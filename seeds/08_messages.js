
exports.seed = function(knex, Promise) {
  return Promise.join(
    knex('messages').del()
  ).then(function () {
    return Promise.join(
      createMessage('Megan', 'Cooper', '', 'EDCC Contagious Disease Alerts', 'message to Megan from Cooper', 'chat', false, null),

      createMessage('Cooper', 'Megan', '', 'EDCC Contagious Disease Alerts', 'message to Cooper from Megan', 'chat', false, null),

      createMessage('Cooper', 'Pete', '', 'EDCC Contagious Disease Alerts', 'Hello, Cooper this is Pete', 'chat', false, null),
      createMessage('Megan', 'Pete', '', 'EDCC Contagious Disease Alerts', 'Hello, Megan this is Pete', 'chat', false, null),

      createMessage('Megan', 'Cooper', '', 'EDCC Contagious Disease Alerts', 'message to Megan from Cooper', 'chat', true, 'https://s-media-cache-ak0.pinimg.com/736x/1c/8f/99/1c8f994a826b1482c75dc89bdbcd1acd.jpg'),
      createMessage('Cooper', 'Megan', '', 'EDCC Contagious Disease Alerts', 'message to Cooper from Megan', 'chat', true, 'http://kids.nationalgeographic.com/content/dam/kids/photos/animals/Mammals/H-P/lion-male-roar.jpg.adapt.945.1.jpg')
    )
  });

  function createMessage(to_first_name, from_first_name, group_name, broadcast_name, content, message_type, image, image_src){
    var result = {
      message_type: message_type,
      content: content,
      read: false,
      time_read: knex.fn.now(),
      sent_in_app: true,
      sent_as_mms: false,
      geographically_limited: false,
      state: null,
      zip: null,
      latitude: null,
      longitude: null,
      image: image,
      image_src: image_src
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
