#!/bin/bash

. geth-env.conf

geth $GETH_PARA__datadir  $GETH_PARA__ethash_dagdir --nodiscover console 2>> $GETH_ENV__logfile

