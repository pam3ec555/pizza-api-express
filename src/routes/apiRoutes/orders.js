const fieldValidation = require('../../utils/fieldValidation');
const { objectSize, generateRandomString } = require('../../utils');
const { CARTS_DIR, MENU_DIR, PIZZA_LIST_FILE, ORDERS_FILE } = require('../../utils/constants');
const { userDataByToken } = require('../../auth');
const store = require('../../store');
const stripe = require('../../api/stripe');
const mailgun = require('../../api/mailgun');
const logger = require('../../utils/logger');

/**
 * @type {Set<string>}
 */
const acceptableMethods = new Set(['post']);

const routes = {};

/**
 * @param {Object} data
 * @param {function} callback
 */
routes.orders = (data, callback) => {
  if (acceptableMethods.has(data.method)) {
    routes._orders[data.method](data, callback);
  } else {
    callback({ statusCode: 405 });
  }
};

routes._orders = {};

/**
 * @param {Object} data
 * @param {function} callback
 */
routes._orders.post = (data, callback) => {
  if (typeof data.payload === 'object') {
    const { cardNumber, expirationMonth, expirationYear, cvs } = data.payload;
    const errors = {
      cardNumber: fieldValidation(cardNumber, { requiredField: true }),
      expirationMonth: fieldValidation(expirationMonth, {
        requiredField: true,
        type: 'number',
        minValue: 1,
        maxValue: 12,
      }),
      expirationYear: fieldValidation(expirationYear, {
        requiredField: true,
        type: 'number',
        maxValue: 9999,
        minValue: new Date().getFullYear(),
      }),
      cvs: fieldValidation(cvs, {
        requiredField: true,
        type: 'number',
        maxValue: 999,
        minValue: 100,
      }),
    };
    if (objectSize(errors) === 0) {
      userDataByToken(data.headers.token, (err, userData) => {
        if (!err && userData) {
          store.read({
            dir: CARTS_DIR,
            file: userData.email,
            callback: (err, cartData) => {
              if (!err && Array.isArray(cartData) && cartData.length > 0) {
                store.read({
                  dir: MENU_DIR,
                  file: PIZZA_LIST_FILE,
                  callback: (err, pizzaList) => {
                    if (!err && pizzaList) {
                      let totalAmount = 0;
                      const fullCartData = cartData.map((item) => {
                        const pizza = pizzaList.find((pizza) => pizza.id === item.itemId);
                        if (pizza && typeof pizza.price === 'number') {
                          totalAmount += (pizza.price * item.count);

                          return { name: pizza.name, count: item.count };
                        }

                        return undefined;
                      }).filter(item => item);
                      stripe.request({
                        amount: totalAmount,
                        cartData: fullCartData,
                        cardNumber,
                        expirationYear,
                        expirationMonth,
                        cvs,
                        callback: (err, paymentData) => {
                          if (!err && paymentData) {
                            const { amount, description } = paymentData;
                            const message =
                              `The payment is successfully done for $${amount}. Order data: ${description}`;
                            mailgun.request({
                              subject: 'Successful payment',
                              text: message,
                              email: userData.email,
                              callback: (err) => {
                                if (err) {
                                  logger.error(err);
                                }

                                store.addToFile({
                                  path: ORDERS_FILE,
                                  data: {
                                    user: userData.email,
                                    date: new Date(),
                                    amount,
                                    description: `Order data: ${description}`,
                                    id: generateRandomString(20),
                                  },
                                  callback: (err) => {
                                    if (!err) {
                                      store.update({
                                        dir: CARTS_DIR,
                                        file: userData.email,
                                        data: [],
                                        callback: (err) => {
                                          if (err) {
                                            logger.error(err);
                                          }

                                          callback({
                                            statusCode: 200,
                                            data: { message },
                                          });
                                        }
                                      });
                                    } else {
                                      callback({
                                        statusCode: 500,
                                        data: { error: err },
                                      });
                                    }
                                  },
                                });
                              },
                            });
                          } else {
                            callback({
                              statusCode: 500,
                              data: { error: err },
                            });
                          }
                        },
                      });
                    } else {
                      callback({
                        statusCode: 500,
                        data: { error: err },
                      });
                    }
                  },
                });
              } else {
                callback({
                  statusCode: 400,
                  data: { error: 'Cart is empty.' },
                });
              }
            },
          });
        } else {
          callback({
            statusCode: 401,
            data: { error: err },
          });
        }
      });
    } else {
      callback({
        statusCode: 400,
        data: { error: errors },
      });
    }
  } else {
    callback({
      statusCode: 400,
      data: { error: 'Payload must be object' },
    });
  }
};

module.exports = routes;
