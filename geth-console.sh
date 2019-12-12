#!/bin/bash

. geth-env.conf

geth $GETH_PARA__datadir  $GETH_PARA__ethash_dagdir \
    --nodiscover --networkid 2018 --maxpeers 5 \
    --rpccorsdomain "http://192.168.186.30:8000,http://127.0.0.1:8000" \
    --dev --dev.period 1 \
    console 2>> $GETH_ENV__logfile

