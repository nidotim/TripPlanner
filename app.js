
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var util = require('util');
var partials = require('express-partials')


var MongoStore = require('connect-mongo')(express);
var settings = require('./settings');

var mongodb = require('mongodb');

var mongodbServer = new mongodb.Server('localhost', 27017, { auto_reconnect: true, poolSize: 10 });
var db = new mongodb.Db('mydb', mongodbServer);


var app = express();

// all environments
//app.configure(function(){
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser());

	app.use(express.session({
		secret: settings.cookieSecret,
		store: new MongoStore({
			db: settings.db
		})
	}));

	app.use(function(req, res, next){
    	res.locals.user = req.session.user;
    	res.locals.error = req.session.error;
    	res.locals.success = req.session.success;
    	next();
  	});
	app.use(partials());
	app.use(app.router);
	//app.use(express.router(routes));
	
routes(app);

	//app.use(express.router(routes));
	app.use(express.static(path.join(__dirname, 'public')));
//});




// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//Tim start
var users = {
	'byvoid':{
		name: 'Carbo',
		website: 'http://www.byvoid.com'
	}
};


//Tim end
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
