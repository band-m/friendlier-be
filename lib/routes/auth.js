const { Router } = require('express');
const User = require('../models/User');
const passport = require('passport');
const jwt = require('jsonwebtoken');
//const ensureAuth = require('../middleware/ensure-auth');

const MAX_AGE_IN_MS = 24 * 60 * 60 * 1000; // 1 day: we can change this

const setSessionCookie = (res, token) => {
  res.cookie('session', token, {
    maxAge: MAX_AGE_IN_MS,
    httpOnly: true,
    secure: true 
  });  
};

const getAuthToken = (user) => {
  return jwt.sign(user.toJSON(), process.env.APP_SECRET, {
    expiresIn: '24h'
  });
};

module.exports = Router()
  .post('/signup', passport.authenticate('signup'), async(req, res, next) => {
    User
      .create(req.body)
      .then(async(user) => {
        setSessionCookie(res, getAuthToken(user));
        res.send(user);
      })
      .catch(next);
  })

  .post('/login', async(req, res, next) => {
    passport.authenticate('local', { session: false }, async(err, user) => {
      try {
        if(err || !user) {
          const error = new Error('An Error occurred');
          return next(error);
        }
        req.login(user, {session: false}, (error) => {
          if(error) {
            res.status(400).send({ error });
          }
          setSessionCookie(res, getAuthToken(user));
          res.send(user);
        });
      }
      catch(error) {
        return next(error);
      }
    })(req, res, next);
  });
