# tru.ID Automatic Top-Up

[![License][license-image]][license-url]

This repository is a demo application for integrating tru.ID's [Payment API](https://developer.tru.id/docs/reference/utils#tag/payments_v0.2) into your backend webserver to automatically top up credit when/if you've run out.

## Prerequisites

- A [tru.ID account](https://tru.id/).
- Create a [tru.ID project](https://developer.tru.id/console)
- A mobile phone with a SIM card that has an active mobile data connection.

## Create a tru.ID account

To use this application you will need a [**tru.ID**](https://www.tru.id) account. To signup for one head over to the [signup page](https://tru.id/signup).

Then, in your **tru.ID** [console](https://developer.tru.id/console), navigate to the `Settings` page to create yourself some credentials for your Workspace. Be sure to save the file somewhere secure and make a note of the `client_id` and `client_secret` because this is needed later when setting up the **tru.ID** CLI.

> **Note** once you close this tab, you will no longer be able to retrieve this specific set of credentials in the **tru.ID** console.

## Create a tru.ID project

To create the **tru.ID** project, first install the **tru.ID** [CLI](https://github.com/tru-ID/tru-cli), by running the following command in your terminal:

```bash
npm install -g @tru_id/cli
```

You'll then need to enter your **tru.ID** credentials, which you can find in the [console](https://developer.tru.id/console). Once you've found your credentials, in your terminal, run the following command: 

```bash
tru setup:credentials {YOUR_CLIENT_ID} {YOUR_CLIENT_SECRET} EU
```

Now you'll need a project on **tru.ID**. So to create your project in your terminal run the following command (`automatic-topups` can be whatever name you wish):

```bash
tru projects:create automatic-topups
```

This will create a new directory `automatic-topups`, and within this directory will be a `tru.json` file containing all the information on your project. It also has your projects credentials so keep it safe.

## Clone this repository

To clone this repository in your terminal run the following command:

```bash
git clone -b main git@github.com:tru-ID/payment-api-auto-topup-tutorial.git
```

## Add the credentials file

Make a copy of the `.env.example` file and call it `.env`. Now, populate the environment variables with the following:

```env
TRU_PROJECT_CLIENT_ID= # YOUR tru.ID PROJECT CLIENT ID
TRU_PROJECT_SECRET= # YOUR tru.ID PROJECT SECRET
TRU_WORKSPACE_ID= # YOUR tru.ID WORKSPACE ID
TRU_WORKSPACE_CLIENT_ID= # YOUR tru.ID WORKSPACE CLIENT ID
TRU_WORKSPACE_SECRET= # YOUR tru.ID WORKSPACE SECRET

TRU_TOP_UP_CURRENCY= # The currency you're paying in
TRU_TOP_UP_AMOUNT= # How much you would like to be automatically topped up
```

## Install third party libraries

In your Terminal, navigate to the project root directory and run the following to install any third party libraries used in this project, and then start the web server:

```
npm install
npm run dev
```

## Create a SIMCheck with a cURL command

With the `starter-files` branch checked out, you can now create a `POST` request to your web server and the path `/sim-check` containing a JSON body for your `phone_number`. Assuming you have credit and your credentials are correct, you'll receive a JSON object response similar to what's shown in the [API specifications page](https://developer.tru.id/docs/reference/products#tag/sim_check_v0.1/operation/create-sim-check). You can see a sample CURL `POST` request below:

```bash
curl --location 'localhost:8080/sim-check' \
--header 'Content-Type: application/json' \
--data '{
    "phone_number": "447500000001"
}'
```

A successful SIMCheck will be similar to what's shown below:

```json
{
  "check_id": "c69bc0e6-a429-11ea-bb37-0242ac130002",
  "status": "COMPLETED",
  "no_sim_change": false,
  "sim_change_within": 43201,
  "no_sim_change_period": 10080,
  "charge_amount": 1,
  "charge_currency": "API",
  "created_at": "2020-06-01T16:43:30+00:00",
  "network_id": "23599",
  "_links": {
    "self": {}
  },
  "snapshot_balance": 100
}
```

## Meta

Distributed under the MIT license. See `LICENSE` for more information.

[https://github.com/tru-ID](https://github.com/tru-ID)

[license-image]: https://img.shields.io/badge/License-MIT-blue.svg
[license-url]: LICENSE