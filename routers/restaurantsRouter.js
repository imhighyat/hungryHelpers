const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//use ES6 promises
mongoose.Promise = global.Promise;

const {Restaurant} = require('../models/restaurantsModel');
const {Schedule} = require('../models/schedulesModel');
const internalMsg = 'Internal server error occured.';

//view multiple restaurant profiles whether with queries or none
router.get('/', (req,res)=>{
	//store the values of the queries
	const active = req.query.active;
	const verified = req.query.verified;
	let restaurantPromise;
	//if both queries are undefined, get all the restaurants
	if(typeof(active) === "undefined" && typeof(verified) === "undefined"){
		restaurantPromise = Restaurant.find();
	}
	//if we have values for BOTH queries and they are strings
	else if(typeof(active) === "string" && typeof(verified) === "string"){
		//check to see if it's our expected values for both query
		if((active === "true" || active === "false") && (verified === "true" || verified === "false")){
			restaurantPromise = Restaurant.find({isActive: active, verified: verified});
		}
		else{
			const message = `Query values ${active} and/or ${verified} are not expected.`;
			return res.status(400).send(message);
		}
	}
	//if only one of the queries have values
	else if(typeof(active) === "string" || typeof(verified) === "string"){
		//test if active is the one with value and the values are what we expect
		if(typeof(active) === "string" && (active === "true" || active === "false")){
			restaurantPromise = Restaurant.find({isActive: active});
		}
		//then check verified for the same condition
		else if(typeof(verified) === "string" && (verified === "true" || verified === "false")){
			restaurantPromise = Restaurant.find({verified: verified});
		}
		else{
			const message = 'Query value unexpected.';
			return res.status(400).send(message);
		}
	}
	//proceed with the query to the db
	restaurantPromise
	.then(data => res.status(200).json(data))
	.catch(err => {
		console.log(err);
		res.status(500).send(internalMsg);
	});
});

//View a single restaurant account/profile
router.get('/:id', (req, res) => {
	Restaurant.findById(req.params.id)
	.then(data => res.status(200).json(data))
	.catch(err => {
		console.log(err);
		res.status(500).send(internalMsg);
	});
});

//View a single restaurant schedules
router.get('/:id/schedules', (req, res) => {
	Schedule.find({restaurant: req.params.id}).populate('bookings.organization')
	.then(data => res.status(200).json(data))
	.catch(err => {
		console.log(err);
		res.status(500).send(internalMsg);
	});
});


//create a new restaurant profile/account
router.post('/', (req, res)=>{
	//store the required properties in an array
	const requiredFields = ['name', 'phoneNumber', 'manager', 'address', 'email', 'username', 'password'];
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
	//if all properties are in the request body
	Restaurant.create({
		name: req.body.name,
		phoneNumber: req.body.phoneNumber,
		manager: req.body.manager,
		address: req.body.address,
		email: req.body.email,
		username: req.body.username,
		password: req.body.password
	})
	.then(newRest => res.status(201).json(newRest))
	.catch(err => {
		console.log(err);
		res.status(500).send(internalMsg);
	});
});

//post a schedule
router.post('/:id/schedules', (req, res)=>{
	// ensure that the id in the request path and the one in request body match
	if(!(req.params.id === req.body.restaurant)){
		const message = `The request path ID ${req.params.id} and restaurant ID ${req.body.restaurant} should match.`;
		console.error(message);
		return res.status(400).send(message);
	}
	//store the required properties in an array
	const requiredFields = ['schedType', 'startingDate', 'endingDate', 'dayOfWeek', 'time','restaurant', 'restPerson', 'bookings'];
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
	//if all properties are in the request body
	Schedule.create({
		schedType: req.body.schedType,
		startingDate: req.body.startingDate,
		endingDate: req.body.endingDate,
		dayOfWeek: req.body.dayOfWeek,
		time: req.body.time,
		restaurant: req.body.restaurant,
		restPerson: req.body.restPerson,
		bookings: req.body.bookings
	})
	.then(newSched => res.status(201).json(newSched))
	.catch(err => {
		console.log(err);
		res.status(500).send(internalMsg);
	});
});

//update a specific restaurant account/profile
router.put('/:id', (req, res)=>{
	// ensure that the id in the request path and the one in request body match
	if(!(req.params.id === req.body.id)){
		const message = `The request path ID ${req.params.id} and request body ID ${req.body.id} should match.`;
		console.error(message);
		return res.status(400).send(message);
	}
	//we need something to hold what the updated data should be
	const toUpdate = {};
	//properties that client can update
	const canBeUpdated = ['phoneNumber', 'manager', 'address', 'email', 'password'];
	//loop through the properties that can be updated
	//check if client sent in updated data for those
	for(let i=0; i<canBeUpdated.length;i++){
		const field = canBeUpdated[i];
		//if the property is in the req body and it is not null
		if(field in req.body && req.body.field !== null){
			//start adding the properties to the toUpdate object
			toUpdate[field] = req.body[field];
		}
	}
	//update the database by finding the id first using the id from req
	//then set the data to update
	Restaurant.findByIdAndUpdate(req.params.id, {$set: toUpdate})
	.then(()=>{
		return Restaurant.findById(req.params.id)
			.then(data => res.status(200).json(data));
	})
	.catch(err => {
		console.log(err);
		res.status(400).send(internalMsg)
	});
});

//update the schedule settings of a restaurant
router.put('/:id/schedules', (req, res)=>{
	// ensure that the id in the request path and the one in request body match
	if(!(req.params.id === req.body.id)){
		const message = `The request path ID ${req.params.id} and request body ID ${req.body.id} should match.`;
		console.error(message);
		return res.status(400).send(message);
	}
	//we need something to hold what the updated data should be
	const toUpdate = {};
	//properties that client can update
	const canBeUpdated = ['schedType', 'startingDate', 'endingDate', 'dayOfWeek', 'time'];
	//loop through the properties that can be updated
	//check if client sent in updated data for those
	for(let i=0; i<canBeUpdated.length;i++){
		const field = canBeUpdated[i];
		//if the property is in the req body and it is not null
		if(field in req.body && req.body.field !== null){
			//start adding the properties to the toUpdate object
			toUpdate[field] = req.body[field];
		}
	}
	Schedule.findOneAndUpdate({restaurant: req.params.id}, {$set: toUpdate}, {new: true})
	.then(()=>{
		return Schedule.find({restaurant: req.params.id})
			.then(data => res.status(200).json(data));
	})
	.catch(err => {
		console.log(err);
		res.status(400).send(internalMsg)
	});
});

//disable a specific restaturant profile/account by setting isActive to false
router.delete('/:id', (req,res)=>{
	Restaurant.findByIdAndUpdate(req.params.id, {$set: {isActive: "false"}})
	.then(result=> res.status(204).end())
	.catch(err => {
		console.log(err);
		res.status(400).send(internalMsg)
	});
});


module.exports = router;
