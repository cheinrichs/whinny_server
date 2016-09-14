
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('broadcasts').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('broadcasts').insert({
          broadcast_name: 'EDCC Contagious Disease Alerts',
          broadcast_photo: 'Photo link',
          geographically_limited: true,
          broadcast_latitude: '40.167207',
          broadcast_longitude: '-105.101927',
          broadcast_zip: 30333,
          broadcast_state: 'GA',
          broadcast_discipline: 'All'
        }),
        knex('broadcasts').insert({
          broadcast_name: 'Kentucky Derby Race Results',
          broadcast_photo: 'Photo link',
          geographically_limited: false,
          broadcast_latitude: '40.167207',
          broadcast_longitude: '-105.101927',
          broadcast_zip: 40201,
          broadcast_state: 'KY',
          broadcast_discipline: 'All'
        })
      ]);
    });
};
