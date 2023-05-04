const { Router } = require('express')

const tru = require('./routes/tru')

const router = Router()

function routes() {
  router.post('/sim-check', tru.createSIMCheck)

  return router
}

module.exports = routes
