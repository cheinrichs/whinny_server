
exports.seed = function(knex, Promise) {
  return Promise.join(
    knex('broadcast_messages').del()
  ).then(function () {
    return Promise.join(
      createBroadcastMessage('Cooper', 'EDCC Contagious Disease Alerts', 'Woozles. I repeat. Woozles'),
      createBroadcastMessage('Cooper', 'Kentucky Derby Race Results', 'This horse was faster than that horse. If you lost money please don\'t blame us'),
      createBroadcastMessage('Morgan', 'Palm Beach Drassage Derby', 'Please note: Puting a tutu on your horse will not help it\'s pirouettes'),
      createBroadcastMessage('Morgan', 'Del Mar National', 'We have a lost long hair dachshund. He is demanding roast chicken at the front office.')
    )
  });

  function createBroadcastMessage(from_first_name, broadcast_name, content){
    var result = { broadcast_message_content: content };
    return knex('users').where('first_name', from_first_name).first().then(function (user_obj) {
      result.from_user = user_obj.user_id;
      return knex('broadcasts').where('broadcast_name', broadcast_name).first();
    }).then(function (broadcast_obj) {
      result.to_broadcast = broadcast_obj.broadcast_id;
      return knex('broadcast_messages').insert(result);
    });
  }
};
