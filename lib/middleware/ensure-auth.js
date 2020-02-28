const passport = require('passport');
module.exports = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    try {
      if(info && info.status != 200) {
        return next(info);
      }
      if(err || !user) {
        const error = new Error('An Error occurred');
        return next(error);
      }
      return req.login(user, { session: false }, (error) => {
        if(error) {
          res.status(400).send({ error });
        }
        delete req.user.iat;
        delete req.user.exp;
        next();
      });
    }
    catch(error) {
      return next(error);
    }
  })(req, res, next);
};
