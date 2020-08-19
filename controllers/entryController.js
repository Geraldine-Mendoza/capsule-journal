// entryController
// - is it bad practice to have render here? (makes less general)

const Emotion = {"HAPPY":'happy', "SAD":'sad', "CONFUSED":'confused', "ANGRY":'angry', "EXCITED":'excited', "BORED":'bored', "SCARED":'scared', "NONE":'none'}; // enum ish
const Entry = require('../models/entryModel');
const evalEmotion = require('../emotion_analysis/eval');

exports.checkUserIdForEntry = (req, res, next) => {
	console.log('checking that user with user_id ' + req.user._id + 'has access to entry with _id ' + req.params.entry_id);
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
			res.render("user-home.ejs", {firstName: req.user.name.firstName, entries: entries, em_obj: Emotion});
	})
}

// create new entry
exports.new = (req, res) => {
	Entry.create({
		user_id: req.user._id, //TODO: SWITCH BACK TO USING THIS! ... can't do req.user_id!!
		date: Date.now(),
		title: "",
		content: "",
		emotion: Emotion.NONE
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
		res.render('entry-edit.ejs', {entry: entry, entry_id: req.params.entry_id});
	});
};

// update entry info (delete if all empty)
exports.update = async (req, res, next) => {
	if(req.body.entryTitle == '' && req.body.entryContent == '') {
		Entry.deleteOne({_id: req.params.entry_id},
			(err, entry) => {
			if(err) res.send(err);
			console.log({
				status: "success",
				message: 'entry deleted'
			});
			next();
		});
	}
	else {
		console.log('updating entry with entry id of ' + req.params.entry_id)
		const em = await evalEmotion(req.body.entryContent) // returns promise
		Entry.updateOne({_id: req.params.entry_id}, 
			{$set:
				{title: req.body.entryTitle,
				content: req.body.entryContent,
				emotion: em}
			})
		.then(() => {
				console.log(`succesfully updated entry, which now has emotion ${em}`) 
				next();
			}
		)
		.catch(err => res.send(err));
	}
};

// delete entry
exports.delete = (req, res) => {
	Entry.deleteOne({
		_id: req.params.entry_id
	}, (err, entry) => {
		if(err) res.send(err);
		console.log({
			status: "success",
			message: 'entry deleted'
		});
		next();
	});
};








