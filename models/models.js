//----------------IMPORT MONGOOSE DB-----------//
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
//-----------------SCHEMA SETUP-------------//

//---------------COMMENT----------------//
var CommentSchema = new Schema({
	commentText: String,
	timestamp: {
				type: Date,
				default: Date.now
				}
});
var Comment = mongoose.model('Comment', CommentSchema);

//-------------USERNAME(AUTHOR)-----------//
var UserNameSchema = new Schema({
	name: String
});
var UserName = mongoos.model('UserName', UserNameSchema);	

//--------------FORUM POST---------------//
var ForumPostSchema = new Schema({
	username: { //does this grab the object ID?? then populate later??
				type: Schema.Types.ObjectId,
				ref: 'UserName'
			},
	forumPost: String,
	comments: [CommentSchema]
});
var ForumPost = mongoose.model('ForumPost', ForumPostSchema);

//-------------EXPORTS------------------//

module.exports.ForumPost = ForumPost;
module.exports.Comment = Comment;
module.exports.UserName = UserName;