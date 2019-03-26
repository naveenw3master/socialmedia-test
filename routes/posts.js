var express = require('express');
var async = require("async");
var router = express.Router();
var db = require('./../config/db');

/* GET posts page. */
router.get('/', function(req, res, next) {
  var user_id = req.session.uid;

  db.query("SELECT p.*, COUNT(DISTINCT(c.`CommentID`)) AS CommentsCount, COUNT(DISTINCT(l.`LikeID`)) AS LikesCount, IF(ml.`LikeID`, 1, 0) AS MyLikeStatus FROM posts  p \n"+
    "LEFT JOIN `comments` c ON c.`PostFKID`=p.`PostID` AND c.Status = 'ACTIVE' \n"+
    "LEFT JOIN `likes` l ON l.`PostFKID`= p.`PostID` AND l.`Type`='POST' AND l.Status = 'ACTIVE' \n"+
    "LEFT JOIN `likes` ml ON ml.`PostFKID`= p.`PostID` AND ml.`Type`='POST' AND ml.Status = 'ACTIVE'  AND ml.`UserFKID`=? \n"+
    "WHERE p.Status = 'ACTIVE' \n"+
    "GROUP BY `PostID`\n"+
    "ORDER BY PostID DESC", [user_id], function(err, result) {
    if (err) throw err;
    return res.render('posts', { username: req.session.name, posts: result });
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

  db.query("SELECT p.*, COUNT(DISTINCT(c.`CommentID`)) AS CommentsCount, COUNT(DISTINCT(l.`LikeID`)) AS LikesCount, IF(ml.`LikeID`, 1, 0) AS MyLikeStatus FROM posts  p \n"+
    "LEFT JOIN `comments` c ON c.`PostFKID`=p.`PostID` AND c.Status = 'ACTIVE' \n"+
    "LEFT JOIN `likes` l ON l.`PostFKID`= p.`PostID` AND l.`Type`='POST' AND l.Status = 'ACTIVE' \n"+
    "LEFT JOIN `likes` ml ON ml.`PostFKID`= p.`PostID` AND ml.`Type`='POST' AND ml.Status = 'ACTIVE'  AND ml.`UserFKID`=? \n"+
    "WHERE p.Status = 'ACTIVE' AND p.PostID = ? \n"+
    "GROUP BY `PostID`", [user_id, post_id], function(err, result) {
    if (err) throw err;
    db.query("SELECT c.*, u.Name as UserName, COUNT(DISTINCT(l.`LikeID`)) AS LikesCount, IF(ml.`LikeID`, 1, 0) AS MyLikeStatus FROM comments c \n"+
      "LEFT JOIN `users` u ON u.`UserID`= c.`UserFKID` \n"+
      "LEFT JOIN `likes` l ON l.`CommentFKID`= c.`CommentID` AND l.`Type`='COMMENT' AND l.Status = 'ACTIVE' \n"+
      "LEFT JOIN `likes` ml ON ml.`CommentFKID`= c.`CommentID` AND ml.`Type`='COMMENT' AND ml.Status = 'ACTIVE'  AND ml.`UserFKID`=? \n"+
      "WHERE c.Status = 'ACTIVE' AND c.ParentFKID = 0 AND c.PostFKID = ? \n"+
      "GROUP BY `CommentID`\n"+
      "ORDER BY CommentID DESC", [user_id, post_id], function(err, comment_result) {
        var comments_data = [];
        async.forEachOfSeries(comment_result, (value, key, callback) => {
          var sub_comments = [];

          db.query("SELECT c.*, u.Name as UserName, COUNT(DISTINCT(l.`LikeID`)) AS LikesCount, IF(ml.`LikeID`, 1, 0) AS MyLikeStatus FROM comments c \n"+
            "LEFT JOIN `users` u ON u.`UserID`= c.`UserFKID` \n"+
            "LEFT JOIN `likes` l ON l.`CommentFKID`= c.`CommentID` AND l.`Type`='COMMENT' AND l.Status = 'ACTIVE' \n"+
            "LEFT JOIN `likes` ml ON ml.`CommentFKID`= c.`CommentID` AND ml.`Type`='COMMENT' AND ml.Status = 'ACTIVE'  AND ml.`UserFKID`=? \n"+
            "WHERE c.Status = 'ACTIVE' AND c.ParentFKID = ? \n"+
            "GROUP BY `CommentID`\n"+
            "ORDER BY CommentID DESC", [user_id, value.CommentID], function(err, sub_comment_result) {
              value.SubComments = sub_comment_result;
              comments_data.push(value);
              return callback();
          });
      }, err => {
          if (err) console.error(err.message);
          return res.render('post_details', { username: req.session.name, post_details: result[0], comments: comments_data });
      });
    });
  });
});

/* POST post create page. */
router.post('/post-create', function(req, res, next) {
  var title = req.body.title;
  var details = req.body.details;
  var user_id = req.session.uid;
  var status = "ACTIVE";
  db.query('INSERT INTO posts (UserFKID, Title, Description, Status) VALUES (?, ?, ?, ?)', [user_id, title, details, status], function(err, result) {
    if (err) throw err;
    return res.redirect('/posts');
  });
});

/* POST post like page. */
router.post('/like-post', function(req, res, next) {
  var post_id = req.body.post_id;
  var user_id = req.session.uid;
  var status = "ACTIVE";
  db.query('INSERT INTO likes (Type, UserFKID, PostFKID, CommentFKID, Status) VALUES (?, ?, ?, ?, ?)', ["POST", user_id, post_id, 0, status], function(err, result) {
    if (err) throw err;
    return res.json({"status": true, "message": "Liked successfully!"});
  });
});

/* POST comment like page. */
router.post('/like-comment', function(req, res, next) {
  var comment_id = req.body.comment_id;
  var user_id = req.session.uid;
  var status = "ACTIVE";
  db.query('INSERT INTO likes (Type, UserFKID, PostFKID, CommentFKID, Status) VALUES (?, ?, ?, ?, ?)', ["COMMENT", user_id, 0, comment_id, status], function(err, result) {
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
  db.query('INSERT INTO comments (UserFKID, PostFKID, Message, ParentFKID, Status) VALUES (?, ?, ?, ?, ?)', [user_id, post_id, message, parent_id, status], function(err, result) {
    if (err) throw err;
    return res.json({"status": true, "message": "Commented successfully!"});
  });
});

module.exports = router;
