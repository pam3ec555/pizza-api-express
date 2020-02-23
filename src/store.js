const path = require('path');
const fs = require('fs');
const { appDir, jsonParse } = require('./utils');

const store = {};

/**
 * @type {string}
 */
store._baseDir = path.join(appDir, '/.data/');

/**
 * @param {string} file
 * @param {string?} dir
 * @return {string}
 */
store._getFilePath = (file, dir) => {
  return dir ? `${store._baseDir}${dir}/${file}.json` : `${store._baseDir}${file}.json`;
};

/**
 * @param {string} path
 * @return {string}
 */
store._getDirPath = (path) => `${store._baseDir}${path}`;

/**
 * @param {string?} dir
 * @param {string} file
 * @param {Object} data
 * @param {function(err: string|boolean)} callback
 */
store.create = ({
  dir,
  file,
  data,
  callback,
}) => {
  fs.open(store._getFilePath(file, dir), 'wx', (err, fd) => {
    if (!err && fd) {
      fs.writeFile(fd, JSON.stringify(data), (err) => {
        if (!err) {
          fs.close(fd, (err) => {
            if (!err) {
              callback(false);
            } else {
              callback(`Could not close the file (${file}.json) after writing. ${err}`);
            }
          })
        } else {
          callback(`Could not write to the file (${file}.json). ${err}`);
        }
      });
    } else {
      callback(`Could not open the file (${file}.json) for writing. It may already exist. ${err}`);
    }
  });
};

/**
 * @param {string?} dir
 * @param {string} file
 * @param {function(err: string|null|boolean, data?: Object | Array)} callback
 */
store.read = ({
  dir,
  file,
  callback,
}) => {
  fs.readFile(store._getFilePath(file, dir), 'utf8', (err, data) => {
    if (!err && typeof data === 'string') {
      callback(false, jsonParse(data));
    } else {
      callback(err, data);
    }
  });
};

/**
 * @param {string?} dir
 * @param {string} file
 * @param {Object} data
 * @param {function(err: string|boolean)} callback
 */
store.update = ({
  dir,
  file,
  data,
  callback,
}) => {
  fs.open(store._getFilePath(file, dir), 'r+', (err, fd) => {
    if (!err && fd) {
      fs.ftruncate(fd, (err) => {
        if (!err) {
          fs.writeFile(fd, JSON.stringify(data), (err) => {
            if (!err) {
              fs.close(fd, (err) => {
                if (!err) {
                  callback(false);
                } else {
                  callback(`Could not close the file (${file}.json) while updating.`);
                }
              });
            } else {
              callback(`Could not write data to file (${file}.json) while updating.`);
            }
          });
        } else {
          callback(`Could not truncate the file (${file}.json)`);
        }
      });
    } else {
      callback(`Could not open the file (${file}.json) for updating. It may not exist yet`);
    }
  });
};

/**
 * @param {string?} dir
 * @param {string} file
 * @param {function(err: string|boolean)} callback
 */
store.delete = ({
  dir,
  file,
  callback,
}) => {
  fs.unlink(store._getFilePath(file, dir), (err) => {
    callback(err);
  });
};

/**
 * @param {string} path
 * @param {boolean} recursive
 * @param {function(err: null|Error)} callback
 */
store.createDir = ({
  path,
  recursive = true,
  callback,
}) => {
  fs.mkdir(store._getDirPath(path), { recursive }, (err) => {
    callback(err);
  });
};

/**
 * @param {string} path
 * @param {function(err: null|Error, list: string[]?)} callback
 */
store.readDir = ({
  path,
  callback,
}) => {
  fs.readdir(store._getDirPath(path), (err, list) => {
    callback(err, list);
  });
};

/**
 * @param {string} path
 * @param {function(err: null|Error|string, data: *[]?)} callback
 */
store.readDataFromDir = ({
  path,
  callback,
}) => {
  store.readDir({
    path,
    callback: (err, list) => {
      if (!err) {
        if (Array.isArray(list)) {
          const data = list.map((file) => {
            const content = fs.readFileSync(
              `${store._getDirPath(path)}/${file}`,
              { encoding: 'utf8' },
            );

            return jsonParse(content);
          });
          callback(null, data);
        } else {
          callback('List is not array');
        }
      } else {
        callback(err);
      }
    },
  })
};

/**
 * @param {string} path
 * @param {*} data
 * @param {function(err: null|Error|string)} callback
 */
store.addToFile = ({
  path,
  data,
  callback,
}) => {
  store.read({
    file: path,
    callback: (err, currentData) => {
      if (!err) {
        if (Array.isArray(currentData)) {
          store.update({
            file: path,
            data: [...currentData, data],
            callback: (err) => {
              if (!err) {
                callback(null);
              } else {
                callback(err);
              }
            },
          })
        } else {
          callback(`Invalid format of data of file ${path}`);
        }
      } else {
        callback(`Can not open the file ${path}. ${err}`);
      }
    },
  });
};

module.exports = store;
