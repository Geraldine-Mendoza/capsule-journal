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
	const { body: user } = req;

	if(!user.username) {
		return res.json({
			errors: { username: 'is required' }
		});
	};
	if(!user.password) {
		return res.json({
      		errors: { password: 'is required' }	
    	});
	};

	Profile.findOne({username: user.username}, (err, TrueUser) => {
		if(!TrueUser.validatePassword(user.password)) res.status(401).send({auth: false, token: null});

		const token = TrueUser.generateJWT();
		console.log({auth: true, token: token});
		// req for later routes
		req.headers['x-access-token'] = token; 
		res.send({auth: true, token: token});
		//next()
	})
	

	// session set to false for easier testing **
	// on success, authenticate will redirect to user's profile
	/*passport.authenticate('local', {session: false}, (err, passportUser, info) => {
		// TODO
		// on error....
		if(err) {
			return res.status(500).json({error: "Unauthorized"})
		}
		// auth failed
		if(!passportUser) {
			console.log(`auth failed due to user ${passportUser}`); return res.redirect('/login'); }
		if(passportUser) {
			/*const user = passportUser;
			user.token = passportUser.generateJWT();
			res.json({
				message: "successfully logged in to account:",
				user: user.toAuthJSON() // print important info in res
			});
			res.redirect('/users/' + user.username);

			//jwt.verify()
		}
	})(req, res, next);*/
};

exports.getEntryInfo = (req, res, next) => {
	Profile.findOne({_id: req.userId}, (err, user) => {
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

