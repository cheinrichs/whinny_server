//Broadcast Messages
exports.up = function(knex, Promise) {
  return knex.schema.createTable('broadcast_messages', function (table) {
    table.increments('broadcast_message_id');

    table.timestamp('broadcast_message_created').defaultTo(knex.fn.now());

    table.integer('to_broadcast')
         .unsigned()
         .notNullable()
         .references('broadcast_id')
         .inTable('broadcasts')
         .onDelete('cascade');

    table.integer('from_user')
         .unsigned()
         .notNullable()
         .references('user_id')
         .inTable('users')
         .onDelete('cascade');

    table.string('broadcast_message_content');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('broadcast_messages');
};
