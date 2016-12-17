var express = require('express');
var router = express.Router();
var knex = require('../lib/knex.js');
var request = require('request');

var SparkPost = require('sparkpost');
var sp = new SparkPost(process.env.SPARKPOST_API_KEY);

var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

var twilio = require('twilio');

var accountSid = process.env.TWILIO_ACCOUNT_SID;
var authToken = process.env.TWILIO_AUTH_TOKEN;

var textClient = new twilio.RestClient(accountSid, authToken);

var CLIENT_CURRENT_VERSION = '0.0.1';


//website routes
router.post('/login_website', function (req, res, next) {
  if(!req.body.params.email) return res.json({error:'Please enter an email'});
  if(!req.body.params.password) return res.json({error:'Please enter a password'});

  //get the user by email address
  //check the users pasword against the given password
  knex('users').where('email', req.body.params.email).first().then(function (user) {
    if(!user){
      knex('user_action_log').insert({ user_id: '0', action: 'WEBSITE: Failed a login attempt with no such user:' + req.body.params.email, action_time: knex.fn.now() }).then(function () {
        res.json({ error: "Incorrect Username or Password"})
      })
    }
    if(user.password === req.body.params.password){
      var data = {};
      var token = jwt.sign(user.user_id, process.env.JWT_SECRET)
      data.token = token;
      data.user = user;
      knex('user_action_log').insert({ user_id: user.user_id, action: 'WEBSITE: Successfully logged in to the website.', action_time: knex.fn.now() }).then(function () {
        res.json(data);
      })
    } else {
      knex('user_action_log').insert({ user_id: user.user_id, action: 'WEBSITE: Failed a login attempt.', action_time: knex.fn.now() }).then(function () {
        res.json({ error: "Incorrect Username or Password"})
      })
    }
  })
  //TODO encrypt passwords
  // if(bcrypt.compareSync(req.body.params.password, access)){
  //   var userId = {userId: "1"};
  //   var token = jwt.sign(userId, process.env.JWT_SECRET)
  //   res.json({token: token});
  // } else {
  //   res.status(400).send({errors: ['You have entered an invalid email or password']});
  // }
});

router.post('/createBroadcastMessage', function (req, res, next) {
  console.log(req.body.params);
  knex('broadcast_messages').where('broadcast_message_id', req.body.params.currentNewMessageId).update({
    to_broadcast: req.body.params.selectedBroadcast,
    from_user: req.body.params.currentUser.user_id,
    broadcast_photo_url: req.body.params.broadcastPhoto,
    broadcast_title: req.body.params.broadcastTitle,
    broadcast_message: req.body.params.broadcastMessage,
    link_text: req.body.params.linkText,
    link_url: req.body.params.linkURL
  }).then(function () {
    console.log(req.params);
    knex('user_action_log').insert({ user_id: req.body.params.currentUser.user_id, action: 'WEBSITE: Broadcaster ' + req.body.params.currentUser.user_id + 'created a broadcast message.', action_time: knex.fn.now() }).then(function () {
      res.json({success: "true"});
    })
  })
});

router.get('/website/broadcastAdmin/:user_id', function (req, res, next) {
  knex('broadcast_memberships').where({user_id: req.params.user_id, admin: true}).pluck('broadcast_id').then(function (memberships) {
    knex('broadcasts').whereIn('broadcast_id', memberships).then(function (broadcasts) {
      knex('user_action_log').insert({ user_id: req.params.user_id, action: 'WEBSITE: A broadcaster logged in to the website to send broadcasts', action_time: knex.fn.now() }).then(function () {
        res.json(broadcasts)
      })
    })
  })
})

router.get('/website/nextBroadcastMessageId', function (req, res, next) {
  knex('broadcast_messages').count('broadcast_message_id').then(function (id_count) {
    knex('broadcast_messages').insert({
      to_broadcast: 1,
      from_user: 1,
      broadcast_photo_url: 'https://placeholdit.imgix.net/~text?txtsize=23&bg=ffffff&txtclr=000000&txt=250%C3%97250&w=250&h=250',
      broadcast_title: "placeholder",
      broadcast_message: "placeholder",
      link_text: "placeholder",
      link_url: 'https://placeholdit.imgix.net/~text?txtsize=23&bg=ffffff&txtclr=000000&txt=250%C3%97250&w=250&h=250'
    }).then(function () {
      var newMessageId = parseInt(id_count[0].count) + 1;
      console.log(newMessageId);
      knex('user_action_log').insert({ user_id: '0', action: 'WEBSITE: A broadcaster grabbed the most recent message id', action_time: knex.fn.now() }).then(function () {
        res.json({ "newMessageId": newMessageId });
      })
    })
  })
})

