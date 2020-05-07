// entryController

Entry = require('../models/entryModel');

// handle what is returned from index
exports.index = (req, res) => {
	Entry.find({}, (err, entries) => {
		if(err) {
			res.json({
				status:"error",
				message: err,
			});
		}
		res.json({
			status: "success",
			message: "Entries retrieved successfully",
			data: entries
		});
	});
};

// create new entry
exports.new = (req, res) => {
	var entry = new Entry();
	entry.date = req.body.date;
	entry.title = req.body.title;
	entry.content = req.body.content;
	entry.emotion = req.body.emotion;
	console.log(`content is ${entry.content}\n`);
	//save entry & check if errors
	entry.save((err) => {
		if(err) res.json(err);
		res.json({
			message: "new entry created",
			data: entry
		});
	});
};

// view entry info
exports.view = (req, res) => {
	Entry.findById(req.params.entry_id, (err, entry) => {
		if(err) res.send(err);
		console.log(`content is ${entry.content}\n`);
		res.json({
			message: 'Loading entry...',
			data: entry
		});
	});
};

// update entry info
exports.update = (req, res) => {
	Entry.findById(req.params.entry_id, (err, entry) => {
		if(err) res.send(err);
		res.json({
			message: 'Entry updated!',
			data: entry
		});
	});
};

// delete entry
exports.delete = (req, res) => {
	Entry.deleteOne({
		_id: req.params.entry_id
	}, (err, entry) => {
		if(err) res.send(err);
		res.json({
			status: "success",
			message: 'entry deleted'
		});
	});
};








