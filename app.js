'use strict';

require('./config/config');

global.MONGODB_URI = process.env.MONGODB_URI;

const express = require('express');
const app = express();

const logger = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

let PORT = process.env.PORT || 8000;

// EJS MIDDLEWARE
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// MIDDLEWARES
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  'secret': 'VideoIdeasSecret',
  saveUninitialized: true,
  resave: true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Global Variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// ROUTES IMPORT
let indexRoute = require('./routes/indexRoute');
let ideaRoute = require('./routes/ideaRoute');
let usersRoute = require('./routes/usersRoute');

// USING ROUTES
app.use('/', indexRoute);
app.use('/ideas', ideaRoute);
app.use('/users', usersRoute);

// 404 page
app.get('*', (req, res, next) => {
  res.send('404 not found');
});

app.listen(PORT, () => {
  console.log(`app listening at ${PORT}`);
});
