var express = require('express');
var http = require('http');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var HttpError = require('./error').HttpError;
var config = require('./config')
var mongoose = require('./lib/mongoose')



var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

app.engine('ejs', require('ejs-locals'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

var MongoStore = require('connect-mongo')(session);
app.use(session({
  secret: config.get('session:secret'),
  key: config.get('session:sid'),
  cookie: config.get('session:cookie'),
  store: new MongoStore({mongooseConnection: mongoose.connection})
}));

app.use(require('./middleware/loadUser'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(require('./middleware/sendHttpError'))

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

app.use(function(err, req, res, next) {
  if (typeof err == 'number'){
    err = new HttpError(err);
  }
  if (err instanceof HttpError){
    res.sendHttpError(err);
  } else {
    if (app.get('env') === 'development') {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err
      })
    } else {
      err = new HttpError(500);
      res.sendHttpError(err);
    }  
  } 
});

http.createServer(app).listen(config.get('port'), function(){
  console.log('Express server listening on port ' + config.get('port'));
});
//module.exports = app;