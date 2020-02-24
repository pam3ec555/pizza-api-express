const { hash } = require('../../utils');
const { verifyUser } = require('../../auth');
const { body, query, validationResult } = require('express-validator');
const { Router } = require('express');
const store = require('../../stores/UsersStore');

const users = Router();

users.route('/users')
  .get([
    query('email').isEmail().withMessage('Invalid email'), // Todo: change email to id
  ], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { email } = req.query;

    // Todo: Change verifying method
    verifyUser({
      email,
      token: req.headers.token,
      callback: async (err) => {
        if (!err) {
          try {
            const userData = await store.read(email);
            delete userData.hashedPassword;
            res.status(200).json(userData);
          } catch (e) {
            res.status(500).send(e);
          }
        } else {
          res.status(401).json({ error: err });
        }
      },
    });
  })
  .post([
    body('email').isEmail().withMessage('Invalid email'),
    body(['name', 'address']).not().isEmpty().withMessage('Required field').trim(),
    body('password').isLength({ min: 6 }).withMessage('Password should be equal or greater than 6 symbols'),
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { name, email, password, address } = req.body;

    try {
      const hashedPassword = hash(password);
      await store.create({
        name,
        email,
        hashedPassword,
        address,
        registeredAt: new Date(),
      });
      res.status(204).send();
    } catch (e) {
      if (e.code === 11000) {
        res.status(409).json({ errors: 'User with specified email already exists' });
      } else {
        res.status(500).send(e);
      }
    }
  })
  .put([
    query('email').isEmail().withMessage('Invalid email'), // Todo: change email to id
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
        callback: async (err) => {
          if (!err) {
            const data = {};
            if (name) {
              data.name = name;
            }
            if (address) {
              data.address = address;
            }
            try {
              await store.update(email, data);
              res.status(204).send();
            } catch (e) {
              res.status(500).send(e);
            }
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
    query('email').isEmail().withMessage('Invalid email'), // Todo: change email to id
  ], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { email } = req.query;

    verifyUser({
      token: req.headers.token,
      email,
      callback: async (err) => {
        if (!err) {
          try {
            await store.delete(email);
            res.status(204).send();
          } catch (e) {
            res.status(500).send(e);
          }
        } else {
          res.status(401).json({ error: err });
        }
      },
    });
  });

module.exports = users;
