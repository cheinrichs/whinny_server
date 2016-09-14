
exports.seed = function(knex, Promise) {
  return Promise.join(
    knex('group_messages').del()
  ).then(function () {
    return Promise.join(
      createGroupMessage('Cooper', 'Whinny Staff', 'get back to work. all of yas'),
      createGroupMessage('Cooper', 'Horse Application Developers', 'Oh hey! Looks like I\'m the only one'),
      createGroupMessage('Morgan', 'Paragon', 'We need more allergy medicine again or something'),
      createGroupMessage('Morgan', 'Horse Fans', 'Check out this HILAROOUSDOS foto -'),
      createGroupMessage('Morgan', 'Whinny Staff', 'Sry bbl I\'m riding!')
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
