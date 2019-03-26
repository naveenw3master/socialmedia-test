var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

/* POST login page. */
router.post('/login', function(req, res, next) {

  res.redirect('/posts');
});

/* POST register page. */
router.post('/register', function(req, res, next) {

  res.redirect('/posts');
});

/* GET register page. */
router.get('/logout', function(req, res, next) {

  res.redirect('/');
});

module.exports = router;
