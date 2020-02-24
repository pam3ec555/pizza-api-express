const { TOKENS_DIR, USERS_DIR } = require('../../../utils/constants');
const { generateRandomString, hash } = require('../../../utils');
const store = require('../../../store');
const { body, validationResult } = require('express-validator');
const { Router } = require('express');

const login = Router();

login.post('/login', [
  body('email').isEmail().withMessage('Invalid email'), // Todo check user for existing
  body('password').isLength({ min: 6 }).withMessage('Password should be equal or greater than 6 symbols'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { password, email } = req.body;

  store.read({
    dir: USERS_DIR,
    file: email,
    callback: (err, userData) => {
      if (!err && userData) {
        if (hash(password) === userData.hashedPassword) {
          const token = generateRandomString(20);
          store.create({
            dir: TOKENS_DIR,
            file: token,
            data: {
              id: token,
              expires: new Date().getTime() + 1000 * 60 * 60,
              email,
            },
            callback: (err) => {
              if (!err) {
                res.status(200).json({ token });
              } else {
                res.status(500).json({ error: `Could not create token. ${err}` });
              }
            },
          })
        } else {
          res.status(422).json({ error: 'Incorrect password' });
        }
      } else {
        res.status(404).json({ error: 'User with specified email is not found.' });
      }
    }
  });
});

module.exports = login;
