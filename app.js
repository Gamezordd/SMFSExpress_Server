var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');
const dotenv = require('dotenv').config;
const MongoStore = require('connect-mongo')(session);
const {config} = require('./config');
const auth = require('./authenticate');

const {AdminRouter, InternRouter} = require('./routes');
const passport = require('passport');
const { Admin } = require('./models');
const { authenticate } = require('passport');

var connect = mongoose.connect(config.mongoUrl, {useFindAndModify: false});
var connectcreate = mongoose.createConnection(config.mongoUrl);
connect.then((db) => {
  console.log("Connected to Server");
}, (err) => {console.error(err);});

const sessionStore = new MongoStore({mongooseConnection: connectcreate, collection:'sessions'});


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: 'StudyMonk', resave: false, saveUninitialized: true, store: sessionStore}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());


app.get('/', function(req, res) {
  console.log(req.session);
  console.log(req.user);
  if(req.session.passport){
    console.log("has cookie", req.session.passport.user);
    Admin.findOne({username: req.session.passport.user}, (err, user) => {
      if(err){
          console.log("error")
      }
      else if(user){
          console.log("_id: ", req.session);
          const token = auth.getToken({_id:req.user._id});
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, token: token, status: 'Welcome Back!'});
      }
    });
  }
  else{
    console.log("no cookie", req.session);
    res.statusCode = 401;
    res.end();
  }
});
app.use('/admin', AdminRouter);
app.use('/Internship', InternRouter);

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

const port = process.env.PORT || 3000;

app.listen(port);

module.exports = app;
