const express = require('express');
const config = require('../config');
const routes = require('./routes');

const server = {};

server.init = () => {
  const app = express();

  app.use(express.static('public'));
  app.use(express.json());

  routes.init(app);

  app.listen(config.port, () => {
    console.log(`Server started on port ${config.port}!`);
  });
};

module.exports = server;
