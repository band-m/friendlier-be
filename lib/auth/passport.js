// From https://www.digitalocean.com/community/tutorials/api-authentication-with-json-web-tokensjwt-and-passport

const passport = require('passport');
const { Strategy: localStrategy } = require('passport-local');
const { Strategy: JWTstrategy } = require('passport-jwt');
const User = require('../models/User');

//Create a passport middleware to handle user registration
passport.use('signup', new localStrategy({
  usernameField : 'email',
  passwordField : 'password'
}, async(email, password, done) => {
  try {
    const user = await User.create({ email, password });
    return done(null, user);
  } catch(error) {
    if(error.message.startsWith('E11000')) {
      done({
        status: 400,
        message: 'A user with that email address already exists.'
      });
    }
    else {
      done(error);
    }
  }
}));

//Create a passport middleware to handle local User login
passport.use('local', new localStrategy({
  usernameField : 'email',
  passwordField : 'password'
}, async(email, password, done) => {
  try {
    const user = await User.findOne({ email });
    if(!user){
      return done(null, false, { status: 401, message : 'Invalid email or password.' });
    }
    const validate = await user.isValidPassword(password);
    if(!validate){
      return done(null, false, { status: 401, message : 'Invalid email or password.' });
    }
    return done(null, user, { status: 200, message : 'Logged in Successfully.' });
  } catch(error) {
    return done(error);
  }
}));

//This verifies that the token sent by the user is valid
passport.use(new JWTstrategy({
  secretOrKey : process.env.APP_SECRET,
  jwtFromRequest : (req) => {
    return req.cookies.session;
  },
}, 
async(token, done) => {
  try {
    return done(null, token);
  } catch(error) {
    done(error);
  }
}));
