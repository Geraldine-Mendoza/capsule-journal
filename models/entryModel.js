// entryModel.js
var mongoose = require('mongoose');
var conn2 = require("../main"); 
// schema setup
var EntrySchema = new mongoose.Schema({
	user_id: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		default: Date.now(),
		required: true
	},
	title: String,
	content: String,
	emotion: String,
});

// why does it only work when i do this ?? **
userConn = 'entryDB';
makeUserConn = mongoose.createConnection(`mongodb://localhost/${userConn}`, { useNewUrlParser: true });
var Entry = module.exports = makeUserConn.model('entry', EntrySchema);