router.post('/website/contactUs', function (req, res, next) {
  console.log(req);

  sp.transmissions.send({
    recipients: [
      {
        "address": {
          "email": 'cooper.heinrichs@gmail.com',
          "name": 'Cooper Heinrichs'
        }
      }
    ],
    content: {
      from: {
        "name": "Whinny the Coop",
        "email": "postmaster@whinny.com"
      },
      subject: 'Tryna get this to work',
      html: '<html><body> yolo </html></body>'
    }
  }, function (err, apiResponse) {
    if(err){
      knex('user_action_log').insert({ user_id: '0', action: 'WEBSITE: There was an error when a user attempted to contact Whinny', action_time: knex.fn.now() }).then(function () {
        res.json(err);
      })
    } else {
      knex('user_action_log').insert({ user_id: '0', action: 'WEBSITE: A user attempted to contact Whinny', action_time: knex.fn.now() }).then(function () {
        res.json(apiResponse.body);
      })
    }
  });
});

router.post('/website/signUpForUpdates', function (req, res, next) {
  knex('user_action_log').insert({ user_id: '0', action: 'WEBSITE: A user attempted to sign up for updates', action_time: knex.fn.now() }).then(function () {
    res.json({ todo: 'true' });
  })
})

router.post('/website/broadcasterSignup', function (req, res, next) {
  knex('user_action_log').insert({ user_id: '0', action: 'WEBSITE: A broadcaster attempted to sign up', action_time: knex.fn.now() }).then(function () {
    res.json({ todo: 'true' });
  })
})
// ******** end website routes ********* //

//checks version when you auto log in
router.get('/versionCheck/:version', function (req, res, next) {
  if(req.params.version === CLIENT_CURRENT_VERSION){
    return res.json({ deprecatedClient: false });
  } else {
    return res.json({ deprecatedClient: true });
  }
})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Whinny Server' });
});

//iOS and Android Client Routes
router.post('/joinWhinny', function (req, res, next) {
  console.log(req.body);

  if(req.body.licenseAgreement === 'false' || req.body.licenseAgreement === false) res.json({error: 'invalid license agreement 1'});
  if(req.body.first_name.length === 0 || req.body.last_name.length === 0) res.json({error: 'invalid user name first or last'})

  var userEmail = req.body.email || "";
  var userPassword = req.body.password || "";

  var confirmationCode = generateConfirmationCode();

  knex('users').insert({
    email: userEmail,
    phone: req.body.phone,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    password: userPassword,
    portrait_link: 'https://s3.amazonaws.com/whinnyphotos/profile_photos/ + ',
    message_notifications: true,
    group_notifications: true,
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
    EULA_date_agreed: knex.fn.now(),
    account_is_setup: false,
    device_token: ''
  }).returning('*').then(function (users) {
    console.log(users);
    //Update the portrait link using the ID, that way the link will always be correct
    knex('users').where('user_id', users[0].user_id).update({ portrait_link: 'https://s3.amazonaws.com/whinnyphotos/profile_photos/' + users[0].user_id + '_PersonalProfilePic.jpg'}).then(function () {
      confirmationCodeText(req.params.phone, confirmationCode);
      knex('user_action_log').insert({ user_id: users[0].user_id, action: 'Joined Whinny', action_time: knex.fn.now() }).then(function () {
        res.json({ success: true })
      })
    })

  })
})

