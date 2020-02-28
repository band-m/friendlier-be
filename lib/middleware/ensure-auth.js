const passport = require('passport');
module.exports = async(req, res, next) => {
  passport.authenticate('jwt', { session: false }, async(err, user, info) => {
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
        // setSessionCookie(res, getAuthToken(user));
        res.send(user);
      });
    }
    catch(error) {
      return next(error);
    }
  })(req, res, next);
};
