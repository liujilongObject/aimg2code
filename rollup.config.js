import { defineConfig } from 'rollup'
import terser from '@rollup/plugin-terser'

export default defineConfig([
  {
    input: 'index.js',
    output: [
      {
        file: 'dist/index.js',
        format: 'es'
      }
    ],
    plugins: [
      terser()
    ],
    external: [
      '@langchain/core',
      '@langchain/core/messages',
      '@langchain/core/output_parsers',
      '@langchain/openai',
      'langchain',
      'minimist',
      'ora',
      '@inquirer/select',
      'node:fs/promises',
      'node:path',
      'node:https'
    ]
  }
])
