module.exports = function() {
	const mongoose = require('mongoose');

	var userSchema = mongoose.Schema({
		username: { type: String, required: '{PATH} is required!', unique: true },
		salt: { type: String, required: '{PATH} is required!' },
		hashedPassword: { type: String, required: '{PATH} is required!' },
		roles: [String]
	});

	var User = mongoose.model('User', userSchema);
};