#!/bin/bash

. geth-env.conf

geth $GETH_PARA__datadir $GETH_PARA__ethash_dagdir --nodiscover --mine --miner.threads 0 --rpc --rpcaddr 0.0.0.0 --rpcport 8545 --rpcapi "db,eth,net,web3" >> $GETH_ENV__logfile &

echo ""
echo ""
echo "geth running. for watching output, please tail -f $GETH_ENV__logfile"
echo ""
echo ""

wait %1
