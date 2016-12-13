
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('user_action_log').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('user_action_log').insert({
          user_id: '1',
          action: 'Restarted the logs',
          action_time: knex.fn.now()
        })
      ]);
    });
};
