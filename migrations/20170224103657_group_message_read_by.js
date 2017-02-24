
exports.up = function(knex, Promise) {
  return knex.schema.createTable('group_message_read_by', function(table){
    table.increments('group_message_read_id');

    table.integer('group_id').unsigned().notNullable();

    table.integer('group_message_id').unsigned().notNullable();

    table.integer('to_user_id').unsigned().notNullable();

    table.boolean('read');

    table.timestamp('time_read');

  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('group_message_read_by');
};
