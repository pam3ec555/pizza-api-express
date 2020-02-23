const apiRoutes = require('./apiRoutes');

const routes = {};

routes.init = (app) => {
  apiRoutes.init(app);
};

module.exports = routes;
