const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({
	name: {
		firstName: {type: String, required: true},
		lastName: {type: String, required: true}
	},
	email: {
		type: String,
		required: true
	},
	username: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	phoneNumber: {
		type: String,
		required: true
	},
	isActive: {
		type: Boolean,
		required: true,
		default: true
	}
});

adminSchema.virtual('fullName').get(function(){
	return `${this.name.firstName} ${this.name.lastName}`;
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = {Admin};