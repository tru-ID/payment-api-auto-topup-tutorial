const moment = require("moment")
const fetch = require("node-fetch")

const PROJECT_TOKEN = {
  accessToken: undefined,
  expiresAt: undefined,
}

async function getAccessToken(clientId, secret, scope) {
  const url = `${process.env.TRU_BASE_URL}/oauth2/v1/token`;

  const toEncode = `${clientId}:${secret}`;
  const auth = Buffer.from(toEncode).toString('base64');

  const requestHeaders = {
    Authorization: `Basic ${auth}`,
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const res = await fetch(url, {
    method: "post",
    headers: requestHeaders,
    body: new URLSearchParams({
      grant_type: "client_credentials",
      scope,
    }),
  });

  if (!res.ok) {
    return false
  }

  const json = await res.json();

  return json
}

async function getProjectAccessToken() {
  // check if existing valid token
  if (PROJECT_TOKEN.accessToken !== undefined && PROJECT_TOKEN.expiresAt !== undefined) {
    // we already have an access token let's check if it's not expired
    // by removing 1 minute because access token is about to expire so it's better refresh anyway
    if (
      moment()
        .add(1, "minute")
        .isBefore(moment(new Date(PROJECT_TOKEN.expiresAt)))
    ) {
      // token not expired
      return PROJECT_TOKEN.accessToken;
    }
  }

  const accessToken = await getAccessToken(
    process.env.TRU_PROJECT_CLIENT_ID, 
    process.env.TRU_PROJECT_SECRET, 
    "sim_check"
  )

  // update token cache in memory
  PROJECT_TOKEN.accessToken = accessToken.access_token;
  PROJECT_TOKEN.expiresAt = moment().add(accessToken.expires_in, "seconds").toString();

  return accessToken.access_token;
}

async function createSIMCheck(phoneNumber) {
  const accessToken = await getProjectAccessToken()

  const simCheckResponse = await fetch(`${process.env.TRU_BASE_URL}/sim_check/v0.1/checks`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      phone_number: phoneNumber
    }),
  });

  return simCheckResponse
}

module.exports = {
  createSIMCheck
};