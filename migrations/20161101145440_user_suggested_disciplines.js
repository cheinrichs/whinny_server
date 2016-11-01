
exports.up = function(knex, Promise) {
  return knex.schema.createTable('user_suggested_disciplines', function(table){
    table.increments('suggestion_id');
    table.string('suggested_discipline');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('user_suggested_disciplines');
};
