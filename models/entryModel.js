// entryModel.js

// schema setup
var EntryObject = {
	date: {
		type: Date,
		default: Date.now,
	},
	title: String,
	content: String,
	emotion: String,
};

//export entry model
module.exports = EntryObject;



