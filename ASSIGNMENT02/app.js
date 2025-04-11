var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// Import configurations file and mongoose to connect to DB
var configs = require('./configs/globals.js');
var passport = require("./configs/passportConfig");
var mongoose = require('mongoose');
var session = require("express-session");
const moment = require('moment');
var hbs = require('hbs');

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var paymentsRouter = require('./routes/payments');
var userprofileRouter = require('./routes/userprofile');
var { isAuthenticated, isProfileComplete } = require('./routes/middlewares');

var app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

hbs.registerHelper('formatDate', function(date) {
  return moment(date).format('DD/MM/YYYY'); // o el formato que prefieras
});

hbs.registerHelper('eq', function (a, b) {
  return a === b;
});

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.user = req.user;  // Pasa el usuario autenticado a todas las vistas
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/payments', isAuthenticated, isProfileComplete, paymentsRouter);
app.use('/userprofile', isAuthenticated, isProfileComplete, userprofileRouter);

hbs.registerHelper('formatCurrency', function (value) {
  return `$ ${Number(value).toLocaleString('es-CL')}`;
});

// Connect to MongoDB using Mongoose
mongoose.connect(configs.ConnectionStrings.MongoDB)
  .then(() => { console.log('Connected to MongoDB'); })
  .catch(err => { console.error('MongoDB connection error:', err); });

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
  res.render('error', { title: '404 Not Found' });
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
