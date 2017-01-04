
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('broadcast_messages').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        // knex('broadcast_messages').insert({
        //   to_broadcast: 2,
        //   from_user: 1,
        //   broadcast_photo_url: 'https://s3.amazonaws.com/whinnyphotos/broadcast_message_photos/broadcast_message_photo_1.jpg',
        //   broadcast_title: 'Woozles. I repeat. Woozles',
        //   broadcast_message: 'Wooozles are currently affecting barns all across the front range',
        //   link_text: 'Whinny the Pooh Song',
        //   link_url: 'https://www.youtube.com/watch?v=j21f7aeTrbc'
        // }),
        // knex('broadcast_messages').insert({
        //   to_broadcast: 1,
        //   from_user: 1,
        //   broadcast_photo_url: 'https://s3.amazonaws.com/whinnyphotos/broadcast_message_photos/broadcast_message_photo_2.jpg',
        //   broadcast_title: 'Race Results 12/19/16',
        //   broadcast_message: 'This horse was faster than that horse. If you lost money please don\'t blame us',
        //   link_text: 'Duck Blur',
        //   link_url: 'https://www.youtube.com/watch?v=mCJkVTBSq0M'
        // }),
        // knex('broadcast_messages').insert({
        //   to_broadcast: 3,
        //   from_user: 2,
        //   broadcast_photo_url: 'https://s3.amazonaws.com/whinnyphotos/broadcast_message_photos/broadcast_message_photo_3.jpg',
        //   broadcast_title: 'Show Attire Update',
        //   broadcast_message: 'Please note: Puting a tutu on your horse will not help it\'s pirouettes',
        //   link_text: 'Dancing queen',
        //   link_url: 'https://www.youtube.com/watch?v=xFrGuyw1V8s'
        // }),
        // knex('broadcast_messages').insert({
        //   to_broadcast: 4,
        //   from_user: 2,
        //   broadcast_photo_url: 'https://s3.amazonaws.com/whinnyphotos/broadcast_message_photos/broadcast_message_photo_4.jpg',
        //   broadcast_title: '',
        //   broadcast_message: 'I think we can all relate',
        //   link_text: '',
        //   link_url: ''
        // }),
        // knex('broadcast_messages').insert({
        //   to_broadcast: 4,
        //   from_user: 2,
        //   broadcast_photo_url: 'https://s3.amazonaws.com/whinnyphotos/broadcast_message_photos/broadcast_message_photo_5.jpg',
        //   broadcast_title: '',
        //   broadcast_message: 'So true',
        //   link_text: '',
        //   link_url: ''
        // }),
        // knex('broadcast_messages').insert({
        //   to_broadcast: 4,
        //   from_user: 2,
        //   broadcast_photo_url: 'https://s3.amazonaws.com/whinnyphotos/broadcast_message_photos/broadcast_message_photo_6.jpg',
        //   broadcast_title: '',
        //   broadcast_message: 'I wouldn\'t question him',
        //   link_text: '',
        //   link_url: ''
        // })
      ]);
    });
};
