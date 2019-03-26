var express = require('express');
var router = express.Router();

/* GET posts page. */
router.get('/', function(req, res, next) {
  res.render('posts', { username: req.session.name });
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
  res.redirect('/posts');
});

module.exports = router;
