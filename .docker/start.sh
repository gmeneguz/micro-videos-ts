#!/bin/bash

npm i 

if [ ! -f "./src/@core/.test.env" ]; then
  cp ./src/@core/.test.env.example ./src/@core/.test.env
fi

tail -f /dev/null

# npm run start:dev