router.post('/logIn', function (req, res, next) {
  //Checks version on a new login
  if(req.body.version === CLIENT_CURRENT_VERSION) return res.json({ deprecatedClient: 'true' });
  console.log(req.body);
  knex('users').where('phone', req.body.phone).then(function (user) {
    console.log(user);

    if(user.length > 0){
      var confirmationCode = generateConfirmationCode();

      //Updates the newly created confirmation code in the user record
      knex('users').where('phone', req.body.phone).update({confirmation_code: confirmationCode, device_token: req.body.device_token}).then(function () {
        confirmationCodeText(req.body.phone, confirmationCode);
        knex('user_action_log').insert({ user_id: user[0].user_id, action: 'Logged in to a new device and received a new confirmation code (POST login)', action_time: knex.fn.now() }).then(function () {
          res.json(user);
        })
      })
    } else {
      knex('user_action_log').insert({ user_id: '0', action: 'A new user began the account creation process (POST login)', action_time: knex.fn.now() }).then(function () {
        res.json({ newUser: true})
      })
    }
  });
})

//TODO deprecated?
router.get('/log_in/:phone', function (req, res, next) {
  console.log("deprecated login route");
  if(req.body.version !== CLIENT_CURRENT_VERSION) res.json({ deprecatedClient: 'true' });

  if(!req.params.phone) res.json({ status: 'denied' });
  //look for them in users
  //if there is a user, create the new confirmation code and send it via text

  //if there isn't a user, send a response to the client which redirects to a user creation form

  knex('users').where('phone', req.params.phone).then(function (user) {
    console.log(user);

    if(user.length > 0){
      var confirmationCode = generateConfirmationCode();

      knex('users').where('phone', req.params.phone).update({confirmation_code: confirmationCode}).then(function () {
        confirmationCodeText(req.params.phone, confirmationCode);
        console.log(user);
        console.log(user[0]);
        console.log(user[0].user_id);
        knex('user_action_log').insert({ user_id: user[0].user_id, action: 'A user began a fresh login process (GET login)', action_time: knex.fn.now() }).then(function () {
          res.json(user);
        })
      })
    } else {
      knex('user_action_log').insert({ user_id: '0', action: 'A user started creating a new account (GET login)', action_time: knex.fn.now() }).then(function () {
        res.json({ newUser: true})
      })
    }
  });

})

router.get('/confirmCode/:user_phone/:confirmation_code', function (req, res, next) {
  knex('users').where('phone', req.params.user_phone).first().then(function (user) {
    if(user){
      if(user.confirmation_code === req.params.confirmation_code.toLowerCase()){
        knex('users').where('phone', req.params.user_phone).update({ verified: true }).then(function () {
          knex('users').where('phone', req.params.user_phone).first().then(function (updatedUser) {
            knex('user_action_log').insert({ user_id: user.user_id, action: 'Successfully confirmed their log in to a device', action_time: knex.fn.now() }).then(function () {
              res.json(updatedUser);
            })
          })
        })
      } else {
        knex('user_action_log').insert({ user_id: user.user_id, action: 'Unsuccessfully attempted to confirm a code on a device', action_time: knex.fn.now() }).then(function () {
          res.json({ status: 'Incorrect code given'});
        })
      }
    } else {
      knex('user_action_log').insert({ user_id: '0', action: 'Attempted to send a confirmation code to a non-existant user', action_time: knex.fn.now() }).then(function () {
        res.json({ status: 'No such user' })
      })
    }
  })
})


