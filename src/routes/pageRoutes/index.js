const menu = require('./menu');
const signIn = require('./signIn');
const signUp = require('./signUp');
const cart = require('./cart');
const payment = require('./payment');
const publicFolder = require('./public');

const pageRoutes = {
  'sign-up': signUp,
  'sign-in': signIn,
  index: menu,
  'my-cart': cart,
  'payment': payment,
  'public': publicFolder,
};

module.exports = pageRoutes;
