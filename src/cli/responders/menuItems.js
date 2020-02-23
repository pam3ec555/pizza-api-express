const { horizontalLine, centered } = require('../utils');
const store = require('../../store');
const { MENU_DIR, PIZZA_LIST_FILE } = require('../../utils/constants');
const logger = require('../../utils/logger');

const menuItems = () => {
  horizontalLine();
  centered('Menu List');
  store.read({
    dir: MENU_DIR,
    file: PIZZA_LIST_FILE,
    callback: (err, pizzaList) => {
      if (!err && pizzaList) {
        logger.table(pizzaList);
      } else {
        logger.error(err);
      }
    },
  });
  horizontalLine();
};

module.exports = menuItems;
