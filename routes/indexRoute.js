'use strict';

let router = require('express').Router();

// INDEX ROUTE
router.get('/', (req, res, next) => {
  res.render('index');
});

// ABOUT ROUTE
router.get('/about', (req, res, next) => {
  res.render('about');
});

module.exports = router;