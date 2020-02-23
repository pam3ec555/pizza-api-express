const server = require('./src/server');
const workers = require('./src/workers');
const cli = require('./src/cli');

const app = {};

app.init = () => {
  server.init();

  workers.init();

  cli.init();
};

app.init();
