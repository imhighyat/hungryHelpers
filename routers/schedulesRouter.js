const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const moment = require('moment');

//use ES6 promises
mongoose.Promise = global.Promise;

const {Schedule} = require('../models/schedulesModel');
const internalMsg = 'Internal server error occured.';

//view multiple schedules whether there is query or not
router.get('/', (req,res)=>{
	const today = new Date();
	let finalDate = new Date();
	finalDate.setDate(today.getDate() + 6);
	//store the values of the query
	const active = req.query.active;
	let schedulePromise;
	//if query is undefined, get all the schedules
	if(typeof(active) === "undefined"){
		schedulePromise = Schedule.find().populate('restaurant');
	}
	//if the query has a value
	else if(typeof(active) === "string"){
		//if value is true, show schedules that are active
		if(active === "true"){
			schedulePromise = Schedule.find({endingDate: {$gte: today}, startingDate: {$lte: finalDate}}).populate('restaurant');
		}
		//else show the past schedules
		else if(active === "false") {
			schedulePromise = Schedule.find({endingDate: {$lt: today}}).populate('restaurant');
		}
		//everything else
		else {
		const message = 'Query value unexpected.';
		return res.status(400).send(message);
		}
	}
	else{
		const message = 'Query value unexpected.';
		return res.status(400).send(message);
	}
	schedulePromise
	.then(data => res.status(200).json(data))
	.catch(err => res.status(500).send(err));
});

//get the schedule of a specific restaurant
router.get('/:id', (req,res)=>{
	Schedule.findById(req.params.id).populate('restaurant')
		.then(data => {
			let today = moment();
			let finalDate = today.clone().add(6,'day');
			const bookings = data.bookings;
			const availBookDates = {};
			//loop through the days starting today + 6 days
			//if the day matches the preferred dayOfWeek then add the date
			//assign a value of true
			for(let i = 0; i < 7; i++){
				let currentDay = today.clone().add(i,'day').day();
				if(data.dayOfWeek.indexOf(currentDay) > -1){
					availBookDates[today.clone().add(i, 'day').format('YYYYMMDD')] = true;
				}
			}
			//loop through the dates
			//assign false to a date key that is before the start date
			for(let bookDateKey in availBookDates){
				start = moment(data.startingDate);
				if (start.diff(moment(bookDateKey), 'days') > 0){
					availBookDates[bookDateKey] = false;
				}
			}
			//loop through the dates
			//assign false to a date key that is after the end date
			for(let bookDateKey in availBookDates){
				end = moment(data.endingDate);
				if (end.diff(moment(bookDateKey), 'days') < 0){
					availBookDates[bookDateKey] = false;
				}
			}
			//loop through the bookings array of the rest sched
			//assign false to a date key that exist in the array
			//it means that the date has been booked and is unavailable
			for(var i = 0; i < bookings.length; i++){
				bookingDate = moment(bookings[i].date);
				if(availBookDates[bookingDate.format('YYYYMMDD')]){
					availBookDates[bookingDate.format('YYYYMMDD')] = false;
				}
			}
			res.status(200).json({data, availBookDates});
		})
		.catch(err => {
			console.log(err);
			res.status(500).send(internalMsg);
		});
});

//book an available date from a restaurant schedule
router.put('/:schedId', (req, res) => {
	const dateToBook = {};
	//store the required properties in an array
	const requiredFields = ['date', 'organization', 'orgPerson'];
	//use for loop to check if all required properties are in the req body
	for(let i=0; i<requiredFields.length; i++){
		const field = requiredFields[i];
		if(!(field in req.body)){
			const message = `Missing ${field} in request body.`;
			//console error the message if at least one is missing
			console.error(message);
			//return with a 400 staus and the error message
			return res.status(400).send(message);
		}
	}
	//loop through the properties that are required
	//check if client sent in data for those
	for(let i=0; i<requiredFields.length;i++){
		const field = requiredFields[i];
		//if the property is in the req body and it is not null
		if(field in req.body && req.body.field !== null){
			//start adding the properties to the dateToBook object
			dateToBook[field] = req.body[field];
		}
	}
	//update the database by finding the id first using the id from req
	//then push the object to the bookings array
	Schedule.findByIdAndUpdate(req.params.schedId, {$push: {bookings: dateToBook}})
	.then(data => res.status(200).send('Your booking has been scheduled!'))
	.catch(err => {
		console.log(err);
		res.status(400).send(internalMsg)
	});
});


module.exports = router;

