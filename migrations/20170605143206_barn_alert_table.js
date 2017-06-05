exports.up = function(knex, Promise) {
  return knex.schema.createTable('barn_alerts', function(table){
    table.increments('alert_id');
    table.string('tweet_id');

    table.dateTime('date');
    table.string('status');
    table.string('disease');
    table.string('content');

    table.string('city');
    table.string('state');

    table.string('source');
    table.string('source_link');
 
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('barn_alerts');
};
