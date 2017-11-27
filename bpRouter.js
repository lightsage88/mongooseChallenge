const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {blogPost} = require('./models');

router.get('/', (req, res) => {
	blogPost
		.find()
		.then(blogPosts => {
			res.json({
				shit
			});
		})
		.catch(
			err => {
				console.error(err);
				res.status(500).json({message: 'Ay, dog, we fucked up'});
			});
	});

module.exports = router;

