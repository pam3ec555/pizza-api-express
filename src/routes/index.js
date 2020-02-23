const apiRoutes = require('./apiRoutes');
const pageRoutes = require('./pageRoutes');

const routes = {
  ...apiRoutes,
  ...pageRoutes,
};

module.exports = routes;
