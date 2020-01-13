#!/usr/bin/env bash
ev=$1
prefix="firebase-config"
cp src/${prefix}-${ev}.js src/${prefix}.js
