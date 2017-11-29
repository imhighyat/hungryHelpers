const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//use ES6 promises
mongoose.Promise = global.Promise;

const {Admin} = require('../models/adminsModel');

router.get('/', (req, res)=>{
	Admin.find()
	.then(data=> res.status(200).json(data));
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
		//update the database by finding the id first using the id from req
		//then set the data to update
		Admin.findByIdAndUpdate(req.params.id, {$set: toUpdate})
		.then(result => res.status(204).end())
		.catch(err => res.status(400).send('Internal server error occured.'));
	}
});

router.delete('/:id', (req,res)=>{
	Admin.findByIdAndRemove(req.params.id)
	.then(result=> res.status(204).end())
	.catch(err=> res.status(400).send('Internal server error occured.'));
});

module.exports = router;
