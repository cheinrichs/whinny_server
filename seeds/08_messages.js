
exports.seed = function(knex, Promise) {
  return Promise.join(
    knex('group_messages').del()
  ).then(function () {
    return Promise.join(
      createMessage('Morgan', 'Cooper', 'Whinny Staff', 'EDCC Contagious Disease Alerts', 'message to Morgan from Cooper', 'chat'),
      createMessage('Cooper', 'Morgan', 'Whinny Staff', 'EDCC Contagious Disease Alerts', 'message to Cooper from Morgan', 'chat'),

      createMessage('Cooper', 'Cooper', 'Whinny Staff', 'EDCC Contagious Disease Alerts', 'get back to work. all of yas', 'group'),
      createMessage('Morgan', 'Cooper', 'Whinny Staff', 'EDCC Contagious Disease Alerts', 'get back to work. all of yas', 'group'),
      createMessage('Cooper', 'Cooper', 'Horse Application Developers', 'EDCC Contagious Disease Alerts', 'Oh hey! Looks like I\'m the only one', 'group'),
      createMessage('Morgan', 'Morgan', 'Paragon', 'EDCC Contagious Disease Alerts', 'We need more allergy medicine again or something', 'group'),
      createMessage('Morgan', 'Morgan', 'Horse Fans', 'EDCC Contagious Disease Alerts', 'Check out this HILAROOUSDOS foto -', 'group'),
      createMessage('Morgan', 'Morgan', 'Whinny Staff', 'EDCC Contagious Disease Alerts', 'Sry bbl I\'m riding!', 'group'),

      createMessage('Cooper', 'Cooper', 'Whinny Staff', 'EDCC Contagious Disease Alerts', 'Woozles. I repeat. Woozles', 'broadcast'),
      createMessage('Cooper', 'Cooper', 'Whinny Staff', 'Kentucky Derby Race Results', 'This horse was faster than that horse. If you lost money please don\'t blame us', 'broadcast'),
      createMessage('Morgan', 'Cooper', 'Whinny Staff', 'Palm Beach Drassage Derby', 'Please note: Puting a tutu on your horse will not help it\'s pirouettes', 'broadcast'),
      createMessage('Morgan', 'Cooper', 'Whinny Staff', 'Del Mar National', 'We have a lost long hair dachshund. He is demanding roast chicken at the front office.', 'broadcast')
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
      if(message_type === 'chat'){
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
