const pageRoute = require('./pageRoute');

const cart = pageRoute({
  file: 'cart',
  templateData: {
    'head.title': 'Cart',
  },
});

module.exports = cart;
