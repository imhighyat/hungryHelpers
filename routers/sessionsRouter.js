const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//use ES6 promises
mongoose.Promise = global.Promise;

const {Restaurant} = require('../models/restaurantsModel');
const {Organization} = require('../models/organizationsModel');
const incorrectMsg = 'Incorrect credentials.';

router.post('/', (req, res)=>{
	const requiredFields = ['username', 'password'];
		for(let i=0; i < requiredFields.length; i++){
    		const field = requiredFields[i];
    		if(!(field in req.body)){
    			const message = `Missing ${field} in request body.`;
				console.error(message);
				return res.send(message);
    		}
    	}
    //check Resto collection first
    Restaurant.findOne({username: req.body.username})
    .then(data => {
    	//if no document was found with matching username, look in the organization collection
    	if(data === null && typeof(data) === 'object'){
        	return Organization.findOne({username: req.body.username})
        			.then(data => {
        				if(data === null && typeof(data) === 'object'){
        					res.send(incorrectMsg);
        				}
        				else{
        					if(data.password === req.body.password){
        						res.status(200).json({orgToken: data._id});
        					}
        					else{
        						res.send(incorrectMsg);
        					}
        				}
        			});
    	}
    	else{
        	if(data.password === req.body.password){
        		res.status(200).json({restoToken: data._id});
        	}
        	else{
        		res.send(incorrectMsg);
        	}
    	}
    });

    router.delete('/', (req,res) => {
        //do something
    });
});


module.exports = router;