const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//use ES6 promises
mongoose.Promise = global.Promise;

const {Schedule} = require('../models/schedulesModel');

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
		.then(data => res.status(200).json(data))
		.catch(err => res.status(500).send('Internal server error occured.'));
});


module.exports = router;

