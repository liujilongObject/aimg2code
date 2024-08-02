import * as fs from "node:fs/promises"
import path from "node:path"
import { request } from "node:https"


const isValidUrl = url => /^(https?:\/\/)/.test(url)

const isRelativePath = path => {
  const absolutePathPattern = /^(?:[a-zA-Z]:\\|\/|http:\/\/|https:\/\/|file:\/\/\/)/
  return !absolutePathPattern.test(path)
}

export const resolve = filePath => {
  return path.resolve(process.cwd(), filePath)
}

const readLocalImgToBase64 = async (path) => {
  const imageData = await fs.readFile(resolve(path))
  return `data:image/jpeg;base64,${imageData.toString("base64")}`
}

const readRemoteImgToBase64 = async (url) => {
  return new Promise((resolve, reject) => {
    const chunks = []
    const req = request(url, res => {
      res.setEncoding('base64')
      res.on('data', (chunk) => {
        chunks.push(chunk)
      })
      res.on('end', () => {
        const imageData = `data:image/jpeg;base64,${chunks.join('').toString("base64")}`
        resolve(imageData)
      })
    })

    req.on('error', (e) => {
      console.error(`problem with request: ${e.message}`)
      reject(e.message)
    })

    req.end()
  })
}

export const readImageFileToBase64 = async fileUrlOrPath => {
  if (isValidUrl(fileUrlOrPath)) {
    return await readRemoteImgToBase64(fileUrlOrPath)
  }

  if (isRelativePath(fileUrlOrPath)) {
    return await readLocalImgToBase64(fileUrlOrPath)
  }
}

export const readConfigJSON = async () => {
  try {
    const json = JSON.parse(
      await fs.readFile(resolve('./aimg2code.config.json'))
    )
    return json
  } catch (error) {
    console.log('【configuration file missed】: The aimg2code.config.json configuration file is missing')
    throw error
  }
}

