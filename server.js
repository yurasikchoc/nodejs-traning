var log = require('./logger')(module);
var User = require('./user');

function run(){
  var yura = new User('yura');
  var ne_yura = new User('ne_yura');

  yura.hello(ne_yura);
  log('run successfull');
}

if (module.parent) {
  exports.run = run;
} else {
  run();
}
