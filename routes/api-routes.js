const express = require('express'),
	app = express(),
	flash = require('express-flash'),
	passport = require('passport'),
	router = require('express').Router(),
	authenticate = require('./auth');

// set default API response
router.get('/', (req, res) => {
	res.json({
		status: 'api is working',
		message: 'welcome to this page'
	});
});

//import controllers & auth
const entryController = require('../controllers/entryController');
const profileController = require('../controllers/profileController');
const auth = require('./auth');

// used only for testing
router.route('/deleteOneAccount/:id')
	.get(profileController.deleteOne);
router.route('/deleteAllAccounts')
	.get(profileController.deleteAll);
router.route('/seeAllAccounts')
	.get(profileController.index);

router.route('/login')
	.get(auth.checkNotAuthenticated,
		(req, res) => {
		res.render("log-in.ejs");
	})
	.post(passport.authenticate('local', 
	{
		successRedirect: '/users/me',
		failureRedirect: '/login',
		failureFlash: true 
	}));

router.route('/signup')
	.get((req, res) => {
		res.render("signup.ejs");
	})
	.post(profileController.new);

// user-home
router.route('/users/me')
	.get(auth.checkAuthenticated,
		entryController.userEntries); // you can also do user.name for some reason ?? **


// ENTRY ROUTES
router.route('/users/me/new')
	.post(auth.checkAuthenticated,
		entryController.new) // create new entry and redirect to it

router.route('/users/me/:entry_id/save')
.patch(auth.checkAuthenticated, 
	entryController.checkUserIdForEntry,
	entryController.update, 
	(req, res) => { res.redirect('/users/me')}) // update part of the source, but not the entirety

router.route('/users/me/:entry_id')
	.get(auth.checkAuthenticated, // make sure authenticated user is accessing
		entryController.checkUserIdForEntry, // make sure authenticated user can access this entry
		entryController.view) // ** maybe should pass entry through middleware... **
	//.post(); // add entry if it doesn't already exist... this doesn't match w current set up

router.route('/entries/')
	.get(entryController.index);

//display specific entry
router.route('/entries/:entry_id')
	.get(entryController.view)
	.patch(entryController.update)
	.put(entryController.update)
	.delete(entryController.delete);

//export API routes
module.exports = router;
