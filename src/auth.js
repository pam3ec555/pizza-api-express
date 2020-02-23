const store = require('./store');
const { TOKENS_DIR, USERS_DIR } = require('./utils/constants');

const auth = {};

/**
 * @param {string} token
 * @param {function(string|Error|boolean)} callback
 */
auth.userIsLoggedIn = ({
  token,
  callback,
}) => {
  if (typeof token === 'string') {
    store.read({
      dir: TOKENS_DIR,
      file: token,
      callback: (err, data) => {
        if (!err && typeof data === 'object') {
          if (data.expires < new Date().getTime()) {
            callback('Token is expired!');
          } else {
            callback(false);
          }
        } else {
          callback('Token is invalid or it had expired and removed.');
        }
      }
    });
  } else {
    callback('User is not authenticated');
  }
};

/**
 * @param {string} token
 * @param {string} email
 * @param {function(err: string|Error|boolean)} callback
 */
auth.verifyUser = ({
  token,
  email,
  callback,
}) => {
  if (typeof token === 'string') {
    store.read({
      dir: TOKENS_DIR,
      file: token,
      callback: (err, data) => {
        if (!err && typeof data === 'object') {
          if (data.email !== email) {
            callback('Access denied!');
          } else if (data.expires < new Date().getTime()) {
            callback('Token is expired!');
          } else {
            callback(false);
          }
        } else {
          callback('Token is invalid or it had expired and removed.');
        }
      }
    });
  } else {
    callback('Token is not defined.');
  }
};

/**
 * @param {string} token
 * @param {function(err: string|Error|boolean, userData: Object?)} callback
 */
auth.userDataByToken = (token, callback) => {
  if (typeof token === 'string') {
    store.read({
      dir: TOKENS_DIR,
      file: token,
      callback: (err, data) => {
        if (!err && typeof data === 'object') {
          if (data.expires < new Date().getTime()) {
            callback('Token is expired!');
          } else if (typeof data.email === 'string') {
            store.read({
              dir: USERS_DIR,
              file: data.email,
              callback: (err, userData) => {
                if (!err && userData) {
                  callback(false, userData);
                } else {
                  callback('User is not defined');
                }
              }
            })
          } else {
            callback('User is not defined');
          }
        } else {
          callback('Token is invalid or it had expired and removed.');
        }
      }
    });
  } else {
    callback('Token is not defined.');
  }
};

module.exports = auth;
