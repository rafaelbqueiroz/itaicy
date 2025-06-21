import express from 'express'
import payload from 'payload'
import path from 'path'
import { getServerSideURL } from './utilities/getURL'

require('dotenv').config()

const app = express()

// Initialize Payload
const start = async () => {
  await payload.init({
    express: app,
    onInit: () => {
      payload.logger.info(`Payload Admin URL: ${getServerSideURL()}/admin`)
    },
    configPath: path.resolve(__dirname, 'payload.config.ts'),
  })

  // Add your own express routes here if needed
  app.get('/', (_, res) => {
    res.redirect('/admin')
  })

  const port = process.env.PORT || 3000
  app.listen(port, async () => {
    payload.logger.info(`Server listening on ${getServerSideURL()}`)
  })
}

start()
