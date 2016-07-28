var http = require('http');
var fs = require('fs');

new http.Server(function(req, res){
	if (req.url == '/big.html'){
		var file = new fs.ReadStream('big.html');
		sendFile(file, res);
	} else {
		res.end('file not found')
	}
}).listen(1337);

function sendFile(file, res){
	file.pipe(res);
	file.pipe(process.stdout);

	res.on('close', function(){
		file.destroy();
	})
	// file.on('readable', write);

	// function write(){
	// 	var fileContent = file.read();

	// 	if (fileContent && !res.write(fileContent)){
	// 		file.removeListener('readable', write);
	// 		res.once('drain', function(){
	// 			file.on('readable', write);
	// 			write();
	// 		});
	// 	}
	// }
	// file.on('end', function(){
	// 	res.end();
	// });
}