var config = require('../config');
var ios = require('socket.io-express-session');
var connect = require('connect'); 
var async = require('async');
var cookie = require('cookie'); 
var cookieParser = require('cookie-parser');
var sessionStore = require('../lib/sessionStore');
var HttpError = require('../error').HttpError;
var User = require('../models/user').User;

function loadUser(session, callback) {

  if (!session.user) {
    return callback(null, null);
  }


  User.findById(session.user, function(err, user) {
    if (err) return callback(err);

    if (!user) {
      return callback(null, null);
    }
    callback(null, user);
  });

}

module.exports = function(server, session) {
  var io = require('socket.io').listen(server);

  io.use(ios(session));
  io.sockets.on('connection', function(socket) {

    loadUser(socket.handshake.session, function(err, user){

	    socket.broadcast.emit('join', user.username);

	    socket.on('message', function(text, cb) {
	      socket.broadcast.emit('message', user.username, text);
	      cb && cb();
	    });

	    socket.on('disconnect', function() {
	      socket.broadcast.emit('leave', user.username);
	    });
	});    
  });

  return io;
};