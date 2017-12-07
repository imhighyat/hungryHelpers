const mongoose = require('mongoose');

const scheduleSchema = mongoose.Schema({
	schedType: {
		type: String,
		required: true
	},
	startingDate: {
		required: true,
		type: Date
	},
	endingDate: {
		required: true,
		type: Date
	},
	dayOfWeek: [{
		required: true,
		type: Number
	}],
	time: {
		hour: {required: true, type: Number},
		minutes: {required: true, type: Number}
	},
	restaurant:{ 
		type: mongoose.Schema.Types.ObjectId, //string with ID of rest
		ref: 'Restaurant',
		required: true
	},
	restPerson: {
		type: String, 
		required: true
	},
	bookings: [{
		date: {type: Date},
		organization: {type: mongoose.Schema.Types.ObjectId, ref: 'Organization'},
		orgPerson: {type: String}
	}]
});

scheduleSchema.virtual('hourMin').get(function(){
	return `${this.time.hour}:${this.time.minutes}`;
});

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = {Schedule};