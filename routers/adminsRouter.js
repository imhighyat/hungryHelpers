const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//use ES6 promises
mongoose.Promise = global.Promise;

const {Admin} = require('../models/adminsModel');
const {Restaurant} = require('../models/restaurantsModel');
const {Organization} = require('../models/organizationsModel');
const internalMsg = 'Internal server error occured.';
const queryMsg = 'Query value unexpected.';

//view multiple admin profiles whether with queries or none
router.get('/', (req,res)=>{
	//store the values of the query
	const active = req.query.active;
	//variable to store what the collection query will be
	let adminPromise;
	//if query is undefined, get all the admins
	if(typeof(active) === "undefined"){
		adminPromise = Admin.find();
	}
	//if the query has a value
	else if(typeof(active) === "string"){
		//test if the value is what we expect
		if(active === "true" || active === "false"){
			adminPromise = Admin.find({isActive: active});
		}
		else{
			return res.status(400).send(queryMsg);
		}
	}
	else{
		return res.status(400).send(queryMsg);
	}
	adminPromise
	.then(data => res.status(200).json(data))
	.catch(err => {
		console.log(err);
		res.status(500).send(internalMsg)
	});
});

//View all restaurants waiting for verification
router.get('/restverify', (req, res) => {
	Restaurant.find({verified: "false"})
	.then(data => res.status(200).json(data))
	.catch(err => {
		console.log(err);
		res.status(500).send(internalMsg)
	});
});

//View all organizations waiting for verification
router.get('/orgverify', (req, res) => {
	Organization.find({verified: "false"})
	.then(data => res.status(200).json(data))
	.catch(err => {
		console.log(err);
		res.status(500).send(internalMsg)
	});
});

//View a single admin account/profile
router.get('/:id', (req, res) => {
	Admin.findById(req.params.id)
	.then(data => res.status(200).json(data))
	.catch(err => {
		console.log(err);
		res.status(500).send(internalMsg)
	});
});

router.post('/', (req, res)=>{
	//store the required properties in an array
	const requiredFields = ['name', 'email', 'username', 'password', 'phoneNumber'];
	//use for loop to check if all required properties are in the req body
	for(let i=0; i<requiredFields.length; i++){
		const field = requiredFields[i];
		if(!(field in req.body)){
			const message = `Missing ${field} in request body.`;
			console.error(message);
			//return with a 400 staus and the error message
			return res.status(400).send(message);
		}
	}
	//if all properties are in the request body
	Admin.create({
		name: req.body.name,
		email: req.body.email,
		username: req.body.username,
		password: req.body.password,
		phoneNumber: req.body.phoneNumber
	})
	.then(newAdmin => res.status(201).json(newAdmin))
	.catch(err => {
		console.log(err);
		res.status(500).send(internalMsg);
	});
});

//update a specific admin account/profile
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
	const canBeUpdated = ['name', 'email', 'password', 'phoneNumber'];
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
	Admin.findByIdAndUpdate(req.params.id, {$set: toUpdate})
	.then(()=>{
		return Admin.findById(req.params.id)
			.then(data => res.status(200).json(data));
	})
	.catch(err => {
		console.log(err);
		res.status(400).send(internalMsg)
	});
});

//update a restaurant profile/account verified property
router.put('/restverify/:id', (req,res) => {
	Restaurant.findByIdAndUpdate(req.params.id, {$set: {verified: "true"}})
	.then(result => res.status(200).send('Account verified!'))
	.catch(err => {
		console.log(err);
		res.status(400).send(internalMsg)
	});
});

//update an organization profile/account verified property
router.put('/orgverify/:id', (req,res) => {
	Organization.findByIdAndUpdate(req.params.id, {$set: {verified: "true"}})
	.then(result => res.status(200).send('Account verified!'))
	.catch(err => {
		console.log(err);
		res.status(400).send(internalMsg)
	});
});

//disable a specific admin profile/account by setting isActive to false
router.delete('/:id', (req,res)=>{
	Admin.findByIdAndUpdate(req.params.id, {$set: {isActive: "false"}})
	.then(result=> res.status(204).end())
	.catch(err => {
		console.log(err);
		res.status(400).send(internalMsg)
	});
});

module.exports = router;
