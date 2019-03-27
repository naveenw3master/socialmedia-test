var express = require('express');
var async = require("async");
var router = express.Router();
var db = require('./../config/db');

const mongo = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
var dbo;
MongoClient.connect('mongodb://localhost:27017/', (err, db) => {
  if (err) throw err;
  dbo = db.db("socialmedia");
})

/* GET posts page. */
router.get('/', function(req, res, next) {
  var user_id = req.session.uid;

  dbo.collection("posts").find({status: "ACTIVE"}).toArray(function(err, result){
    if (err) throw err;
    async.forEachOf(result, (post, key, callback) => {

      dbo.collection("users").find({_id: new mongo.ObjectID(post.user_id), status: "ACTIVE"}).toArray(function(err, user_info){
        if (err) throw err;
        var username = user_info.length > 0 ? user_info[0].name : "";
        dbo.collection("comments").count({post_id: new mongo.ObjectID(post._id), status: "ACTIVE"}, function(error, comments_count){
          if (err) throw err;
          dbo.collection("likes").count({type: "POST", post_id: new mongo.ObjectID(post._id), status: "ACTIVE"}, function(error, likes_count){
            if (err) throw err;
            dbo.collection("likes").find({post_id: new mongo.ObjectID(post._id), user_id: new mongo.ObjectID(user_id), type: "POST", status: "ACTIVE"}).toArray(function(err, like_info){
              if (err) throw err;
              var my_like_status = like_info.length > 0 ? 1 : 0;

              post.username = username;
              post.comments_count = comments_count;
              post.likes_count = likes_count;
              post.my_like_status = my_like_status;
              result[key] = post;
              return callback();
            });
          });
        });
      });

    }, err => {
        if (err) console.error(err.message);
        return res.render('posts', { username: req.session.name, posts: result });
    });
  });

});

/* GET new post page. */
router.get('/new-post', function(req, res, next) {
  return res.render('new_post', { username: req.session.name });
});

