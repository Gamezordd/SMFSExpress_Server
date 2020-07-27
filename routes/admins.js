var express = require('express');
var router = express.Router();
const passport = require('passport');
const authenticate = require('../authenticate');
const {Admin} = require('../models');

router.get('/', function(req, res, next) {
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

router.post('/login', passport.authenticate('local'), (req, res) => {
  console.log("inside");
  const token = authenticate.getToken({_id: req.user._id});
  req.session.username = req.body.email;
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'Successfully logged in!'});
});

router.get('/logout', authenticate.verifyUser, (req, res) => {
  req.session.destroy();
  res.clearCookie('session-id');
  res.json({logout: true});
});

module.exports = router;
