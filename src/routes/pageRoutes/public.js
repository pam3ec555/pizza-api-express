const fs = require('fs');
const path = require('path');
const { appDir } = require('../../utils');

/**
 * @param {string} file
 * @return {string}
 */
const getFilePath = (file) => path.join(appDir, '/', file);

const publicFolder = (data, callback) => {
  if (data.method === 'get') {
    const { trimmedPath } = data;
    fs.readFile(getFilePath(trimmedPath), (err, data) => {
      if (!err && data) {
        let contentType = 'plain';
        if (trimmedPath.endsWith('.css')) {
          contentType = 'css';
        } else if (trimmedPath.endsWith('.png')) {
          contentType = 'png';
        } else if (trimmedPath.endsWith('.jpg')) {
          contentType = 'jpg';
        } else if (trimmedPath.endsWith('.ico')) {
          contentType = 'favicon';
        }

        callback({
          statusCode: 200,
          data,
          contentType,
        });
      } else {
        callback({ statusCode: 404 });
      }
    });
  } else {
    callback({ statusCode: 405 });
  }
};

module.exports = publicFolder;
