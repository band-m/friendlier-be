const { Router } = require('express');
const Connection = require('../models/Connection');

module.exports = Router()
  .post('/', (req, res, next) => {
    Connection
      .create(req.body)
      .then(connection => res.send(connection))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Connection
      .find({ contactId: req.params.id })
      .then(connections => res.send(connections))
      .catch(next);
  })

  .patch('/:id', (req, res, next) => {
    Connection
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(updatedConnection => res.send(updatedConnection))
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    Connection
      .findByIdAndDelete(req.params.id)
      .then(connection => res.send(connection))
      .catch(next);
  });
