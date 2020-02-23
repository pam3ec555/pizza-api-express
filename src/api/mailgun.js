const fieldValidation = require('../utils/fieldValidation');
const { objectSize, jsonParse } = require('../utils');
const https = require('https');
const { mailgun: { apiHost, apiKey, apiPath, apiProtocol, domainEmail, apiMethod } } = require('../../config');
const { StringDecoder } = require('string_decoder');
const querystring = require('querystring');

const mailgun = {};

/**
 * @param {string} subject
 * @param {string} text
 * @param {string} email
 * @return {{subject: string, text: string, email: string}}
 * @private
 */
mailgun._fieldValidation = ({
  subject,
  text,
  email,
}) => ({
  subject: fieldValidation(subject, { requiredField: true }),
  text: fieldValidation(text, { requiredField: true }),
  email: fieldValidation(email, { requiredField: true }),
});

/**
 * @param {string} subject
 * @param {string} text
 * @param {string} email
 * @param {function(err: Object|boolean)} callback
 * @private
 */
mailgun._send = ({
  subject,
  text,
  email,
  callback,
}) => {
  const query = querystring.stringify({
    from: `Mailgun Sandbox ${domainEmail}`,
    to: email,
    subject,
    text,
  });

  const req = https.request({
    hostname: apiHost,
    protocol: apiProtocol,
    path: `${apiPath}?${query}`,
    auth: `api:${apiKey}`,
    method: apiMethod,
  }, (res) => {
    const decoder = new StringDecoder('utf8');
    let buffer = '';
    res.on('data', (data) => {
      buffer += decoder.write(data);
    });

    res.on('end', () => {
      buffer += decoder.end();

      if (res.statusCode === 200) {
        callback(false);
      } else {
        const data = jsonParse(buffer);
        callback(data.message || 'Email has not been sent.');
      }
    });
  });

  req.on('error',(err) => {
    callback(err);
  });

  req.end();
};

/**
 * @param {string} subject
 * @param {string} text
 * @param {string} email
 * @param {function(err: Object|boolean)} callback
 */
mailgun.request = ({
  subject,
  text,
  email,
  callback,
}) => {
  const errors = mailgun._fieldValidation({ subject, text, email });
  if (objectSize(errors) === 0) {
    mailgun._send({ subject, callback, email, text });
  } else {
    callback(errors);
  }
};

module.exports = mailgun;
