
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('broadcasts').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('broadcasts').insert({
          broadcast_name: 'Whinny Tips',
          broadcast_photo: 'https://s3.amazonaws.com/whinnyphotos/broadcast_profile_photos/1_BroadcastProfilePic.jpg',
          geographically_limited: true,
          broadcast_latitude: '40.167207',
          broadcast_longitude: '-105.101927',
          broadcast_zip: 30333,
          broadcast_state: 'GA',
          broadcast_discipline: 'All'
        }),
        knex('broadcasts').insert({
          broadcast_name: 'EDCC Contagious Disease Alerts',
          broadcast_photo: 'https://s3.amazonaws.com/whinnyphotos/broadcast_profile_photos/2_BroadcastProfilePic.jpg',
          geographically_limited: false,
          broadcast_latitude: '40.167207',
          broadcast_longitude: '-105.101927',
          broadcast_zip: 40201,
          broadcast_state: 'KY',
          broadcast_discipline: 'Racing'
        }),
        knex('broadcasts').insert({
          broadcast_name: 'Equestrian News',
          broadcast_photo: 'https://s3.amazonaws.com/whinnyphotos/broadcast_profile_photos/3_BroadcastProfilePic.jpg',
          geographically_limited: false,
          broadcast_latitude: '40.167207',
          broadcast_longitude: '-105.101927',
          broadcast_zip: 33480,
          broadcast_state: 'FL',
          broadcast_discipline: 'Drassage'
        }),
        knex('broadcasts').insert({
          broadcast_name: 'Funnies',
          broadcast_photo: 'https://s3.amazonaws.com/whinnyphotos/broadcast_profile_photos/4_BroadcastProfilePic.jpg',
          geographically_limited: false,
          broadcast_latitude: '40.167207',
          broadcast_longitude: '-105.101927',
          broadcast_zip: 92014,
          broadcast_state: 'CA',
          broadcast_discipline: 'Drassage'
        }),
        knex('broadcasts').insert({
          broadcast_name: 'Barn Business',
          broadcast_photo: 'https://s3.amazonaws.com/whinnyphotos/broadcast_profile_photos/5_BroadcastProfilePic.jpg',
          geographically_limited: false,
          broadcast_latitude: '40.167207',
          broadcast_longitude: '-105.101927',
          broadcast_zip: 92014,
          broadcast_state: 'CA',
          broadcast_discipline: 'Drassage'
        }),
        knex('broadcasts').insert({
          broadcast_name: 'Beautiful Barns',
          broadcast_photo: 'https://s3.amazonaws.com/whinnyphotos/broadcast_profile_photos/6_BroadcastProfilePic.jpg',
          geographically_limited: false,
          broadcast_latitude: '40.167207',
          broadcast_longitude: '-105.101927',
          broadcast_zip: 92014,
          broadcast_state: 'CA',
          broadcast_discipline: 'Drassage'
        }),
        knex('broadcasts').insert({
          broadcast_name: 'Equestrian Style',
          broadcast_photo: 'https://s3.amazonaws.com/whinnyphotos/broadcast_profile_photos/7_BroadcastProfilePic.jpg',
          geographically_limited: false,
          broadcast_latitude: '40.167207',
          broadcast_longitude: '-105.101927',
          broadcast_zip: 92014,
          broadcast_state: 'CA',
          broadcast_discipline: 'Drassage'
        }),
        knex('broadcasts').insert({
          broadcast_name: 'Valegro',
          broadcast_photo: 'https://s3.amazonaws.com/whinnyphotos/broadcast_profile_photos/8_BroadcastProfilePic.jpg',
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
