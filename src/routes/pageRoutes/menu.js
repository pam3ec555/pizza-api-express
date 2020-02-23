const pageRoute = require('./pageRoute');

const menu = pageRoute({
  file: 'index',
  templateData: {
    'head.title': 'Tasty pizza',
  },
});

module.exports = menu;
