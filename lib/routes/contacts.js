const { Router } = require('express');
const Contact = require('../models/Contact');

module.exports = Router()
  .post('/', (req, res, next) => {
    Contact
      .create(req.body)
      .then(contact => res.send(contact))
      .catch(next);
  })

  // get one contact's details
  .get('/single/:id', (req, res, next) => {
    Contact
      .findById(req.params.id)
      .then(contact => res.send(contact))
      .catch(next);
  })

  // get all contacts for a user
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
