const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('../models/User');

passport.use('signup', new localStrategy({
  usernameField : 'email',
  passwordField : 'password'
}, async (email, password, done) => {
  try {
    //Save the information provided by the user to the the database
    const user = await User.create({ email, password });
    //Send the user information to the next middleware
    return done(null, user);
  } catch (error) {
    done(error);
  }
}));