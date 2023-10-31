# Running a full node
## Save your Chain ID in `dydxprotocold` config

Save the mainnet `chain-id`. This will make it so you do not have to manually pass in the chain-id flag for every CLI command.

```bash
dydxprotocold config chain-id dydx-mainnet-1
```

## Downloading `genesis.json`

Download the correct `genesis.json` from the [`networks` repository](https://github.com/dydxopsdao/networks) and replace the existing `genesis.json`.

## Start a Full Node

Find the seed node's ID and the IP address from the [mainnet info page](https://docs.dydx.trade/mainnet/mainnet_info). Then, run the following command to start a non-validating full node.

```bash
dydxprotocold start --p2p.seeds="<comma separated seed nodes>" --non-validating-full-node=true
```

💡💡💡**Note**: if you want to disable gRPC on your full node, it is important to start the node with the
`--non-validating-full-node=true` flag. Otherwise, the application will require that gRPC be enabled. 💡💡💡


