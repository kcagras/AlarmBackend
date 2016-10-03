var express 		= require('express');
var app     		= express();
var morgan			= require ('morgan');
var PythonShell 	= require ('python-shell');
var fs				= require ('fs');

var dir				= '/home/pi/AlarmBackend/status.txt';
var port = process.env.PORT || 8080;

app.use(morgan('dev'));
var apiRoutes = express.Router();
var enabled = true;

fs.writeFile(dir, 'start', function (err) {
	if (err) throw err;
});

var pyshell = new PythonShell('import_detector_v_0_2.py', function (err) {
		if (err) throw err;
	});


pyshell.on('message', function(msg) {
	console.log("Received from Python: "+msg);

});

//================================
// API-ROUTE TO GET STATUS
//================================

apiRoutes.get('/status', function(req, res) {
	
	fs.readFile('/home/pi/AlarmBackend/status.txt', function(err, data) {
		if (err) throw err; // Fail if the file can't be read.
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.end(data);
	});
});


//================================
// API-ROUTE FOR ENDISABLING
//================================

apiRoutes.get('/endisable', function(req, res) {

	if (!enabled) {
		fs.writeFile(dir, 'start', function (err) {
			if (err) throw err;
			enabled = true;
			res.status(200).send();
		});
	}
	else {
		fs.writeFile(dir, 'stop', function (err) {
			if (err) throw err;
			enabled = false;
			res.status(200).send();
		});
	}
});

//================================
// API-ROUTE FOR GETTING IMAGES
//================================

apiRoutes.get('/images', function(req, res) {
	
	fs.readFile('/var/www/photo/'+req.query.name, function(err, data) {
		if (err) throw err; // Fail if the file can't be read.
		res.writeHead(200, {'Content-Type': 'image/jpeg'});
		res.end(data);
	});
});

apiRoutes.get('/imagelist', function(req, res) {

	fs.readdir('/var/www/photo/', function(err, files) {
		if (err) throw err; // Fail if the file can't be read.
		res.end(''+files);
	});
});

app.use('/', apiRoutes);

app.listen(port);
