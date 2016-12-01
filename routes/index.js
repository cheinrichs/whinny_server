var express = require('express');
var router = express.Router();
var knex = require('../lib/knex.js');
var request = require('request');

var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

var twilio = require('twilio');

var accountSid = process.env.TWILIO_ACCOUNT_SID;
var authToken = process.env.TWILIO_AUTH_TOKEN;

var textClient = new twilio.RestClient(accountSid, authToken);


//website routes
router.post('/login_website', function (req, res, next) {
  if(!req.body.params.email){
    console.log("no email");
    res.json({error:'Please enter an email'})
  }
  if(!req.body.params.password){
    console.log("no password");
    res.json({error:'Please enter a password'})
  }

  //get the user by email address
  //check the users pasword against the given password
  knex('users').where('email', req.body.params.email).first().then(function (user) {
    if(!user){
      res.json({ error: "Incorrect Username or Password"})
    }
    if(user.password === req.body.params.password){
      var data = {};
      var token = jwt.sign(user.user_id, process.env.JWT_SECRET)
      data.token = token;
      data.user = user;
      res.json(data);
    } else {
      res.json({error: "Incorrect Username or Password"})
    }
  })
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
    res.json({success: "true"});
  })
});

router.get('/website/broadcastAdmin/:user_id', function (req, res, next) {
  knex('broadcast_memberships').where({user_id: req.params.user_id, admin: true}).pluck('broadcast_id').then(function (memberships) {
    knex('broadcasts').whereIn('broadcast_id', memberships).then(function (broadcasts) {
      res.json(broadcasts)
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
      res.json({ "newMessageId": newMessageId });
    })
  })
})
// ******** end website routes ********* //

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Whinny Server' });
});

//TODO post
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

//TODO POST
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
//TODO POST
router.get('/sendGroupMessage/:to_group/:from_user/:content', function (req, res, next) {
  knex('group_messages').insert({
    to_group: req.params.to_group,
    from_user: req.params.from_user,
    group_message_content: req.params.content
  }).then(function () {
    res.json({confirmed: true})
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
        res.json({confirmed: true})
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
        res.json(user);
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
        EULA_date_agreed: null
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
              res.json(new_users[0]);
            } else {
              console.log("couldnt send text message");
              new_users[0].textSent = false;
              res.json(new_users[0]);
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
                res.json({ group_id: group[0].group_id });
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
    res.json(invitations);
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
      res.json({ groupMembershipCreated: 'successful' });
    })
  })
})

router.post('/declineInvitation', function (req, res, next) {
  knex('group_invitations').where({ invitation_id: req.body.invitation_id }).del().then(function () {
    res.json({ groupMembershipDeclined: 'successful' });
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
          res.json(result);
        } else {
          res.json({ noCurrentApplications: true });
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
      res.json({ groupMembershipCreated: 'successful' });
    })
  })
})

router.post('/declineGroupApplication', function (req, res, next) {
  //TODO instead of deleting, update the status to deleted
  knex('group_applications').where({ application_id: req.body.application_id }).del().then(function () {
    res.json({ groupApplicationDeclined: 'successful' });
  })
})

router.get('/groupSearch/:user_id', function (req, res, next) {
  knex('group_memberships').where('user_id', req.params.user_id).pluck('group_id').then(function (group_ids) {
    knex('groups').where('is_hidden', false).whereNotIn('group_id', group_ids).then(function (searchGroups) {
      res.json(searchGroups);
    })
  })
})

router.post('/joinGroup', function (req, res, next) {

  if(!req.body.group_id){
    console.log("No given group_id in joinGroup");
    res.json({success: false});
  }

  if(!req.body.user_id){
    console.log("No given user_id in joinGroup");
    res.json({success: false});
  }

  knex('group_memberships').insert({
    user_id: req.body.user_id,
    group_id: req.body.group_id,
    admin: false,
    notifications: true
  }).then(function () {
    res.json({ success: true});
  })

})