router.get('/chatMessages/:user_id', function (req, res, next) {
  if(!req.params.user_id){
    res.json({ error: "User undefined" });
  }
  var result = {};

  //get all messages involving the given id as to_user or from_user
  knex('messages').where('to_user', req.params.user_id)
  .orWhere('from_user', req.params.user_id).then(function (messages) {
    var user_ids = [];
    //for loop through all the retrieved messages
    for (var i = 0; i < messages.length; i++) {
      //push each message into an object
      //the key of each message object is the user id
      //that is not the given id
      if(messages[i].to_user == req.params.user_id){

        if(!result[messages[i].from_user]){
          result[messages[i].from_user] = {
            unread: false,
            messages: [],
            convoUser: {},
          };
        }

        result[messages[i].from_user].messages.push(messages[i]);

        //while checking that, see if any of them are unread
        //if they are, flip the unread flag
        if(messages[i].read === false) result[messages[i].from_user].unread = true;

      } else if(messages[i].from_user == req.params.user_id){

        if(!result[messages[i].to_user]){
          result[messages[i].to_user] = {
            unread: false,
            messages: [],
            convoUser: {},
          };
        }

        result[messages[i].to_user].messages.push(messages[i]);

        if(messages[i].read === false) result[messages[i].to_user].unread = true;
      }
    }

    knex('users').whereIn('user_id', Object.keys(result)).then(function (userObjects) {
      for (var i = 0; i < userObjects.length; i++) result[userObjects[i].user_id].convoUser = userObjects[i];
      res.json(result)
    })

  })


  //then stick in the convo user

  // knex('messages').where('to_user', req.params.user_id)
  // .orWhere('from_user', req.params.user_id).then(function (messages) {
  //   result.messages = messages;
  //   var user_ids = [];
  //
  //   //Find all user ids that are involved in conversations
  //   for (var i = 0; i < messages.length; i++) {
  //     if(messages[i].from_user) user_ids.push(messages[i].from_user);
  //     if(messages[i].to_user) user_ids.push(messages[i].to_user);
  //   }
  //   user_ids = user_ids.unique();
  //   knex('users').whereIn('user_id', user_ids).then(function (userObjects) {
  //     result.userObjects = userObjects;
  //     knex('user_action_log').insert({ user_id: req.params.user_id, action: 'Checked their chat messages', action_time: knex.fn.now() }).then(function () {
  //       res.json(result);
  //     })
  //   })
  // })
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
            knex('user_action_log').insert({ user_id: req.params.user_id, action: 'Checked their group messages', action_time: knex.fn.now() }).then(function () {
              res.json(result);
            })
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
        knex('user_action_log').insert({ user_id: req.params.user_id, action: 'Checked their broadcast messages', action_time: knex.fn.now() }).then(function () {
          res.json(result);
        })
      })
    })
  })
})

router.post('/sendChatMessage', function (req, res, next) {
  knex('users').where('user_id', req.body.to_user).first().then(function (toUser) {
    knex('messages').insert({
      to_user: req.body.to_user,
      from_user: req.body.from_user,
      message_type: 'chat',
      content: req.body.content,
      read: false,
      sent_in_app: true,
      sent_as_mms: false,
      geographically_limited: false,
      state: null,
      zip: null,
      latitude: null,
      longitude: null
    }).then(function () {
      var body = JSON.stringify({
        "tokens": [toUser.device_token],
        "profile": "whinny_push_notifications_dev",
        "notification": {
          "title": req.body.senderName,
          "message": req.body.content
        }
      });
      request({
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2N2Q2OThmZS0xMzk5LTQwZjktOGM5ZS1jM2Q5MTU4ZmM4ODkifQ.m3pm5yI86MI6JvTBCU2hD_jNhShSVZsWTp79IMx4QJo'
        },
        uri: 'https://api.ionic.io/push/notifications',
        body: body,
        method: 'POST'
      }, function (err, response, body) {
        if(err) console.log(err);
        knex('user_action_log').insert({ user_id: req.body.from_user, action: 'Sent a chat message to user ' + req.body.to_user, action_time: knex.fn.now() }).then(function () {
          res.json({created: true});
        })
      })
    })
  })
})

//TODO POST
router.get('/sendGroupMessage/:to_group/:from_user/:content', function (req, res, next) {
  knex('group_messages').insert({
    to_group: req.params.to_group,
    from_user: req.params.from_user,
    group_message_content: req.params.content
  }).then(function () {
    knex('user_action_log').insert({ user_id: req.params.from_user, action: 'Sent a group message to group ' + req.params.to_group, action_time: knex.fn.now() }).then(function () {
      res.json({confirmed: true})
    })
  })
})
//TODO POST - deprecated remove
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
        knex('user_action_log').insert({ user_id: req.params.from_user, action: 'Sent a broadcast message to broadcast ' + req.params.to_broadcast, action_time: knex.fn.now() }).then(function () {
          res.json({confirmed: true})
        })
      })
    }
  })
})

