const truApi = require('../api/tru')

async function getPaymentMethod(req, res) {
  console.log('Getting Payment Methods')
  const paymentMethods = await truApi.getPaymentMethods()

  if (paymentMethods === false) {
    console.log('Payment Methods request failed')

    return res.sendStatus(400)
  }

  if (paymentMethods.length === 0) {
    console.log('No payment methods available')

    return res.status(400).json({ error: "No available payment methods. Please add a payment method."})
  }

  paymentMethods[0].expiry_month = 2

  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()

  const availablePaymentMethods = []

  paymentMethods.forEach(paymentMethod => {
    if (paymentMethod.expiry_year === currentYear && paymentMethod.expiry_month >= currentMonth) {
      availablePaymentMethods.push(paymentMethod)      
    } else if (paymentMethod.expiry_year >= currentYear) {
      availablePaymentMethods.push(paymentMethod)  
    }
  })

  if (availablePaymentMethods.length === 0) {
    console.log('No payment methods with active expiry date.')

    // Return error, no payment methods available.
    return res.status(400).json({ error: "No available payment methods. Please add an up to date payment method."})
  }

  return res.status(200).json(availablePaymentMethods)
}

async function topup(req, res) {
  const { payment_method_id, currency, amount } = req.body

  console.log('Creating a Topup request')
  const topupAttempt = await truApi.createTopUp(payment_method_id, currency, amount)

  if (topupAttempt.status === 201) {
    const body = await topupAttempt.json()

    console.log('Topup request successful..')
    console.log(body)

    return res.status(201).json(body)
  }

  return res.sendStatus(400)
}

module.exports = {
  getPaymentMethod,
  topup
}