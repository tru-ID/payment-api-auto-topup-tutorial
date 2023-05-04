const { Router } = require('express')

const payments = require('./routes/payments')
const tru = require('./routes/tru')

const router = Router()

function routes() {
  router.get('/get-payment-methods', payments.getPaymentMethod)
  router.post('/topup', payments.topup)

  router.post('/sim-check', tru.createSIMCheck)

  return router
}

module.exports = routes
