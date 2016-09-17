//Groups
exports.up = function(knex, Promise) {
  return knex.schema.createTable('groups', function (table) {
    table.increments('group_id');

    table.timestamp('group_created_at').defaultTo(knex.fn.now());
    table.timestamp('last_used').defaultTo(knex.fn.now());

    table.string('group_name').notNullable();
    table.string('group_photo');

    table.boolean('is_private');
    table.boolean('is_hidden');
    table.boolean('users_can_respond');
    table.boolean('geographically_limited');

    table.decimal('group_latitude', 20, 10);
    table.decimal('group_longitude', 20, 10);
    table.integer('group_zip').unsigned();
    table.string('group_state');

    table.string('group_discipline');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('groups')
};
