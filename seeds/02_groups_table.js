
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('groups').del()
    .then(function () {
      return knex('groups').insert({
          group_name: 'Dressage Pacifico',
          group_photo: 'https://s3.amazonaws.com/whinnyphotos/group_profile_photos/1_GroupProfilePic.jpg',
          description: 'Longmont, Colorado',
          is_private: true,
          is_hidden: false,
          users_can_respond: true,
          geographically_limited: false,
          group_latitude: '40.167207',
          group_longitude: '-105.101927',
          group_zip: 80501,
          group_state: 'CO',
          group_discipline: 'Drassage'
        }).then(function () {
          return knex('groups').insert({
            group_name: 'Gray Filly Farm',
            group_photo: 'https://s3.amazonaws.com/whinnyphotos/group_profile_photos/2_GroupProfilePic.jpg',
            description: 'Longmont, Colorado',
            is_private: true,
            is_hidden: false,
            users_can_respond: true,
            geographically_limited: false,
            group_latitude: '40.167207',
            group_longitude: '-105.101927',
            group_zip: null,
            group_state: null,
            group_discipline: 'All'
          }).then(function () {
            return knex('groups').insert({
              group_name: 'Jessica Greer Dressage',
              group_photo: 'https://s3.amazonaws.com/whinnyphotos/group_profile_photos/3_GroupProfilePic.jpg',
              description: 'Berthoud, Colorado',
              is_private: true,
              is_hidden: false,
              users_can_respond: true,
              geographically_limited: false,
              group_latitude: '40.167207',
              group_longitude: '-105.101927',
              group_zip: null,
              group_state: null,
              group_discipline: 'All'
            }).then(function () {
              return knex('groups').insert({
                group_name: 'Whinny Staff',
                group_photo: 'https://s3.amazonaws.com/whinnyphotos/group_profile_photos/4_GroupProfilePic.jpg',
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
              }).then(function () {
                return knex('groups').insert({
                  group_name: 'Paragon Equestrian Centre',
                  group_photo: 'https://s3.amazonaws.com/whinnyphotos/group_profile_photos/5_GroupProfilePic.jpg',
                  description: 'Berthoud, Colorado',
                  is_private: true,
                  is_hidden: false,
                  users_can_respond: true,
                  geographically_limited: false,
                  group_latitude: '40.167207',
                  group_longitude: '-105.101927',
                  group_zip: null,
                  group_state: null,
                  group_discipline: 'All'
                }).then(function () {
                  return knex('groups').insert({
                    group_name: 'Rabbit Mountain Equestrian Center',
                    group_photo: 'https://s3.amazonaws.com/whinnyphotos/group_profile_photos/6_GroupProfilePic.jpg',
                    description: 'Longmont, Colorado',
                    is_private: true,
                    is_hidden: false,
                    users_can_respond: true,
                    geographically_limited: false,
                    group_latitude: '40.167207',
                    group_longitude: '-105.101927',
                    group_zip: null,
                    group_state: null,
                    group_discipline: 'All'
                  }).then(function () {
                    return knex('groups').insert({
                      group_name: 'Wild Rose Farm',
                      group_photo: 'https://s3.amazonaws.com/whinnyphotos/group_profile_photos/7_GroupProfilePic.jpg',
                      description: 'Longmont, Colorado',
                      is_private: true,
                      is_hidden: false,
                      users_can_respond: true,
                      geographically_limited: false,
                      group_latitude: '40.167207',
                      group_longitude: '-105.101927',
                      group_zip: null,
                      group_state: null,
                      group_discipline: 'All'
                    }).then(function () {
                      return knex('groups').insert({
                        group_name: 'Secret invite only group',
                        group_photo: 'https://s3.amazonaws.com/whinnyphotos/group_profile_photos/8_GroupProfilePic.jpg',
                        description: 'Theyre watching. Were watching back.',
                        is_private: true,
                        is_hidden: true,
                        users_can_respond: true,
                        geographically_limited: false,
                        group_latitude: '40.167207',
                        group_longitude: '-105.101927',
                        group_zip: null,
                        group_state: null,
                        group_discipline: 'All'
                      }).then(function () {
                        return knex('groups').insert({
                          group_name: 'Somerset Farms',
                          group_photo: 'https://s3.amazonaws.com/whinnyphotos/group_profile_photos/9_GroupProfilePic.jpg',
                          description: 'Longmont, Colorado',
                          is_private: true,
                          is_hidden: false,
                          users_can_respond: true,
                          geographically_limited: false,
                          group_latitude: '40.167207',
                          group_longitude: '-105.101927',
                          group_zip: null,
                          group_state: null,
                          group_discipline: 'All'
                        }).then(function () {
                          knex('groups').insert({
                              group_name: 'Lime Chip Fans',
                              group_photo: 'https://s3.amazonaws.com/whinnyphotos/group_profile_photos/10_GroupProfilePic.jpg',
                              description: 'Longmont, Colorado',
                              is_private: false,
                              is_hidden: false,
                              users_can_respond: true,
                              geographically_limited: false,
                              group_latitude: '40.167207',
                              group_longitude: '-105.101927',
                              group_zip: 80501,
                              group_state: 'CO',
                              group_discipline: 'Seriously, who doesn\'t love these things!'
                            })
                        })
                      })
                    })
                  })
                })
              })
            })
          })
        })
      });
};
