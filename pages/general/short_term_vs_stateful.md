<aside>
💡 This document is meant to serve as a detailed explanation of the differences between short term and stateful orders in `[x/clob](https://github.com/dydxprotocol/v4-chain/tree/main/protocol/x/clob)` during the dYdX v4 public testnet. It touches on order lifecycle as well as signature verification, replay prevention, KVStore state, and Memstore state.

</aside>

*****************Note: “Placed” in this document refers to an order which has been gone through taker order matching via memclob.PlaceOrder.  An order can exist in state without having been placed yet.***************** 

This document was created for traders on the dYdX Testnet, and is subject to the terms and conditions for [v4 testnet](https://v4-teacher.vercel.app).  For more details on definitions, see the v4-chain repo [here](https://github.com/dydxprotocol/v4-chain).

|  | Short-term | Stateful |
| --- | --- | --- |
| purpose | Short-lived orders which are meant to placed immediately (in the same block the order was received). These orders stay in-memory up to 20 blocks, with only their fill amount and expiry block height being committed to state. Intended for use by market makers with high throughput, or for market orders. IoC and FoK orders are also considered short-term orders. Short-term orders do not survive a network restart.

- User would send a short-term transaction to a validator
- The transaction needs to contain exactly one Cosmos msg, and that msg is a https://github.com/dydxprotocol/v4-proto/blob/4b721881fdfe99485336e221def03dc5b86eb0a1/dydxprotocol/clob/tx.proto#L37C1-L38C1
- Each validator has a https://github.com/dydxprotocol/v4-proto/blob/4b721881fdfe99485336e221def03dc5b86eb0a1/dydxprotocol/clob/tx.proto#L27C1-L28C1, which is one validator’s view of the operations queue
- In the context of short-term orders, the block proposer should eventually be gossiped the short-term order and have it in their MsgProposedOperations 
- The block proposer would then optimistically place the short-term order in https://docs.cosmos.network/main/basics/tx-lifecycle 
- Matches that short term orders were included in block during MsgProposedOperations would be included in block for all the validators in the network during https://docs.cosmos.network/main/basics/tx-lifecycle | Long-lived orders which may execute far in the future. These orders should not be lost during a validator restart (placed in the block after the order was received). In the event a validator restarts, all stateful orders are https://github.com/dydxprotocol/v4-chain/blob/95b59028af247c0a93ef72de9bfd09a645d30eb1/protocol/app/app.go#L1125 Likely to be used primarily by retail traders. The front end would be sending stateful orders for all order types other than market orders.

Two types of stateful orders:
1. Long-Term Orders
- meant to be added to the orderbook as soon as possible. Due to certain technical limitations, long-term orders are placed in the block after they are written to state. E.g. if MsgPlaceOrder is included in block N, taker order matching would occur for the long-term order in block N+1.
- Order types requiring immediate execution such as fill-or-kill / immediate-or-cancel are disallowed as these should be placed as short term orders; Long-term FoK/IoC orders would never be maker orders, so there is no benefit to writing them to state.

2. Conditional Orders
- execute when the oracle price becomes either LTE or GTE to specified trigger price, depending on the type of conditional order (e.g. stop loss sell = LTE, take profit buy = GTE)
- orders are placed in the block after their condition is met and they become triggered
- it is possible for a conditional order to become triggered in the same block they are initially written to state in. Conditional orders are placed in block ≥ N+1.  |
| placement message | MsgPlaceOrder | MsgPlaceOrder, long term or conditional order flag enabled on MsgPlaceOrder.Order.OrderId.OrderFlags
- valid OrderFlags values are 32 (conditional) and 64 (long-term) for stateful orders |
| cancellation message | MsgCancelOrder 

Short term cancellations are handled best-effort, meaning they are only gossiped and not included in MsgProposedOperations | MsgCancelOrder, long term or conditional order flag enabled on MsgCancelOrder.OrderId.OrderFlags |
| expirations | Good-Till-Block (GTB)

Short term orders have a maximum GTB of current block height + https://github.com/dydxprotocol/v4/blob/c6b30514f19f458f5c2b31f46d47a2f1437d6472/x/clob/types/memclob.go#L13. Currently this value is 20 blocks, or about 30 seconds. Short term orders can only be GTB because in the interest of being resilient to chain halts or slowdowns. | Good-Till-Block-Time (GTBT)

Stateful orders have a maximum GTBT of current block time + https://github.com/dydxprotocol/v4/blob/c6b30514f19f458f5c2b31f46d47a2f1437d6472/x/clob/types/memclob.go#L17. Currently this value is 95 days.

GTBT is used instead of GTB to give a more meaningful expiration time for stateful orders.  |
| inclusion in block | OperationRaw_ShortTermOrderPlacement inside MsgProposedOperations.OperationsQueue which is an app-injected message in the proposal. Included if and only if the short term order is included in a match. | Normal cosmos transaction. The original Tx which included the MsgPlaceOrder or MsgCancelOrder would be included directly in the block. |
| signature verification | Short-term orders must undergo custom signature verification because they are included in an app-injected transaction.

The memclob stores each short term order placement’s raw transaction bytes in the memclob. When the order is included in a match, an OperationRaw_ShortTermOrderPlacement operation is included in MsgProposedOperations which contains these bytes.

During DeliverTx, we decode the raw transaction bytes into a transaction object and pass the transaction through the app’s antehandler which executes signature verification. If signature verification fails, the MsgProposedOperations execution returns an error and none of the operations are persisted to state. Operations for a given block is all-or-nothing, meaning all operations execute or none of them execute. | Normal cosmos transaction signature verification, executed by the app’s antehandler. |
| replay prevention | Keep orders in state until after Good-Till-Block aka expiry (even if fully-filled or cancelled) | Cosmos SDK sequence numbers, verified to be strictly increasing in the app’s antehandler. 

Note that their use of sequence numbers requires stateful orders to be received in order otherwise they would fail. If placing multiple stateful orders they should be sent to the same validator to prevent issues. |
| time placed (matching logic) | CheckTx, immediately after placement transaction is received by the validator.

Short term orders are only included in a block when matched. See “time added to state” below. | long-term: Block N+1 in https://github.com/dydxprotocol/v4-chain/blob/c87b6072a76c4bc0cdcee16d5f4e032aa5c7548a/protocol/x/clob/abci.go#L110 where MsgPlaceOrder was included in block N
conditional: Block N+1 PrepareCheckState where the order was triggered in EndBlocker of block N |
| what is stored in state | OrderAmountFilledKeyPrefix:
- key = OrderId
- value = OrderFillAmount & PrunableBlockHeight

BlockHeightToPotentiallyPrunableOrdersPrefix:
- key = block height
- value = list of potentially prunable OrderIds

PrunableBlockHeight holds the block height at which we can safely remove this order from state. BlockHeightToPotentiallyPrunableOrders stores a list of order ids which we can prune for a certain block height. These are used in conjunction for replay prevention of short term orders | StatefulOrderPlacementKeyPrefix:
- key = OrderId
- value = Order

StatefulOrdersTimeSlice
- key = time
- value = list of OrderIds expiring at this GTBT

OrderAmountFilledKeyPrefix:
- key = OrderId
- value = OrderFillAmount & PrunableBlockHeight (prunable block height unused for stateful orders) |
| time added to state | DeliverTx, when part of a match included in MsgProposedOperations | StatefulOrderPlacementKeyPrefix and StatefulOrdersTimeSlice: DeliverTx, the https://github.com/dydxprotocol/v4-chain/blob/eb5895a445d72610854395e71d6c2e3c97ee20fd/protocol/x/clob/keeper/msg_server_place_order.go#L19 is executed for MsgPlaceOrder msgs included in the block. The handler performs stateful validation, a collateralization check, and writes the order to state. Stateful orders are also written to the checkState in CheckTx for spam mitigation purposes.

OrderAmountFilledKeyPrefix: DeliverTx, when part of a match included in MsgProposedOperations |
| time removed from state | Always in https://github.com/dydxprotocol/v4-chain/blob/95b59028af247c0a93ef72de9bfd09a645d30eb1/protocol/x/clob/abci.go#L42 based off of prunable block height | - cancelled by user: removed from state in DeliverTx for MsgCancelOrder
- forcefully-cancelled by protocol: removed from state in DeliverTx when 
processing OperationRaw_OrderRemoval operation. This operation type is included by the proposer in MsgProposedOperations when a stateful order is no longer valid. Removal reasons listed https://github.com/dydxprotocol/v4-chain/blob/bd368df4a4ee9c15781d83fd2c9b91b50cd279e0/protocol/x/clob/types/order_removals.pb.go#L28
- fully-filled: removed from state in DeliverTx in the block in which they become fully filled. The order is added to RemovedStatefulOrderIds of processProposerMatchesEvents to be used in EndBlocker to remove from the in-memory orderbook.
- expired: pruned during EndBlocker based off of GTBT

also removed from state in CheckTx for cancellations. This is for spam mitigation purposes. |
| time added to in-memory orderbook | When placed in CheckTx, if not fully-matched | When placed in PrepareCheckState, if not fully-matched |
| time removed from in-memory orderbook | - when fully-filled: removed in PrepareCheckState where invalid memclob state is purged via fully filled orders present in OrderIdsFilledInLastBlock
- when cancelled: (CheckTx)
- when expired: PrepareCheckState, removed using memclob.openOrders.blockExpirationsForOrders data structure which stores expiration times for short term orders based off of GTB | - when fully-filled: removed in PrepareCheckState where we purge invalid memclob state based off of RemovedStatefulOrderIds
- when cancelled: removed in PrepareCheckState based off of PlacedStatefulCancellations
 - when expired: removed in PrepareCheckState by PurgeInvalidMemclobState, using the list of ExpiredStatefulOrderIds produced in EndBlocker |

dYdX Chain is open source software. dYdX does not control or operate any protocol running the dYdX Chain software. All use of dYdX Chain software and documentation are subject to dYdX v4 terms of use and licensing requirements. dYdX products and services are not available to U.S., Canadian and other Restricted Persons, defined in the [v4 Terms of Use](https://dydx.exchange/v4-terms?).