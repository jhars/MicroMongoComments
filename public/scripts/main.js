$(function() {

//---------Post Controller-----------//
var postController = {

template: _.template($('#post-template').html()),

//---------Render Post to HTML thru Template----------// 
 render: function (blogObj) {
  var $blogPostHTML = $(postController.template(blogObj));
  $('#blog-post-list').append($blogPostHTML);
 },

//-------------GET Blog Posts from API------//
//---------iterate thru EACH blogpost-------//
//----Event-listeners 4 UPDATE & DELETE ----//

 all: function () {
  $.get('/api/forumposts', function (data) {
    var forumData = data;
    _.each(forumData, function (blogpost) {
    postController.render(blogpost);
  });
    postController.addEventHandlers();
  });
 },

 create: function (newID, newUserName, newForumPost){
  var blogPostData = {_id: newID, username: newUserName, forumPost: newForumPost};

  $.post('/api/forumposts', blogPostData, function (data){
    var newPost = data;
    postController.render(newPost);
  });
 },

update: function(userID, updatedUsername, updatedForumPost){
  $.ajax({
    type: 'PUT',
    url: '/api/forumposts' + userID,
    data: {
      username: updatedUsername,
      forumPost: updatedForumPost
    },
    success: function (data) {
      var updatedPost = data;
      var $blogPostHTML = $(postController.template(updatedPost));
      $('#bp-' + userID).replaceWith($blogPostHTML);
    }
  });
},

delete: function (userID) {
  $.ajax({
    type: 'DELETE',
    url: '/api/forumposts' + userID,
    success: function(data) {
      $('#bp-' + userID).remove();
    }
  });
},

//------------------EVENT HANDLERS---------------//

addEventHandlers: function () {
  $('#blog-post-list')
    // for update: submit event on `.update-phrase` form
    .on('submit', '.update-blog-post', function(event) {
      event.preventDefault();
      
      // find the phrase's id (stored in HTML as `data-id`)
      var updatedID = $(this).closest('.blog-post-item').attr('data-id');
      
      // udpate the phrase with form data
      var updatedUserName = $(this).find('.updated-username').val();
      var updatedForumPost = $(this).find('.updated-forum-post').val();
      postController.update(updatedID, updatedUserName,updatedForumPost);
    })
    
    // for delete: click event on `.delete-phrase` button
    .on('click', '.delete-post', function(event) {
      event.preventDefault();

      // find the phrase's id
      var bloggerId = $(this).closest('.blog-post-item').attr('data-id');
      
      // delete the phrase
      postController.delete(bloggerId);
    });
},

setupView: function() {
  postController.all();
  $('#new-post').on('submit', function (event) {
    event.preventDefault();

    var newID = null;
    var newUserName = $('#user-name').val();
    var newForumPost = $('#blog-post').val();
    postController.create(newID, newUserName, newForumPost);

    $(this)[0].reset();
    $('#new-username').focus();
    });
  }
};

postController.setupView();

  });