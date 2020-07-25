const dboperations = require('../operations');
const express = require('express');
const router = express.Router();
const authenticate = require('../authenticate');

const {Internship} = require('../models');


router.get('/', (req, res, next) => {
    var response = [];
    Internship.find({}).exec((err, res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(res);
    });
    
});

router.post('/', authenticate.verifyUser, (req, res, next) => {
    const newPost = {name: req.body.name, company: req.body.company, details: req.body.details, class: req.body.class, pointsBreakup: req.body.pointsBreakup};
    Internship.create(newPost).then((post) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(post).end();
    }).catch(() => {
        res.statusCode =  500;
        res.send('There was an error creating post').end();
    });
});


module.exports = router;