//TODO POST
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
        knex('user_action_log').insert({ user_id: req.params.from_user, action: 'Created a new chat with current whinny user ' + user.user_id, action_time: knex.fn.now() }).then(function () {
          res.json(user);
        })
      })

    } else {
      console.log("user not in the system");
      //create a new user
      console.log("creating user", req.params.to_phone);

      knex('users').insert({
        email: null,
        phone: req.params.to_phone,
        first_name: null,
        last_name: null,
        password: null,
        //TODO: standard portrait link
        portrait_link: 'https://s-media-cache-ak0.pinimg.com/564x/a5/38/e3/a538e3c4163496bfec2a6782b8290a33.jpg',
        message_notifications: true,
        group_notifications: true,
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
        EULA_date_agreed: null,
        account_is_setup: false,
        device_token: ''
      }).returning('*').then(function (new_users) {
        //Create a message to the new user
        console.log('new user', new_users);
        console.log(new_users[0].user_id);
        console.log("creating message");
        knex('messages').insert({
          to_user: new_users[0].user_id,
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
              new_users[0].textSent = true;
              knex('user_action_log').insert({ user_id: req.params.from_user, action: 'Created a new chat with a user not registered to Whinny. A text was sent to ' + req.params.to_phone, action_time: knex.fn.now() }).then(function () {
                res.json(new_users[0]);
              })
            } else {
              console.log("couldnt send text message");
              new_users[0].textSent = false;
              knex('user_action_log').insert({ user_id: req.params.from_user, action: 'Created a new chat with a user not registered to Whinny. A text was not sent to ' + req.params.to_phone, action_time: knex.fn.now() }).then(function () {
                res.json(new_users[0]);
              })
            }
          })
        })
      });
    }
  });
});

router.post('/createNewGroup', function (req, res, next) {
  console.log('req body', req.body);
  if(!req.body) res.json({ success: 'false' });

  var url = 'http://maps.googleapis.com/maps/api/geocode/json?address=' + req.body.zip + '&sensor=true';
  var state;
  // request(url, function (error, response, body) {
  //   var data = JSON.parse(body);
  //   for (var i = 0; i < data.results[0].address_components.length; i++) {
  //     if(data.results[cd 0].address_components[i].types.includes('administrative_area_level_1')){
  //       state = data.results[0].address_components[i].short_name;
  //     }
  //   }
  //   console.log(state);

    // create a group with the current specs
    knex('groups').insert({
      group_name: req.body.groupName,
      group_photo: 'Placeholder',
      description: req.body.description,
      is_private: req.body.is_private,
      is_hidden: req.body.hidden,
      users_can_respond: true, //TODO fix this
      geographically_limited: false, //TODO
      group_latitude: '40.167207',
      group_longitude: '-105.101927',
      group_zip: req.body.zip,
      group_state: 'CO', //TODO
      group_discipline: req.body.discipline,
      geographically_limited: false,
    }).returning('*').then(function (group) {
      //update the image link to the link that will be active
      console.log("group:");
      console.log(group[0]);
      knex('groups').where('group_id', group[0].group_id).update({
          group_photo: 'https://s3.amazonaws.com/whinnyphotos/group_profile_photos/' + group[0].group_id + '_GroupProfilePic.jpg'
      }).then(function () {
        console.log(group);
        //Create a group membership for the creator
        var membership = {
          user_id: req.body.fromUser.user_id,
          group_id: group[0].group_id,
          admin: true,
          notifications: true
        }
        console.log(membership);
        knex('group_memberships').insert(membership).then(function () {
          //TODO if there is not a user object for a given phone number, create a new user
          //and then create an invitation
          var invitedPhoneNumbers = [];
          for (var i = 0; i < req.body.invited.length; i++) {
            invitedPhoneNumbers.push(req.body.invited[i].phone);
          }
          console.log("invited phone numbers", invitedPhoneNumbers);
          knex('users').whereIn('phone', invitedPhoneNumbers).then(function (users) {
            console.log(users);
            console.log(group[0]);
            if(users.length < req.body.invited.length){ //TODO remove once we add users
              console.log(" some users weren't invited ");
            }
            if(req.body.invited){
              var invitations = [];
              for (var i = 0; i < users.length; i++) {
                invitations.push({
                  group_id: group[0].group_id,
                  user_id: users[i].user_id,
                  status: 'pending'
                });
                //look up the user and get the user id for the phone number
                //create a group membership for the given user id
              }
              knex('group_invitations').insert(invitations).then(function () {
                knex('user_action_log').insert({ user_id: req.body.fromUser.user_id, action: 'Created group ' + group[0].group_id, action_time: knex.fn.now() }).then(function () {
                  res.json({ group_id: group[0].group_id });
                })
              })
            }
          })
        })
      })

    })
  // })
})

