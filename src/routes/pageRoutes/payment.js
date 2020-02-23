const pageRoute = require('./pageRoute');

const payment = pageRoute({
  file: 'payment',
  templateData: {
    'head.title': 'Payment',
  },
});

module.exports = payment;
