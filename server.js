const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

const bPRouter = require('./bPRouter');

mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');
const {blogPost} = require('./models');
//models is where we will define the schema

const app = express();
app.use(bodyParser.json());


//set up get, post, put, deletes here
//after defining schema
// app.use('/blogPost', bPRouter);

app.get('/blogPost', (req, res)=>{
	blogPost
	.find()
	.then(blogPosts => {
		res.json({
			blogPosts: blogPosts.map(
				(blogPost) => blogPost.apiRepr())
		});
	})
	.catch(
		err => {
			console.error(err);
			res.status(500).json({message: 'We fucked up, mang'});
		});
});




let server;

app.get('/blogPosts', (req, res)=>{
	blogPost
	.find()
	.then(blogPosts => {
		res.json({
			blogPosts: blogPosts.map((blogPost)=> blogPost.apiRepr())
		});
	})
	.catch(
		err => {
			console.error(err);
			res.status(500).json({message: 'fuck, god damnit'});
		});
});

function runServer(databaseUrl=DATABASE_URL,
	port=PORT) {

	return new Promise((resolve, reject)=>{
		mongoose.connect(databaseUrl, err => {
			if(err) {
				return reject(err);
			}
			server = app.listen(port, ()=>{
				console.log(`Your app is cripping on
					port ${port}`);
				resolve();
			})
			.on('error', err =>{
				mongoose.disconnect();
				reject(err);
			});
		});
	});
}

function closeServer(){
	return mongoose.disconnect().then(()=>{
		return new Promise((resolve, reject)=>{
			console.log('closing server, foo');
			server.close(err => {
				if (err) {
					return reject(err);
				}
				resolve();
			});
		});
	});
}

if (require.main === module) {
	runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};