router.get('/groupInvitations/:user_id', function (req, res, next) {
  knex('group_invitations').where('user_id', req.params.user_id).join('groups', 'group_invitations.group_id', '=', 'groups.group_id').then(function (invitations) {
    knex('user_action_log').insert({ user_id: req.params.user_id, action: 'Checked their group invitations', action_time: knex.fn.now() }).then(function () {
      res.json(invitations);
    })
  })
})

router.post('/acceptInvitation', function (req, res, next) {
  knex('group_invitations').where({ group_id: req.body.group_id, user_id: req.body.user_id }).del().then(function () {
    //create a new group membership
    knex('group_memberships').insert({
      user_id: req.body.user_id,
      group_id: req.body.group_id,
      admin: false,
      notifications: true
    }).then(function () {
      knex('user_action_log').insert({ user_id: req.body.user_id, action: 'Accepted a group invitation to ' + req.body.group_id, action_time: knex.fn.now() }).then(function () {
        res.json({ groupMembershipCreated: 'successful' });
      })
    })
  })
})

router.post('/declineInvitation', function (req, res, next) {
  knex('group_invitations').where({ invitation_id: req.body.invitation_id }).del().then(function () {
    knex('user_action_log').insert({ user_id: req.body.user_id, action: 'Declined a group invitation', action_time: knex.fn.now() }).then(function () {
      res.json({ groupMembershipDeclined: 'successful' });
    })
  });
})

router.get('/groupApplications/:user_id', function (req, res, next) {
  var result = {};
  knex('group_memberships').where({
    user_id: req.params.user_id,
    admin: true
  }).pluck('group_id').then(function (group_ids) {
    knex('groups').whereIn('group_id', group_ids).then(function (groups) {
      for (var i = 0; i < groups.length; i++) {
        result[groups[i].group_id] = groups[i];
      }
      knex('group_applications')
      .whereIn('group_id', group_ids)
      .select(
        ['group_applications.application_id',
         'group_applications.group_id',
         'group_applications.user_id',
         'group_applications.status',
         'users.first_name',
         'users.last_name'
       ])
      .innerJoin('users', 'group_applications.user_id', '=', 'users.user_id').then(function (applications){
        if(applications.length > 0){
          for (var i = 0; i < applications.length; i++) {
            result[applications[i].group_id].applications = [];
            result[applications[i].group_id].applications.push(applications[i])
          }
          knex('user_action_log').insert({ user_id: req.params.user_id, action: 'Checked their group applications', action_time: knex.fn.now() }).then(function () {
            res.json(result);
          })
        } else {
          knex('user_action_log').insert({ user_id: req.params.user_id, action: 'Checked their group applications', action_time: knex.fn.now() }).then(function () {
            res.json({ noCurrentApplications: true });
          })
        }
      })
    })
  })
})

router.post('/acceptGroupApplication', function (req, res, next) {
  //TODO instead of deleting, update the status to accepted
  knex('group_applications').where({ user_id: req.body.user_id, group_id: req.body.group_id }).del().then(function () {
    knex('group_memberships').insert({
      user_id: req.body.user_id,
      group_id: req.body.group_id,
      admin: false,
      notifications: true
    }).then(function () {
      knex('user_action_log').insert({ user_id: req.body.user_id, action: 'Was accepted into group ' + req.body.group_id + ' after applying.', action_time: knex.fn.now() }).then(function () {
        res.json({ groupMembershipCreated: 'successful' });
      })
    })
  })
})

router.post('/declineGroupApplication', function (req, res, next) {
  //TODO instead of deleting, update the status to deleted
  knex('group_applications').where({ application_id: req.body.application_id }).del().then(function () {
    knex('user_action_log').insert({ user_id: req.body.user_id, action: 'Declined a group application', action_time: knex.fn.now() }).then(function () {
      res.json({ groupApplicationDeclined: 'successful' });
    })
  })
})

router.get('/groupSearch/:user_id', function (req, res, next) {
  knex('group_memberships').where('user_id', req.params.user_id).pluck('group_id').then(function (group_ids) {
    knex('groups').where('is_hidden', false).whereNotIn('group_id', group_ids).then(function (searchGroups) {
      knex('user_action_log').insert({ user_id: req.params.user_id, action: 'Searched for groups', action_time: knex.fn.now() }).then(function () {
        res.json(searchGroups);
      })
    })
  })
})

