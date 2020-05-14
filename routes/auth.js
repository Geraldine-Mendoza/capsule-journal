// auth.js

//const jwt = require('express-jwt');
const jwt = require('jsonwebtoken');

// gets payload
/*const getTokenFromHeaders = (req) => {
	// equiv to req.headers.authorization
	const { headers: { authorization }} = req;
	
	if(authorization && authorization.split(' ')[0] == 'Token') 
		return authorization.split(' ')[1];
	return null;
};*/

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

// checks if token is valid and decodes information
authenticate = (req, res, next) => {
	const token = req.headers['x-access-token'];
	if(!token) return res.status(401).send({auth: false, message:"No token provided"});
	jwt.verify(token, 'secret', (err, decoded) => {
		if(err) return res.status(500).send({auth: false, message: "Could not authenticate token"});
		console.log(`decoded info is ${decoded.username}`);
		// set req for other routes to use
		req.userId = decoded._id;
		next();
	});
}

module.exports = authenticate;
