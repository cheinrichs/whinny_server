
exports.seed = function(knex, Promise) {
  return Promise.join(
    knex('group_messages').del()
  ).then(function () {
    return Promise.join(


      createGroupMessage('Cooper', 'Whinny Staff', 'get back to work. all of yas'),
      createGroupMessage('Cooper', 'Gray Filly Farm', 'Someone left hay all over the road...'),

      createGroupMessage('Morgan', 'Paragon Equestrian Centre', 'Aleshe will help with the farrier today, thank you!'),
      createGroupMessage('Morgan', 'Gray Filly Farm', 'Ollie has had his medicine'),
      createGroupMessage('Morgan', 'Whinny Staff', 'Sry bbl I\'m riding!'),

      createGroupMessage('George', 'Whinny Staff', 'Are there any more gluten free cookies...?')
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
