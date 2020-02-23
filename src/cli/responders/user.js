const { horizontalLine, centered } = require('../utils');
const logger = require('../../utils/logger');
const store = require('../../store');
const { USERS_DIR } = require('../../utils/constants');

/**
 * @param {string} str
 */
const order = (str) => {
  const [, email] = str.split('--');
  if (typeof email === 'string') {
    store.readDataFromDir({
      path: USERS_DIR,
      callback: (err, data) => {
        if (!err && data) {
          const user = data.find((user) => user.email === email);
          if (user) {
            delete user.hashedPassword;

            horizontalLine();
            centered('User');
            logger.table(user);
            horizontalLine();
          } else {
            logger.error('User not found');
          }
        } else {
          logger.error(err);
        }
      },
    });
  } else {
    logger.error('Invalid input text. You should use this pattern: "user --{email}" to get user info');
  }
};

module.exports = order;
