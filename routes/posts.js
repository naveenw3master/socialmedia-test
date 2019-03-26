var express = require('express');
var router = express.Router();

/* GET posts page. */
router.get('/', function(req, res, next) {
  res.render('posts', { title: 'Posts' });
});

/* GET new post page. */
router.get('/new-post', function(req, res, next) {
  res.render('new_post', { title: 'New Post' });
});

/* GET post details page. */
router.get('/post-details', function(req, res, next) {
  res.render('post_details', { title: 'Post Details' });
});

/* POST post create page. */
router.post('/post-create', function(req, res, next) {
  res.redirect('/posts');
});

module.exports = router;
