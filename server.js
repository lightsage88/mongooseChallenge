const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');
const {blogPost} = require('./models');
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
			console.log('here goes nothing, bitches');
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
	blogPost
	.find()
	.then(blahs => {
		res.json({
			blahs: blahs.map(
				(blogPost) => blogPost.apiRepr())
		});
	})	
	.catch(
		err => {
			console.error(err);
			res.status(500).json({message: 'internal server error'});
		});
});

app.get('/posts/:id', (req, res)=>{
	blogPost
		.findById(req.params.id)
		.then(blogPost => res.json(blogPost.apiRepr()))
		.catch(err =>{
			console.error(err);
			res.status(500).json({message: 'Man, that shit don exist, cuz'})
		});
});

app.post('/posts', (req, res)=>{
	const requiredFields = ['author', 'title','content'];
	for (let i=0; i<requiredFields.length; i++){
		const field = requiredFields[i];
		if(!(field in req.body)){
			const message = `Missing \`${field}\` in request body`
			console.error(message);
			return res.status(400).send(message);
		}
	}

	blogPost
		.create({
			author: req.body.author,
			title: req.body.title,
			content: req.body.content
		})
		.then(blogPost => res.status(201).json(blogPost.apiRepr()))
		.catch(err => {
			console.error(err);
			res.status(500).json({error: 'aw, fuck'});
		});
});

app.put('/posts/:id', (req, res)=>{
	const requiredFields = ['id', 'title'];
	
		if(!(req.params.id && req.body.id && req.params.id === req.body.id)){
			const message = `The req.params.id \`${req.params.id}\` and the req.body.id \`${req.body.id}\` need to match.`
			console.error(message);
			res.status(400).json({message: message});
		}
	const toUpdate = {};
	const updateableFields = ['author', 'content', 'title'];

	updateableFields.forEach(function(field){
		if(field in req.body){
			toUpdate[field]=req.body[field];
		}
	});

	blogPost
		.findByIdAndUpdate(req.params.id, {$set: toUpdate})
		.then(blogPost => res.status(204).end())
		.catch(err => res.status(500).json({message: 'We don fucked up, homie. That is our bad!'}));

});

app.delete('/posts/:id', (req, res) => {
	blogPost
		.findByIdAndRemove(req.params.id)
		.then(blogPost => res.status(204).end())
		.catch(err =>res.status(500).json({message: 'Yikes...shit'}));
});

app.use('*', function(req,res){
	res.status(404).json({message: 'Man, you know that shit dont exist here...the fuck outta here'});
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