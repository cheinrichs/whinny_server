var express = require('express');
var router = express.Router();
var knex = require('../lib/knex.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Whinny Server' });
});

router.get('/messages/:user_id', function (req, res, next) {
  var result = {
    messages: [],
    users: [],
    groups: [],
    broadcasts: []
  };
  knex('messages').where('to_user', req.params.user_id)
  .orWhere('from_user', req.params.user_id)
  .then(function (messages){
    //get all of a users messages
    result.messages = messages;
    //look through those messages for each unique user id, then get that specific
    //user object and stick it into users
    var user_ids = [];
    var group_ids = [];
    var broadcast_ids = [];
    for (var i = 0; i < messages.length; i++) {
      user_ids.push(messages[i].to_user);
      user_ids.push(messages[i].from_user);
      group_ids.push(messages[i].group_id);
      broadcast_ids.push(messages[i].broadcast_id);
    }

    //run through the collected users, groups, and broadcasts and make sure they're unique
    user_ids = user_ids.unique();
    group_ids = group_ids.unique();
    broadcast_ids = broadcast_ids.unique();

    //look through users and find each corresponding user object and add it to
    //the final result object
    knex('users').whereIn('user_id', user_ids).then(function (users) {
      result.users = users;
    }).then(function () {
      knex('groups').whereIn('group_id', group_ids).then(function (groups) {
        result.groups = groups;
      }).then(function () {
        knex('broadcasts').whereIn('broadcast_id', broadcast_ids).then(function (broadcasts) {
          result.broadcasts = broadcasts;
        }).then(function () {
          res.json(result);
        })
      })
    })
    //look through groups and find each corresponding group object and add it to
    //the final result object

    //look through messages for each broadcast id, then get that specific broadcast
    //object and stick it in broadcasts

  })
});

router.get('/user/:user_phone', function (req, res, next) {
  knex('users').where('phone', req.params.user_phone).then(function (result) {
    res.json(result);
  });
})

Array.prototype.unique = function() {
    var o = {};
    var i;
    l = this.length;
    r = [];
    for(i=0; i<l;i+=1){
      if(this[i] === null) continue;
      o[this[i]] = this[i];
    }
    for(i in o){
      r.push(o[i]);
    }
    return r;
};


module.exports = router;
