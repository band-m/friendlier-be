const { Router } = require('express');
const ensureAuth = require('../middleware/ensure-auth');
const Subscription = require('../models/Subscription');

module.exports = Router()
  .post('/', ensureAuth, async(req, res, next) => {
    try {
      await Subscription
        .create({ ...req.body, user: req.user._id });
      res.send('Subscription successful');
    }
    catch(error) {
      next(error);
    }
  });
