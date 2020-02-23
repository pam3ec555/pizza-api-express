const fieldValidation = require('../../utils/fieldValidation');
const store = require('../../store');
const { objectSize, hash } = require('../../utils');
const { USERS_DIR, CARTS_DIR } = require('../../utils/constants');
const { verifyUser } = require('../../auth');

/**
 * @type {Set<string>}
 */
const acceptableMethods = new Set(['post', 'get', 'put', 'delete']);

/**
 * @type {Set<string>}
 */
const deleteDirs = new Set([CARTS_DIR]);

const routes = {};

/**
 * @param {Object} data
 * @param {function} callback
 */
routes.users = (data, callback) => {
  if (acceptableMethods.has(data.method)) {
    routes._users[data.method](data, callback);
  } else {
    callback({ statusCode: 405 });
  }
};

routes._users = {};

/**
 * @param {Object} data
 * @param {function} callback
 */
routes._users.post = (data, callback) => {
  if (typeof data === 'object' && typeof data.payload === 'object') {
    const { name, email, address, password } = data.payload;
    const errors = {
      name: fieldValidation(name, { requiredField: true }),
      email: fieldValidation(email, { requiredField: true, email: true }),
      address: fieldValidation(address, { requiredField: true }),
      password: fieldValidation(password, { requiredField: true, minLength: 6 }),
    };

    if (objectSize(errors) === 0) {
      store.read({
        dir: USERS_DIR,
        file: email,
        callback: (err) => {
          if (err) {
            const hashedPassword = hash(password);
            if (hashedPassword) {
              store.create({
                dir: USERS_DIR,
                file: email,
                data: {
                  name,
                  email,
                  hashedPassword,
                  address,
                  registeredAt: new Date(),
                },
                callback: (err) => {
                  if (!err) {
                    callback({ statusCode: 204 });
                  } else {
                    callback({
                      statusCode: 500,
                      data: { error: `Could create the user. ${err}` },
                    });
                  }
                },
              });
            } else {
              callback({
                statusCode: 500,
                data: { error: `Could not hash the password. ${err}` },
              });
            }
          } else {
            callback({
              statusCode: 409,
              data: { error: `User with email ${email} already exists` },
            });
          }
        },
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
      data: { error: 'Payload must be an object' },
    });
  }
};

/**
 * @param {Object} data
 * @param {function} callback
 */
routes._users.get = (data, callback) => {
  if (typeof data === 'object' && typeof data.query === 'object') {
    const { email } = data.query;
    const emailError = fieldValidation(email, { requiredField: true, email: true });
    if (!emailError) {
      verifyUser({
        email,
        token: data.headers.token,
        callback: (err) => {
          if (!err) {
            store.read({
              dir: USERS_DIR,
              file: email,
              callback: (err, userData) => {
                if (!err && userData) {
                  delete userData.hashedPassword;
                  callback({
                    statusCode: 200,
                    data: userData,
                  });
                } else {
                  callback({ statusCode: 404 });
                }
              },
            });
          } else {
            callback({
              statusCode: 401,
              data: { error: err },
            });
          }
        },
      });
    } else {
      callback({
        statusCode: 400,
        data: { error: { email: emailError } },
      });
    }
  } else {
    callback({
      statusCode: 400,
      data: { error: 'Query params are empty' },
    });
  }
};

/**
 * @param {Object} data
 * @param {function} callback
 */
routes._users.put = (data, callback) => {
  if (typeof data === 'object' && typeof data.payload === 'object' && typeof data.query === 'object') {
    const { email } = data.query;
    const emailError = fieldValidation(email, { requiredField: true, email: true });
    if (!emailError) {
      const { name, address } = data.payload;
      if (name || address) {
        verifyUser({
          token: data.headers.token,
          email,
          callback: (err) => {
            if (!err) {
              store.read({
                dir: USERS_DIR,
                file: email,
                callback: (err, userData) => {
                  if (!err && userData) {
                    if (name) {
                      userData.name = name;
                    }
                    if (address) {
                      userData.address = address;
                    }

                    store.update({
                      dir: USERS_DIR,
                      file: email,
                      data: userData,
                      callback: (err) => {
                        if (!err) {
                          callback({ statusCode: 204 });
                        } else {
                          callback({
                            statusCode: 500,
                            data: { error: 'Could not update the user' },
                          });
                        }
                      },
                    });
                  } else {
                    callback({ statusCode: 404 });
                  }
                },
              })
            } else {
              callback({
                statusCode: 401,
                data: { error: err },
              });
            }
          }
        });
      } else {
        callback({
          statusCode: 400,
          data: { error: 'There are no fields to update' },
        });
      }
    } else {
      callback({
        statusCode: 400,
        data: { error: { email: emailError } },
      });
    }
  } else {
    callback({
      statusCode: 400,
      data: { error: 'Query params are empty or payload is not defined' },
    });
  }
};

/**
 * @param {Object} data
 * @param {function} callback
 */
routes._users.delete = (data, callback) => {
  if (typeof data === 'object' && typeof data.query === 'object') {
    const { email } = data.query;
    const emailError = fieldValidation(email, { requiredField: true, email: true });
    if (!emailError) {
      verifyUser({
        token: data.headers.token,
        email,
        callback: (err) => {
          if (!err) {
            store.read({
              dir: USERS_DIR,
              file: email,
              callback: (err) => {
                if (!err && data) {
                  store.delete({
                    dir: USERS_DIR,
                    file: email,
                    callback: (err) => {
                      if (!err) {
                        deleteDirs.forEach((dir) => {
                          store.delete({
                            dir,
                            file: email,
                            callback: () => {},
                          });
                        });
                        callback({ statusCode: 204 });
                      } else {
                        callback({
                          statusCode: 500,
                          data: { error: 'Could not delete the user' },
                        });
                      }
                    },
                  });
                } else {
                  callback({ statusCode: 404 });
                }
              },
            });
          } else {
            callback({
              statusCode: 401,
              data: { error: err },
            });
          }
        }
      })
    } else {
      callback({
        statusCode: 400,
        data: { error: { email: emailError } },
      });
    }
  } else {
    callback({
      statusCode: 400,
      data: { error: 'Query params are empty' },
    });
  }
};

module.exports = routes;
