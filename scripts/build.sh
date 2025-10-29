#!/bin/bash

pnpm exec babel ./src --out-dir ./es --config-file ./babel/babel.es.config.js -x ".js,.ts,.tsx" --copy-files --no-copy-ignored
pnpm exec babel ./src --out-dir ./lib --config-file ./babel/babel.lib.config.js -x ".js,.ts,.tsx" --copy-files --no-copy-ignored
