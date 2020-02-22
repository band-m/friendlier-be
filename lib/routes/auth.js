const { Router } = require('express');
const User = require('../models/User');
const passport = require('passport');

const ensureAuth = require('../middleware/ensure-auth');

const MAX_AGE_IN_MS = 24 * 60 * 60 * 1000;

const setSessionCookie = (res, token) => {
  res.cookie('session', token, {
    maxAge: MAX_AGE_IN_MS
  });  
};

module.exports = Router()
  .post('/signup', passport.authenticate('signup'), async(req, res, next) => {
    await User
      .create(req.body)
      .then(async user => {
        setSessionCookie(res, user.authToken());
        res.send(user);
      })
      .catch(next);
  })
  .post('/login', async(req, res, next) => {
    passport.authenticate('login', async(err, user, info) =>  {
      User
        .authenticate(req.body)
        .then(async user => {
          setSessionCookie(res, user.authToken());
          await user.populate('dancer').execPopulate();
          res.send(user);
        })
        .catch(next);
    })
  });
