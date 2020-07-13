// entryController
// - is it bad practice to have render here? (makes less general)


const Entry = require('../models/entryModel');

exports.checkUserIdForEntry = (req, res, next) => {
	console.log('checking that user with user_id ' + req.user._id + 'has access to entry with _id' + req.params.entry_id);
	Entry.findById(req.params.entry_id, (err, entry) => {
		console.log('foudn one!');
		if(err) res.redirect('/users/me') // ok ? **
		else if(entry.user_id == req.user._id) {
			console.log('that user has access to entry ' + entry._id);
			next();
		} else {
			res.redirect('/users/me');
		}
	});
}

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
			message: "LIST OF ALL ENTRIES",
			data: entries
		})
	});
};

exports.userEntries = (req, res) => {
	Entry.find({user_id: req.user._id}, 
		(err, entries) => {
			if(err) res.json({
				status:"error",
				message: err
			});
			res.render("user-home.ejs", {firstName: req.user.name.firstName, entries: entries});
	})
}

// create new entry
exports.new = (req, res) => {
	Entry.create({
		user_id: req.user._id, //TODO: SWITCH BACK TO USING THIS! ... can't do req.user_id!!
		date: Date.now(),
		title: "",
		content: "",
	}, (err, entry) => {
		console.log(entry);
		if(err) res.json(err);
		res.redirect(`/users/me/${entry._id}`)
	})
};

// view entry info
exports.view = (req, res) => {
	console.log('looking for entry with _id of ' + req.params.entry_id);
	Entry.findById(req.params.entry_id, (err, entry) => {
		if(err) res.send(err);
		res.render('entry-edit.ejs', {entry: entry});
	});
};

// update entry info
exports.update = (req, res, next) => {
	Entry.updateOne({_id: req.params.entry_id}, 
		{
			title: req.body.title,
			content: req.body.emotion // add emotion eventually here
		}, next())
};

// delete entry
exports.delete = (req, res) => {
	/*Entry.deleteOne({
		_id: req.params.entry_id
	}, (err, entry) => {
		if(err) res.send(err);
		res.json({
			status: "success",
			message: 'entry deleted'
		});
	});*/
};