router.post('/joinGroup', function (req, res, next) {
  if(!req.body.group_id){
    res.json({ error: "No given group_id in joinGroup"});
    return;
  }
  if(!req.body.user_id){
    res.json({ error: "No given user_id in joinGroup" });
    return;
  }

  knex('group_memberships').insert({
    user_id: req.body.user_id,
    group_id: req.body.group_id,
    admin: false,
    notifications: true
  }).then(function () {
    knex('user_action_log').insert({ user_id: req.body.user_id, action: 'Joined group ' + req.body.group_id, action_time: knex.fn.now() }).then(function () {
      res.json({ succes: true });
    })
  })

})

router.post('/leaveGroup', function (req, res, next) {
  if(!req.body.group_id){
    res.json({ error: "No given group_id in joinGroup" });
    return;
  }
  if(!req.body.user_id){
    res.json({ error: "No given user_id in joinGroup" });
    return
  }

  knex('group_memberships').where({
    user_id: req.body.user_id,
    group_id: req.body.group_id
  }).del().then(function () {
    knex('user_action_log').insert({ user_id: req.body.user_id, action: 'Left group ' + req.body.group_id, action_time: knex.fn.now() }).then(function () {
      res.json({ succes: true });
    })
  })

})

router.get('/broadcastSearch/:user_id', function (req, res, next) {
  knex('broadcast_memberships').where('user_id', req.params.user_id).pluck('broadcast_id').then(function (broadcast_ids) {
    knex('broadcasts').whereNotIn('broadcast_id', broadcast_ids).then(function (searchBroadcasts) {
      knex('user_action_log').insert({ user_id: req.params.user_id, action: 'Searched broadcasts', action_time: knex.fn.now() }).then(function () {
        res.json(searchBroadcasts);
      })
    })
  })
})

router.post('/subscribeToBroadcast', function (req, res, next) {
  if(!req.body.broadcast_id) return res.json({ error: "No given broadcast_id in subscribeFromBroadcast" });
  if(!req.body.user_id) return res.json({ error: "No given user_id in subscribeFromBroadcast"});

  var membership = {
    user_id: req.body.user_id,
    broadcast_id: req.body.broadcast_id,
    admin: false,
    notifications: true
  }

  knex('broadcast_memberships').insert(membership).then(function () {
    knex('user_action_log').insert({ user_id: req.body.user_id, action: 'Subscribed to broadcast ' + req.body.broadcast_id, action_time: knex.fn.now() }).then(function () {
      res.json({ succes: true });
    })
  })
})

router.post('/unsubscribeFromBroadcast', function (req, res, next) {
  console.log("unsubscribeFromBroadcast with", req.body.broadcast_id, req.body.user_id);
  if(!req.body.broadcast_id) return res.json({ error: "No given broadcast_id in unsubscribeFromBroadcast" });
  if(!req.body.user_id) return res.json({error: "No given user_id in unsubscribeFromBroadcast"});

  knex('broadcast_memberships').where({ user_id: req.body.user_id, broadcast_id: req.body.broadcast_id}).del().then(function () {
    knex('user_action_log').insert({ user_id: req.body.user_id, action: 'Unsubscribed from broadcast ' + req.body.broadcast_id, action_time: knex.fn.now() }).then(function () {
      res.json({ usubscribedFrom: req.body.broadcast_id });
    })
  })
})

router.get('/getUserInterests/:user_id', function (req, res, next) {
  knex('user_interests').where( 'user_id', req.params.user_id).then(function (interests) {
    knex('user_action_log').insert({ user_id: req.params.user_id, action: 'Accessed their interests (1st Route)', action_time: knex.fn.now() }).then(function () {
      res.json(interests);
    })
  })
})

router.post('/addUserInterests', function (req, res, next) {
  if(!req.body.currentUser) return res.json({error: "No given user_id in addUserInterests"});
  if(!req.body.interests) return res.json({error: "No given interests in addUserInterests"});
  knex('user_interests').where('user_id', req.body.currentUser).del().then(function () {
    var interests = [];
    for (var i = 0; i < req.body.interests.length; i++) {
      var interest = {
        user_id: req.body.currentUser,
        discipline_id: req.body.interests[i]
      }
      interests.push(interest);
    }
    console.log(req.body.suggested_interest);

    knex('user_interests').insert(interests).then(function () {
      knex('user_suggested_disciplines').insert({suggested_discipline: req.body.suggested_interest}).then(function () {
        knex('user_action_log').insert({ user_id: '2', action: 'Updated their interests to ' + req.body.interests, action_time: knex.fn.now() }).then(function () {
          res.json({ success: true})
        })
      })
    });
  })
})

