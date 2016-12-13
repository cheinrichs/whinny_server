//Users
exports.up = function(knex, Promise) {
  return knex.schema.createTable('user_action_log', function(table){
    table.increments('action_id');

    table.integer('user_id').unsigned().notNullable();

    table.string('action');

    table.timestamp('action_time');

  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('user_action_log');
};
