
exports.seed = function(knex, Promise) {
  return Promise.join(
    knex('broadcast_memberships').del()
  ).then(function () {
    return Promise.join(
      createBroadcastMembership('Cooper', 'EDCC Contagious Disease Alerts', true, true),
      createBroadcastMembership('Cooper', 'Kentucky Derby Race Results', false, false),
      createBroadcastMembership('Morgan', 'Palm Beach Drassage Derby', true, false),
      createBroadcastMembership('Morgan', 'EDCC Contagious Disease Alerts', false, false),
      createBroadcastMembership('Morgan', 'Del Mar National', false, true),
      createBroadcastMembership('George', 'EDCC Contagious Disease Alerts', false, true)
    )
  });

  function createBroadcastMembership(first_name, broadcast_name, admin, notifications){
    var result = {
      notifications: notifications,
      admin: admin
     };
    return knex('users').where('first_name', first_name).first().then(function (user_obj) {
      result.user_id = user_obj.user_id;
      return knex('broadcasts').where('broadcast_name', broadcast_name).first();
    }).then(function (broadcast_obj) {
      result.broadcast_id = broadcast_obj.broadcast_id;
      return knex('broadcast_memberships').insert(result);
    });
  }
};
