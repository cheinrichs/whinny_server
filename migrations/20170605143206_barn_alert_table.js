exports.up = function(knex, Promise) {
  return knex.schema.createTable('barn_alert_table', function(table){
    table.increments('alert_id');

    table.string('content');
    table.string('state');

    table.decimal('alert_latitude', 20, 10);
    table.decimal('alert_longitude', 20, 10);

  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('barn_alert_table');
};
