
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('group_message_read_by').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        // createGroupReadByRecord(group_id, to_user_id, content, read)
        // to_user_id = the user that will read the message
        // There is a record for every user in the group for every message
        createGroupReadByRecord('2', '1', 'Testing - GFF', false),
        createGroupReadByRecord('4', '1', 'Testing - Whinny Staff', false),
        createGroupReadByRecord('5', '1', 'Testing - Paragon Equestrian Centre', false),
        createGroupReadyByRecordImage('4', '1', 'https://s3.amazonaws.com/whinnyphotos/chat_images/1_chatMessage_2134134132412.jpg', false),

        createGroupReadByRecord('2', '2', 'Testing - GFF', false),
        createGroupReadByRecord('4', '2', 'Testing - Whinny Staff', false),
        createGroupReadByRecord('5', '2', 'Testing - Paragon Equestrian Centre', false),
        createGroupReadyByRecordImage('4', '2', 'https://s3.amazonaws.com/whinnyphotos/chat_images/1_chatMessage_2134134132412.jpg', false),

        createGroupReadByRecord('2', '3', 'Testing - GFF', false),
        createGroupReadByRecord('4', '3', 'Testing - Whinny Staff', false),
        createGroupReadByRecord('5', '3', 'Testing - Paragon Equestrian Centre', false),
        createGroupReadyByRecordImage('4', '2', 'https://s3.amazonaws.com/whinnyphotos/chat_images/1_chatMessage_2134134132412.jpg', false),




      ]);
    });

    function createGroupReadByRecord(group_id, to_user_id, content, read){
      var result = {
        group_id: group_id,
        to_user_id: to_user_id,
        read: read,
        time_read: null
      };
      return knex('group_messages').where('group_message_content', content).first().then(function (message) {
        result.group_message_id = message.group_message_id;
        return knex('group_message_read_by').insert(result);
      });
    }

    function createGroupReadyByRecordImage(group_id, to_user_id, link, read) {
      var result = {
        group_id: group_id,
        to_user_id: to_user_id,
        read: read,
        time_read: null
      };
      return knex('group_messages').where('image_src', link).first().then(function (message) {
        result.group_message_id = message.group_message_id;
        return knex('group_message_read_by').insert(result);
      });
    }
};
