exports.seed = function(knex, Promise) {
  return Promise.join(
    knex('group_memberships').del()
  ).then(function () {
    return Promise.join(
      createGroupMembership('Cooper', 'Horse Application Developers', true, true),
      createGroupMembership('Cooper', 'Whinny Staff', false, false),
      createGroupMembership('Morgan', 'Whinny Staff', true, false),
      createGroupMembership('Morgan', 'Paragon', true, false),
      createGroupMembership('Morgan', 'Horse Fans', false, true)
    )
  });

  function createGroupMembership(first_name, group_name, admin, notifications){
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
