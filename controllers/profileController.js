// profileController

const mongoose = require('mongoose');
const passport = require('passport');
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
						token: profile.generateJWT()
					});
	});
};

exports.login = (req, res, next) => {
	const { body: user} = req;
	//const user = body.user;
	console.log(user);

	if(!user.username) {
		return res.json({
      errors: {
        username: 'is required',
      },
    });
	};
	if(!user.password) {
		return res.json({
      errors: {
        password: 'is required',
      },	
    });
	};

	passport.authenticate('local', {session: false}, (err, passportUser, info) => {
		if(err) return next(err);
		if(passportUser) {
			const user = passportUser;
			user.token = passportUser.generateJWT();
			res.json({
				message: "successfully logged in to account:",
				user: user.toAuthJSON()
			});
		}

		return info;
	})(req, res, next);
};



