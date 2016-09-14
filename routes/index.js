var express = require('express');
var router = express.Router();
var knex = require('../lib/knex.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Whinny Server' });
});

module.exports = router;
