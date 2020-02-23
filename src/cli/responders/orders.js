const { horizontalLine, centered } = require('../utils');
const logger = require('../../utils/logger');
const store = require('../../store');
const { ORDERS_FILE } = require('../../utils/constants');

const orders = () => {
  store.read({
    file: ORDERS_FILE,
    callback: (err, data) => {
      if (!err) {
        if (Array.isArray(data)) {
          horizontalLine();
          centered('Recent orders');
          let preparedData = data.filter((item) => {
            if (!item || typeof item.date !== 'string') {
              return false;
            }

            return new Date(item.date).getTime() >= new Date().getTime() - 1000 * 60 * 60 * 24;
          });
          preparedData = preparedData.map(({ user, id, amount }) => ({ user, id, amount }));
          logger.table(preparedData);
          horizontalLine();
        } else {
          logger.error('Invalid format of orders data');
        }
      } else {
        logger.error(err);
      }
    },
  });
};

module.exports = orders;