/* GET post details page. */
router.get('/post-details', function(req, res, next) {
  var post_id = req.query.id;
  var user_id = req.session.uid;

  dbo.collection("posts").find({_id: new mongo.ObjectID(post_id), status: "ACTIVE"}).toArray(function(err, result){
    if (err) throw err;
    dbo.collection("users").find({_id: new mongo.ObjectID(result[0].user_id), status: "ACTIVE"}).toArray(function(err, user_info){
      if (err) throw err;
      var username = user_info.length > 0 ? user_info[0].name : "";
      dbo.collection("comments").count({post_id: new mongo.ObjectID(post_id), status: "ACTIVE"}, function(error, comments_count){
        if (err) throw err;
        dbo.collection("likes").count({type: "POST", post_id: new mongo.ObjectID(post_id), status: "ACTIVE"}, function(error, likes_count){
          if (err) throw err;
          dbo.collection("likes").find({post_id: new mongo.ObjectID(post_id), user_id: new mongo.ObjectID(user_id), type: "POST", status: "ACTIVE"}).toArray(function(err, like_info){
            if (err) throw err;
            var my_like_status = like_info.length > 0 ? 1 : 0;

            result[0].username = username;
            result[0].comments_count = comments_count;
            result[0].likes_count = likes_count;
            result[0].my_like_status = my_like_status;

            dbo.collection("comments").find({post_id: new mongo.ObjectID(post_id), parent_id: null, status: "ACTIVE"}).toArray(function(err, cresult){
              if (err) throw err;
              async.forEachOf(cresult, (comment, key, callback) => {

                dbo.collection("users").find({_id: new mongo.ObjectID(comment.user_id), status: "ACTIVE"}).toArray(function(err, cuser_info){
                  if (err) throw err;
                  var cusername = cuser_info.length > 0 ? cuser_info[0].name : "";
                  dbo.collection("likes").count({type: "COMMENT", comment_id: new mongo.ObjectID(comment._id), status: "ACTIVE"}, function(error, clikes_count){
                    if (err) throw err;
                    dbo.collection("likes").find({comment_id: new mongo.ObjectID(comment._id), user_id: new mongo.ObjectID(user_id), type: "COMMENT", status: "ACTIVE"}).toArray(function(err, clike_info){
                      if (err) throw err;
                      var cmy_like_status = clike_info.length > 0 ? 1 : 0;

                      comment.username = cusername;
                      comment.likes_count = clikes_count;
                      comment.my_like_status = cmy_like_status;

                      dbo.collection("comments").find({post_id: new mongo.ObjectID(post_id), parent_id: new mongo.ObjectID(comment._id), status: "ACTIVE"}).toArray(function(err, scresult){
                        if (err) throw err;
                        async.forEachOf(scresult, (scomment, skey, callbackSub) => {

                          dbo.collection("users").find({_id: new mongo.ObjectID(scomment.user_id), status: "ACTIVE"}).toArray(function(err, scuser_info){
                            if (err) throw err;
                            var scusername = scuser_info.length > 0 ? scuser_info[0].name : "";
                            dbo.collection("likes").count({type: "COMMENT", comment_id: new mongo.ObjectID(scomment._id), status: "ACTIVE"}, function(error, sclikes_count){
                              if (err) throw err;
                              dbo.collection("likes").find({comment_id: new mongo.ObjectID(scomment._id), user_id: new mongo.ObjectID(user_id), type: "COMMENT", status: "ACTIVE"}).toArray(function(err, sclike_info){
                                if (err) throw err;
                                var scmy_like_status = sclike_info.length > 0 ? 1 : 0;

                                scomment.username = scusername;
                                scomment.likes_count = sclikes_count;
                                scomment.my_like_status = scmy_like_status;
                                scresult[skey] = scomment;
                                return callbackSub();
                              });
                            });
                          });

                        }, err => {
                            if (err) console.error(err.message);
                            comment.sub_comments = scresult;
                            return callback();
                        });
                      });

                      cresult[key] = comment;

                    });
                  });
                });

              }, err => {
                  if (err) console.error(err.message);
                  return res.render('post_details', { username: req.session.name, post_details: result[0], comments: cresult });
              });
            });


          });
        });
      });
    });

  });


  // db.query("SELECT p.*, u.Name as UserName, COUNT(DISTINCT(c.`CommentID`)) AS CommentsCount, COUNT(DISTINCT(l.`LikeID`)) AS LikesCount, IF(ml.`LikeID`, 1, 0) AS MyLikeStatus FROM posts  p \n"+
  //   "LEFT JOIN `users` u ON u.`UserID`= p.`UserFKID` \n"+
  //   "LEFT JOIN `comments` c ON c.`PostFKID`=p.`PostID` AND c.Status = 'ACTIVE' \n"+
  //   "LEFT JOIN `likes` l ON l.`PostFKID`= p.`PostID` AND l.`Type`='POST' AND l.Status = 'ACTIVE' \n"+
  //   "LEFT JOIN `likes` ml ON ml.`PostFKID`= p.`PostID` AND ml.`Type`='POST' AND ml.Status = 'ACTIVE'  AND ml.`UserFKID`=? \n"+
  //   "WHERE p.Status = 'ACTIVE' AND p.PostID = ? \n"+
  //   "GROUP BY `PostID`", [user_id, post_id], function(err, result) {
  //   if (err) throw err;
  //   db.query("SELECT c.*, u.Name as UserName, COUNT(DISTINCT(l.`LikeID`)) AS LikesCount, IF(ml.`LikeID`, 1, 0) AS MyLikeStatus FROM comments c \n"+
  //     "LEFT JOIN `users` u ON u.`UserID`= c.`UserFKID` \n"+
  //     "LEFT JOIN `likes` l ON l.`CommentFKID`= c.`CommentID` AND l.`Type`='COMMENT' AND l.Status = 'ACTIVE' \n"+
  //     "LEFT JOIN `likes` ml ON ml.`CommentFKID`= c.`CommentID` AND ml.`Type`='COMMENT' AND ml.Status = 'ACTIVE'  AND ml.`UserFKID`=? \n"+
  //     "WHERE c.Status = 'ACTIVE' AND c.ParentFKID = 0 AND c.PostFKID = ? \n"+
  //     "GROUP BY `CommentID`\n"+
  //     "ORDER BY CommentID DESC", [user_id, post_id], function(err, comment_result) {
  //       var comments_data = [];
  //       async.forEachOfSeries(comment_result, (value, key, callback) => {
  //         var sub_comments = [];
  //
  //         db.query("SELECT c.*, u.Name as UserName, COUNT(DISTINCT(l.`LikeID`)) AS LikesCount, IF(ml.`LikeID`, 1, 0) AS MyLikeStatus FROM comments c \n"+
  //           "LEFT JOIN `users` u ON u.`UserID`= c.`UserFKID` \n"+
  //           "LEFT JOIN `likes` l ON l.`CommentFKID`= c.`CommentID` AND l.`Type`='COMMENT' AND l.Status = 'ACTIVE' \n"+
  //           "LEFT JOIN `likes` ml ON ml.`CommentFKID`= c.`CommentID` AND ml.`Type`='COMMENT' AND ml.Status = 'ACTIVE'  AND ml.`UserFKID`=? \n"+
  //           "WHERE c.Status = 'ACTIVE' AND c.ParentFKID = ? \n"+
  //           "GROUP BY `CommentID`\n"+
  //           "ORDER BY CommentID DESC", [user_id, value.CommentID], function(err, sub_comment_result) {
  //             value.SubComments = sub_comment_result;
  //             comments_data.push(value);
  //             return callback();
  //         });
  //     }, err => {
  //         if (err) console.error(err.message);
  //         return res.render('post_details', { username: req.session.name, post_details: result[0], comments: comments_data });
  //     });
  //   });
  // });
});

