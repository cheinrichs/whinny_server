var express = require('express');
var router = express.Router();
var knex = require('../lib/knex.js');

var twilio = require('twilio');

var accountSid = process.env.TWILIO_ACCOUNT_SID;
var authToken = process.env.TWILIO_AUTH_TOKEN;

var textClient = new twilio.RestClient(accountSid, authToken);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Whinny Server' });
});

router.get('/joinWhinny/:first_name/:last_name/:phone/:licenseAgreement', function (req, res, next) {
  if(req.params.licenseAgreement === 'false' || req.params.licenseAgreement === false) res.json({error: 'invalid license agreement 1'});
  if (req.params.first_name.length === 0 || req.params.last_name.length === 0) res.json({error: 'invalid user name first or last'})

  knex('users').where('phone', req.params.phone).then(function (user) {

    var confirmationCode = generateConfirmationCode();

    if(user.length > 0){
      knex('users').where('phone', req.params.phone).update({confirmation_code: confirmationCode}).then(function () {
        confirmationCodeText(req.params.phone, confirmationCode);
        res.json(user);
      })
    } else {


      knex('users').insert({
        email: null,
        phone: req.params.phone,
        first_name: req.params.first_name,
        last_name: req.params.last_name,
        password: null,
        portrait_link: 'http://www.boostinspiration.com/wp-content/uploads/2010/09/11_victory_bw_photography.jpg',
        message_notifications: true,
        group_notifications: false,
        broadcast_notifications: true,
        country_code: 1,
        account_created: knex.fn.now(),
        user_latitude: '40.167207',
        user_longitude: '-105.101927',
        verified: false,
        last_login: knex.fn.now(),
        banned: false,
        ban_timestamp: null,
        discipline: null,
        confirmation_code: confirmationCode,
        user_type: 'App',
        ip_address: null,
        tutorial_1: true,
        tutorial_2: true,
        tutorial_3: true,
        tutorial_4: true,
        tutorial_5: true,
        EULA: true,
        EULA_date_agreed: knex.fn.now()
      }).returning('*').then(function (user) {
        //send a text with twilio
        confirmationCodeText(req.params.phone, confirmationCode);
        res.json(user)
      });
    }
  })
})

router.get('/log_in/:phone', function (req, res, next) {
  if(!req.params.phone) res.json({status: 'denied'});
  knex('users').where('phone', req.params.phone).first().then(function (user) {
    res.json(user);
  })
})

router.get('/confirmCode/:user_id/:confirmation_code', function (req, res, next) {
  knex('users').where('user_id', req.params.user_id).first().then(function (user) {
    //TODO set a flag in the database that user has been confirmed
    //TODO if the user is null handle it
    if(user.confirmation_code === req.params.confirmation_code.toLowerCase()){
      res.json({confirmed: 'true'});
    } else {
      res.json({confirmed: 'false'});
    }
  })
})

router.get('/messages/:user_id', function (req, res, next) {
  var result = {
    messages: [],
    users: {},
    groups: {},
    broadcasts: {}
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
      for (var i = 0; i < users.length; i++) result.users[users[i].user_id] = users[i];
    }).then(function () {
      //look through groups and find each corresponding group object and add it to
      //the final result object
      knex('groups').whereIn('group_id', group_ids).then(function (groups) {
        for (var i = 0; i < groups.length; i++) result.groups[groups[i].group_id] = groups[i];
      }).then(function () {
        //look through messages for each broadcast id, then get that specific broadcast
        //object and stick it in broadcasts
        knex('broadcasts').whereIn('broadcast_id', broadcast_ids).then(function (broadcasts) {
          for (var i = 0; i < broadcasts.length; i++) result.broadcasts[broadcasts[i].broadcast_id] = broadcasts[i];
        }).then(function () {
          res.json(result);
        })
      })
    })
  })
});

router.get('/user/:user_phone', function (req, res, next) {
  knex('users').where('phone', req.params.user_phone).then(function (result) {
    res.json(result);
  });
})

router.get('/sendChatMessage/:to_user/:from_user/:content', function(req, res, next){
  knex('messages').insert({
    to_user: req.params.to_user,
    from_user: req.params.from_user,
    message_type: 'chat',
    content: req.params.content,
    read: false,
    sent_in_app: true,
    sent_as_mms: false,
    geographically_limited: false,
    state: null,
    zip: null,
    latitude: null,
    longitude: null
  }).then(function () {
    res.json({created: true});
  })
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

function generateConfirmationCode(){
  var charset = '0123456789abcdefghijklmnopqrstuvwxyz';
  var confirmationCode = "";
  for( var i=0; i < 4; i++ ){
    confirmationCode += charset.charAt(Math.floor(Math.random() * charset.length));
  }

  return confirmationCode;
}

function confirmationCodeText(to_phone, confirmationCode) {
  textClient.sms.messages.create({
    // to: to_phone,
    to: '3035892321',
    from: '+17204087635',
    body: 'Hello! Thank you for registering with Whinny! CONFIRMTATION CODE: ' + confirmationCode,
  }, function (error, message) {
    if(!error){
      console.log("Success! The SID for this SMS message is: ", message.sid);
    } else {
      console.log("There was an error with twilio confirmation code");
    }
  })
}

module.exports = router;
