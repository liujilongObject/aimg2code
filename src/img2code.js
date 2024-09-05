import { ChatOpenAI } from "@langchain/openai"
import { HumanMessage } from "@langchain/core/messages"
import { StringOutputParser } from '@langchain/core/output_parsers'
import * as fs from "node:fs/promises"
import { resolve, readImageFileToBase64 } from './readFile.js'
import ora from 'ora'

const spinner = ora()

export const img2Code = async (options = {}, imagePathList = [], prompt = '') => {
  try {
    const imageFiles = await Promise.all(imagePathList.map(readImageFileToBase64))

    const { openaiApiKey, openaiModel, openaiBaseUrl, temperature = 0.95 } = options
    const model = new ChatOpenAI({
      configuration: {
        baseURL: openaiBaseUrl || 'https://api.openai.com/v1'
      },
      temperature,
      apiKey: openaiApiKey,
      model: openaiModel || 'gpt-4o'
    })
    // some third-party language models are not compatible with the openAI specification,
    // they do not support some parameters, and langchain takes the initiative to add these parameters,
    // resulting in request failure, so here you need to clear these parameters
    model.frequencyPenalty = undefined
    model.n = undefined
    model.presencePenalty = undefined
    model.topP = undefined

    const messages = [
      new HumanMessage({
        content: [
          {
            type: 'text',
            text: prompt
          },
          ...imageFiles.map(image => ({
            type: 'image_url',
            image_url: {
              url: image
            }
          }))
        ]
      })
    ]

    const chain = model.pipe(new StringOutputParser())

    spinner.start(`Calling the ${openaiModel || 'gpt-4o'} model`)

    const res = await chain.invoke(messages)

    const htmlString = res.substring(res.indexOf('<html lang="en">'), res.lastIndexOf('</html>') + '</html>'.length)
    const finalHtmlString = `<!DOCTYPE html>\n${htmlString.replace('<!DOCTYPE html>', '')}`

    const outHtmlFilePath = resolve(`./output_${new Date(Date.now()).toLocaleString().replace(/\/|:/g, '-').split(' ').join('_')}.html`)
    await fs.writeFile(outHtmlFilePath, finalHtmlString, 'utf-8')

    spinner.succeed(`Successfully generated code! See: ${outHtmlFilePath}`)
  } catch (error) {
    console.log(error)
    spinner.fail('Failed to output code')
  }
}
