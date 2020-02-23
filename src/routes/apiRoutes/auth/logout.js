const store = require('../../../store');
const { TOKENS_DIR } = require('../../../utils/constants');

/**
 * @param {Object} data
 * @param {function} callback
 */
const logout = (data, callback) => {
  if (data.method === 'post') {
    if (typeof data.headers.token === 'string') {
      store.delete({
        dir: TOKENS_DIR,
        file: data.headers.token,
        callback: (err) => {
          if (!err) {
            callback({ statusCode: 204 });
          } else {
            callback({
              statusCode: 400,
              data: { error: `The specified token is invalid or expired: ${err}` },
            });
          }
        },
      });
    } else {
      callback({
        statusCode: 400,
        data: { error: '"token" is required' },
      });
    }
  } else {
    callback({
      statusCode: 404,
      data: { error: 'method must be POST' },
    });
  }
};

module.exports = logout;
