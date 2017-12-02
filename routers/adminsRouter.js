const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//use ES6 promises
mongoose.Promise = global.Promise;

const {Admin} = require('../models/adminsModel');

//view multiple admin profiles whether with queries or none
router.get('/', (req,res)=>{
	//store the values of the query
	const active = req.query.active;
	//if query is undefined, get all the admins
	if(typeof(active) === "undefined"){
		Admin.find()
		.then(data => res.status(200).json(data))
		.catch(err => res.status(500).send('Internal server error occured.'));
	}
	//if the query has a value
	else if(typeof(active) === "string"){
		//test if the value is what we expect
		if(active === "true" || active === "false"){
			Admin.find({isActive: active})
			.then(data => res.status(200).json(data))
			.catch(err => res.status(500).send('Internal server error occured.'));
		}
		else{
			const message = 'Query value unexpected.';
			res.status(400).send(message);
		}
	}
	else{
		const message = 'Query value unexpected.';
		res.status(400).send(message);
	}
});

//View a single admin account/profile
router.get('/:id', (req, res) => {
	Admin.findById(req.params.id)
	.then(data => res.status(200).json(data))
	.catch(err => res.status(500).send('Internal server error occured.'));
});

router.post('/', (req, res)=>{
	//store the required properties in an array
	const requiredFields = ['name', 'email', 'username', 'password', 'phoneNumber'];
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
		res.status(500).send('Internal server error occured');
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
	.catch(err => res.status(400).send('Internal server error occured.'));
});

//disable a specific admin profile/account by setting isActive to false
router.delete('/:id', (req,res)=>{
	Admin.findByIdAndUpdate(req.params.id, {$set: {isActive: "false"}})
	.then(result=> res.status(204).end())
	.catch(err=> res.status(400).send('Internal server error occured.'));
});

module.exports = router;