/* POST post create page. */
router.post('/post-create', function(req, res, next) {
  var title = req.body.title;
  var details = req.body.details;
  var user_id = req.session.uid;
  var status = "ACTIVE";
  var postobj = { user_id: user_id, title: title, description: details, status: status };
  dbo.collection("posts").insertOne(postobj, function(err, result) {
    if (err) throw err;
    res.redirect('/posts');
  });
});

/* POST post like page. */
router.post('/like-post', function(req, res, next) {
  var post_id = req.body.post_id;
  var user_id = req.session.uid;
  var status = "ACTIVE";
  var likeobj = { type: "POST", user_id: new mongo.ObjectID(user_id), post_id: new mongo.ObjectID(post_id), status: status };
  dbo.collection("likes").insertOne(likeobj, function(err, result) {
    if (err) throw err;
    return res.json({"status": true, "message": "Liked successfully!"});
  });
});

/* POST comment like page. */
router.post('/like-comment', function(req, res, next) {
  var comment_id = req.body.comment_id;
  var user_id = req.session.uid;
  var status = "ACTIVE";
  var likeobj = { type: "COMMENT", user_id: new mongo.ObjectID(user_id), comment_id: new mongo.ObjectID(comment_id), status: status };
  dbo.collection("likes").insertOne(likeobj, function(err, result) {
    if (err) throw err;
    return res.json({"status": true, "message": "Liked successfully!"});
  });
});

/* POST post comment page. */
router.post('/post-comment', function(req, res, next) {
  var post_id = req.body.post_id;
  var message = req.body.message;
  var parent_id = req.body.parent_id;
  var user_id = req.session.uid;
  var status = "ACTIVE";
  var commentobj = { user_id: new mongo.ObjectID(user_id), post_id: new mongo.ObjectID(post_id), message: message, parent_id: (parent_id != 0 ? new mongo.ObjectID(parent_id) : null), status: status };
  dbo.collection("comments").insertOne(commentobj, function(err, result) {
    if (err) throw err;
    return res.json({"status": true, "message": "Commented successfully!"});
  });
});

module.exports = router;
