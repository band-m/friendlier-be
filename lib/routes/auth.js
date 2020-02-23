const { Router } = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const ensureAuth = require('../middleware/ensure-auth');

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
  .post('/signup', passport.authenticate('signup'), async(req, res) => {
    setSessionCookie(res, getAuthToken(req.user));
    res.send(req.user);
  })
  .post('/login', async(req, res, next) => {
    passport.authenticate('local', { session: false }, async(err, user) => {
      try {
        if(err || !user) {
          const error = new Error('An Error occurred');
          return next(error);
        }
        req.login(user, { session: false }, (error) => {
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
  })
  .get('/signed-in', ensureAuth, (req, res) => {
    res.send(req.user);
  })
  .get('/logout', (req, res) => {
    res.clearCookie('session');
    res.status(200).send({ message: 'Bye!' });
  });
