// config 

const mongoose = require('mongoose')
	passport = require('passport')
	LocalStrategy = require('passport-local').Strategy;

Profiles = require('../models/profileModel');

passport.use(new LocalStrategy((username, password, done) => {
  console.log(`username we got was ${username}`);
  console.log(`password we got was ${password}`);
  Profiles.findOne({ username: username })
    .then((user) => { // user refers to the one profile object
      console.log(`the user is ${user}`);
      if(!user || !user.validatePassword(password)) {
        return done(null, false, { errors: { 'username or password': 'is invalid' } });
      }

      return done(null, user);
    }).catch(done); // what to do if user not found ....
}));

