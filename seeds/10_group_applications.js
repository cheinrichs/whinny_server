exports.seed = function(knex, Promise) {
  return Promise.join(
    knex('group_applications').del()
  ).then(function () {
    return Promise.join(
      createGroupApplication('Cooper', 'Paragon Equestrian Centre'),
      createGroupApplication('Megan', 'Wild Rose Farm'),
      createGroupApplication('Pete', 'Secret invite only group'),
      createGroupApplication('Megan', 'Secret invite only group'),
      createGroupApplication('Megan', 'Somerset Farms')

    )
  });


  function createGroupApplication(first_name, group_name) {
    var groupApplication = {
      status: 'pending'
    };
    return knex('users').where('first_name', first_name).first().then(function (user_obj) {
      groupApplication.user_id = user_obj.user_id;
      return knex('groups').where('group_name', group_name).first();
    }).then(function (group_obj) {
      groupApplication.group_id = group_obj.group_id;
      return knex('group_applications').insert(groupApplication);
    });
  }
};
