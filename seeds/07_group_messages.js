
exports.seed = function(knex, Promise) {
  return Promise.join(
    knex('group_messages').del()
  ).then(function () {
    return Promise.join(

      createGroupMessage('Morgan', 'Paragon Equestrian Centre', 'Testing - Paragon Equestrian Centre', false, null),
      createGroupMessage('Morgan', 'Gray Filly Farm', 'Testing - GFF', false, null),
      createGroupMessage('Morgan', 'Whinny Staff', 'Testing - Whinny Staff', false, null),

      createGroupMessage('Morgan', 'Whinny Staff', '', true, 'https://thewondrous.com/wp-content/uploads/2015/05/horse-funny.jpg')

    )
  });

  function createGroupMessage(from_first_name, group_name, content, image, image_src){
    var result = {
      group_message_content: content,
      image: image,
      image_src: image_src
    };
    return knex('users').where('first_name', from_first_name).first().then(function (user_obj) {
      result.from_user = user_obj.user_id;
      return knex('groups').where('group_name', group_name).first();
    }).then(function (group_obj) {
      result.to_group = group_obj.group_id;
      return knex('group_messages').insert(result);
    });
  }
};
