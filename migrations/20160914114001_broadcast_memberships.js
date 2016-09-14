
exports.up = function(knex, Promise) {
  return knex.schema.createTable('broadcast_memberships', function (table) {
    table.increments('broadcast_membership_id');

    table.integer('user_id')
         .unsigned()
         .notNullable()
         .references('user_id')
         .inTable('users')
         .onDelete('cascade');
         
    table.integer('broadcast_id')
         .unsigned()
         .notNullable()
         .references('broadcast_id')
         .inTable('broadcasts')
         .onDelete('cascade');

    table.boolean('admin');

    table.boolean('notifications');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('broadcast_memberships');
};
