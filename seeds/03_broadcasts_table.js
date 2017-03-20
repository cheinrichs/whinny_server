
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('broadcasts').del()
    .then(function () {
      return knex('broadcasts').insert({
        broadcast_name: 'Beautiful Barns',
        broadcast_description: 'Photos of barn architecture from around the world.',
        broadcast_photo: 'https://s3.amazonaws.com/whinnyphotos/broadcast_profile_photos/1_BroadcastProfilePic.png',
        broadcast_photo_small: 'https://s3.amazonaws.com/whinnyphotos/broadcast_profile_photos/1_BroadcastProfilePic_small.png',
        geographically_limited: true,
        broadcast_latitude: '40.167207',
        broadcast_longitude: '-105.101927',
        broadcast_zip: 30333,
        broadcast_state: 'GA',
        broadcast_discipline: 'All'
      }).then(function () {
        return knex('broadcasts').insert({
          broadcast_name: 'Equestrian News',
          broadcast_description: 'International news from the horse world.',
          broadcast_photo: 'https://s3.amazonaws.com/whinnyphotos/broadcast_profile_photos/2_BroadcastProfilePic.png',
          broadcast_photo_small: 'https://s3.amazonaws.com/whinnyphotos/broadcast_profile_photos/2_BroadcastProfilePic_small.png',
          geographically_limited: false,
          broadcast_latitude: '40.167207',
          broadcast_longitude: '-105.101927',
          broadcast_zip: 40201,
          broadcast_state: 'KY',
          broadcast_discipline: 'Racing'
        }).then(function () {
          return knex('broadcasts').insert({
            broadcast_name: 'Horse Humor',
            broadcast_description: 'To bring a smile (or two) to your day.',
            broadcast_photo: 'https://s3.amazonaws.com/whinnyphotos/broadcast_profile_photos/3_BroadcastProfilePic.jpg',
            broadcast_photo_small: 'https://s3.amazonaws.com/whinnyphotos/broadcast_profile_photos/3_BroadcastProfilePic_small.jpg',
            geographically_limited: false,
            broadcast_latitude: '40.167207',
            broadcast_longitude: '-105.101927',
            broadcast_zip: 33480,
            broadcast_state: 'FL',
            broadcast_discipline: 'Drassage'
          }).then(function () {
            return knex('broadcasts').insert({
              broadcast_name: 'EqBusiness',
              broadcast_description: 'Business tips for the equestrian professional.',
              broadcast_photo: 'https://s3.amazonaws.com/whinnyphotos/broadcast_profile_photos/4_BroadcastProfilePic.png',
              broadcast_photo_small: 'https://s3.amazonaws.com/whinnyphotos/broadcast_profile_photos/4_BroadcastProfilePic_small.png',
              geographically_limited: false,
              broadcast_latitude: '40.167207',
              broadcast_longitude: '-105.101927',
              broadcast_zip: 92014,
              broadcast_state: 'CA',
              broadcast_discipline: 'Drassage'
            }).then(function () {
              return knex('broadcasts').insert({
                broadcast_name: 'Whinny Tips',
                broadcast_description: 'Learn more about Whinny, stay up to date, and more!',
                broadcast_photo: 'https://s3.amazonaws.com/whinnyphotos/broadcast_profile_photos/5_BroadcastProfilePic.jpg',
                broadcast_photo_small: 'https://s3.amazonaws.com/whinnyphotos/broadcast_profile_photos/5_BroadcastProfilePic_small.jpg',
                geographically_limited: false,
                broadcast_latitude: '40.167207',
                broadcast_longitude: '-105.101927',
                broadcast_zip: 92014,
                broadcast_state: 'CA',
                broadcast_discipline: 'Drassage'
              }).then(function () {
                return knex('broadcasts').insert({
                  broadcast_name: 'EqFashion',
                  broadcast_description: 'Equestrian fashion inspiration and trends.',
                  broadcast_photo: 'https://s3.amazonaws.com/whinnyphotos/broadcast_profile_photos/6_BroadcastProfilePic.png',
                  broadcast_photo_small: 'https://s3.amazonaws.com/whinnyphotos/broadcast_profile_photos/6_BroadcastProfilePic_small.png',
                  geographically_limited: false,
                  broadcast_latitude: '40.167207',
                  broadcast_longitude: '-105.101927',
                  broadcast_zip: 92014,
                  broadcast_state: 'CA',
                  broadcast_discipline: 'Drassage'
                }).then(function () {
                  return knex('broadcasts').insert({
                    broadcast_name: 'Disease Communication Center',
                    broadcast_description: 'Equine contagious disease alerts from the Equine Disease Communication Center.',
                    broadcast_photo: 'https://s3.amazonaws.com/whinnyphotos/broadcast_profile_photos/7_BroadcastProfilePic.jpg',
                    broadcast_photo_small: 'https://s3.amazonaws.com/whinnyphotos/broadcast_profile_photos/7_BroadcastProfilePic_small.jpg',
                    geographically_limited: false,
                    broadcast_latitude: '40.167207',
                    broadcast_longitude: '-105.101927',
                    broadcast_zip: 92014,
                    broadcast_state: 'CA',
                    broadcast_discipline: 'Drassage'
                  }).then(function () {
                    return knex('broadcasts').insert({
                      broadcast_name: 'Equine Veterinary Info',
                      broadcast_description: 'Equine veterinary tips, information, and news. Always consult with your own vet. ',
                      broadcast_photo: 'https://s3.amazonaws.com/whinnyphotos/broadcast_profile_photos/8_BroadcastProfilePic.png',
                      broadcast_photo_small: 'https://s3.amazonaws.com/whinnyphotos/broadcast_profile_photos/8_BroadcastProfilePic_small.png',
                      geographically_limited: false,
                      broadcast_latitude: '40.167207',
                      broadcast_longitude: '-105.101927',
                      broadcast_zip: 92014,
                      broadcast_state: 'CA',
                      broadcast_discipline: 'Drassage'
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
