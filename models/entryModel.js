// entryModel.js

// schema setup
var EntryObject = {
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
};

//export entry model
module.exports = EntryObject;



