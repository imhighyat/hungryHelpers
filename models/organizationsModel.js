const mongoose = require('mongoose');

const organizationSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	causeDescription: {
		type: String,
		required: true
	},
	phoneNumber: {
		type: String,
		required: true
	},
	manager: {
		firstName: String,
		lastName: String
	},
	address: {
		building: String,
		street: String,
		city: String,
		state: String,
		zipcode: String
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
	verified: {
		type: Boolean
	},
	memberSince: {
		type: Date,
		required: true,
		default: Date.now
	}	
});

organizationSchema.virtual('personInCharge').get(function(){
	return `${this.manager.firstName} ${this.manager.lastName}`;
});

organizationSchema.virtual('fullAddress').get(function(){
	return `${this.address.building}, ${this.address.street}, ${this.address.city}, ${this.address.state} ${this.address.zipcode}`;
});

const Organization = mongoose.model('organization', organizationSchema);

module.exports = {Organization};