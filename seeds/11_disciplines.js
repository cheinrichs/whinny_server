
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('disciplines').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('disciplines').insert({discipline_name: 'Barrel Racing'}),
        knex('disciplines').insert({discipline_name: 'Jumper'}),
        knex('disciplines').insert({discipline_name: 'Dressage'}),
        knex('disciplines').insert({discipline_name: 'Hunter'}),
        knex('disciplines').insert({discipline_name: 'Eventing'}),
        knex('disciplines').insert({discipline_name: 'Reining'}),
        knex('disciplines').insert({discipline_name: 'Arabian Horses'}),
        knex('disciplines').insert({discipline_name: 'Driving'}),
        knex('disciplines').insert({discipline_name: 'Racing'}),
        knex('disciplines').insert({discipline_name: 'Trail Riding'}),
        knex('disciplines').insert({discipline_name: 'Polo'}),
        knex('disciplines').insert({discipline_name: 'Veterinary'}),
      ]);
    });
};
