#!/usr/bin/env node

import minimist from 'minimist'
import { readConfigJSON } from './src/readFile.js'
import { img2Code } from './src/img2code.js'
import { selectOutputStack } from './src/prompts.js'

(async function main() {
  const argvs = minimist(process.argv.slice(2))
  const { i: input, temperature } = argvs

  const config = await readConfigJSON()

  if (!config.openaiApiKey) {
    console.error('【openaiApiKey missed】: Please configure your API-KEY!')
    return
  }

  const inputImgs = input?.split(',') || []
  const configImages = config?.images ? [].concat(config.images) : []
  if (!inputImgs.length && !configImages.length) {
    console.error('【image missed】: Please enter the image path or URL to be converted!')
    return
  }

  const prompt = await selectOutputStack()
  const images = inputImgs.length ? inputImgs : configImages
  const openaiParams = Object.assign(config, {
    temperature: (typeof temperature === 'number' && temperature >=0 && temperature < 1) ? temperature : undefined
  })
  img2Code(openaiParams, images, prompt)
})()
