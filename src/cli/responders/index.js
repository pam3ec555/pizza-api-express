const menuItems = require('./menuItems');
const help = require('./help');
const exit = require('./exit');
const orders = require('./orders');
const order = require('./order');
const users = require('./users');
const user = require('./user');

const responders = {
  menuItems,
  help,
  exit,
  orders,
  order,
  users,
  user,
};

module.exports = responders;
