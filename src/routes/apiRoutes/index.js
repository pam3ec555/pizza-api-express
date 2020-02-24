const users = require('./users');
const login = require('./auth/login');
const logout = require('./auth/logout');

const apiRoutes = {};

apiRoutes.init = (app) => {
  app.use(users);
  app.use(login);
  app.use(logout);
};

module.exports = apiRoutes;
