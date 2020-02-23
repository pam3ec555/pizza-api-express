const fieldValidation = require('../../../utils/fieldValidation');
const { objectSize, hash, generateRandomString } = require('../../../utils');
const store = require('../../../store');
const { USERS_DIR, TOKENS_DIR } = require('../../../utils/constants');

/**
 * @param {Object} data
 * @param {function} callback
 */
const login = (data, callback) => {
  if (data.method === 'post') {
    if (typeof data.payload === 'object') {
      const { email, password } = data.payload;
      const errors = {
        email: fieldValidation(email, { requiredField: true, email: true }),
        password: fieldValidation(password, { requiredField: true, minLength: 6 }),
      };
      if (objectSize(errors) === 0) {
        store.read({
          dir: USERS_DIR,
          file: email,
          callback: (err, userData) => {
            if (!err && userData) {
              if (hash(password) === userData.hashedPassword) {
                const token = generateRandomString(20);
                store.create({
                  dir: TOKENS_DIR,
                  file: token,
                  data: {
                    id: token,
                    expires: new Date().getTime() + 1000 * 60 * 60,
                    email,
                  },
                  callback: (err) => {
                    if (!err) {
                      callback({
                        statusCode: 200,
                        data: { token },
                      });
                    } else {
                      callback({
                        statusCode: 500,
                        data: { error: `Could not create token. ${err}` },
                      });
                    }
                  },
                })
              } else {
                callback({
                  statusCode: 400,
                  data: { error: 'Incorrect password' },
                });
              }
            } else {
              callback({
                statusCode: 404,
                data: { error: 'User with specified email is not found.' },
              });
            }
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
        data: { error: 'Payload must be an object' },
      });
    }
  } else {
    callback({
      statusCode: 404,
      data: { error: 'method must be POST' },
    });
  }
};

module.exports = login;
