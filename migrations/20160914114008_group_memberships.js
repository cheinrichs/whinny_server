//Group Memberships
exports.up = function(knex, Promise) {
  return knex.schema.createTable('group_memberships', function (table) {
    table.increments('group_membership_id');

    table.integer('group_id')
         .unsigned()
         .notNullable()
         .references('group_id')
         .inTable('groups')
         .onDelete('cascade');

    table.integer('user_id')
         .unsigned()
         .notNullable()
         .references('user_id')
         .inTable('users')
         .onDelete('cascade');

    table.boolean('admin');

    table.boolean('notifications');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('group_memberships');
};
