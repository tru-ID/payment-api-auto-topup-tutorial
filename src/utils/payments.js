const truId = require('../api/truId')

async function getPaymentMethod() {
  const paymentMethods = await truId.getPaymentMethods()

  if (paymentMethods === false) {
    console.log("No available payment methods. Please add a payment method.")

    return false
  }

  if (paymentMethods.length === 0) {
    console.log("No available payment methods. Please add a payment method.")

    return false
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
    console.log("No available payment methods. Please add an up to date payment method.")

    return false
  }

  return availablePaymentMethods
}

async function topup(currency, amount) {
  const paymentMethods = await getPaymentMethod()

  if (paymentMethods.length === 0) {
    console.log('Unable to top up. No payment methods available')

    return false
  }

  const topupAttempt = await truId.createTopUp(paymentMethods[0].id, currency, amount)

  if (topupAttempt.status === 201) {
    const body = await topupAttempt.json()
    console.log(`Top up successful: ${body}`)

    return true
  }

  console.log('Unable to create top up')

  return false
}

module.exports = {
  getPaymentMethod,
  topup
}