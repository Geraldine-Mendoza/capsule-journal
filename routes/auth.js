// auth.js

exports.checkAuthenticated = (req, res, next) => {
	console.log('in checkAuth');
	if(req.isAuthenticated()) return next()
	res.redirect('/login')
}

exports.checkNotAuthenticated = (req, res, next) => {
	if(req.isAuthenticated()) return res.redirect('/users/me');
	next() // otherwise continue
}
