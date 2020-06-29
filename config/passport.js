// config passport 

const mongoose = require('mongoose');
const passport = require('passport');
	LocalStrategy = require('passport-local').Strategy;

Profiles = require('../models/profileModel');

getUserById = (id) => {
  Profiles.findOne({ _id: id })
  .then(user => {return user});
}

function initialize(passport) {
  console.log('initalized')
  const authenticateUser = (username, password, done) => {
    console.log(`username we got was ${username}`);
    console.log(`password we got was ${password}`);
    Profiles.findOne({ username: username }, (err, user) => {
        console.log(`the user is ${user}`);
        if(err) { return done(err); }
        if(!user || !user.validatePassword(password)) {
          return done(null, false, { message: "Username or password is invalid"});
        }
        else { return done(null, user); }
      })
  }

  passport.use(new LocalStrategy({usernameField: 'username', passwordField:'password'}, authenticateUser));
  passport.serializeUser((user, done) => done(null, user._id));
  passport.deserializeUser((id, done) => { 
    Profiles.findById(id, (err, user) => { done(err, user); })
  });

}module.exports = initialize;

