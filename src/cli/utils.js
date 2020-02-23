const logger = require('../utils/logger');

const utils = {};

utils.horizontalLine = () => {
  const { columns } = process.stdout;
  let line = '';
  for (let i = 0; i < columns; i++) {
    line += '-';
  }
  logger.log(line);
};

utils.centered = (str) => {
  const { columns } = process.stdout;
  const leftPadding = Math.floor((columns - str.length) / 2);
  let line = '';
  for (let i = 0; i < leftPadding; i++) {
    line += ' ';
  }
  line += str;
  logger.log(line);
};

module.exports = utils;
