// profileController
if(process.env.NODE_ENV !== 'production') { require('dotenv').config() } // set up env

const mongoose = require('mongoose'),
	flash = require('express-flash');

Profile = require('../models/profileModel');

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

	// errors if not there -- 
	// client should deal w this
	if(!user.email) {
		return res.json({
			errors: { email: 'is required', }
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
	profile.email = user.email;
	profile.name = {
		firstName : user.firstName,
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

/*
exports.login = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	console.log(email);
	if(!email) {
		return res.json({
			errors: { email: 'is required' }
		});
	};
	if(!password) {
		return res.json({
      		errors: { password: 'is required' }	
    	});
	};
	
	console.log('about to auth passport, login controller');
	console.log(req.body);
	// on success, authenticate will redirect to user's profile
	passport.authenticate('local', 
	{
		successRedirect: '/users/me',
		failureRedirect: '/login',
		failureFlash: true 
	});
	
};*/

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

