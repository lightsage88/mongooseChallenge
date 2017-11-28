const mongoose = require('mongoose');

//schema to represent blogPosts:
// const blogPostSchema = mongoose.Schema({
// 	_id: {type: String, required: true},
// 	title: {type: String, required: true},
// 	content: {type: String, required: true},
// 	author: {
// 		firstName: {type: String, required: true},
// 		lastName: {type: String, required: true}
// 	}
	
// });

const blogPostSchema = mongoose.Schema({
	author:{
		firstName: String,
		lastName: String
	},
	title: {type: String, required: true},
	content: {type: String},
	created: {type: Date, default: Date.now}
});

blogPostSchema.virtual('creator').get(function(){
	return `${this.author.firstName} ${this.author.lastName}`.trim()
});

blogPostSchema.methods.apiRepr = function(){

		return {
			id: this._id,
			author: this.creator,
			content: this.content,
			title: this.title,
			created: this.created
		};
}

const Blogpost = mongoose.model('Blogpost', blogPostSchema);

module.exports = {Blogpost};