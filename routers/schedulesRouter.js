const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//use ES6 promises
mongoose.Promise = global.Promise;

const {Schedule} = require('../models/schedulesModel');

//view multiple schedules
router.get('/', (req,res)=>{
	const today = new Date();
	let finalDate = new Date();
	finalDate.setDate(today.getDate() + 6);
	//store the values of the query
	const active = req.query.active;
	let schedulePromise;
	//if query is undefined, get all the admins
	if(typeof(active) === "undefined"){
		schedulePromise = Schedule.find()
	}
	//if the query has a value
	else if(typeof(active) === "string"){
		//test if the value is what we expect
		if(active === "true"){
			schedulePromise = Schedule.find({ending: {$gt: today}, starting: {$lt: finalDate}});
		}
		else if(active === "false") {
			schedulePromise = Schedule.find({ending: {$lt: today}});
		}
	}
	else{
		const message = 'Query value unexpected.';
		return res.status(400).send(message);
	}
	schedulePromise
	.then(data => res.status(200).json(data))
	.catch(err => res.status(500).send('Internal server error occured.'));
});

//get the schedule of a specific restaurant
router.get('/:restaurant', (req,res)=>{
	Schedule.find({restaurant: req.params.restaurant})
		.then(data => res.status(200).json(data))
		.catch(err => res.status(500).send('Internal server error occured.'));
});


module.exports = router;

