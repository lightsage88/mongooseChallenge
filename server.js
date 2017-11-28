const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');
const {Blogpost} = require('./models');
//models is where we will define the schema

const app = express();
app.use(bodyParser.json());
app.use(morgan('common'));


//set up get, post, put, deletes here
//after defining schema

let server;



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


app.get('/posts', (req, res)=>{
	Blogpost
	.find()
	.then(blogPosts => {
		res.json(blogPosts.map(blogPost => blogPost.apiRepr())
		);
	})
	.catch(
		err => {
			console.error(err);
			res.status(500).json({message: 'internal server error'});
		});
});



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