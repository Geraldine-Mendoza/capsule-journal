// initializes express router
let router = require('express').Router();
const passport = require('passport')
	authenticate = require('./auth');
require('../config/passport');

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

// finish after auth all good
// Entry routes
router.route('/entries/:user') // user removed later since using auth
	.get(entryController.index)
	.post(entryController.new);

//display specific entry
router.route('/entries/:entry_id')
	.get(entryController.view)
	.patch(entryController.update)
	.put(entryController.update)
	.delete(entryController.delete);

//export API routes
module.exports = router;