router.post('/updateMessageNotificationSettings', function (req, res, next) {
  if(!req.body.user_id) return res.json({ error: "Missing user_id" });
  if(!req.body.messaging) return res.json({ error: "Missing messaging" });
  knex('users').where('user_id', req.body.user_id).update({
    message_notifications: req.body.messaging
  }).then(function () {
    if(req.body.messaging === 'true'){
      knex('user_action_log').insert({ user_id: req.body.user_id, action: 'Turned on messaging notification settings', action_time: knex.fn.now() }).then(function () {
        res.json({ success: true})
      })
    } else {
      knex('user_action_log').insert({ user_id: req.body.user_id, action: 'Turned off messaging notification settings', action_time: knex.fn.now() }).then(function () {
        res.json({ success: true})
      })
    }
  })
})

router.post('/updateGroupNotificationSettings', function (req, res, next) {
  if(!req.body.user_id) return res.json({ error: "Missing user_id" });
  if(!req.body.group) return res.json({ error: "Missing group" });
  knex('users').where('user_id', req.body.user_id).update({
    group_notifications: req.body.group
  }).then(function () {
    if(req.body.group === 'true'){
      knex('user_action_log').insert({ user_id: req.body.user_id, action: 'Turned on group notification settings', action_time: knex.fn.now() }).then(function () {
        res.json({ success: true})
      })
    } else {
      knex('user_action_log').insert({ user_id: req.body.user_id, action: 'Turned off group notification settings', action_time: knex.fn.now() }).then(function () {
        res.json({ success: true})
      })
    }
  })
})

router.post('/updateBroadcastNotificationSettings', function (req, res, next) {
  if(!req.body.user_id) return res.json({ error: "Missing user_id" });
  if(!req.body.broadcast) return res.json({ error: "Missing broadcast" });
  knex('users').where('user_id', req.body.user_id).update({
    broadcast_notifications: req.body.broadcast
  }).then(function () {
    if(req.body.broadcast === 'true'){
      knex('user_action_log').insert({ user_id: req.body.user_id, action: 'Turned on broadcast notification settings', action_time: knex.fn.now() }).then(function () {
        res.json({ success: true})
      })
    } else {
      knex('user_action_log').insert({ user_id: req.body.user_id, action: 'Turned off broadcast notification settings', action_time: knex.fn.now() }).then(function () {
        res.json({ success: true})
      })
    }
  })
})

router.get('/userInterests/:user_id', function (req, res, next) {
  //Select all interests for a certain user_id and return them
  knex('user_interests').where('user_id', req.params.user_id).pluck('discipline_id').then(function (disciplines) {
    //Log that the user accessed their disciplines
    knex('user_action_log').insert({ user_id: req.params.user_id, action: 'Accessed disciplines (2nd route?)', action_time: knex.fn.now() }).then(function () {
      res.json(disciplines);
    });
  })
})

router.post('/logOut', function (req, res, next) {
  console.log(req.body.user_id);
  knex('users').where('user_id', req.body.user_id).update({ verified: false, device_token: '' }).then(function () {

    res.json({ loggedOut: 'Successful' });
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

  console.log(to_phone);
  console.log(typeof(to_phone));
  var sendTo;

  if(to_phone === '3035892321' || to_phone === '1111111111'){
    sendTo = '+13035892321';
  } else if (to_phone === '7203464283' || to_phone === '3333333333'){
    sendTo = '+17203464283';
  } else if(to_phone === '3035892486' || to_phone === '2222222222'){
    sendTo = '+13035892486';
  } else {
    sendTo = '+13035892321';
  }

  textClient.sms.messages.create({
    // to: to_phone,
    to: sendTo,
    from: '+17204087635',
    body: 'Hello! Thank you for registering with Whinny! CONFIRMATION CODE: ' + confirmationCode,
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
