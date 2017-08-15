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

      createGroupMembership('Megan', 'Dressage Pacifico', true, true, false),
      createGroupMembership('Megan', 'Gray Filly Farm', true, true, true),
      createGroupMembership('Megan', 'Jessica Greer Dressage', true, true, false),
      createGroupMembership('Megan', 'Whinny Staff', false, false, true),
      createGroupMembership('Megan', 'Paragon Equestrian Centre', true, true, false),
      createGroupMembership('Megan', 'Rabbit Mountain Equestrian Center', true, true, false),
      createGroupMembership('Megan', 'Wild Rose Farm', true, true, false),
      createGroupMembership('Megan', 'Secret invite only group', true, true, false),
      createGroupMembership('Megan', 'Somerset Farms', true, true, false),
      createGroupMembership('Megan', 'Caribou Ranch', true, true, true),

      createGroupMembership('Pete', 'Whinny Staff', false, false, true),
      createGroupMembership('Pete', 'Gray Filly Farm', false, false, true),
      createGroupMembership('Pete', 'Caribou Ranch', true, true, true),
      createGroupMembership('Pete', 'Paragon Equestrian Centre', false, false, false)
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
