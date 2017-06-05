
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('table_name').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('barn_alerts').insert({
          tweet_id: '870378126592880600',
          date: 'Thu Jun 01 20:34:50 +0000 2017',
          status: 'Confirmed case(s): Quarantine',
          disease: 'Strangles',
          content: 'On June 1, one premise in Lake County, Florida was placed under quarantine for clinical signs and positive PCR confirmation of strangles.  The index case became clinical around May 25.  None of the five horses on the premises have left the premises since clinical signs began. This the second case for Lake County and case 23 for Florida in 2017.',
          city: 'Lake County',
          state:'FL',
          source: 'Florida Department of Agriculture and Consumer Services',
          source_link: 'http://www.freshfromflorida.com/'
        }),
        knex('barn_alerts').insert({
          tweet_id: '870378126592880600',
          date: 'Thu Jun 01 20:34:50 +0000 2017',
          status: 'Confirmed case(s): Quarantine',
          disease: 'Strangles',
          content: 'On June 1, one premise in Lake County, Florida was placed under quarantine for clinical signs and positive PCR confirmation of strangles.  The index case became clinical around May 25.  None of the five horses on the premises have left the premises since clinical signs began. This the second case for Lake County and case 23 for Florida in 2017.',
          city: 'Lake County',
          state:'FL',
          source: 'Florida Department of Agriculture and Consumer Services',
          source_link: 'http://www.freshfromflorida.com/'
        })
      ]);
    });
};
