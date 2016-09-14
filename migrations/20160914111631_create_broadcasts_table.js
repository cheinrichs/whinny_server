//Broadcasts
exports.up = function(knex, Promise) {
  return knex.schema.createTable('broadcasts', function (table) {
    table.increments('broadcast_id');
    
    table.timestamp('broadcast_created_at').defaultTo(knex.fn.now());
    table.timestamp('last_used').defaultTo(knex.fn.now());

    table.string('broadcast_name');
    table.string('broadcast_photo');

    table.boolean('geographically_limited');

    table.decimal('broadcast_latitude', 20, 10);
    table.decimal('broadcast_longitude', 20, 10);
    table.integer('broadcast_zip');
    table.string('broadcast_state');

    table.string('broadcast_discipline');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('broadcasts');
};
