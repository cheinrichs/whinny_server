
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('groups').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('groups').insert({
          group_name: 'Paragon',
          group_photo: 'photo link',
          is_private: true,
          users_can_respond: true,
          geographically_limited: false,
          group_latitude: '40.167207',
          group_longitude: '-105.101927',
          group_zip: 80501,
          group_state: 'CO',
          group_discipline: 'Drassage'
        }),
        knex('groups').insert({
          group_name: 'Horse Fans',
          group_photo: 'photo link',
          is_private: false,
          users_can_respond: true,
          geographically_limited: false,
          group_latitude: '40.167207',
          group_longitude: '-105.101927',
          group_zip: null,
          group_state: null,
          group_discipline: 'All'
        }),
        knex('groups').insert({
          group_name: 'Horse Application Developers',
          group_photo: 'photo link',
          is_private: false,
          users_can_respond: true,
          geographically_limited: false,
          group_latitude: '40.167207',
          group_longitude: '-105.101927',
          group_zip: null,
          group_state: null,
          group_discipline: 'All'
        }),
        knex('groups').insert({
          group_name: 'Whinny Staff',
          group_photo: 'photo link',
          is_private: true,
          users_can_respond: true,
          geographically_limited: false,
          group_latitude: '40.167207',
          group_longitude: '-105.101927',
          group_zip: null,
          group_state: null,
          group_discipline: 'All'
        })
      ]);
    });
};
