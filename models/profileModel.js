// profileModel.js

var mongoose = require('mongoose')
	crypto = require('crypto')
	jwt = require('jsonwebtoken');


var profileSchema = new mongoose.Schema({
	// account
	username: String,
	//auth
	hash: String,
	salt: String,
	profile: {
		// name
		firstName: {
			type: String,
			required: true,
		},
		middleName: String,
		lastName: String,
		nickName: String,
	}
});

// ** arrow function does not itself have this property **

// set password to account
profileSchema.methods.setPassword = function(password) {
	this.salt = crypto.randomBytes(16).toString('hex');
	console.log(`set salt to ${this.salt}`);
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

// check valid password
profileSchema.methods.validatePassword = function(password) {
	console.log(`salt is ${this.salt}`);
	const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash;
};

profileSchema.methods.generateJWT = function() {
	const today = new Date();
	const expirationDate = new Date(today);
	expirationDate.setDate(today.getDate() + 60);

	// should profile info be in the token ?
	// or just username ?
	return jwt.sign({
		username: this.username,
		_id: this._id,
		exp: parseInt(expirationDate.getTime()/1000, 10)
	}, 'secret');

}

// this is not working...
// "generateJWT is not a function"
profileSchema.methods.toAuthJSON = function() {
	return {
		_id: this._id,
		username: this.username,
		token: this.generateJWT(),
	}
};



var Profile = module.exports = mongoose.model('profile', profileSchema);
/*module.exports.get = (callback, limit) => {
	Profile.find(callback).limit(limit);
}*/