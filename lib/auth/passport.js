// From https://www.digitalocean.com/community/tutorials/api-authentication-with-json-web-tokensjwt-and-passport

const passport = require('passport');
const { Strategy: localStrategy } = require('passport-local');
const { Strategy: JWTstrategy } = require('passport-jwt');
const User = require('../models/User');



//Create a passport middleware to handle user registration
passport.use('signup', new localStrategy({
  usernameField : 'email',
  passwordField : 'password'
}, async(email, password, next) => {
  try {
    const user = await User.create({ email, password });
    return next(null, user);
  } catch(error) {
    next(error);
  }
}));

//Create a passport middleware to handle local User login
passport.use('local', new localStrategy({
  usernameField : 'email',
  passwordField : 'password'
}, async(email, password, next) => {
  try {
    const user = await User.findOne({ email });
    if(!user){
      return next(null, false, { message : 'Incorrect email or password' });
    }
    const validate = await user.isValidPassword(password);
    if(!validate){
      return next(null, false, { message : 'Incorrect email or password' });
    }
    return next(null, user, { message : 'Logged in Successfully' });
  } catch(error) {
    return next(error);
  }
}));

//This verifies that the token sent by the user is valid
passport.use(new JWTstrategy({
  secretOrKey : process.env.APP_SECRET,
  jwtFromRequest : (req) => req.cookies.jwt,
}, 
async(token, next) => {
  try {
    return next(null, token.user);
  } catch(error) {
    next(error);
  }
}));
