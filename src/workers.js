const store = require('./store');
const { TOKENS_DIR } = require('./utils/constants');
const logger = require('./utils/logger');

const workers = {};

/**
 * @private
 */
workers._removeExpiredTokens = () => {
  store.readDir({
    path: TOKENS_DIR,
    callback: (err, list) => {
      if (!err && Array.isArray(list)) {
        list.forEach((file) => {
          file = file.replace('.json', '');
          store.read({
            dir: TOKENS_DIR,
            file,
            callback: (err, data) => {
              if (!err && data) {
                const { expires, id } = data;
                if (typeof expires === 'number' && typeof id === 'string') {
                  if (new Date().getTime() > expires) {
                    store.delete({
                      dir: TOKENS_DIR,
                      file,
                      callback: (err) => {
                        if (!err) {
                          logger.info(`workers._removeExpiredTokens: token with id "${id}" had expired and removed`);
                        } else {
                          logger.error('workers._removeExpiredTokens: ', err);
                        }
                      },
                    });
                  }
                } else {
                  logger.error('workers._removeExpiredTokens: "expires" must be a number');
                }
              } else {
                logger.error('workers._removeExpiredTokens: ', err);
              }
            },
          })
        });
      } else {
        logger.warning('workers._removeExpiredTokens: ', err);
      }
    },
  });
};

/**
 * @private
 */
workers._loop = () => {
  workers._removeExpiredTokens();
};

workers.init = () => {
  workers._loop();

  setInterval(() => {
    workers._loop();
  }, 1000 * 60 * 60);
};

module.exports = workers;
