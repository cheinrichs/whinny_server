
exports.up = function(knex, Promise) {
  return knex.schema.createTable('user_interests', function (table) {
    table.increments('user_interest_id');

    table.integer('user_id')
         .unsigned()
         .notNullable()
         .references('user_id')
         .inTable('users')
         .onDelete('cascade');

    table.integer('discipline_id')
         .unsigned()
         .notNullable()
         .references('discipline_id')
         .inTable('disciplines')
         .onDelete('cascade');

  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('user_interests');
};
