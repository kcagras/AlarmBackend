var express 		= require('express');
var app     		= express();
var morgan			= require ('morgan');
var PythonShell 	= require ('python-shell');

var options = {
	scriptPath: './python'
};

var port = process.env.PORT || 8080;
var enabled = false;

app.use(morgan('dev'));
var apiRoutes = express.Router();

var pyshell = new PythonShell('import_detector_v_0_1.py', { mode: 'text'});


pyshell.on('message', function(msg) {
	console.log(""+msg);
	pyshell.end(function (err) {
		if (err) throw err;
		console.log('finished');
	});
});


/*

//================================
// API-ROUTE FOR ENDISABLING
//================================

apiRoutes.get('/endisable', function(req, res) {
	if (!enabled) {
		PythonShell.run('import_detector_v_0_1.py', options, function (err, results) { 
			if (err) 
				throw err;
		});
		enabled = true;
		console.log('Enabled Movement Detection.');
		res.status(200).send();
	}
	else {
		PythonShell.end('import_detector_v_0_1.py', options, function (err, results) { 
			if (err) 
				throw err;
		});		
		enabled = false;
		console.log('Disabled Movement Detection.');
		res.status(200).send();
	}
});

app.use('/', apiRoutes);

app.listen(port);
*/
