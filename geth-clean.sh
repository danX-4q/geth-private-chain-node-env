#!/bin/bash

. geth-env.conf

rm -rf $GETH_ENV__datadir $GETH_ENV__ethash_dagdir $(dirname $GETH_ENV__logfile)
mkdir $(dirname $GETH_ENV__logfile)
