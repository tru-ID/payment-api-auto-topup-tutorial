const express = require('express')
const cors = require('cors')
const routes = require('./routes')

require('dotenv').config()

const port = 8080;

async function serve() {
  const app = express()

  app.use(cors())
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  // required for `req.ip` to be populated if behind a proxy i.e. ngrok
  app.set('trust proxy', true)

  app.use(routes())

  const server = app.listen(port, () => {
    console.log(`Demo Web Server listening at http://localhost:${port}`)
  })

  return {
    app,
    server,
  }
}

module.exports = {
  serve,
}
