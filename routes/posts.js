var express = require('express');
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
    res.render('posts', { username: req.session.name, posts: result });
  });
});

/* GET new post page. */
router.get('/new-post', function(req, res, next) {
  res.render('new_post', { username: req.session.name });
});

/* GET post details page. */
router.get('/post-details', function(req, res, next) {
  res.render('post_details', { username: req.session.name });
});

/* POST post create page. */
router.post('/post-create', function(req, res, next) {
  var title = req.body.title;
  var details = req.body.details;
  var user_id = req.session.uid;
  var status = "ACTIVE";
  db.query('INSERT INTO posts (UserFKID, Title, Description, Status) VALUES (?, ?, ?, ?)', [user_id, title, details, status], function(err, result) {
    if (err) throw err;

    res.redirect('/posts');
  });
});

module.exports = router;
