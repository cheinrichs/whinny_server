exports.seed = function(knex, Promise) {
  return Promise.join(
    knex('group_memberships').del()
  ).then(function () {
    return Promise.join(
      createGroupMembership('Cooper', 'Whinny Staff', true, false, true),
      createGroupMembership('Cooper', 'Gray Filly Farm', false, false, false),
      createGroupMembership('Cooper', 'Secret invite only group', true, true, true),
      createGroupMembership('Cooper', 'Somerset Farms', true, false, false),

      createGroupMembership('Morgan', 'Whinny Staff', true, true, true),
      createGroupMembership('Morgan', 'Paragon Equestrian Centre', true, false, true),
      createGroupMembership('Morgan', 'Gray Filly Farm', true, false, true),
      createGroupMembership('Morgan', 'Somerset Farms', true, false, false),

      createGroupMembership('George', 'Whinny Staff', false, true, true),
      createGroupMembership('George', 'Gray Filly Farm', false, false, true),
      createGroupMembership('George', 'Caribou Ranch', true, true, true)
    )
  });

  function createGroupMembership(first_name, group_name, admin, owner, notifications){
    var result = {
      notifications: notifications,
      admin: admin
     };
    return knex('users').where('first_name', first_name).first().then(function (user_obj) {
      result.user_id = user_obj.user_id;
      return knex('groups').where('group_name', group_name).first();
    }).then(function (group_obj) {
      result.group_id = group_obj.group_id;
      return knex('group_memberships').insert(result);
    });
  }
};
