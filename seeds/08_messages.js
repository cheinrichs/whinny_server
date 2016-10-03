
exports.seed = function(knex, Promise) {
  return Promise.join(
    knex('messages').del()
  ).then(function () {
    return Promise.join(
      createMessage('Morgan', 'Cooper', '', 'EDCC Contagious Disease Alerts', 'message to Morgan from Cooper', 'chat'),

      createMessage('Cooper', 'Morgan', '', 'EDCC Contagious Disease Alerts', 'message to Cooper from Morgan', 'chat'),

      createMessage('Cooper', 'George', '', 'EDCC Contagious Disease Alerts', 'Hello, Cooper this is George', 'chat'),
      createMessage('Morgan', 'George', '', 'EDCC Contagious Disease Alerts', 'Hello, Morgan this is George', 'chat')

    )
  });

  function createMessage(to_first_name, from_first_name, group_name, broadcast_name, content, message_type){
    var result = {
      message_type: message_type,
      content: content,
      read: false,
      sent_in_app: true,
      sent_as_mms: false,
      geographically_limited: false,
      state: null,
      zip: null,
      latitude: null,
      longitude: null
    };
    return knex('users').where('first_name', from_first_name).first().then(function (user_obj) {
      if(message_type === 'chat' || message_type === 'group'){
        result.from_user = user_obj.user_id;
      } else {
        result.from_user = null;
      }
      return knex('groups').where('group_name', group_name).first();
    }).then(function (group_obj) {
      if(message_type === 'group'){
        result.group_id = group_obj.group_id;
      } else {
        result.group_id = null;
      }
      return knex('broadcasts').where('broadcast_name', broadcast_name).first();
    }).then(function (broadcast_obj) {
      if(message_type === 'broadcast'){
        result.broadcast_id = broadcast_obj.broadcast_id;
      } else {
        result.broadcast_id = null;
      }
      return knex('users').where('first_name', to_first_name).first();
    }).then(function (user_obj) {
      result.to_user = user_obj.user_id;
      return knex('messages').insert(result);
    });
  }
};
