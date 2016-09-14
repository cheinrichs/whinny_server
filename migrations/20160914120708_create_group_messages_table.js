//Group Messages
exports.up = function(knex, Promise) {
  return knex.schema.createTable('group_messages', function (table) {
    table.increments('group_message_id');

    table.timestamp('group_message_created').defaultTo(knex.fn.now());

    table.integer('to_group')
         .unsigned()
         .notNullable()
         .references('group_id')
         .inTable('groups')
         .onDelete('cascade');

    table.integer('from_user')
         .unsigned()
         .notNullable()
         .references('user_id')
         .inTable('users')
         .onDelete('cascade');

    table.string('group_message_content');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('group_messages');
};
