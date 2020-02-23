const users = require('./users');
// const menu = require('./menu');
// const cart = require('./cart');
// const orders = require('./orders');
// const profile = require('./profile');
// const login = require('./auth/login');
// const logout = require('./auth/logout');

const apiRoutes = {};

apiRoutes.init = (app) => {
  app.use(users);
  /*app.use('/menu', menu);
  app.use('/cart', cart);
  app.use('/orders', orders);
  app.use('/profile', profile);
  app.use('/login', login);
  app.use('/logout', logout);
  app.use('*', (req, res) => {
    res.sendStatus(404);
  });*/
};

module.exports = apiRoutes;
