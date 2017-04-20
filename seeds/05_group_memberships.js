exports.seed = function(knex, Promise) {
  return Promise.join(
    knex('group_memberships').del()
  ).then(function () {
    return Promise.join(
      createGroupMembership('Cooper', 'Whinny Staff', true, true, true),
      createGroupMembership('Cooper', 'Paragon Equestrian Centre', false, false, false),
      createGroupMembership('Cooper', 'Gray Filly Farm', false, false, false),
      createGroupMembership('Cooper', 'Secret invite only group', true, true, true),
      createGroupMembership('Cooper', 'Somerset Farms', true, false, false),
      createGroupMembership('Cooper', 'Caribou Ranch', false, false, true),

      createGroupMembership('Morgan', 'Dressage Pacifico', true, true, false),
      createGroupMembership('Morgan', 'Gray Filly Farm', true, true, true),
      createGroupMembership('Morgan', 'Jessica Greer Dressage', true, true, false),
      createGroupMembership('Morgan', 'Whinny Staff', false, false, true),
      createGroupMembership('Morgan', 'Paragon Equestrian Centre', true, true, false),
      createGroupMembership('Morgan', 'Rabbit Mountain Equestrian Center', true, true, false),
      createGroupMembership('Morgan', 'Wild Rose Farm', true, true, false),
      createGroupMembership('Morgan', 'Secret invite only group', true, true, false),
      createGroupMembership('Morgan', 'Somerset Farms', true, true, false),
      createGroupMembership('Morgan', 'Caribou Ranch', true, true, true),

      createGroupMembership('George', 'Whinny Staff', false, false, true),
      createGroupMembership('George', 'Gray Filly Farm', false, false, true),
      createGroupMembership('George', 'Caribou Ranch', true, true, true),
      createGroupMembership('George', 'Paragon Equestrian Centre', false, false, false)
    )
  });

  function createGroupMembership(first_name, group_name, admin, owner, notifications){
    var result = {
      notifications: notifications,
      admin: admin,
      owner: owner
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
