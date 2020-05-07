// initializes express router
let router = require('express').Router();
const passport = require('passport')
	auth = require('./auth');
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

router.route('/seeAllAccounts')
	.get(profileController.index);

router.route('/login')
	.get((req, res) => {
		res.render("log-in.ejs");
	})
	.post(auth.optional, profileController.login);

router.route('/signup')
	.get((req, res) => {
		res.render("signup.ejs");
	})
	.post(auth.optional, profileController.new);

// finish after auth all good
// Entry routes
router.route('/entries')
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
