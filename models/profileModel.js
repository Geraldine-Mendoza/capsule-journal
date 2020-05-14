// profileModel.js

var mongoose = require('mongoose')
	crypto = require('crypto')
	jwt = require('jsonwebtoken');
const Entry = require('./entryModel');

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
	},
	entries: [ Entry ],
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

// generateJWT returns a jwt token
profileSchema.methods.generateJWT = function() {
	const today = new Date();
	const expirationDate = new Date(today);
	expirationDate.setDate(today.getDate() + 60);

	// should profile info be in the token ?
	// or just username ?
	// payload includes username, id and exp... (only need id)
	// 		- payload stuff can be seen by anyone
	return jwt.sign({
		username: this.username,
		_id: this._id,
		exp: parseInt(expirationDate.getTime()/1000, 10)
	}, 'secret'); // TODO: secret should not be publicly visible, put in env variable

}

// returns object holding info
profileSchema.methods.toAuthJSON = function() {
	return {
		_id: this._id,
		username: this.username,
		token: this.generateJWT(),
	}
};

var Profile = module.exports = mongoose.model('profile', profileSchema);