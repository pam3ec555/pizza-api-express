const { userDataByToken } = require('../../auth');

/**
 * @type {Set<string>}
 */
const acceptableMethods = new Set(['get']);

const routes = {};

/**
 * @param {Object} data
 * @param {function} callback
 */
routes.profile = (data, callback) => {
  if (acceptableMethods.has(data.method)) {
    routes._profile[data.method](data, callback);
  } else {
    callback({ statusCode: 405 });
  }
};

routes._profile = {};

/**
 * @param {Object} data
 * @param {function} callback
 */
routes._profile.get = (data, callback) => {
  if (typeof data === 'object') {
    userDataByToken(
      data.headers.token,
      (err, userData) => {
        if (!err && userData) {
          delete userData.hashedPassword;
          callback({
            statusCode: 200,
            data: userData,
          });
        } else {
          callback({ statusCode: 401 });
        }
      },
    );
  } else {
    callback({
      statusCode: 500,
      data: { error: '"data" must be an object.' },
    });
  }
};

module.exports = routes;
