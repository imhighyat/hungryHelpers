const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

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
	//if query is undefined, get all the admins
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
			let today = new Date();
			let finalDate = today.getDate() + 6;
			//take the bookings data and assign it to a var for comparison later
			const bookings = data.bookings;
			//create object to put booking dates available in the next 7 weeks
			const availBookDates = {};
			//for loop to get a weeks dates starting from today
			//will check the days preferred compared to the coming days
			for(let i = 0; i < 7; i++){
    			if(data.dayOfWeek.indexOf(today.getDay() + i) > -1){
      				availBookDates[`${today.getFullYear()}${today.getMonth() + 1}${today.getDate() + i}`] = true;
    			}
  			}
  			//for loop to go through the availBookDates and check if there are dates that are past the starting date
  			let bookDatesKeys = Object.keys(availBookDates);
  			for(let i = 0; i < bookDatesKeys.length; i++){
    			start = new Date(data.startingDate);
    			if(parseInt(bookDatesKeys[i]) < parseInt(`${start.getFullYear()}${start.getMonth() + 1}${start.getDate()}`)){
      				availBookDates[bookDatesKeys[i]] = false; 
    			}
  			}
  			//for loop to go through the availBookDates and check if there are dates that are after the end date
  			for(let i = 0; i < bookDatesKeys.length; i++){
    			end = new Date(data.endingDate);
    			console.log(Date.parse(bookDatesKeys[i]));
    			if(parseInt(bookDatesKeys[i]) > parseInt(`${end.getFullYear()}${end.getMonth()+1}${end.getDate()}`)) {
      				availBookDates[bookDatesKeys[i]] = false; 
    			}
  			}
  			console.log(availBookDates);
  			//for loop to check if date has been taken
  			for(var i = 0; i < bookings.length; i++){
  				let bookingDate = new Date(bookings[i].date);
    			if(parseInt(bookDatesKeys[i]) === parseInt(`${bookingDate.getFullYear()}${bookingDate.getMonth() + 1}${bookingDate.getDate()}`)){
      				availBookDates[bookDatesKeys[i]] = false; 
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

