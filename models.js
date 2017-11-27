const mongoose = require('mongoose');

//schema to represent blogPosts:
const blogPostSchema = mongoose.Schema({
	_id: {type: String, required: true},
	title: {type: String, required: true},
	content: {type: String, required: true},
	author: {
		firstName: {type: String, required: true},
		lastName: {type: String, required: true}
	}
	
});

blogPostSchema.virtual('creator').get(function(){
	return `${this.author.firstName} ${this.author.lastName}`.trim()
});

blogPostSchema.methods.apiRepr = function(){

return {
	id: this._id,
	title: this.title,
	content: this.content,
	author: this.creator,
	};

}

const blogPost = mongoose.model('blogPost', blogPostSchema);

module.exports = {blogPost};