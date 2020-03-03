#!/bin/bash

. geth-env.conf

set -x
geth $GETH_PARA__datadir $GETH_PARA__ethash_dagdir \
    --nodiscover --networkid 2018 --maxpeers 5 --allow-insecure-unlock --password ./password \
    --mine --miner.threads 4 \
    --rpc --rpcaddr 0.0.0.0 --rpcport 18545 --rpcapi "db,eth,net,web3,personal" \
    --rpcvhosts "*" --rpccorsdomain "http://192.168.186.30:8000,http://127.0.0.1:8000" \
    --ws --wsaddr 0.0.0.0 --wsport 18546 --wsapi db,eth,net,web3,personal --wsorigins '*' \
    --dev --dev.period 1 \
    2>> $GETH_ENV__logfile &
set +x
echo ""
echo ""
echo "geth running. for watching output, please tail -f $GETH_ENV__logfile"
echo ""
echo ""

wait %1
