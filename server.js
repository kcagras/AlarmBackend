var express 		= require('express');
var app     		= express();
var morgan			= require ('morgan');
var PythonShell 	= require ('python-shell');
var fs				= require ('fs');
var gcm				= require ('node-gcm');

var dir				= '/home/pi/AlarmBackend/status.txt';
var port = process.env.PORT || 8080;
var token;
var apikey;

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

fs.readFile('/home/pi/AlarmBackend/apikey.txt', function(err, data) {
	if (err) throw err; // Fail if the file can't be read.
	apikey = data;
	
	fs.readFile('/home/pi/AlarmBackend/token.txt', function(err, newdata) {
		if (err) throw err; // Fail if the file can't be read.
		token = newdata;
	});
});

function sendTestMsg() {
	var message = new gcm.Message({
		data: { key1: 'msg1'}
	});
	var sender = new gcm.Sender(apikey);
	var regTokens = [];
	regTokens.push(token);
	
	sender.send(message, {regToken: regTokens}, function (err, response) {
		if (err) console.log(err);
		else console.log(response);
	});
}

sendTestMsg();

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
// API-ROUTE TO SET PUSH
//================================

apiRoutes.get('/push', function(req, res) {
	
	fs.writeFile('/home/pi/AlarmBackend/token.txt', req.query.token, function(err) {
		if (err) throw err; // Fail if the file can't be read.
		res.status(200).send();
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
			if (req.query.from == 'nfc') {
				console.log('From nfc, add site to response');
			}
			res.status(200).send();
		});
	}
	else {
		fs.writeFile(dir, 'stop', function (err) {
			if (err) throw err;
			enabled = false;
			if (req.query.from == 'nfc') {
				console.log('From nfc, add site to response');
			}
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
