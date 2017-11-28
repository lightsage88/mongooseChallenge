const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

//this makes the should syntax available thru
//the module
const should = chai.should();

const {blogPost} = require('../models');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

function seedBlogData() {
	console.info('making some fake blog data up for tests');
	const seedData = [];

	for(let i=0; i<=10; i++) {
		seedData.push(generateBlogData())
		console.log(seedData);
	}
	return blogPost.insertMany(seedData);
}

// const blogPostSchema = mongoose.Schema({
// 	author:{
// 		firstName: String,
// 		lastName: String
// 	},
// 	title: {type: String, required: true},
// 	content: {type: String},
// 	created: {type: Date, default: Date.now}
// });

// blogPostSchema.virtual('creator').get(function(){
// 	return `${this.author.firstName} ${this.author.lastName}`.trim()
// });

// blogPostSchema.methods.apiRepr = function(){

// 		return {
// 			id: this._id,
// 			author: this.creator,
// 			content: this.content,
// 			title: this.title,
// 			created: this.created
// 		};
// }		author: generateAuthor(),




//use this to generate an object emulating a blogPost
//for seeding dating for database OR request.body data
function generateBlogData(){
	return{
		author: {
			firstName: faker.name.findName(),
			lastName: faker.name.findName()
		},
		content: faker.lorem.words(),
		title: faker.company.companyName(),
		created: faker.date.past()
	};
}	

//line 62 may be a bust!!!!
//function to delete the entire database,
//called in an 'afterEach' block to 
//make sure data from one test doesn't 
//stick around for the next


function torpedoDb(){
	console.warn('Murking dat db, son!');
	return mongoose.connection.dropDatabase();
}

describe('blog test API', function(){
	before(function(){
		return runServer(TEST_DATABASE_URL)
	});

	beforeEach(function(){
		return seedBlogData();
	});

	afterEach(function(){
		return torpedoDb();
	});

	after(function(){
		return closeServer();
	});

	//now we use nested 'describe/it' blocks
	//lets us make clearer discrete tests that 
	//prove something small as a focus
	describe('GET endpoint', function(){
		it('should return all present blogPosts', function(){
			let resultado;
			return chai.request(app)
				.get('/posts')
				.then(function(_res){
					resultado = _res;
					console.log(resultado.body.blahs);
					resultado.should.have.status(200);
					resultado.body.blahs.should.have.length.of.at.least(1);
					return blogPost.count();
				})
				.then(function(count){
					
					resultado.body.blahs.should.have.length.of.at.least(count);
				});
		});

		it('should return all posts with right fields', function(){
			let resultadoX;
			return chai.request(app)
			.get('/posts')
			.then(function(res){
				res.should.have.status(200);
				res.should.be.json;
				res.body.blah.should.be.a('array');
				res.body.blahs.should.have.length.of.at.least(1);

				res.body.blahs.forEach(function(blah){
					blah.should.be.a('object');
					blah.should.include.keys('id', 'author', 'content', 'title', 'created');
				});
				resultadoX = res.body.blahs[0];
				return blogPost.findById(resultadoX.id);
			})
			.then(function(blah){
				resultadoX.id.should.equal(blah.id);
				resultadoX.author.should.equal(blah.author);
				resultadoX.content.should.equal(blah.content);
				resultadoX.title.should.equal(blah.title);
				resultadoX.created.should.equal(blah.created);
			});
		});
	});

	describe('POST endpoint', function(){
		it('should add a new blahg post', function(){

			const newPost = generateBlogData();

			return chai.request(app)
			.post('/posts')
			.send(newPost)
			.then(function(res){
				res.should.have.status(201);
				res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.include.keys(
				'id','author', 'content', 'title', 'created');
				res.body.author.should.equal(newPost.author);
				res.body.id.should.not.be.null;
				res.body.content.should.equal(newPost.content);
				res.body.title.should.equal(newPost.title);
				res.body.created.should.equal(newPost.created);
			});
		});
	});
});











