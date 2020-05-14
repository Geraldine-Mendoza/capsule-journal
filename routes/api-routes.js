// initializes express router
let router = require('express').Router();
const passport = require('passport')
	authenticate = require('./auth');
require('../config/passport');
// fixme: remove this, should all be in profileController
Profile = require('../models/profileModel');
const Entry = require('../models/entryModel');

// set default API response
router.get('/', (req, res) => {
	res.json({
		status: 'api is working',
		message: 'welcome to this page'
	});
});

//import controllers
var entryController = require('../controllers/entryController');
var profileController = require('../controllers/profileController');

// used only for testing
router.route('/deleteOneAccount/:id')
	.get(profileController.deleteOne);
router.route('/deleteAllAccounts')
	.get(profileController.deleteAll);

router.route('/seeAllAccounts')
	.get(profileController.index);

router.route('/login')
	.get((req, res) => {
		res.render("log-in.ejs");
	})
	.post(profileController.login);
		//(res, req) => {res.redirect('/users/me')}); // believe this should be handled by client

router.route('/signup')
	.get((req, res) => {
		res.render("signup.ejs");
	})
	.post(profileController.new);

router.route('/users/me')
	.get(authenticate, 
		profileController.getEntryInfo, 
		(req, res) => { res.render("user-home.ejs", { firstName: req.firstName, entries: req.entries }) });

// FIXME: THESE ROUTES ARE TEMP ONLY FOR TESTING
// Entry routes
router.route('/entries/:user') // :user removed later since using auth, and info passed through headers
	.get((req, res) => { // temp get first user in collection
		res.render('user-home.ejs', 
		{ firstName: "Joseph", 
			entries: [{
				title: 'My first day at work',
				content:
				'it was very fun, I might change my name to Josephine Mendoza.',
				emotion: 'happy' 
			},
		  	{ 
				title: 'My second day at work',
				content:
				'In the eyes of the Soviet government led by moi, Sundays represent a genuine threat to the whirr and hum of industrial progress. For one day in seven, after all, machines sit silent, productivity slumps to zero and people retreat to comforts thought to be contrary to the revolytionary ideal, like FAMILY LIFE or RELIGIOUS PRACTICE.',
				emotion: 'sad' 
			}]
		});
		/*Profile.findOne({}, (err, user) => {
			console.log(user.entries);
			res.render('user-home.ejs', { firstName: user.profile.firstName, entries: user.entries })
		});*/
	});

// should know user from session here
router.route('/entries/new')
	.post((req, res) => {
		Profile.findOne({}, (err, user) => {
			const entry = {
				date: Date.now(),
				title: req.body.title,
				content: req.body.content,
				emotion: req.body.emotion
			}
			user.entries.push(entry);
			user.save((err) => {
				if(err) console.log(`there was an error ${err} in saving new entry`)
				console.log(`user is now ${user}`);
				res.send("made new entry");
			});
		})
	});

//display specific entry
router.route('/entries/:entry_id')
	.get(entryController.view)
	.patch(entryController.update)
	.put(entryController.update)
	.delete(entryController.delete);

//export API routes
module.exports = router;
