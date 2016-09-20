
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('broadcasts').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('broadcasts').insert({
          broadcast_name: 'EDCC Contagious Disease Alerts',
          broadcast_photo: 'http://www.equinediseasecc.org/images/EDCC-logo-web.png',
          geographically_limited: true,
          broadcast_latitude: '40.167207',
          broadcast_longitude: '-105.101927',
          broadcast_zip: 30333,
          broadcast_state: 'GA',
          broadcast_discipline: 'All'
        }),
        knex('broadcasts').insert({
          broadcast_name: 'Kentucky Derby Race Results',
          broadcast_photo: 'http://sports-odds.com/images/assets/2014/05/kentucky-derby-logo.jpg',
          geographically_limited: false,
          broadcast_latitude: '40.167207',
          broadcast_longitude: '-105.101927',
          broadcast_zip: 40201,
          broadcast_state: 'KY',
          broadcast_discipline: 'Racing'
        }),
        knex('broadcasts').insert({
          broadcast_name: 'Palm Beach Drassage Derby',
          broadcast_photo: 'http://cache.trustedpartner.com/images/library/PalmBeachIllustrated2010/News%20&%20Blogs/Hot%20for-/2012/jan/wdm/dressage.jpg',
          geographically_limited: false,
          broadcast_latitude: '40.167207',
          broadcast_longitude: '-105.101927',
          broadcast_zip: 33480,
          broadcast_state: 'FL',
          broadcast_discipline: 'Drassage'
        }),
        knex('broadcasts').insert({
          broadcast_name: 'Del Mar National',
          broadcast_photo: 'http://delmarnational.com/wp-content/uploads/2016/06/dmnhs-logo.png',
          geographically_limited: false,
          broadcast_latitude: '40.167207',
          broadcast_longitude: '-105.101927',
          broadcast_zip: 92014,
          broadcast_state: 'CA',
          broadcast_discipline: 'Drassage'
        })
      ]);
    });
};
