var express = require('express');
var router = express.Router();
var db = require('./../config/db');

const MongoClient = require('mongodb').MongoClient;
var dbo;
MongoClient.connect('mongodb://localhost:27017/', (err, db) => {
  if (err) throw err;
  dbo = db.db("socialmedia");
})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

/* POST login page. */
router.post('/login', function(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  var status = "ACTIVE";

  dbo.collection("users").find({email: email, password: password, status: status}).toArray(function(err, chkresult){
    if (err) throw err;
    if(chkresult.length > 0){
      req.session.uid = chkresult[0]._id;
      req.session.name = chkresult[0].name;
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

  dbo.collection("users").find({email: email}).toArray(function(err, chkresult){
    if (err) throw err;
    if(chkresult.length == 0){
      var userobj = { name: name, email: email, password: password, status: status };
      dbo.collection("users").insertOne(userobj, function(err, result) {
        if (err) throw err;
        req.session.uid = result.insertedId;
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
