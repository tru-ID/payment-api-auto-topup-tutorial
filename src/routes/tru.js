const truApi = require('../api/tru')

async function createSIMCheck(req, res) {
  const { phone_number } = req.body

  if (!phone_number) {
    return res.status(400).json({ error: "`phone_number` not provided."})
  }

  console.log(`Creating SIMCheck for phone number: ${  phone_number}`)

  const simCheck = await truApi.createSIMCheck(phone_number)

  const response = await simCheck.json()

  if (simCheck.status === 402) {
    console.log('SIMCheck returned 402, insufficient credit.')

    return res.status(400).json({ error: "Unable to run SIMCheck, please try again in a few minutes."})
  }


  console.log('SIMCheck created.. Results:')
  console.log(response)

  return res.status(simCheck.status).json(response)
}

module.exports = {
  createSIMCheck
}