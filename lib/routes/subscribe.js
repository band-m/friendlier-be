const { Router } = require('express');
const ensureAuth = require('../middleware/ensure-auth');
const Subscriber = require('../models/Subscriber');

module.exports = Router()
  .post('/', ensureAuth, async(req, res, next) => {
    try {
      await Subscriber
        .create({...req.body});
      res.send('Subscription successful');
    }
    catch(error) {
      next(error);
    }
  });
