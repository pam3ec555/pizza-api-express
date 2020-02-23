const { horizontalLine, centered } = require('../utils');
const logger = require('../../utils/logger');
const store = require('../../store');
const { ORDERS_FILE } = require('../../utils/constants');

/**
 * @param {string} str
 */
const order = (str) => {
  const [, orderId] = str.split('--');
  if (typeof orderId === 'string') {
    store.read({
      file: ORDERS_FILE,
      callback: (err, data) => {
        if (!err) {
          if (Array.isArray(data)) {
            const order = data.find(({ id }) => id === orderId);
            if (order) {
              horizontalLine();
              centered(`Order ${orderId}`);
              logger.table(order);
              horizontalLine();
            } else {
              logger.error('Order not found');
            }
          } else {
            logger.error('Invalid format of orders data');
          }
        } else {
          logger.error(err);
        }
      },
    });
  } else {
    logger.error('Invalid input text. You should use this pattern: "order --{id}" to get order info');
  }
};

module.exports = order;
