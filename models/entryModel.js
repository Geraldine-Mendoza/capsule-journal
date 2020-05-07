// entryModel.js

var mongoose = require('mongoose');

// schema setup
var entrySchema = new mongoose.Schema({
	date: {
		type: Date,
		default: Date.now,
	},
	title: String,
	content: String,
	emotion: String,
});

//export entry model
var Entry = module.exports = mongoose.model('entry', entrySchema);
module.exports.get = (callback, limit) => {
	Entry.find(callback).limit(limit);
}



