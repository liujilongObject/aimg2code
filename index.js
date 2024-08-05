#!/usr/bin/env node

import minimist from 'minimist'
import { readConfigJSON } from './src/readFile.js'
import { img2Code } from './src/img2code.js'

(async function main() {
  const argvs = minimist(process.argv.slice(2))
  const inputImgs = argvs['i']?.split(',') || []

  const config = await readConfigJSON()
  const configImages = config?.images ? [].concat(config.images) : []

  if (!inputImgs.length && !configImages.length) {
    console.error('【image missed】: Please enter the image path or URL to be converted!')
    return
  }
  const images = inputImgs.length ? inputImgs : configImages
  img2Code(config, images)
})()
