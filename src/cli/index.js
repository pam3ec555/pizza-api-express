const event = require('./event');
const readline = require('readline');
const logger = require('../utils/logger');

const cli = {};

/**
 * @param {string} str
 * @private
 */
cli._processInput = (str) => {
  if (typeof str === 'string' && str.trim().length > 0) {
    const input = event.eventNames().find((input) => str.toLowerCase().match(input));
    if (typeof input === 'string') {
      event.emit(input, str);
    } else {
      logger.error('Command is not found');
    }
  }
};

cli.init = () => {
  const _interface = readline.createInterface( {
    input: process.stdin,
    output: process.stdout,
    prompt: '',
  });

  _interface.prompt();

  _interface.on('line', (str) => {
    cli._processInput(str);

    _interface.prompt();
  });

  _interface.on('close', () => {
    process.exit(0);
  });
};

module.exports = cli;
