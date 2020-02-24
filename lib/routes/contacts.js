const { Router } = require('express');
const Contact = require('../models/Contact');

module.exports = Router()
  .post('/', (req, res, next) => {
    Contact
      .create(req.body)
      .then(contact => res.send(contact))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Contact
      .find({ userId: req.params.id })
      .then(contacts => res.send(contacts))
      .catch(next);
  });
