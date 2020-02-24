const store = require('../../store');
const { hash } = require('../../utils');
const { CARTS_DIR, USERS_DIR } = require('../../utils/constants');
const { verifyUser } = require('../../auth');
const { body, query, validationResult } = require('express-validator');
const { Router } = require('express');

const users = Router();

users.route('/users')
  .get([
    query('email').isEmail().withMessage('Invalid email'), // Todo check user for existing
  ], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { email } = req.query;

    verifyUser({
      email,
      token: req.headers.token,
      callback: (err) => {
        if (!err) {
          store.read({
            dir: USERS_DIR,
            file: email,
            callback: (err, userData) => {
              if (!err && userData) {
                delete userData.hashedPassword;
                res.status(200).json(userData);
              } else {
                res.status(404).send();
              }
            },
          });
        } else {
          res.status(401).json({ error: err });
        }
      },
    });
  })
  .post([
    body('email').isEmail().withMessage('Invalid email'), // Todo: check user for existing here
    body(['name', 'address']).not().isEmpty().withMessage('Required field').trim(),
    body('password').isLength({ min: 6 }).withMessage('Password should be equal or greater than 6 symbols'),
  ], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { name, email, password, address } = req.body;

    store.read({
      dir: USERS_DIR,
      file: email,
      callback: (err) => {
        if (err) {
          const hashedPassword = hash(password);
          if (hashedPassword) {
            store.create({
              dir: USERS_DIR,
              file: email,
              data: {
                name,
                email,
                hashedPassword,
                address,
                registeredAt: new Date(),
              },
              callback: (err) => {
                if (!err) {
                  res.status(204).send();
                } else {
                  res.status(500).json({ error: `Could create the user. ${err}` });
                }
              },
            });
          } else {
            res.status(500).json({ error: `Could not hash the password. ${err}` });
          }
        } else {
          res.status(409).json({ error: `User with email ${email} already exists` });
        }
      },
    });
  })
  .put([
    query('email').isEmail().withMessage('Invalid email'), // Todo check user for existing
  ], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { name, address } = req.body;
    if (name || address) {
      const { email } = req.query;
      verifyUser({
        token: req.headers.token,
        email,
        callback: (err) => {
          if (!err) {
            store.read({
              dir: USERS_DIR,
              file: email,
              callback: (err, userData) => {
                if (!err && userData) {
                  if (name) {
                    userData.name = name;
                  }
                  if (address) {
                    userData.address = address;
                  }

                  store.update({
                    dir: USERS_DIR,
                    file: email,
                    data: userData,
                    callback: (err) => {
                      if (!err) {
                        res.status(204).send();
                      } else {
                        res.status(500).json({ error: 'Could not update the user' });
                      }
                    },
                  });
                } else {
                  res.status(404).send();
                }
              },
            })
          } else {
            res.status(401).json({ error: err });
          }
        }
      });
    } else {
      res.status(400).json({ error: 'There are no fields to update' });
    }
  })
  .delete([
    query('email').isEmail().withMessage('Invalid email'), // Todo check user for existing
  ], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { email } = req.query;

    verifyUser({
      token: req.headers.token,
      email,
      callback: (err) => {
        if (!err) {
          store.read({
            dir: USERS_DIR,
            file: email,
            callback: (err) => {
              if (!err) {
                store.delete({
                  dir: USERS_DIR,
                  file: email,
                  callback: (err) => {
                    if (!err) {
                      store.delete({
                        dir: CARTS_DIR,
                        file: email,
                        callback: () => {
                        },
                      });
                      res.status(204).send();
                    } else {
                      res.status(500).json({ error: 'Could not delete the user' });
                    }
                  },
                });
              } else {
                res.status(404).send();
              }
            },
          });
        } else {
          res.status(401).json({ error: err });
        }
      },
    });
  });

module.exports = users;
