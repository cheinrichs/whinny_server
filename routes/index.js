var express = require('express');
var router = express.Router();
var knex = require('../lib/knex.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Whinny Server' });
});

router.get('/messages/:user_id', function (req, res, next) {
  knex('messages').where('to_user', req.params.user_id)
  .orWhere('from_user', req.params.user_id)
  .then(function (messages){
    res.json(messages);
  })
});


module.exports = router;
