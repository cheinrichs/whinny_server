
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('broadcast_read_by').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        createBroadcastReadByRecord('5', '1', 'How to Unsubscribe from Broadcasts', false),
        createBroadcastReadByRecord('5', '1', 'Hidden Groups', false)

      ]);
  });

    function createBroadcastReadByRecord(broadcast_id, to_user_id, title, read){
      var result = {
        broadcast_id: broadcast_id,
        user_id: to_user_id,
        read: false,
        time_read: null
      };

      return knex('broadcast_messages').where('broadcast_title', title).first().then(function (message) {
        result.broadcast_message_id = message.broadcast_message_id;
        return knex('broadcast_read_by').insert(result);
      });
    }
};
