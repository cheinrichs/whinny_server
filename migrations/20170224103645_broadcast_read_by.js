
exports.up = function(knex, Promise) {
  return knex.schema.createTable('broadcast_read_by', function(table){
    table.increments('broadcast_read_id');

    table.integer('broadcast_id').unsigned().notNullable();

    table.integer('broadcast_message_id').unsigned().notNullable();

    table.integer('user_id').unsigned().notNullable();

    table.boolean('read');

    table.timestamp('time_read');

  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('broadcast_read_by');
};
