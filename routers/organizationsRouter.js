const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//use ES6 promises
mongoose.Promise = global.Promise;

const {Organization} = require('../models/organizationsModel');

router.get('/', (req, res)=>{
	Organization.find()
	.then(data=> res.status(200).json(data));
});

router.post('/', (req, res)=>{
	//store the required properties in an array
	const requiredFields = ['name', 'causeDescription', 'phoneNumber', 'manager', 'address', 'email', 'username', 'password', 'verified'];
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
	Organization.create({
		name: req.body.name,
		causeDescription: req.body.causeDescription,
		phoneNumber: req.body.phoneNumber,
		manager: req.body.manager,
		address: req.body.address,
		email: req.body.email,
		username: req.body.username,
		password: req.body.password,
		verified: req.body.verified
	})
	.then(newOrg => res.status(201).json(newOrg))
	.catch(err => {
		console.log(err);
		res.status(500).send('Internal server error occured');
	});
});

router.put('/:id', (req, res)=>{
	// ensure that the id in the request path and the one in request body match
	if(!(req.params.id === req.body._id)){
		const message = `The request path ID ${req.params.id} and request body ID ${req.body._id} should match.`;
		console.error(message);
		return res.status(400).send(message);
	}
	//we need something to hold what the updated data should be
	const toUpdate = {};
	//properties that client can update
	const canBeUpdated = ['causeDescription', 'phoneNumber', 'manager', 'address', 'email', 'password'];
	//loop through the properties that can be updated
	//check if client sent in updated data for those
	for(let i=0; i<canBeUpdated.length;i++){
		const field = canBeUpdated[i];
		//if the property is in the req body and it is not null
		if(field in req.body && req.body.field !== null){
			//start adding the properties to the toUpdate object
			toUpdate[field] = req.body[field];
		}
		//update the database by finding the id first using the id from req
		//then set the data to update
		Organization.findByIdAndUpdate(req.params.id, {$set: toUpdate})
		.then(result => res.status(204).end())
		.catch(err => res.status(400).send('Internal server error occured.'));
	}
});

router.delete('/:id', (req,res)=>{
	Organization.findByIdAndRemove(req.params.id)
	.then(result=> res.status(204).end())
	.catch(err=> res.status(400).send('Internal server error occured.'));
});


module.exports = router;
