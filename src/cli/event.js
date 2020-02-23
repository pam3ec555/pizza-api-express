const EventEmitter = require('events');
const responders = require('./responders');

class PizzaEventEmitter extends EventEmitter {

}

/**
 * @type {PizzaEventEmitter}
 */
const event = new PizzaEventEmitter();

event.on('menu list', () => {
  responders.menuItems();
});

event.on('help', () => {
  responders.help();
});

event.on('exit', () => {
  responders.exit();
});

event.on('orders', () => {
  responders.orders();
});

event.on('order', (str) => {
  responders.order(str);
});

event.on('users', () => {
  responders.users();
});

event.on('user', (str) => {
  responders.user(str);
});

module.exports = event;
