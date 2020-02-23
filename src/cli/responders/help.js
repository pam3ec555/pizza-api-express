const { horizontalLine, centered } = require('../utils');
const logger = require('../../utils/logger');

const data = [
  {
    command: 'help',
    description: 'Show this help page',
  },
  {
    command: 'exit',
    description: 'Kill the CLI (and the rest of the application)',
  },
  {
    command: 'menu list',
    description: 'Show table of menu items',
  },
  {
    command: 'orders',
    description: 'Show table of orders placed in the last 24 hours',
  },
  {
    command: 'order --{id}',
    description: 'Show specified order info',
  },
  {
    command: 'users',
    description: 'View all the users who have signed up in the last 24 hours',
  },
  {
    command: 'user --{email}',
    description: 'Show specified user info',
  },
];

const help = () => {
  horizontalLine();
  centered('Help');
  logger.table(data);
  horizontalLine();
};

module.exports = help;
