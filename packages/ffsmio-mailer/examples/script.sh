#!/bin/bash

file=$1

if [ -f "examples/.env" ]; then
  while IFS= read -r line || [[ -n "$line" ]]; do
    if [[ ! "$line" =~ ^# ]] && [[ -n "$line" ]]; then
      export "$line"
    fi
  done < "examples/.env"
fi

if [ ! -f "examples/$file.ts" ]; then
    echo "File examples/$file.ts not found!"
    exit 1
fi

ts-node -r tsconfig-paths/register "examples/$file.ts"