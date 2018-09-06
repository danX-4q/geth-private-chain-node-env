#!/bin/bash

. geth-env.conf

mkdir $(dirname $GETH_ENV__logfile)

geth $GETH_PARA__datadir init $GETH_ENV__genesis_file
geth $GETH_PARA__datadir $GETH_PARA__password account new 2>> $GETH_ENV__logfile
