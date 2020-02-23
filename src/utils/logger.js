const logger = {};

/**
 * @param {...*} message
 */
logger.error = (...message) => {
  console.error('\x1b[31m', ...message, '\x1b[0m');
};

/**
 * @param {...*} message
 */
logger.warning = (...message) => {
  console.warn('\x1b[33m', ...message, '\x1b[0m');
};

/**
 * @param {...*} message
 */
logger.info = (...message) => {
  console.info('\x1b[34m', ...message, '\x1b[0m');
};

/**
 * @param {...*} message
 */
logger.log = console.log;

logger.table = console.table;

module.exports = logger;
