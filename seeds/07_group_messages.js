
exports.seed = function(knex, Promise) {
  return Promise.join(
    knex('group_messages').del()
  ).then(function () {
    return Promise.join(

      // createGroupMessage('Cooper', 'Whinny Staff', ''),
      // createGroupMessage('Cooper', 'Gray Filly Farm', ''),
      //
      // createGroupMessage('Morgan', 'Paragon Equestrian Centre', ''),
      // createGroupMessage('Morgan', 'Gray Filly Farm', ''),
      // createGroupMessage('Morgan', 'Whinny Staff', ''),
      //
      // createGroupMessage('George', 'Whinny Staff', '')
    )
  });

  function createGroupMessage(from_first_name, group_name, content){
    var result = { group_message_content: content };
    return knex('users').where('first_name', from_first_name).first().then(function (user_obj) {
      result.from_user = user_obj.user_id;
      return knex('groups').where('group_name', group_name).first();
    }).then(function (group_obj) {
      result.to_group = group_obj.group_id;
      return knex('group_messages').insert(result);
    });
  }
};
