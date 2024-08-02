#!/usr/bin/env node

import minimist from 'minimist'
import { readConfigJSON } from './src/readFile.js'
import { img2Code } from './src/img2code.js'

(async function main() {
  const argvs = minimist(process.argv.slice(2))
  const inputImgs = argvs['i']

  console.log(argvs)

  const config = await readConfigJSON()

  img2Code(config, inputImgs.split(','))
})()
