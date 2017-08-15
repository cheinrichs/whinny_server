
exports.seed = function(knex, Promise) {
  return Promise.join(
    knex('group_messages').del()
  ).then(function () {
    return Promise.join(

      createGroupMessage('Megan', 'Paragon Equestrian Centre', 'Testing - Paragon Equestrian Centre', false, null),
      createGroupMessage('Megan', 'Gray Filly Farm', 'Testing - GFF', false, null),
      createGroupMessage('Megan', 'Whinny Staff', 'Testing - Whinny Staff', false, null),

      createGroupMessage('Megan', 'Whinny Staff', '', true, 'https://s3.amazonaws.com/whinnyphotos/chat_images/1_chatMessage_2134134132412.jpg'),


      createGroupMessage('Megan', 'Harley Medical Log', 'Fed Harley', false, null),
      createGroupMessage('Megan', 'Harley Medical Log', 'Harley looking a little lame', false, null),
      createGroupMessage('Megan', 'Harley Medical Log', 'Dressage Training', false, null),
      createGroupMessage('Pete', 'Harley Medical Log', 'fed Harley', false, null),
      createGroupMessage('Megan', 'Harley Medical Log', 'Gave Harley 2 extra carrots :D', false, null),
      createGroupMessage('Megan', 'Harley Medical Log', 'Fed Harley', false, null),
      createGroupMessage('Pete', 'Harley Medical Log', 'Pasture', false, null),
      createGroupMessage('Megan', 'Harley Medical Log', 'Fed Harley', false, null),
      createGroupMessage('Pete', 'Harley Medical Log', 'Pasture', false, null)

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
