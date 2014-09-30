var path = require('path');
var csrf = require('csurf');
var morgan = require('morgan');
var session = require('express-session');
var express = require('express');
var compress = require('compression');
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');
var cookieParser = require('cookie-parser');
var errorHandler = require('errorhandler');
var methodOverride = require('method-override');

var app = express();
var env = process.env.NODE_ENV || 'development';
var routes = require('./routes');

app.use(morgan('dev'));
app.use(compress());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(methodOverride());

app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'views'));

// CSRF
app.use(cookieParser());
app.use(session({ secret: '234D&CSSF' }));
app.use(csrf());
app.use(function(request, response, next) {
    response.cookie('XSRF-TOKEN', request.csrfToken());
    response.locals.csrf_token = request.csrfToken();
    next();
});

app.use(serveStatic(path.join(__dirname, 'public')));


if (env === 'development') {
    app.use(errorHandler());
}

app.get('/', routes.index);
app.get('/parse', routes.parse);

app.listen(process.env.PORT || 5005, function() {
    console.log('Express server listening on port ' + (process.env.PORT || 5005));
});
