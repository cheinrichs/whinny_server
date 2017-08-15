exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return Promise.join(
    knex('user_interests').del()
  ).then(function () {
    return Promise.join(
      createUserInterest('Cooper', 2),
      createUserInterest('Cooper', 4),
      createUserInterest('Megan', 3),
      createUserInterest('Megan', 12),
      createUserInterest('Megan', 7),
      createUserInterest('Pete', 3)
    )
  });

  function createUserInterest(first_name, discipline_id) {
    var result = {
      user_id: 0
    }
    return knex('users').where('first_name', first_name).first().then(function (user_obj) {
      result.user_id = user_obj.user_id;
      return knex('disciplines').where('discipline_id', discipline_id).first();
    }).then(function (disc_obj) {
      result.discipline_id = disc_obj.discipline_id;
      return knex('user_interests').insert(result);
    })
  }
};
