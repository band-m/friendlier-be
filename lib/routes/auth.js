const { Router } = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const ensureAuth = require('../middleware/ensure-auth');

const MAX_AGE_IN_MS = 24 * 60 * 60 * 1000; // 1 day: we can change this

const setSessionCookie = (res, token) => {
  res.cookie('session', token, {
    maxAge: MAX_AGE_IN_MS,
  });  
};

const getAuthToken = (user) => {
  const token = jwt.sign(user.toJSON(), process.env.APP_SECRET, {
    expiresIn: '24h'
  });
  return token;
};

module.exports = Router()
  .post('/signup', passport.authenticate('signup', { session: false }), async(req, res, next) => {
    try {
      req.user.displayName = req.body.displayName;
      await req.user.save();
      setSessionCookie(res, getAuthToken(req.user));
      res.send(req.user);
    }
    catch(error) {
      return next(error);
    }
  })
  .post('/login', async(req, res, next) => {
    passport.authenticate('local', { session: false, failureFlash: true }, async(err, user, info) => {
      try {
        if(info && info.status != 200) {
          return next(info);
        }
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
    delete req.user.iat;
    delete req.user.exp;
    res.send(req.user);
  })
  .get('/logout', (req, res) => {
    res.clearCookie('session');
    res.status(200).send({ message: 'Bye!' });
  });
