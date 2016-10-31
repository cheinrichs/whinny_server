
exports.up = function(knex, Promise) {
  return knex.schema.createTable('group_applications', function (table) {
    table.increments('application_id');

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

    table.string('status')

  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('group_applications');
};
