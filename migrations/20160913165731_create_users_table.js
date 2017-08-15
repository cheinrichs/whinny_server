//Users
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(table){
    table.increments('user_id');
    table.string('email');
    table.string('phone').notNullable();
    table.string('first_name');
    table.string('last_name');
    table.string('password');

    table.string('portrait_link');

    table.boolean('message_notifications');
    table.boolean('group_notifications');
    table.boolean('broadcast_notifications');

    table.integer('country_code').unsigned().notNullable();

    table.timestamp('account_created').defaultTo(knex.fn.now());

    table.decimal('user_latitude', 20, 10);
    table.decimal('user_longitude', 20, 10);

    table.boolean('verified');

    table.timestamp('last_login');

    table.boolean('banned');
    table.timestamp('ban_timestamp');

    table.string('discipline');

    table.string('confirmation_code');
    table.string('email_confirmation_code');

    table.string('user_type');

    table.string('ip_address');

    table.boolean('tutorial_1');
    table.boolean('tutorial_2');
    table.boolean('tutorial_3');
    table.boolean('tutorial_4');
    table.boolean('tutorial_5');

    table.boolean('EULA');
    table.timestamp('EULA_date_agreed');

    table.boolean('account_is_setup');

    table.string('device_token');
  }
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
