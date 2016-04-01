var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var session    = require('express-session');
var flash = require('connect-flash');
var MongoStore = require('connect-mongo')(session); 
var settings = require('./settings'); 

var index = require('./routes/index');
var reg = require('./routes/reg');
var login = require('./routes/login');
var logout = require('./routes/logout');
var post = require('./routes/post');
var user = require('./routes/user');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(partials());

app.use(logger('dev'));
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({
    secret: settings.cookieSecret,
     store: new MongoStore({
        url:'mongodb://localhost/'+settings.db
    })
}));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

    app.use(function(req, res, next){
      res.locals.user = req.session.user;
      var error = req.flash('error');
      res.locals.error = error.length ? error : null;

      var success = req.flash('success');
      res.locals.success = success.length ? success : null;
      next();
    });


app.use('/', index); // 主页
app.use('/reg', reg); // 注册
app.use('/login', login); // 登陆
app.use('/logout', logout); // 登出
app.use('/post', post);
app.use('/u', user);


/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
