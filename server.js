// require express framework and additional modules
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    _ = require('underscore'),
    mongoose = require('mongoose'),
	db = require("./models/models");
	    // ForumPost

//------------Linking to Public Folder------//
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
//----Connects to localhost to Database------//
mongoose.connect('mongodb://localhost/forumposts');

//>>>>>>>>>>>>>>>>>>>>>>>>>ROUTES<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<//

//-----------------ROOT Route---------------------//
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/views/microblog.html');
});

//////////////////////==DATA/API Routes===/////////////////



//-**********************USERNAMES*******************//


//---------------Show All UserNames-----------------//
app.get('/api/usernames', function (req, res){
	db.UserName.find({}, function (err, foundUserName){
		res.json(foundUserName);
	});
});

//---------------CREATE NEW USERNAME-----------------//
app.post('/api/usernames', function (req, res){
	newUserName = new db.UserName({name: req.body.UserName});
	newUserName.save(function (rew, newUserName){
		res.json(newUserName);
	});
});

//------Assign UserName to Specific Forum Post--------//
app.put('/api/forumposts/:postid/usernames/:userid', function (req, res){
	db.UserName.find({_id: req.params.userid}, function (err, foundUserName){
		db.ForumPost({_id: req.params.postid}, function (err, foundForumPost){
			foundForumPost.username = username._id;
			foundForumPost.save(function (err, savedForumPost){
				res.json(savedForumPost);
			});
		});
	});
});


//***********************FORUM-POSTS*******************//

//----------------Show All Forum Posts--------------//
app.get('/api/forumposts', function (req, res){
//>>>>populate all of the post's author information
	db.ForumPost.find({}).populate('author').exec( function (err, allForumPosts){
		if(err){
			console.log('wrong path dummy:', err);
			res.status(500).send(err);
		} else {
			res.json(allForumPosts);
		}
	});
});
});

//-------------NEW BLOG POST--------------------//
app.post('/api/forumposts', function (req, res){

	newUserName = new db.UserName({
		name: req.body.UserName
	});
	var newForumPost = new db.ForumPost({
		username: newUserName._id,
		forumPost: req.body.forumPost
	});
	newForumPost.save(function (err, savedForumPost){
		if (err){
			console.log("fucked up again", err);
			res.status(500).send(err);
		} else {
			res.json(savedForumPost);
		}
	});
});

//---------Show Forum Post based on ID in URL----------//
app.get('/api/forumposts/:postid', function (req, res){
	var targetID = req.params.postid;
	db.ForumPost.findOne({_id: targetID}, function (err, foundForumPost){
		console.log(foundForumPost);
		if(err){
			console.log("wtf happened dude", err);
			res.status(500).send(err);
		} else {
			res.json(foundForumPost);
		}
	});

//----------------UPDATE SINGLE POST---------------//
app.put('/api/forumposts/:postid', function (req, res){
	var targetID = req.params.postid;
	db.ForumPost.findOne({_id: targetID}, function (err, foundForumPost){
		if(err){
			console.log("wrong again fucker");
			res.status(500).send(err);
		} else {
			foundForumPost.username = req.body.username;
			foundForumPost.forumPost = req.body.forumPost;
			res.json(foundForumPost);
			foundForumPost.save(function (err, savedForumPost){
				if (err){
					console.log("mother fkcur");
					res.status(500).send(err);
				} else {
					res.json(savedForumPost);
				}
			});
		}
	});
});



//**************************COMMENTS**************************//

//----------READ EMBEDDED COMMENTS 4 SINGLE POST----------------//
app.get('/api/forumposts/:id/comments', function (req, res){
	var targetID = req.params.id;
	db.ForumPost.findOne({_id: targetID}, function (err, foundForumPost){
		if (err){
			console.log('wrong path dummy:', err);
			res.status(500).send(err);
		} else {
			res.json(foundForumPost.comments)
		}
	});
});

//--------------NEW COMMENT ON FORUM POST------------------//
//*******************ISSUE with PARENS*********************//

app.post('/api/forumposts/:id/comments', function (req, res){
	var targetID = req.params.id;
	db.ForumPost.findOne( {_id: req.params.id} , function (err, foundForumPost){
		if (err){
			console.log('you cant post a comment here', err);
			res.status(500).send(err);
		} else {
			newComment = new db.Comment({commentText: req.body.CommentText});
			foundForumPost.comments.push(newComment);
			res.json(newComment);
			// foundForumPost.save(function (err, savedForumPost){
			// 	res.json(savedForumPost);
		}
	});
});





//-----------------DELETE User By ID------------------//
app.delete('/api/forumposts/:id', function (req, res){
	var targetID = req.params.id;
	db.ForumPost.findOneAndRemove({_id: targetID}, function (err, deletedForumPost){
		if(err){
			console.log("wrong again fucker");
			res.status(500).send(err);
		} else {
			res.json(deletedForumPost);
			};
		});
});

// --------------listen on port 3000-------------------//
app.listen(3000, function () {
  console.log('server started on localhost:3000');
});