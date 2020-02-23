const config = {
  hashingSecret: 'someSecret',
  port: 3000,
  stripe: {
    publicKey: 'pk_test_cImC2vMLnl6VtqQhqgcAas2R00PkLaKtdr',
    privateKey: 'sk_test_PoJXwv4H9R70pSvcRJsaSH0n00XZ8eod3e',
    apiProtocol: 'https:',
    apiHost: 'api.stripe.com',
    createTokenPath: '/v1/tokens',
    createChargePath: '/v1/charges',
    apiMethod: 'POST',
    currency: 'usd',
  },
  mailgun: {
    apiKey: 'e0d122e59e556c3472ad134411ac6dd1-713d4f73-f619d89e',
    domainEmail: 'postmaster@sandboxf0005ae02b6d409e884b43a83afc793c.mailgun.org',
    apiProtocol: 'https:',
    apiHost: 'api.mailgun.net',
    apiPath: '/v3/sandboxf0005ae02b6d409e884b43a83afc793c.mailgun.org/messages',
    apiMethod: 'POST',
  },
};

module.exports = config;
