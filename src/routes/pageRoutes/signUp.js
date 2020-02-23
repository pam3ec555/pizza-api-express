const pageRoute = require('./pageRoute');

const signUp = pageRoute({
  file: 'sign-up',
  templateData: {
    'head.title': 'Sign up',
  },
});

module.exports = signUp;