router.post('/leaveGroup', function (req, res, next) {
  if(!req.body.group_id){
    console.log("No given group_id in joinGroup");
    res.json({success: false});
  }

  if(!req.body.user_id){
    console.log("No given user_id in joinGroup");
    res.json({success: false});
  }

  knex('group_memberships').where({
    user_id: req.body.user_id,
    group_id: req.body.group_id
  }).del().then(function () {
    res.json({ success: true });
  })

})

router.get('/broadcastSearch/:user_id', function (req, res, next) {
  knex('broadcast_memberships').where('user_id', req.params.user_id).pluck('broadcast_id').then(function (broadcast_ids) {
    knex('broadcasts').whereNotIn('broadcast_id', broadcast_ids).then(function (searchBroadcasts) {
      res.json(searchBroadcasts);
    })
  })
})

router.post('/subscribeToBroadcast', function (req, res, next) {
  console.log("subscribing to broadcast", req.body.broadcast_id, req.body.user_id);
  if(!req.body.broadcast_id){
    console.log("No given broadcast_id in subscribeFromBroadcast");
    res.json({success: false});
  }

  if(!req.body.user_id){
    console.log("No given user_id in subscribeFromBroadcast");
    res.json({success: false});
  }

  var membership = {
    user_id: req.body.user_id,
    broadcast_id: req.body.broadcast_id,
    admin: false,
    notifications: true
  }
  knex('broadcast_memberships').insert(membership).then(function () {
    res.json({ succes: true });
  })
})

router.post('/unsubscribeFromBroadcast', function (req, res, next) {
  console.log("unsubscribeFromBroadcast with", req.body.broadcast_id, req.body.user_id);
  if(!req.body.broadcast_id){
    console.log("No given broadcast_id in unsubscribeFromBroadcast");
    res.json({success: false});
  }

  if(!req.body.user_id){
    console.log("No given user_id in unsubscribeFromBroadcast");
    res.json({success: false});
  }

  knex('broadcast_memberships').where({ user_id: req.body.user_id, broadcast_id: req.body.broadcast_id}).del().then(function () {
    res.json({ usubscribedFrom: req.body.broadcast_id });
  })
})

router.get('/getUserInterests/:user_id', function (req, res, next) {
  knex('user_interests').where( 'user_id', req.params.user_id).then(function (interests) {
    res.json(interests);
  })
})

router.post('/addUserInterests', function (req, res, next) {
  knex('user_interests').where('user_id', req.body.currentUser).del().then(function () {
    console.log(req.body);
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
        res.json({ yyeaaa: 'yeah' });
      })
    });
  })

})

router.post('/updateNotificationSettings', function (req, res, next) {
  //TODO error handling
  knex('users').where('user_id', req.body.user_id).update({
    message_notifications: req.body.messaging,
    group_notifications: req.body.group,
    broadcast_notifications: req.body.broadcast
  }).then(function () {
    res.json({ success: true})
  })
})

router.post('/updateMessageNotificationSettings', function (req, res, next) {
  knex('users').where('user_id', req.body.user_id).update({
    message_notifications: req.body.messaging
  }).then(function () {
    res.json({ success: true})
  })
})

router.post('/updateGroupNotificationSettings', function (req, res, next) {
  knex('users').where('user_id', req.body.user_id).update({
    group_notifications: req.body.group
  }).then(function () {
    res.json({ success: true})
  })
})

router.post('/updateBroadcastNotificationSettings', function (req, res, next) {
  knex('users').where('user_id', req.body.user_id).update({
    broadcast_notifications: req.body.broadcast
  }).then(function () {
    res.json({ success: true})
  })
})

router.get('/userInterests/:user_id', function (req, res, next) {
  knex('user_interests').where('user_id', req.params.user_id).pluck('discipline_id').then(function (disciplines) {
    res.json(disciplines);
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
