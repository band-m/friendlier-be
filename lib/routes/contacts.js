const { Router } = require('express');
const Contact = require('../models/Contact');
const ensureAuth = require('../middleware/ensure-auth');

module.exports = Router()
  .post('/', ensureAuth, (req, res, next) => {
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
  })

  .patch('/:id', (req, res, next) => {
    Contact
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(updatedContact => res.send(updatedContact))
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    Contact
      .findByIdAndDelete(req.params.id)
      .then(contact => res.send(contact))
      .catch(next);
  });

// middleware? ensure-auth?
