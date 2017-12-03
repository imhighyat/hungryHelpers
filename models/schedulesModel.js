const mongoose = require('mongoose');

const scheduleSchema = mongoose.Schema({
	schedType: {
		type: String,
		required: true
	},
	starting: {
		required: true,
		type: Date
	},
	ending: {
		required: true,
		type: Date
	},
	weekday: [{
		required: true,
		type: Number
	}],
	time: {
		hour: {required: true, type: Number},
		minutes: {required: true, type: Number}
	},
	restaurant:{ 
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'Restaurant'
	},
	restPerson: {
		type: String, 
		required: true
	},
	bookings: [{
		date: {type: Date},
		organization: {type: mongoose.Schema.Types.ObjectId, ref: 'Organization'},
		orgPerson: {
			type: String
		}
	}]
});

scheduleSchema.virtual('hourMin').get(function(){
	return `${this.time.hour}:${this.time.minutes}`;
});

const Schedule = mongoose.model('schedule', scheduleSchema);

module.exports = {Schedule};