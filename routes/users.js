var express = require('express');
var ObjectID = require('mongodb').ObjectID;
var HttpError = require('../error').HttpError;
var router = express.Router();

/* GET users listing. */

var User = require('../models/user').User;

router.get('/', function(req, res, next) {
  	User.find({}, function(err, users) {
  		if (err) return next(err); 
  		res.json(users)
  	})
});

router.get('/:id', function(req, res, next) {
  	try {
      var id = new ObjectID(req.params.id);
    } catch (e) {
      return next(404);
    }  
    User.findById(req.params.id, function(err, user) {
  		if (err) return next(err); 
  		if (!user) {
  			next(new HttpError(404, 'User not found'));
  		} else {
  		  res.json(user)
      }
  	})
});


module.exports = router;
