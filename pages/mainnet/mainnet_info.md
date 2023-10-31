## Mainnet

To join the mainnet network, you need to run the correct binary version and specify the correct `genesis.json` as well as the `seed node` info.

The above info can be found in this [`networks` repository](https://github.com/dydxopsdao/networks).

### Seed nodes
| Team           |  URI                                                                                  |
|----------------|---------------------------------------------------------------------------------------|
| Polkachu       | `ade4d8bc8cbe014af6ebdf3cb7b1e9ad36f412c0@seeds.polkachu.com:23856`                   |
| KingNodes      | `65b740ee326c9260c30af1f044e9cda63c73f7c1@seeds.kingnodes.net:23856`                  |
| Bware Labs     | `f04a77b92d0d86725cdb2d6b7a7eb0eda8c27089@dydx-mainnet-seed.bwarelabs.com:36656`      |
| Lavender.Five  | `20e1000e88125698264454a884812746c2eb4807@seeds.lavenderfive.com:23856`               |
| CryptoCrew     | `c2c2fcb5e6e4755e06b83b499aff93e97282f8e8@tenderseed.ccvalidators.com:26401`          |
| Crosnest       | `4f20c3e303c9515051b6276aeb89c0b88ee79f8f@seed.dydx.cros-nest.com:26656`              |
| DSRV           | `a9cae4047d5c34772442322b10ef5600d8e54900@dydx-mainnet-seednode.allthatnode.com:26656`|
| Luganodes      | `802607c6db8148b0c68c8a9ec1a86fd3ba606af6@64.227.38.88:26656`                         |
| kjnodes        | `400f3d9e30b69e78a7fb891f60d76fa3c73f0ecc@dydx.rpc.kjnodes.com:17059`                 |
| NodeStake      | `4c30c8a95e26b07b249813b677caab28bf0c54eb@rpc.dydx.nodestake.top:666`                 |


### Indexer endpoints
> ⚠️ These endpoints will be with limited functionality during the Alpha phase of dYdX Chain.

| Type  | URI                              |
|-------|----------------------------------|
| API   | `https://indexer.dydx.trade/v4`  |
| WS    | `wss://indexer.dydx.trade/v4/ws` |


### StateSync/Snapshots
| Type      | URI                                                    |
|-----------|--------------------------------------------------------|
| StateSync | `https://dydx-mainnet-statesync-rpc.bwarelabs.com` <br> `https://polkachu.com/state_sync/dydx` <br> `https://services.lavenderfive.com/mainnet/dydx/statesync` <br> `https://services.kjnodes.com/mainnet/dydx/state-sync` <br> `https://nodestake.top/dydx` |
| Snapshots | `https://bwarelabs.com/snapshots/dydx` <br> `https://polkachu.com/tendermint_snapshots/dydx` <br> `https://services.lavenderfive.com/mainnet/dydx/snapshot` <br> `https://services.kjnodes.com/mainnet/dydx/snapshot` <br> `https://nodestake.top/dydx` |


### RPC endpoints
| Type  | URI                                                                                       |
|-------|-------------------------------------------------------------------------------------------|
| RPC   | `https://dydx-dao-rpc.polkachu.com` <br> `https://dydx-mainnet-full-rpc.public.blastapi.io` <br> `https://dydx-ops-rpc.kingnodes.com` <br> `https://dydx-rpc.lavenderfive.com` <br> `https://dydx.rpc.kjnodes.com` <br> `https://rpc.dydx.nodestake.top` |
| REST  | `https://dydx-dao-api.polkachu.com` <br> `https://dydx-mainnet-full-lcd.public.blastapi.io` <br> `https://dydx-ops-rest.kingnodes.com` <br> `https://dydx-api.lavenderfive.com` <br> `https://dydx.api.kjnodes.com` <br> `https://api.dydx.nodestake.top` |
| gRPC  | `dydx-dao-grpc-1.polkachu.com:23890` <br> `dydx-dao-grpc-2.polkachu.com:23890` <br> `dydx-dao-grpc-3.polkachu.com:23890` <br> `dydx-dao-grpc-4.polkachu.com:23890` <br> `dydx-dao-grpc-5.polkachu.com:23890` <br> `dydx-mainnet-full-grpc.public.blastapi.io:443` <br> `https://dydx-ops-grpc.kingnodes.com` <br> `https://dydx-grpc.lavenderfive.com` <br> `dydx.grpc.kjnodes.com:443` <br> `https://grpc.dydx.nodestake.top` |


### Archival nodes endpoints
| Type  | URI                                                                                       |
|-------|-------------------------------------------------------------------------------------------|
| RPC   | `https://dydx-dao-archive-rpc.polkachu.com` <br> `https://dydx-mainnet-archive-rpc.public.blastapi.io` <br> `https://dydx-ops-archive-rpc.kingnodes.com` |
| REST  | `https://dydx-dao-archive-api.polkachu.com` <br> `https://dydx-mainnet-archive-lcd.public.blastapi.io` <br> `https://dydx-ops-archive-rest.kingnodes.com` |
| gRPC  | `dydx-dao-archive-grpc-1.polkachu.com:23890` <br> `dydx-dao-archive-grpc-2.polkachu.com:23890` <br> `dydx-mainnet-archive-grpc.public.blastapi.io:443` <br> `https://dydx-ops-archive-grpc.kingnodes.com` |

### Chain info
```
{
  "rpc": "https://dydx-dao-rpc.polkachu.com:26657",
  "rest": "https://dydx-dao-api.polkachu.com",
  "chainId": "dydx-mainnet-1",
  "chainName": "dYdX Chain",
  "chainSymbolImageUrl": "https://raw.githubusercontent.com/cosmos/chain-registry/master/dydx/images/dydx.png",
  "bech32Config": {
    "bech32PrefixAccPub": "dydxpub",
    "bech32PrefixValPub": "dydxvaloperpub",
    "bech32PrefixAccAddr": "dydx",
    "bech32PrefixConsPub": "dydxvalconspub",
    "bech32PrefixValAddr": "dydxvaloper",
    "bech32PrefixConsAddr": "dydxvalcons"
  },
  "bip44": {
    "coinType": 118
  },
  "stakeCurrency": {
    "coinDenom": "DYDX",
    "coinDecimals": 18,
    "coinMinimalDenom": "adydx",
  },
  "currencies": [
    {
      "coinDenom": "DYDX",
      "coinDecimals": 18,
      "coinMinimalDenom": "adydx",
    },
    {
      "coinDenom": "USDC",
      "coinDecimals": 6,
      "coinMinimalDenom": "ibc/8E27BA2D5493AF5636760E354E46004562C46AB7EC0CC4C1CA14E9E20E2545B5",
    }
  ],
  "feeCurrencies": [
    {
      "coinDenom": "DYDX",
      "coinDecimals": 18,
      "coinMinimalDenom": "adydx",
    },
    {
      "coinDenom": "USDC",
      "coinDecimals": 6,
      "coinMinimalDenom": "ibc/8E27BA2D5493AF5636760E354E46004562C46AB7EC0CC4C1CA14E9E20E2545B5",
    }
  ],
  "features": []
}
```
