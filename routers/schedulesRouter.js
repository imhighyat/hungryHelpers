const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//use ES6 promises
mongoose.Promise = global.Promise;

const {Schedule} = require('../models/schedulesModel');

//view multiple restaurant profiles whether with queries or none
router.get('/', (req,res)=>{
	Schedule.find()
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