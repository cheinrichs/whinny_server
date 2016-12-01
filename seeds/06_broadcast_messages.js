
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('broadcast_messages').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('broadcast_messages').insert({
          to_broadcast: 1,
          from_user: 1,
          broadcast_photo_url: 'http://vignette1.wikia.nocookie.net/disney/images/4/4d/Winniethepooh-disneyscreencaps.com-4335.jpg/revision/latest?cb=20110508025700',
          broadcast_title: 'Woozles. I repeat. Woozles',
          broadcast_message: 'Wooozles are currently affecting barns all across the front range',
          link_text: 'Whinny the Pooh Song',
          link_url: 'https://www.youtube.com/watch?v=j21f7aeTrbc'
        }),
        knex('broadcast_messages').insert({
          to_broadcast: 2,
          from_user: 1,
          broadcast_photo_url: 'http://cdn.thefiscaltimes.com/sites/default/files/KentuckyDerbyRace.jpeg',
          broadcast_title: 'Race Results 12/19/16',
          broadcast_message: 'This horse was faster than that horse. If you lost money please don\'t blame us',
          link_text: 'Duck Blur',
          link_url: 'https://www.youtube.com/watch?v=mCJkVTBSq0M'
        }),
        knex('broadcast_messages').insert({
          to_broadcast: 3,
          from_user: 2,
          broadcast_photo_url: 'http://www.boydandsilvamartin.com/wp-content/uploads/2009/03/Palm-Beach-Dressage-Derby-252.jpg',
          broadcast_title: 'Show Attire Update',
          broadcast_message: 'Please note: Puting a tutu on your horse will not help it\'s pirouettes',
          link_text: 'Dancing queen',
          link_url: 'https://www.youtube.com/watch?v=xFrGuyw1V8s'
        }),
        knex('broadcast_messages').insert({
          to_broadcast: 4,
          from_user: 2,
          broadcast_photo_url: 'http://vignette1.wikia.nocookie.net/disney/images/4/4d/Winniethepooh-disneyscreencaps.com-4335.jpg/revision/latest?cb=20110508025700',
          broadcast_title: 'Lost Dog',
          broadcast_message: 'We have a lost long hair dachshund. He is demanding roast chicken at the front office.',
          link_text: 'Contact',
          link_url: 'http://rejectionline.com/'
        })
      ]);
    });
};
