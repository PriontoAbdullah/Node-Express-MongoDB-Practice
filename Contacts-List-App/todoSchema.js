const mongoose = require('mongoose');

const todoSchema = mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	description: String,
	status: {
		type: String,
		enum: [ 'active', 'inactive' ]
	},
	date: {
		type: Date,
		default: Date.now
	},
	user: {
		type: mongoose.Types.ObjectId,
		ref: 'User'
	}
});

// instance method
todoSchema.methods = {
	findActive: function(cb) {
		return mongoose.model('Todo').find({ status: 'inactive' }, cb);
	}
};

// static method
todoSchema.statics = {
	findByJS: function() {
		return this.find({ title: /hero/i });
	}
};

// query helpers
todoSchema.query = {
	byHero: function(language) {
		return this.find({ title: new RegExp(language, 'i') });
	}
};

module.exports = todoSchema;
