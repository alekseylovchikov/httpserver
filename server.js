var http = require('http'),
	fs = require('fs'),
	url = require('url'),
	path = require('path');

var mimeTypes = {
	"html": "text/html",
	"jpeg": "image/jpeg",
	"jpg": "image/jpeg",
	"png": "image/png",
	"js": "text/javascript",
	"css": "text/css"
};

http.createServer(function(req, res) {
	var uri = url.parse(req.url).pathname;
	console.log('uri: ' + uri);
	var fileName = path.join(process.cwd(), unescape(uri));
	console.log('file name: ' + fileName);
	console.log('Loading: ' + uri);
	var stats;

	try {
		stats = fs.lstatSync(fileName);
		console.log('stats: ' + stats);
	} catch (e) {
		fs.readFile('404.html', function(err, html) {
			if (err) {
				throw err;
			}

			res.writeHead(404, {'Content-Type': 'text/html'});
			res.write(html);
			res.end();
		});
		return;
	}


	if (stats.isFile()) {
		var mimeType = mimeTypes[path.extname(fileName).split('.').reverse()[0]];
		res.writeHead(200, {'Content-Type': mimeType});

		var fileStream = fs.createReadStream(fileName);
		fileStream.pipe(res);
	} else if (stats.isDirectory()) {
		res.writeHead(302, {
			'Location': 'index.html'
		});
		res.end();
	} else {
		res.writeHead(500, {'Content-Type': 'text/plain'});
		res.write('500 Internal Error\n');
		res.end();
	}

}).listen(3000);