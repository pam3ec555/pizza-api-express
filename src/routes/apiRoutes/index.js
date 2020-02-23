const users = require('./users');
const menu = require('./menu');
const cart = require('./cart');
const orders = require('./orders');
const profile = require('./profile');
const login = require('./auth/login');
const logout = require('./auth/logout');

const apiRoutes = {
  ...users,
  ...menu,
  ...cart,
  ...orders,
  ...profile,

  login,
  logout,

  notFound: (data, callback) => {
    callback({ statusCode: 404 });
  },
};

module.exports = apiRoutes;
