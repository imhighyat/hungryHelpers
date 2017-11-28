const mongoose = require('mongoose');

const restaurantSchema = mongoose.Schema({
	name: {
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
	}	
});

restaurantSchema.virtual('personInCharge').get(function(){
	return `${this.manager.firstName} ${this.manager.lastName}`;
});

restaurantSchema.virtual('fullAddress').get(function(){
	return `${this.address.building}, ${this.address.street}, ${this.address.city}, ${this.address.state} ${this.address.zipcode}`;
});

const Restaurant = mongoose.model('restaurant', restaurantSchema);

module.exports = {Restaurant};