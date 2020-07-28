var express = require('express');
var router = express.Router();
const cookieParser = require('cookie-parser');
const passport = require('passport');
const authenticate = require('../authenticate');
const {Admin} = require('../models');
const cors = require('cors');

router.use(cookieParser());

router.get('/', function(req, res, next) {
  if(req.session.custId){
    req.session.custId++;
    console.log("has cookie", req.session.custId);
  }
  else{
    req.session.cusiId = 1;
    console.log("no cookie");
  }
  res.send('respond with a resource');
});

router.post('/signup', (req, res, err) =>{
  Admin.register(new Admin({username: req.body.username}),
    req.body.password, (err, user) => {
      if(err){
        res.statusCode = 409;
        res.setHeader('Content-Type', 'application/json');
        return res.json({err: err}).end();
      }
      else{
        user.save((err, user) => {
          if(err){
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({err: err});
            return;
          }
        });
        passport.authenticate('local')(req, res, () => {
          req.session.user = true;
          req.session.username = req.body.email;
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, status: "Registration Success"});
        });
      }
    });
});

router.post('/login', cors({origin: 'http://localhost:3001'}), passport.authenticate('local'), (req, res) => {
  console.log("inside");
  const token = authenticate.getToken({_id: req.user._id});
  req.session.cookie.custId = req.user._id;
  res.cookie('studymonk', req.user._id, {
    maxAge: 60*60*2*60,
    httpOnly: true,
    sameSite: true,
    secure: false
  });
  console.log("set new cookie");
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'Successfully logged in!'}).end();
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.clearCookie('studymonk');
  res.json({logout: true});
});

module.exports = router;
