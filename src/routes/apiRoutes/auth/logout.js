const store = require('../../../store');
const { TOKENS_DIR } = require('../../../utils/constants');
const { body, validationResult } = require('express-validator');
const { Router } = require('express');

const logout = Router();

logout.post('/logout', (req, res) => {
  store.delete({
    dir: TOKENS_DIR,
    file: req.headers.token,
    callback: (err) => {
      if (!err) {
        res.status(204).send();
      } else {
        res.status(422).json({ error: `The specified token is invalid or expired: ${err}` });
      }
    },
  });
});

module.exports = logout;
