// auth.js

//const jwt = require('express-jwt');
const jwt = require('jsonwebtoken');

/*const auth = {
	required: jwt({
		secret: 'secret',
		payload: 'payload',
		getToken: getTokenFromHeaders,
	}),
	optional: jwt({
	    secret: 'secret',
	    userProperty: 'payload',
	    getToken: getTokenFromHeaders,
	    credentialsRequired: false,
  	}),
};*/

checkAuthenticated = (req, res, next) => {
	console.log('in checkAuth');
	if(req.isAuthenticated()) return next()
	res.redirect('/login')
}

checkNotAuthenticated = (req, res, next) => {
	if(req.isAuthenticated) return res.redirect('/users/me');
	next()
}

module.exports = checkAuthenticated;
