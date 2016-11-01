
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('disciplines').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('disciplines').insert({discipline_id: 1, discipline_name: 'Barrel Racing'}),
        knex('disciplines').insert({discipline_id: 2, discipline_name: 'Jumper'}),
        knex('disciplines').insert({discipline_id: 3, discipline_name: 'Dressage'}),
        knex('disciplines').insert({discipline_id: 4, discipline_name: 'Hunter'}),
        knex('disciplines').insert({discipline_id: 5, discipline_name: 'Eventing'}),
        knex('disciplines').insert({discipline_id: 6, discipline_name: 'Reining'}),
        knex('disciplines').insert({discipline_id: 7, discipline_name: 'Arabian Horses'}),
        knex('disciplines').insert({discipline_id: 8, discipline_name: 'Driving'}),
        knex('disciplines').insert({discipline_id: 9, discipline_name: 'Racing'}),
        knex('disciplines').insert({discipline_id: 10, discipline_name: 'Trail Riding'}),
        knex('disciplines').insert({discipline_id: 11, discipline_name: 'Polo'}),
        knex('disciplines').insert({discipline_id: 12, discipline_name: 'Veterinary'}),
      ]);
    });
};
