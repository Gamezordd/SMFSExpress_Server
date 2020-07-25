const dboperations = require('../operations');
const express = require('express');
const router = express.Router();
const authenticate = require('../authenticate');

const {Internship} = require('../models');


router.get('/', (req, res, err) => {
    if(err){
        res.statusCode =  500;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, error: err});
    }
    var response = [];
    dboperations.findDocuments('SMFS', 'Internships', (data) => {
        return data.map(obj => {
            response = response.concat(obj);
        });
    });
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(response);
});

router.post('/', authenticate.verifyUser, (req, res, err) => {
    if(err){
        console.log("error: ", err);
        res.statusCode =  500;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, error: err});
    }
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