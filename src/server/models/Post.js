module.exports = function() {
	const mongoose = require('mongoose');

	let postSchema = mongoose.Schema({
		title: { type: String, required: '{PATH} is required!' },
		content: { type: String },
        photos: [String],
        date: { type: Date, default: Date.now },
        publish: { type: Boolean, default: false }
	});

	mongoose.model('Post', postSchema);
};