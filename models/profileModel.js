// profileModel.js

var mongoose = require('mongoose')
	crypto = require('crypto')
	jwt = require('jsonwebtoken');

var profileSchema = new mongoose.Schema({
	// account
	email: {
		type: String,
		required: true,
		unique: true
	},
	//auth
	hash: String,
	salt: String,
	profile: {
		// name
		name: {
			firstName: {
				type: String,
				required: true,
			},
			middleName: String,
			lastName: String,
			nickName: String
		}
	},
});

// ** arrow function this property points always to what defined it **
// so `this` refers to profileSchema instance

// set password (string) to account
profileSchema.methods.setPassword = function(password) {
	this.salt = crypto.randomBytes(16).toString('hex');
	this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

// check if hash for given password matches profileSchema hash
profileSchema.methods.validatePassword = function(password) {
	const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  	return this.hash === hash;
};

var Profile = module.exports = mongoose.model('profile', profileSchema);