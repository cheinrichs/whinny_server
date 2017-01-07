
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('broadcast_messages').del()
    .then(function () {
      return Promise.all([
        //Beautiful Barns seeds
        knex('broadcast_messages').insert({
          to_broadcast: 1,
          from_user: 2,
          broadcast_photo_url: 'https://s3.amazonaws.com/whinnyphotos/broadcast_message_photos/broadcast_message_photo_1.jpg',
          broadcast_title: 'Wellington, FL',
          broadcast_message: '',
          link_text: '',
          link_url: ''
        }),
        knex('broadcast_messages').insert({
          to_broadcast: 1,
          from_user: 2,
          broadcast_photo_url: 'https://s3.amazonaws.com/whinnyphotos/broadcast_message_photos/broadcast_message_photo_2.jpg',
          broadcast_title: 'Heberg, Sweden',
          broadcast_message: 'Hannell Dressage Arena with a 5 star restaurant upstairs.',
          link_text: '',
          link_url: ''
        }),

        //Equestrian news seeds
        knex('broadcast_messages').insert({
          to_broadcast: 2,
          from_user: 2,
          broadcast_photo_url: 'https://s3.amazonaws.com/whinnyphotos/broadcast_message_photos/broadcast_message_photo_3.jpg',
          broadcast_title: 'Carl Hester chats...By Rebecca Ashton',
          broadcast_message: '“She has something. That’s such a gift to just go down there, and she rode around the arena, and it all disappeared and they did a gorgeous performance. I’m glad it finished like that and I totally understand when she came out of the arena and said, “Never again.” I burst into tears, she burst into tears and I have never cried at any of her performances.”',
          link_text: 'Full story here',
          link_url: 'https://horsemagazine.partica.online/thm-september-2016/thm-december-2016-january-2017/dressage/carl-hester-chats?iid=149011'
        }),
        knex('broadcast_messages').insert({
          to_broadcast: 2,
          from_user: 2,
          broadcast_photo_url: 'https://s3.amazonaws.com/whinnyphotos/broadcast_message_photos/broadcast_message_photo_4.jpg',
          broadcast_title: 'Reunited with Bear',
          broadcast_message: 'The orphan foal that launched an iconic photo as he slept in the company of a giant stuffed teddy bear is all grown up and much bigger than his old friend. Little Breeze who was sadly rejected by his mother came in to The Mare and Foal Sanctuary at only a few hours old in 2013 and needed round the clock care. To keep him company, he was given teddy bear called Buttons, who was welcomed by the foal and became a constant companion. Fast forward to today and Breeze, now 3 years old, is a handsome and grown-up looking pony. PC: SWNS. Click the link to see a photo of grown-up Breeze and his bear!',
          link_text: 'Full story here',
          link_url: 'https://www.mareandfoal.org/blog/2016/10/21/breeze-and-buttons-a-friendship/'
        }),
        knex('broadcast_messages').insert({
          to_broadcast: 2,
          from_user: 2,
          broadcast_photo_url: 'https://s3.amazonaws.com/whinnyphotos/broadcast_message_photos/broadcast_message_photo_5.png',
          broadcast_title: '12/11/16',
          broadcast_message: 'Heartbreaking news following the Geneva CHI CDI4* competition. Beatriz Ferrer-Salat, Grand Prix dressage rider for Spain, lost Sir Radjah to colic. The 11-year-old Westfalen gelding could not be revived following colic surgery. ',
          link_text: 'Full story here',
          link_url: 'http://www.dressage-news.com/?p=39032'
        }),
        knex('broadcast_messages').insert({
          to_broadcast: 2,
          from_user: 2,
          broadcast_photo_url: 'https://s3.amazonaws.com/whinnyphotos/broadcast_message_photos/broadcast_message_photo_6.jpg',
          broadcast_title: '12/12/16',
          broadcast_message: 'Valegro is at Olympia and will soon take part in his public retirement ceremony so the world can thank him for his contribution to dressage. PC: Charlotte Dujardin',
          link_text: 'Click Here for Full Story',
          link_url: 'http://www.olympiahorseshow.com/'
        }),


        // Horse Humor seeds
        knex('broadcast_messages').insert({
          to_broadcast: 3,
          from_user: 2,
          broadcast_photo_url: 'https://s3.amazonaws.com/whinnyphotos/broadcast_message_photos/broadcast_message_photo_7.jpg',
          broadcast_title: '',
          broadcast_message: '',
          link_text: '',
          link_url: ''
        }),
        knex('broadcast_messages').insert({
          to_broadcast: 3,
          from_user: 2,
          broadcast_photo_url: 'https://s3.amazonaws.com/whinnyphotos/broadcast_message_photos/broadcast_message_photo_8.jpg',
          broadcast_title: '',
          broadcast_message: '',
          link_text: '',
          link_url: ''
        }),
        knex('broadcast_messages').insert({
          to_broadcast: 3,
          from_user: 2,
          broadcast_photo_url: 'https://s3.amazonaws.com/whinnyphotos/broadcast_message_photos/broadcast_message_photo_9.jpg',
          broadcast_title: '',
          broadcast_message: '',
          link_text: '',
          link_url: ''
        }),

        //EqBusiness
        //3 placeholders
        knex('broadcast_messages').insert({
          to_broadcast: 4,
          from_user: 2,
          broadcast_photo_url: 'https://s3.amazonaws.com/whinnyphotos/broadcast_message_photos/broadcast_message_photo_10.jpeg',
          broadcast_title: 'He didn’t run the organization; the organization ran him.',
          broadcast_message: '“It\'s so important to not let the demands of the day run you around, constantly forcing your priorities, and putting your plans on the back burner. If you let the fire drills take control, you’ll never get ahead of the work enough to be able to run the organization.” Jim Joseph, marketing guru, shares his insight into effective daily management of priorities.',
          link_text: 'Full Article',
          link_url: 'https://www.entrepreneur.com/article/285805'
        }),
        knex('broadcast_messages').insert({
          to_broadcast: 4,
          from_user: 2,
          broadcast_photo_url: 'https://s3.amazonaws.com/whinnyphotos/broadcast_message_photos/broadcast_message_photo_11.jpeg',
          broadcast_title: 'Weathering the Seas of Sole Proprietorship',
          broadcast_message: 'How to prepare for the unknowns that you will undoubtedly face when running your own business. Summarized thoughts from Michael Mamas… Keep your eyes toward the distant shore- “remain steadfastly fixed and dedicated to your larger goal”, but be always be prepared to pivot. Stay flexible and resilient- “never lose sight of the great paradox of business: it requires you to remain simultaneously flexible and rigid.” Keep the boat afloat- there are times to seek progression and times to hold steady. Be comfortable with both, but not overly comfortable with just one. Steer clear of the Sirens (think Odyssey)- “there will always be such experts to distract you with fear and greed.” Beware the serpents- “serpents come in many forms: competitors, misguided experts, friends-turned-foe, narrow-visioned advisors, etc. Trust your judgment about people.” PC: RubberBall Productions-Getty Images',
          link_text: 'Full Article',
          link_url: 'https://www.entrepreneur.com/article/271806'
        }),
        // knex('broadcast_messages').insert({
        //   to_broadcast: 4,
        //   from_user: 2,
        //   broadcast_photo_url: 'https://s3.amazonaws.com/whinnyphotos/broadcast_message_photos/broadcast_message_photo_12.jpg',
        //   broadcast_title: '',
        //   broadcast_message: '',
        //   link_text: '',
        //   link_url: ''
        // }),

        //Whinny Tips
        //2 placeholders
        // knex('broadcast_messages').insert({
        //   to_broadcast: 4,
        //   from_user: 2,
        //   broadcast_photo_url: 'https://s3.amazonaws.com/whinnyphotos/broadcast_message_photos/broadcast_message_photo_13.jpg',
        //   broadcast_title: '',
        //   broadcast_message: '',
        //   link_text: '',
        //   link_url: ''
        // }),
        // knex('broadcast_messages').insert({
        //   to_broadcast: 4,
        //   from_user: 2,
        //   broadcast_photo_url: 'https://s3.amazonaws.com/whinnyphotos/broadcast_message_photos/broadcast_message_photo_14.jpg',
        //   broadcast_title: '',
        //   broadcast_message: '',
        //   link_text: '',
        //   link_url: ''
        // }),

        //Equestrian Fasion seeds
        knex('broadcast_messages').insert({
          to_broadcast: 6,
          from_user: 2,
          broadcast_photo_url: 'https://s3.amazonaws.com/whinnyphotos/broadcast_message_photos/broadcast_message_photo_15.jpg',
          broadcast_title: 'Lavender Navy Black and Grey',
          broadcast_message: '',
          link_text: '',
          link_url: ''
        }),
        knex('broadcast_messages').insert({
          to_broadcast: 6,
          from_user: 2,
          broadcast_photo_url: 'https://s3.amazonaws.com/whinnyphotos/broadcast_message_photos/broadcast_message_photo_16.jpg',
          broadcast_title: 'Pikeur breeches in Jasha Mustard Navy',
          broadcast_message: '',
          link_text: '',
          link_url: ''
        }),
        knex('broadcast_messages').insert({
          to_broadcast: 6,
          from_user: 2,
          broadcast_photo_url: 'https://s3.amazonaws.com/whinnyphotos/broadcast_message_photos/broadcast_message_photo_17.jpg',
          broadcast_title: 'Sky Blue',
          broadcast_message: '',
          link_text: '',
          link_url: ''
        }),
        knex('broadcast_messages').insert({
          to_broadcast: 6,
          from_user: 2,
          broadcast_photo_url: 'https://s3.amazonaws.com/whinnyphotos/broadcast_message_photos/broadcast_message_photo_18.jpg',
          broadcast_title: 'Roeckl Gold',
          broadcast_message: '',
          link_text: '',
          link_url: ''
        }),


        //Disease Communications Center
        //2 placeholder
        knex('broadcast_messages').insert({
          to_broadcast: 7,
          from_user: 2,
          broadcast_photo_url: 'https://s3.amazonaws.com/whinnyphotos/broadcast_message_photos/broadcast_message_photo_19.jpg',
          broadcast_title: 'Outbreak Update',
          broadcast_message: 'Date: 1/7/2017 Disease: Equine Herpes Virus Location: Los Angeles, CA There are no new EHM cases at the Los Angeles Equestrian Center as of January 6, 2017. LAEC continues to have one horse in quarantined isolation awaiting prescribed negative testing.',
          link_text: 'Read More from EDCC',
          link_url: 'http://www.equinediseasecc.org/outbreaks.aspx'
        }),
        // knex('broadcast_messages').insert({
        //   to_broadcast: 7,
        //   from_user: 2,
        //   broadcast_photo_url: 'https://s3.amazonaws.com/whinnyphotos/broadcast_message_photos/broadcast_message_photo_20.jpg',
        //   broadcast_title: '',
        //   broadcast_message: '',
        //   link_text: '',
        //   link_url: ''
        // }),


        //Vet info seeds
        knex('broadcast_messages').insert({
          to_broadcast: 8,
          from_user: 2,
          broadcast_photo_url: 'https://s3.amazonaws.com/whinnyphotos/broadcast_message_photos/broadcast_message_photo_21.jpg',
          broadcast_title: 'Fun Fact!',
          broadcast_message: 'Did you know that horses do not have a gall bladder? Bile aids in digestion and is produced in the liver. The gall bladder stores bile. Because horses are meant to be eating for the majority of the day, they do not need to store excess bile- hence, no gall bladder!',
          link_text: '',
          link_url: ''
        }),
        knex('broadcast_messages').insert({
          to_broadcast: 8,
          from_user: 2,
          broadcast_photo_url: 'https://s3.amazonaws.com/whinnyphotos/broadcast_message_photos/broadcast_message_photo_22.jpg',
          broadcast_title: 'Basic Eye Anatomy of the Horse',
          broadcast_message: '',
          link_text: '',
          link_url: ''
        }),
        knex('broadcast_messages').insert({
          to_broadcast: 8,
          from_user: 2,
          broadcast_photo_url: 'https://s3.amazonaws.com/whinnyphotos/broadcast_message_photos/broadcast_message_photo_23.jpg',
          broadcast_title: 'Avoiding Shipping Fever',
          broadcast_message: 'Transporting your horse in a box stall is one way to avoid shipping fever. Allowing a horse to lower his or her head during transport will help to reduce the risk of airway disease. Read Dr. Ryan Lukens’ top 5 tips regarding preventing shipping fever by clicking the link…',
          link_text: 'Link text- “Dr. Lukens’ Top 5 Tips”',
          link_url: 'http://equineclinic.com/2016/11/shipping-fever-what-to-know-and-how-to-reduce-risk/'
        })

      ]);
    });
};
