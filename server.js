var express 		= require('express');
var http 			= require ('http');
var app     		= express();
var morgan			= require ('morgan');

var port = process.env.PORT || 8080;

app.use(morgan('dev'));
var apiRoutes = express.Router();

//================================
// API-ROUTE FOR ENDISABLING
//================================

apiRoutes.get('/endisable', function(req, res) {
	res.status(200).send();
});

app.use('/', apiRoutes);

app.listen(port);
