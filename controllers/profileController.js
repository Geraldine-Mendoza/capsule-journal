// profileController
if(process.env.NODE_ENV !== 'production') { require('dotenv').config() } // set up env

const express = require('express'),
	app = express(),
	mongoose = require('mongoose'),
	flash = require('express-flash'),
	passport = require('passport');

Profile = require('../models/profileModel');

app.use(express.urlencoded({ extended: false }))
//auth
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false, // no resaving session vars if nothing changed
  saveUninitialized: false // no empty value on init
}))
app.use(passport.initialize())
app.use(passport.session()) // req.user always set to user that's authenticated at that moment

// passport initilization
const initializePassport = require('../config/passport');
initializePassport(passport);

// list all profiles
exports.index = (req, res) => {
	Profile.find({}, (err, profiles) => {
		if(err) {
			res.json({
				status:"error",
				message: err,
			});
		}
		res.json({
			status: "success",
			message: "Profiles retrieved successfully",
			data: profiles
		});
	});
};

// create new user profile
exports.new = (req, res, next) => {
	const { body: body} = req;
	const user = body.user;
	console.log(user);

	// errors if not there -- 
	// client should deal w this
	if(!user.username) {
		return res.json({
			errors: { username: 'is required', }
    	});
	};
	if(!user.password) {
		return res.json({
      errors: { password: 'is required' }
    });
	}
	if(!user.firstName) {
		return res.json({
      		errors: { firstName: 'is required' }
    	});
	}

	// create new profile object
	var profile = new Profile();
	profile.username = user.username;
	profile.profile = {
		firstName: user.firstName,
		middleName: user.middleName,
		lastName: user.lastName,
		nickName: user.nickName,
	};
	profile.setPassword(user.password);

	profile.save((err) => {
		if(err) return next(err);
		return res.json({
			message: "new user profile created",
		});
	});
};

exports.login = (req, res, next) => {
	const username = req.body.username;
	const password = req.body.password;
	console.log(username);
	if(!username) {
		return res.json({
			errors: { username: 'is required' }
		});
	};
	if(!password) {
		return res.json({
      		errors: { password: 'is required' }	
    	});
	};
	/*
	Profile.findOne({username: user.username}, (err, TrueUser) => {
		if(!TrueUser.validatePassword(user.password)) res.status(401).send({auth: false, token: null});

		const token = TrueUser.generateJWT();
		// req for later routes
		//req.headers['auth-access-token']= token;
		res.locals.authtoken = token;
		console.log(res.locals.authtoken);
		// set token in client side using ------- API
		console.log({auth: true, token: token});
		next();
	})*/
	
	console.log('about to auth passport, login controller');
	console.log(req.body);
	// on success, authenticate will redirect to user's profile
	passport.authenticate('local', (
	{
		successRedirect: '/users/me',
		failureRedirect: '/login',
		failureFlash: true 
	}));
};

exports.getEntryInfo = (req, res, next) => {
	Profile.findOne({firstName: req.user.firstName}, (err, user) => {
		if(err) res.status(500).send("Could not access home page")
		req.entries = user.entries;
		req.firstName = user.profile.firstName;
		next();
	})
}

// just used for testing
exports.deleteOne = (req, res) => {
	Profile.deleteOne({_id: req.params.id}, (err) => {
		if(err) res.send(`oops there was error deleting account with id ${req.params.id}`);
		res.send(`successfully deleted account with id ${req.params.id}`);
	})
}

exports.deleteAll = (req, res) => {
	Profile.remove({}, (err) => {
		if(err) res.send(`oops there was error deleting all accounts`);
		res.send(`successfully deleted all accounts`);
	})
}

