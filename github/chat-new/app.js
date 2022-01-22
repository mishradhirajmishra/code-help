const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const flash = require('connect-flash');
const session = require('express-session');
const fileUpload = require('express-fileupload');
const key = require('./config/key');
const passport = require('passport');
const expHbs = require('express-handlebars');

require('./database/connection');
require('./config/passport-local-setting')(passport);
const cookieSession = require('cookie-session');


const app = express();
// view engine setup
// app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs',expHbs({defaultLayout:'layout',extname:'.hbs'}))
app.set('view engine', '.hbs');
// files upload
app.use(fileUpload());
// set up session cookies
app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: [key.session_key]
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
/*================================================================================================================*/
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/tether/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
/*================================================================================================================*/
// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user;
  res.locals.authrised = req.isAuthenticated();
  next();
});

// router middleware
app.use('/', require('./routes/index-router'));

app.use('/auth', require('./routes/auth-router'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
