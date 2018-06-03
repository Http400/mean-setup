const mongoose = require('mongoose');

module.exports = function (config) {
	mongoose.connect(config.db);
	const db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error...'));
	db.once('open', function() {
		console.log('db opened');
	});
	require('./../models/Post')();
	require('./../models/User')();
};