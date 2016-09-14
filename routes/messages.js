var express = require('express');
var router = express.Router();
var knex = require('../lib/knex');

router.get('/messages/:user_id', function (req, res, next) {
  knex('messages').where('to_user', req.params.id).then(function (messages){
    res.json(messages);
  })
});

module.exports = router;
