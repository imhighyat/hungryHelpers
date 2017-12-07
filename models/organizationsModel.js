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
		firstName: {type: String, required: true},
		lastName: {type: String, required: true}
	},
	address: {
		street: {type: String, required: true},
		city: {type: String, required: true},
		state: {type: String, required: true},
		zipcode: {type: String, required: true}
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
		type: Boolean,
		required: true,
		default: false
	},
	memberSince: {
		type: Date,
		required: true,
		default: Date.now
	},
	isActive: {
		type: Boolean,
		required: true,
		default: true
	}	
});

organizationSchema.virtual('personInCharge').get(function(){
	return `${this.manager.firstName} ${this.manager.lastName}`;
});

organizationSchema.virtual('fullAddress').get(function(){
	return `${this.address.building}, ${this.address.street}, ${this.address.city}, ${this.address.state} ${this.address.zipcode}`;
});

const Organization = mongoose.model('Organization', organizationSchema);

module.exports = {Organization};