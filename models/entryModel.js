// entryModel.js
const Emotion = {"HAPPY":1, "SAD":2, "CONFUSED":3, "ANGRY":4, "EXCITED":5, "BORED":6, "SCARED":7, "NONE":8}; // enum ish
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
		default: Date.now,
		required: true
	},
	title: String,
	content: String,
	emotion: {
		type: Emotion,
		default: Emotion.NONE
	}
});

// why does it only work when i do this ?? **
userConn = 'entryDB';
makeUserConn = mongoose.createConnection(`mongodb://localhost/${userConn}`, { useNewUrlParser: true });
var Entry = module.exports = makeUserConn.model('entry', EntrySchema);



