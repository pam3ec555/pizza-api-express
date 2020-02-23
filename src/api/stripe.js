const https = require('https');
const querystring = require('querystring');
const { objectSize, jsonParse } = require('../utils/index');
const {
  stripe: { apiProtocol, apiHost, createChargePath, createTokenPath, apiMethod, publicKey, currency, privateKey },
} = require('../../config');
const { StringDecoder } = require('string_decoder');
const fieldValidation = require('../utils/fieldValidation');

const stripe = {};

/**
 * @param {number} amount
 * @param {string} cardNumber
 * @param {number} expirationMonth
 * @param {number} expirationYear
 * @param {number} cvs
 * @param {{name: string, count: number}[]} cartData,
 * @return {{expirationYear: string, cvs: string, amount: string, cartData: string, expirationMonth: string, cardNumber: string}}
 * @private
 */
stripe._fieldValidation = ({
  cardNumber,
  expirationMonth,
  expirationYear,
  amount,
  cartData,
  cvs,
}) => ({
  cardNumber: fieldValidation(cardNumber, { requiredField: true }),
  expirationMonth: fieldValidation(expirationMonth, {
    requiredField: true,
    type: 'number',
    minValue: 1,
    maxValue: 12,
  }),
  expirationYear: fieldValidation(expirationYear, {
    requiredField: true,
    type: 'number',
    maxValue: 9999,
    minValue: new Date().getFullYear(),
  }),
  cvs: fieldValidation(cvs, {
    requiredField: true,
    type: 'number',
    maxValue: 999,
    minValue: 100,
  }),
  amount: fieldValidation(amount, { requiredField: true, type: 'number' }),
  cartData: fieldValidation(cartData, { requiredField: true, type: 'array', emptyIsValid: false }),
});

/**
 * @param {string} path
 * @param {string} key
 * @return {{path, protocol: string, hostname: string, method: string, auth: string}}
 * @private
 */
stripe._httpsParams = ({
  path,
  key,
}) => ({
  protocol: apiProtocol,
  hostname: apiHost,
  path,
  method: apiMethod,
  auth: `${key}:`,
});

/**
 * @param {{name: string, count: number}[]} cartData,
 * @private
 * @return {string}
 */
stripe._getChargeDescription = (cartData) => {
  return cartData.map(({ count, name }) => {
    return `"${name}": ${count}`;
  }).join(', ');
};

/**
 * @param {string} token
 * @param {number} amount
 * @param {string} description
 * @param {function(err: Object|boolean, paymentData: Object?)} callback
 * @private
 */
stripe._createCharge = ({
  token,
  amount,
  description,
  callback,
}) => {
  const req = https.request(
    stripe._httpsParams({ path: createChargePath, key: privateKey }),
    (res) => {
      const decoder = new StringDecoder('utf8');
      let buffer = '';

      res.on('data', (data) => {
        buffer += decoder.write(data);
      });

      res.on('end', () => {
        buffer += decoder.end();

        const data = jsonParse(buffer);
        const { status, amount, description, error } = data;
        if (status === 'succeeded') {
          callback(false, { amount: amount / 100, description });
        } else if (error && error.message) {
          callback(error.message);
        } else {
          callback('Unfortunately payment failed. Try again later, please!');
        }
      });
    },
  );

  req.on('error',(err) => {
    callback(err);
  });

  req.write(querystring.stringify({
    amount: amount * 100,
    currency,
    source: token,
    description,
  }));

  req.end();
};

/**
 * @param {string} cardNumber
 * @param {number} expirationMonth
 * @param {number} expirationYear
 * @param {number} cvs
 * @param {number} amount
 * @param {{name: string, count: number}[]} cartData,
 * @param {function(err: Object|boolean, paymentData: Object?)} callback
 * @private
 */
stripe._createCardToken = ({
  cardNumber,
  expirationMonth,
  expirationYear,
  cvs,
  amount,
  cartData,
  callback,
}) => {
  const req = https.request(
    stripe._httpsParams({ path: createTokenPath, key: publicKey }),
    (res) => {
      const decoder = new StringDecoder('utf8');
      let buffer = '';
      res.on('data', (data) => {
        buffer += decoder.write(data);
      });

      res.on('end', () => {
        buffer += decoder.end();

        const data = jsonParse(buffer);
        const { id, error } = data;
        if (id) {
          stripe._createCharge({ token: id, amount, callback, description: stripe._getChargeDescription(cartData) });
        } else if (error && error.message) {
          callback(error.message);
        } else {
          callback('Oops, something was wrong. Try again later, please!');
        }
      });
    }
  );

  req.on('error',(err) => {
    callback(err)
  });

  req.write(querystring.stringify({
    'card[number]': cardNumber,
    'card[exp_month]': expirationMonth,
    'card[exp_year]': expirationYear,
    'card[cvc]': cvs,
  }));

  req.end();
};

/**
 * @param {number} amount
 * @param {string} cardNumber
 * @param {number} expirationMonth
 * @param {number} expirationYear
 * @param {number} cvs
 * @param {{name: string, count: number}[]} cartData,
 * @param {function(err: Object|boolean, paymentData: Object?)} callback
 */
stripe.request = ({
  amount,
  cardNumber,
  expirationMonth,
  expirationYear,
  cvs,
  cartData,
  callback,
}) => {
  const errors = stripe._fieldValidation({ amount, cartData, expirationMonth, expirationYear, cardNumber, cvs });
  if (objectSize(errors) === 0) {
    stripe._createCardToken({ cardNumber, expirationYear, expirationMonth, cvs, callback, amount, cartData });
  } else {
    callback(errors);
  }
};

module.exports = stripe;
