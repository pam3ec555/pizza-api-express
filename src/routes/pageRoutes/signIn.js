const pageRoute = require('./pageRoute');

const signIn = pageRoute({
  file: 'sign-in',
  templateData: {
    'head.title': 'Login',
  },
});

module.exports = signIn;
