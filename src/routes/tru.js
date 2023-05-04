const truId = require('../api/truId')
const truPayments = require('../utils/payments')

async function createSIMCheck(req, res) {
  const { phone_number } = req.body

  if (!phone_number) {
    return res.status(400).json({ error: "`phone_number` not provided."})
  }

  console.log(`Creating SIMCheck for phone number: ${  phone_number}`)

  const simCheck = await truId.createSIMCheck(phone_number)

  const response = await simCheck.json()

  if (simCheck.status === 402) {
    console.log('SIMCheck returned 402, insufficient credit.')

    console.log('Requesting a topup')
    // Trigger payment top up
    const topup = await truPayments.topup(process.env.TRU_TOP_UP_CURRENCY, process.env.TRU_TOP_UP_AMOUNT)

    if (topup !== false) {
      console.log('Topup successful.. retrying SIMCheck')
      const simCheckRetry = await truId.createSIMCheck(phone_number)
    
      const retryResponse = await simCheckRetry.json()

      if (simCheckRetry.status !== 201) {
        console.log('Second attempt at creating SIMCheck failed')

        return res.status(400).json({ error: "Unable to run SIMCheck, please try later."})
      }
      console.log('SIMCheck retry successful.. results:')
      console.log(retryResponse)

      return res.status(simCheckRetry.status).json(retryResponse)
    }

    console.log('Unable to create SIMCheck')

    return res.status(400).json({ error: "Unable to run SIMCheck, please try again in a few minutes."})
  }

  console.log('SIMCheck created... results:')
  console.log(response)

  return res.status(simCheck.status).json(response)
}

module.exports = {
  createSIMCheck
}