const path = require('path');
const { appDir } = require('../../utils');
const fs = require('fs');

/**
 * @type {string}
 */
const templateDirPath = path.join(appDir, '/src/templates/');

/**
 * @type {string}
 */
const containerFile = path.join(templateDirPath, '_container.html');

/**
 * @param {Object} templateData
 * @param {string} template
 * @param {boolean} isAuthenticated
 * @param {function(err: string|boolean, template: string?)} callback
 */
const insertTemplateToContainer = ({
  template,
  callback,
  templateData,
}) => {
  fs.readFile(containerFile, 'utf8', (err,str) => {
    if (!err && typeof str === 'string' && str.length > 0) {
      str = str.replace('{{children}}', template);
      callback(false, interpolate({ templateData, str }));
    } else {
      callback('_container.html is not found');
    }
  });
};

/**
 * @param {string} str
 * @param {Object} templateData
 */
const interpolate = ({
  str,
  templateData = {},
}) => {
  if (typeof templateData === 'object') {
    for (const key in templateData) {
       str = str.replace(`{{${key}}}`, templateData[key]);
    }
  }

  return str;
};

/**
 * @param {Object} templateData
 * @param {string} file
 * @param {function(err: string|boolean, template: string?)} callback
 */
const getTemplate = ({
  templateData = {},
  file,
  callback,
}) => {
  fs.readFile(`${templateDirPath}${file}.html`, 'utf8', (err, str) => {
    if (!err && typeof str === 'string' && str.length > 0) {
      insertTemplateToContainer({ callback, template: str, templateData });
    } else {
      callback(err);
    }
  });
};

/**
 * @param {Object} templateData
 * @param {string} file
 * @return {function(data: Object, callback: function)}
 */
const pageRoute = ({
  templateData,
  file,
}) => (data, callback) => {
  if (data.method === 'get') {
    getTemplate({
      file,
      templateData,
      callback: (err, template) => {
        if (!err && template) {
          callback({
            statusCode: 200,
            data: template,
            contentType: 'html',
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
    callback({ statusCode: 405 });
  }
};

module.exports = pageRoute;
