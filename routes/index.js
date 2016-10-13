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


router.get('/chatMessages/:user_id', function (req, res, next) {
  var result = {};
  knex('messages').where('to_user', req.params.user_id)
  .orWhere('from_user', req.params.user_id).then(function (messages) {
    result.messages = messages;
    var user_ids = [];
    for (var i = 0; i < messages.length; i++) {
      if(messages[i].from_user) user_ids.push(messages[i].from_user);
      if(messages[i].to_user) user_ids.push(messages[i].to_user);
    }
    user_ids = user_ids.unique();
    knex('users').whereIn('user_id', user_ids).then(function (userObjects) {
      result.userObjects = userObjects;
      res.json(result);
    })
  })
})

router.get('/groupMessages/:user_id', function (req, res, next) {
  var result = {};
  knex('group_memberships').where('user_id', req.params.user_id).pluck('group_id').then(function (memberships) {
    knex('group_memberships').whereIn('group_id', memberships).pluck('user_id').then(function (user_ids) {
      knex('users').whereIn('user_id', user_ids).then(function (userObjects) {
        result.userObjects = userObjects;
        knex('group_messages').whereIn('to_group', memberships).then(function (messages) {
          result.groupMessages = messages;
          knex('groups').whereIn('group_id', memberships).then(function (groupObjects) {
            result.groupObjects = {};
            for (var i = 0; i < groupObjects.length; i++) {
              result.groupObjects[groupObjects[i].group_id] = groupObjects[i];
            }
            res.json(result);
          })
        })
      })
    })
  })
})

router.get('/broadcastMessages/:user_id', function (req, res, next) {
  var result = {};
  knex('broadcast_memberships').where('user_id', req.params.user_id).pluck('broadcast_id').then(function (broadcasts) {
    knex('broadcast_messages').whereIn('to_broadcast', broadcasts).then(function (messages) {

      result.broadcastMessages = messages;

      knex('broadcast_memberships')
      .join('broadcasts', 'broadcast_memberships.broadcast_id', "=", 'broadcasts.broadcast_id')
      .where('user_id', req.params.user_id)
      .then(function (broadcastObjects) {
        result.broadcastObjects = broadcastObjects;
        res.json(result);
      })
    })
  })
})


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

router.get('/sendGroupMessage/:to_group/:from_user/:content', function (req, res, next) {
  knex('group_messages').insert({
    to_group: req.params.to_group,
    from_user: req.params.from_user,
    group_message_content: req.params.content
  }).then(function () {
    res.json({confirmed: true})
  })
})

router.get('/sendBroadcastMessage/:to_broadcast/:from_user/:content', function (req, res, next) {
  knex('broadcast_memberships').where({
    broadcast_id: req.params.to_broadcast,
    user_id: req.params.from_user
  }).first().then(function (membership) {
    if(!membership.admin){
      res.json({confirmed: false});
    } else {
      knex('broadcast_messages').insert({
        to_broadcast: req.params.to_broadcast,
        from_user: req.params.from_user,
        broadcast_message_content: req.params.content
      }).then(function () {
        res.json({confirmed: true})
      })
    }
  })
})

//TODO: change to post
router.get('/createNewChat/:to_phone/:from_user/:content', function (req, res, next) {
  knex('users').where('phone', req.params.to_phone).first().then(function (user) {
    if(user){
      //create a message with user.user_id as a the to user
      console.log("user in the system");
      console.log(user);
      console.log("creating message");
      knex('messages').insert({
        to_user: user.user_id,
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

    } else {
      console.log("user not in the system");
      //create a new user
      console.log("creating user");

      knex('users').insert({
        email: null,
        phone: req.params.to_phone,
        first_name: null,
        last_name: null,
        password: null,
        //TODO: standard portrait link
        portrait_link: 'https://s-media-cache-ak0.pinimg.com/564x/a5/38/e3/a538e3c4163496bfec2a6782b8290a33.jpg',
        message_notifications: true,
        group_notifications: false,
        broadcast_notifications: true,
        country_code: 1,
        account_created: knex.fn.now(),
        user_latitude: '40.167207',
        user_longitude: '-105.101927',
        verified: false,
        last_login: null,
        banned: false,
        ban_timestamp: null,
        discipline: null,
        confirmation_code: generateConfirmationCode(),
        user_type: 'text',
        ip_address: null,
        tutorial_1: true,
        tutorial_2: true,
        tutorial_3: true,
        tutorial_4: true,
        tutorial_5: true,
        EULA: false,
        EULA_date_agreed: null
      }).returning('*').first().then(function (new_user) {
        //Create a message to the new user
        console.log('new user', new_user);
        console.log(new_user.user_id);
        console.log("creating message");
        knex('messages').insert({
          to_user: new_user.user_id,
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
          //send a text message to the given phone number
          knex('users').where('user_id', req.params.from_user).first().then(function (from_user) {
            if(from_user){
              console.log('sending text message');
              sendMms(req.params.to_phone, req.params.content, from_user.first_name, from_user.last_name);
              res.json({created: true, textSent: true});
            } else {
              console.log("couldnt send text message");
              res.json({created:true, textSent: false});
            }
          })
        })
      });
    }
  });
});
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

function sendMms(to_phone, content, from_first_name, from_last_name) {
  textClient.sms.messages.create({
    // to: to_phone,
    to: '+13035892321',
    from: '+17204087635',
    body: content + '\nYou received this message from ' + from_first_name + ' ' + from_last_name + '\nTo download the Whinny App click here! http://www.whinny.com/',
  }, function (error, message) {
    if(!error){
      console.log("Success! The SID for this SMS message is: ", message.sid);
    } else {
      console.log("There was an error with twilio mms message");
    }
  })
}
module.exports = router;
