const express = require('express');
const router = express.Router();
const authenticate = require('../authenticate');

const {Internship} = require('../models');


router.get('/', (req, res, next) => {
    Internship.find({}).exec((err, doc) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(doc);
    });
});

router.post('/', authenticate.verifyUser, (req, res) => {
    const newPost = {name: req.body.name, company: req.body.company, details: req.body.details, class: req.body.class, pointsBreakup: req.body.pointsBreakup};
    Internship.create(newPost).then((post) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(post).end();
    }).catch((err) => {
        console.log("error: ", err);
        res.statusCode =  500;
        res.send('There was an error creating post').end();
    });
});


module.exports = router;