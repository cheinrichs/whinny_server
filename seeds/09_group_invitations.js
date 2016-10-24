exports.seed = function(knex, Promise) {
  return Promise.join(
    knex('group_invitations').del()
  ).then(function () {
    return Promise.join(
      createGroupInvitation('Cooper', 'Horse Fans'),
      createGroupInvitation('Morgan', 'Horse Application Developers'),
      createGroupInvitation('George', 'Paragon')
    )
  });


  function createGroupInvitation(first_name, group_name) {
    var groupInvitation = {
      status: 'pending'
    };
    return knex('users').where('first_name', first_name).first().then(function (user_obj) {
      groupInvitation.user_id = user_obj.user_id;
      return knex('groups').where('group_name', group_name).first();
    }).then(function (group_obj) {
      groupInvitation.group_id = group_obj.group_id;
      return knex('group_invitations').insert(groupInvitation);
    });
  }
};
