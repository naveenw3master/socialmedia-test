var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var path = require('path');
// var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var postsRouter = require('./routes/posts');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'S0c1@1M3d1@',
  cookie: { maxAge: 600000 }
}));

var sess;
app.all('*', checkUser);

function checkUser(req, res, next) {
  if( req.path == '/' || req.path == '/register' || req.path == '/login' ){
    sess = req.session;
    if(sess.uid) {
      return res.redirect('/posts');
    } else {
      return next();
    }
  } else if( req.path == '/logout' ) {
    return next();
  } else {
    sess = req.session;
    if(!sess.uid) {
      return res.redirect('/');
    } else {
      return next();
    }
  }
}

app.use('/', indexRouter);
app.use('/posts', postsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
