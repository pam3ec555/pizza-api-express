const path = require('path');
const config = require('../../config');
const crypto = require('crypto');

const utils = {};

/**
 * @type {string}
 */
utils.appDir = path.dirname(require.main.filename);

/**
 * @param {Object} obj
 * @param {boolean?} [includeUndefinedKeys=false]
 * @return {number}
 */
utils.objectSize = (obj, { includeUndefinedKeys = false } = {}) => {
  let size = 0;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (includeUndefinedKeys) {
        size++;
      } else if (typeof obj[key] !== 'undefined') {
        size++;
      }
    }
  }

  return size;
};

/**
 * @param {string} str
 * @return {string|null}
 */
utils.hash = (str) => {
  if (typeof str === 'string' && str.length > 0) {
    return crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
  }

  return null;
};

/**
 * @param {string} str
 * @return {Object}
 */
utils.jsonParse = (str) => {
  try {
    return JSON.parse(str);
  } catch(e) {
    return {};
  }
};

/**
 * @param {number} strLength
 * @return {string|null}
 */
utils.generateRandomString = (strLength) => {
  if (typeof strLength === 'number' && strLength > 0){
    const possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';

    let str = '';
    for (let i = 1; i <= strLength; i++) {
      const randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
      str += randomCharacter;
    }

    return str;
  }

  return null;
};

module.exports = utils;
