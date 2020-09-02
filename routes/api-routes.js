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
const { render } = require('node-sass');

// used only for testing
router.route('/deleteOneAccount/:id')
	.get(profileController.deleteOne);
router.route('/deleteAllAccounts')
	.get(profileController.deleteAll);
router.route('/seeAllAccounts')
	.get(profileController.index);

// LOGIN
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

// SIGN UP
router.route('/signup')
	.get((req, res) => {
		res.render("signup.ejs");
	})
	.post(profileController.new);

// USER HOME
router.route('/users/me')
	.get(auth.checkAuthenticated,
		entryController.userEntries("user-home.ejs")); // you can also do user.name for some reason ?? **

// FIXME: remove
const Emotion = {"HAPPY":'happy', "SAD":'sad', "CONFUSED":'confused', "ANGRY":'angry', "EXCITED":'excited', "BORED":'bored', "SCARED":'scared', "NONE":'none'}; // enum ish

// GRAPHS AND INFO (PROGRESS)
router.route('/users/me/progress')
	.get(//auth.checkAuthenticated,
		//entryController.userEntries("progress.ejs")
		(req, res) => {
			res.render("progress.ejs", {firstName: "FirstName", 
				entries: [{
					"emotion": "happy",
					"_id": "5f0bc60e2bf85147e5e68ae8",
					"date": "2020-07-13T02:25:18.435Z",
					"user_id": "5f0bbb62a67c2b476f78d73f",
					"title": "this is a title",
					"content": "this is the content of the entry. yes it is. is it now. ok now. ok not then but NOW. not then, but maybe now?\r\n\r\nok NOW IT WILL WORK\r\n\r\nok so maybe not\r\n\r\nplease\r\n\r\nhello\r\n\r\nHELLO\r\n\r\nok sort of\r\n\r\nNOW\r\ntest\r\nturn off auth for a bit\r\nwell idk it kinda hard",
					"__v": 0
				},
				{
					"emotion": "happy",
					"_id": "5f1a1556b269f6a21bb3c277",
					"date": "2020-07-23T22:55:18.934Z",
					"user_id": "5f0bbb62a67c2b476f78d73f",
					"title": "ok now it's working yay!",
					"content": "Today I don't feel with much motivation to do chores. Today I'm cooking with my children, and that makes me happy because I'm sharing with my children a very good time. But I don't want to do anything else. And I'm contemplating a warm evening that I see from the window, where I see trees and birds whistling.",
					"__v": 0
				},
				{
					"emotion": "excited",
					"_id": "5f23679671e0dbdf1e994d17",
					"date": "2020-07-31T00:36:38.402Z",
					"user_id": "5f0bbb62a67c2b476f78d73f",
					"title": "another entry",
					"content": "execute order 66!",
					"__v": 0
				},
				{
					"emotion": "angry",
					"_id": "5f39d015797fe8213bbc0bca",
					"date": "2020-08-17T00:32:21.754Z",
					"user_id": "5f0bbb62a67c2b476f78d73f",
					"title": "hey...",
					"content": "im trying here to have other emotion",
					"__v": 0
				},
				{
					"emotion": "sad",
					"_id": "5f39d0de74f0652175810b38",
					"date": "2020-08-17T00:35:42.006Z",
					"user_id": "5f0bbb62a67c2b476f78d73f",
					"title": "hi...",
					"content": "i am sad. this is sad. im trying to tell you that this is sad. ok. bye.\r\n\r\nwe will see?",
					"__v": 0
				},
				{
					"emotion": "excited",
					"_id": "5f3ae0f999badd2e151cd82d",
					"user_id": "5f0bbb62a67c2b476f78d73f",
					"date": "2020-08-17T19:56:41.512Z",
					"title": "craziness unlimited",
					"content": "if you are watching this your days are numbered. ",
					"__v": 0
				}], 
				em_obj: Emotion});
		});


// ENTRY ROUTES
router.route('/users/me/new')
	.post(auth.checkAuthenticated,
		entryController.new) // create new entry and redirect to it

router.route('/users/me/:entry_id')
	.get(auth.checkAuthenticated, // make sure authenticated user is accessing
		entryController.checkUserIdForEntry, // make sure authenticated user can access this entry
		entryController.view) // ** maybe should pass entry through middleware... **
	//.post(); // add entry if it doesn't already exist... this doesn't match w current set up
	.post(auth.checkAuthenticated, 
		entryController.checkUserIdForEntry,
		entryController.update, 
		(req, res) => { res.redirect('/users/me')}); // update part of the source, but not the entirety

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
