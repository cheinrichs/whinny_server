
exports.seed = function(knex, Promise) {
  return Promise.join(
    knex('broadcast_memberships').del()
  ).then(function () {
    return Promise.join(
      createBroadcastMembership('Cooper', 'Whinny Tips', true, true),
      createBroadcastMembership('Cooper', 'Disease Communication Center', true, true),
      createBroadcastMembership('Cooper', 'Equestrian News', true, true),

      createBroadcastMembership('Megan', 'Beautiful Barns', true, true),
      createBroadcastMembership('Megan', 'Equestrian News', true, true),
      createBroadcastMembership('Megan', 'Horse Humor', true, true),
      createBroadcastMembership('Megan', 'EqBusiness', true, true),
      createBroadcastMembership('Megan', 'Whinny Tips', true, true),
      createBroadcastMembership('Megan', 'EqFashion', true, true),
      createBroadcastMembership('Megan', 'Disease Communication Center', true, true),
      createBroadcastMembership('Megan', 'Equine Veterinary Info', true, true),

      createBroadcastMembership('Pete', 'Whinny Tips', true, true),
      createBroadcastMembership('Pete', 'Disease Communication Center', true, true),
      createBroadcastMembership('Pete', 'Equestrian News', false, false)
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
