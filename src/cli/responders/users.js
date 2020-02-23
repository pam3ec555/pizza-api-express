const { horizontalLine, centered } = require('../utils');
const logger = require('../../utils/logger');
const store = require('../../store');
const { USERS_DIR } = require('../../utils/constants');

const users = () => {
  store.readDataFromDir({
    path: USERS_DIR,
    callback: (err, data) => {
      if (!err && data) {
        horizontalLine();
        centered('Users');
        const preparedData = data.filter((item) => {
          if (!item || typeof item.registeredAt !== 'string') {
            return false;
          }

          return new Date(item.registeredAt).getTime() >= new Date().getTime() - 1000 * 60 * 60 * 24;
        }).map(({ email, registeredAt }) => ({ email, registeredAt }));
        logger.table(preparedData);
        horizontalLine();
      } else {
        logger.error(err);
      }
    },
  });
};

module.exports = users;
