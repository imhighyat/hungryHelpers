const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const package = require('./package.json');
const {PORT, DATABASE_URL} = require('./config');
const {Restaurant} = require('./models/restaurantsModel');
const {Organization} = require('./models/organizationsModel');
const {Admin} = require('./models/adminsModel');


//use ES6 promises
mongoose.Promise = global.Promise;

const app = express();

//for logging
app.use(morgan('common'));
app.use(bodyParser.json());

app.get('/', (req, res)=>{
	res.json({name: package.name, version: package.version});
});

//ENDPOINT FOR RESTAURANTS

app.get('/restaurants', (req,res)=>{
	Restaurant.find()
	.then(data => res.status(200).json(data));
});

app.post('/restaurants', (req, res)=>{
	//store the required properties in an array
	const requiredFields = ['name', 'phoneNumber', 'manager', 'address', 'email', 'username', 'password', 'verified'];
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
		password: req.body.password,
		verified: req.body.verified
	})
	.then(newRest => res.status(201).json(newRest))
	.catch(err => {
		console.log(err);
		res.status(500).send('Internal server error occured');
	});
});

app.put('/restaurants/:id', (req, res)=>{
	// ensure that the id in the request path and the one in request body match
	if(!(req.params.id === req.body._id)){
		const message = `The request path ID ${req.params.id} and request body ID ${req.body._id} should match.`;
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
		//update the database by finding the id first using the id from req
		//then set the data to update
		Restaurant.findByIdAndUpdate(req.params.id, {$set: toUpdate})
		.then(result => res.status(204).end())
		.catch(err => res.status(400).send('Internal server error occured.'));
	}
});

app.delete('/restaurants/:id', (req,res)=>{
	Restaurant.findByIdAndRemove(req.params.id)
	.then(result=> res.status(204).end())
	.catch(err=> res.status(400).send('Internal server error occured.'));
});

//ENDPOINTS FOR ORGANIZATIONS
app.get('/organizations', (req, res)=>{
	Organization.find()
	.then(data=> res.status(200).json(data));
});

app.post('/organizations', (req, res)=>{
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

app.put('/organizations/:id', (req, res)=>{
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

app.delete('/organizations/:id', (req,res)=>{
	Organization.findByIdAndRemove(req.params.id)
	.then(result=> res.status(204).end())
	.catch(err=> res.status(400).send('Internal server error occured.'));
});

//ENDPOINTS FOR ADMINS
app.get('/admins', (req, res)=>{
	Admin.find()
	.then(data=> res.status(200).json(data));
});

app.post('/admins', (req, res)=>{
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

app.put('/admins/:id', (req, res)=>{
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

app.delete('/admins/:id', (req,res)=>{
	Admin.findByIdAndRemove(req.params.id)
	.then(result=> res.status(204).end())
	.catch(err=> res.status(400).send('Internal server error occured.'));
});

let server;

//connects to the db and starts the server
function runServer(databaseUrl=DATABASE_URL, port=PORT){
    return new Promise ((resolve, reject) => {
        //connect to the db first
        mongoose.connect(databaseUrl, err => {
            //if there is an error connecting, return the promise
            //with reject and the error
            if(err){
                return reject(err);
            }
            //if not, move on to starting a server
            server = app.listen(port, () => {
                console.log(`The app is listening on ${port}.`);
                resolve();
            })
            //if there is an error, disconnect server and return a reject
            .on('error', err => {
                mongoose.disconnect();
                reject(err);
            });
        });
    });
}

//disconnects from the db and close the server
function closeServer(){
    return mongoose.disconnect().then(() => {
        return new Promise ((resolve, reject) => {
            console.log('Closing the server.');
            //closing the server
            server.close(err => {
                //if there is an error, return a reject
                if(err){
                    return reject(err);
                }
                //if not, return a resolve
                resolve();
            });
        });
    });
}

//if server.js is directly called from node, we will invoke runServer
if(require.main === module){
    //if any error, catch it and log
    runServer().catch(err => console.error(err));
}

//exporting our app and the run and close functions for testing
module.exports = {app, runServer, closeServer};