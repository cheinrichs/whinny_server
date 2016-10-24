
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('groups').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('groups').insert({
          group_name: 'Paragon',
          group_photo: 'https://i.homeadore.com/2013/03/002-fultonville-barn-heritage-barns.jpg',
          description: 'For patrons of Paragon, the penultimate solution for your barning requirements',
          is_private: true,
          is_hidden: false,
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
          group_photo: 'https://s-media-cache-ak0.pinimg.com/564x/c0/1a/89/c01a898f3c249ce6f2551ea7127e563a.jpg',
          description: 'Do you like horses? Wow so do we!',
          is_private: false,
          is_hidden: false,
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
          group_photo: 'http://www.datamation.com/img/2009/05/iphone-app-development.jpg',
          description: 'LF other lonely souls',
          is_private: false,
          is_hidden: false,
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
          group_photo: 'http://vignette1.wikia.nocookie.net/disney/images/5/54/Pooh-bear-clip-art-winniepooh_1_800_800.jpg/revision/latest?cb=20140909020750',
          description: 'Private group for Whinny Staff',
          is_private: true,
          is_hidden: true,
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
