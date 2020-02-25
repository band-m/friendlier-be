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
  });
