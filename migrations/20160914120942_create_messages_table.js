//Messages
exports.up = function(knex, Promise) {
  return knex.schema.createTable('messages', function (table) {
    table.increments('message_id');

    table.timestamp('message_created').defaultTo(knex.fn.now());

    table.integer('to_user')
         .notNullable()
         .unsigned()
         .references('user_id')
         .inTable('users')
         .onDelete('cascade');

    table.string('message_type'); //solo, group, or broadcast

    table.integer('from_user')
         .unsigned()
         .references('user_id')
         .inTable('users') //Used for solo and group messages. Can be null.
         .onDelete('cascade');

    table.integer('broadcast_id')
         .unsigned()
         .references('broadcast_id')
         .inTable('broadcasts') //used only for broadcasts. Can be null.
         .onDelete('cascade');

    table.integer('group_id')
         .unsigned()
         .references('broadcast_id')
         .inTable('broadcasts') //used only for broadcasts. Can be null.
         .onDelete('cascade');


    table.string('content');

    table.boolean('read');
    table.timestamp('time_read');
    table.boolean('sent_in_app');
    table.boolean('sent_as_mms');

    //would be a copy from the broadcast location data
    //the client checks to see if this is limited and then based on user rules
    //whether or not each message is displayed
    table.boolean('geographically_limited');
    table.string('state');
    table.integer('zip');

    table.decimal('latitude', 20, 10);
    table.decimal('longitude', 20, 10);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('messages');
};
