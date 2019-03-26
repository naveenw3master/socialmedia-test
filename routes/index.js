var express = require('express');
var router = express.Router();
var db = require('./../config/db');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

/* POST login page. */
router.post('/login', function(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  var status = "ACTIVE";
  db.query('SELECT * FROM users WHERE Email = ? AND Password = ? AND Status = ?', [email, password, status], function(err, chkresult) {
    if (err) throw err;

    if(chkresult.length > 0){
      req.session.uid = chkresult[0].UserID;
      req.session.name = chkresult[0].Name;
      res.redirect('/posts');
    } else {
      res.redirect('/');
    }
  });
});

/* POST register page. */
router.post('/register', function(req, res, next) {
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;
  var status = "ACTIVE";
  db.query('SELECT * FROM users WHERE Email = ?', [email], function(err, chkresult) {
    if (err) throw err;

    if(chkresult.length == 0){
      db.query('INSERT INTO users (Name, Email, Password, Status) VALUES (?, ?, ?, ?)', [name, email, password, status], function(err, result) {
        if (err) throw err;
        req.session.uid = result.insertId;
        req.session.name = name;
        res.redirect('/posts');
      });
    } else {
      res.redirect('/');
    }
  });
});

/* GET register page. */
router.get('/logout', function(req, res, next) {
  req.session.destroy(function(err) {
    res.redirect('/');
  })
});

module.exports = router;
