
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('users').insert({
          email: 'cooper.heinrichs@gmail.com',
          phone: '3035892321',
          first_name: 'Cooper',
          last_name: 'Heinrichs',
          password: 'password',
          portrait_link: 'http://www.boostinspiration.com/wp-content/uploads/2010/09/11_victory_bw_photography.jpg',
          message_notifications: false,
          group_notifications: false,
          broadcast_notifications: false,
          country_code: 1,
          account_created: knex.fn.now(),
          user_latitude: '40.167207',
          user_longitude: '-105.101927',
          verified: true,
          last_login: knex.fn.now(),
          banned: false,
          ban_timestamp: null,
          discipline: 'Hunter/Jumper',
          confirmation_code: '54HW',
          user_type: 'App',
          ip_address: '69.170.209.157',
          tutorial_1: true,
          tutorial_2: true,
          tutorial_3: true,
          tutorial_4: true,
          tutorial_5: true,
          EULA: true,
          EULA_date_agreed: knex.fn.now()
        }),
        knex('users').insert({
          email: 'morgan.heinrichs@gmail.com',
          phone: '3035892428',
          first_name: 'Morgan',
          last_name: 'Heinrichs',
          password: 'password',
          portrait_link: 'http://orig09.deviantart.net/a6f2/f/2011/243/5/5/winter_people_by_belovaan-d48g3dk.jpg',
          message_notifications: false,
          group_notifications: false,
          broadcast_notifications: false,
          country_code: 1,
          account_created: knex.fn.now(),
          user_latitude: '40.167207',
          user_longitude: '-105.101927',
          verified: true,
          last_login: knex.fn.now(),
          banned: false,
          ban_timestamp: null,
          discipline: 'Drassage',
          confirmation_code: '3X1P',
          user_type: 'App',
          ip_address: '69.170.209.157',
          tutorial_1: false,
          tutorial_2: false,
          tutorial_3: true,
          tutorial_4: false,
          tutorial_5: true,
          EULA: true,
          EULA_date_agreed: knex.fn.now()
        })
      ]);
    });
};
