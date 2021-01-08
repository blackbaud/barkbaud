const colors = require('colors');
const Dog = require('../models/dog');

function buildDatabase(callback) {
  const dogs = [];
  let counter = 0;

  console.log('Creating database documents...'.cyan);

  // Clean out any records first.
  Dog.collection.remove();

  dogs.push(new Dog({
    bio: 'Hi there! My name is Red Baron. The nice folks at CBR have helped me out of a bad situation and I intend to take advantage of my second chance. No looking back. No more being chained outside. No more sleeping on the cold, hard ground. No more going to sleep hungry. That\'s the best part, cause I really like food! At my foster home, I have my own soft bed and my own den, they call a crate. It\'s pretty nice I guess, as long as I can have my Nylabone to chew on! It\'s a pretty nice place to sleep in at night. It beats sleeping outside, I can tell you that! I go for leisurely walks every day. I like that too! I went to a clinic yesterday and they gave me some medicine to get rid of the worms in my belly.',
    breed: 'Boxer',
    createdAt: '2015-10-16T19:18:12.685Z',
    gender: 'Male',
    image: {
      file: 'baron.jpg'
    },
    name: 'Baron',
    notes: [
      {
        createdAt: '2015-10-16T20:27:00.072Z',
        date: '2015-10-16T20:28:00.000Z',
        description: 'Baron got his rabies shots. Such a good boy!',
        title: 'Got rabies shots',
        updatedAt: '2015-10-20T19:57:18.574Z'
      },
      {
        createdAt: '2016-01-12T16:37:25.973Z',
        date: '2016-01-12T16:37:25.948Z',
        description: 'Hopefully it\'s nothing serious. Vet provided some medicine for Baron to take next 2-3 days, and we\'ll continue to monitor.',
        title: 'Cough',
        updatedAt: '2016-01-12T16:37:25.973Z'
      },
      {
        createdAt: '2016-01-07T21:03:14.678Z',
        date: '2016-01-07T21:03:14.632Z',
        description: 'Wear a cone for a few days',
        title: 'Stitches',
        updatedAt: '2016-01-07T21:03:14.678Z'
      },
      {
        createdAt: '2015-10-27T21:04:04.807Z',
        date: '2015-10-27T21:04:04.769Z',
        description: 'Yikes!',
        title: 'Fleas',
        updatedAt: '2015-10-27T21:04:04.807Z'
      },
      {
        createdAt: '2015-10-21T01:21:34.544Z',
        date: '2015-10-21T01:21:34.512Z',
        description: 'Baron was at an event and snipped another dog.  Please be mindful when inviting him to future events.',
        title: 'Bit another dog',
        updatedAt: '2015-10-21T01:21:34.544Z'
      },
      {
        createdAt: '2015-11-24T22:21:50.855Z',
        date: '2015-11-24T22:21:50.722Z',
        description: 'Baron needs heartworm meds tomorrow.',
        title: 'Heartworm',
        updatedAt: '2015-11-24T22:21:50.855Z'
      }
    ],
    ratings: [
      {
        category: {
          name: 'Obedience',
          type: 'codetable'
        },
        source: 'Barkbaud',
        date: 'Jan 1, 2017',
        value: 'Just starting'
      },
      {
        category: {
          name: 'Sheds',
          type: 'boolean'
        },
        source: 'Barkbaud',
        date: 'Jan 1, 2017',
        value: false
      }
    ],
    owners: [
      {
        constituentId: '242',
        createdAt: '2015-10-21T01:41:58.185Z',
        fromDate: '2014-08-01T01:41:00.000Z',
        toDate: '2015-10-23T03:32:06.877Z',
        updatedAt: '2015-10-23T03:32:07.169Z'
      },
      {
        constituentId: '280',
        createdAt: '2016-02-08T15:05:38.767Z',
        fromDate: '2016-02-08T15:05:38.670Z',
        isActive: true,
        updatedAt: '2016-02-08T15:05:38.767Z'
      },
      {
        constituentId: '280',
        createdAt: '2015-10-23T03:32:07.484Z',
        fromDate: '2015-10-23T03:32:06.877Z',
        toDate: '2015-10-27T21:04:22.929Z',
        updatedAt: '2015-10-27T21:04:22.963Z'
      },
      {
        constituentId: '508',
        createdAt: '2015-10-27T21:04:23.014Z',
        fromDate: '2015-10-27T21:04:22.929Z',
        toDate: '2015-11-02T14:48:17.968Z',
        updatedAt: '2015-11-02T14:48:18.026Z'
      },
      {
        constituentId: '280',
        createdAt: '2015-12-07T19:17:53.811Z',
        fromDate: '2015-12-07T19:17:53.704Z',
        toDate: '2016-02-08T15:05:38.670Z',
        updatedAt: '2016-02-08T15:05:38.716Z'
      },
      {
        constituentId: '508',
        createdAt: '2015-11-24T22:20:50.714Z',
        fromDate: '2015-11-24T22:20:50.640Z',
        toDate: '2015-12-07T19:17:53.704Z',
        updatedAt: '2015-12-07T19:17:53.780Z'
      },
      {
        constituentId: '280',
        createdAt: '2015-11-05T14:56:38.611Z',
        fromDate: '2015-11-05T14:56:38.492Z',
        toDate: '2015-11-05T14:57:56.063Z',
        updatedAt: '2015-11-05T14:57:56.093Z'
      },
      {
        constituentId: '255',
        createdAt: '2015-10-21T01:40:44.854Z',
        fromDate: '2015-04-01T01:40:00.000Z',
        toDate: '2015-07-08T01:40:00.000Z',
        updatedAt: '2015-10-23T03:30:25.849Z'
      },
      {
        constituentId: '508',
        createdAt: '2015-11-02T15:37:56.854Z',
        fromDate: '2015-11-02T15:37:56.794Z',
        toDate: '2015-11-05T14:56:38.492Z',
        updatedAt: '2015-11-05T14:56:38.538Z'
      },
      {
        constituentId: '280',
        createdAt: '2015-11-02T14:48:18.077Z',
        fromDate: '2015-11-02T14:48:17.968Z',
        toDate: '2015-11-02T15:37:56.794Z',
        updatedAt: '2015-11-02T15:37:56.806Z'
      }
    ],
    updatedAt: '2016-02-08T15:05:38.811Z'
  }));

  dogs.push(new Dog({
    bio: 'Hi! My name is Pebbles. I am about 6-7 months old and I weigh around 3 pounds. I am spayed/neutered, current on vaccines and microchipped.',
    breed: 'Yorkshire Terrier',
    createdAt: '2015-10-15T17:24:13.642Z',
    gender: 'Female',
    image: {
      file: 'pebbles.jpg'
    },
    name: 'Pebbles',
    notes: [
      {
        createdAt: '2015-10-27T09:49:31.921Z',
        date: '2015-10-27T09:49:31.874Z',
        description: 'We got Pebbles her standard shots',
        title: 'Shots',
        updatedAt: '2015-10-27T09:49:31.921Z'
      }
    ],
    ratings: [
      {
        category: {
          name: 'Activity level',
          type: 'codetable'
        },
        source: 'Barkbaud',
        date: 'Jan 1, 2017',
        value: 'Couch Potato'
      },
      {
        category: {
          name: 'Sheds',
          type: 'boolean'
        },
        source: 'Barkbaud',
        date: 'Jan 1, 2017',
        value: true
      }
    ],
    owners: [
      {
        constituentId: '186',
        createdAt: '2015-10-27T00:20:12.660Z',
        fromDate: '2015-10-27T00:20:12.637Z',
        isActive: true,
        updatedAt: '2015-10-27T00:20:12.660Z'
      }
    ],
    updatedAt: '2015-10-27T00:20:12.717Z'
  }));

  dogs.push(new Dog({
    bio: 'Dash is my name.  I am very active and love to play. I can sleep in a crate and eat snacks.  I\'m about 25 pounds but If I eat snacks, then maybe 26 pounds.  I love other dogs.  The dog park is the best.  I think I\'m fast but my friend Tucker is even faster.  Did I mention that I like to play?  I\'d rather play with a tennis ball or chew toy than your shoes.  I realize that\'s a no-no.  I\'m not a bad dog, I\'m a good dog.  While I have white fur that shows dirt, this does not mean that I am a bad dog.  I\'m happy outside or inside.  I will let others know not to mess with my family with my powerful bark!  ARF!!',
    breed: 'Terrier',
    createdAt: '2015-10-16T20:54:25.364Z',
    gender: 'Male',
    image: {
      file: 'dash.jpg'
    },
    name: 'Dash',
    notes: [],
    owners: [
      {
        constituentId: '233',
        createdAt: '2015-10-24T15:13:37.699Z',
        fromDate: '2015-10-24T15:13:37.657Z',
        isActive: true,
        updatedAt: '2015-10-24T15:13:37.699Z'
      }
    ],
    updatedAt: '2015-10-24T15:13:37.766Z'
  }));

  dogs.push(new Dog({
    bio: 'Hi! My name is Boo. I like taking long walks on the beach. If you throw a stick I will run and get it. I also like to bring people newspapers. I grew up in Philadelphia but somehow found myself in Charleston after I hopped into the back of a pickup truck. I now have Southern accent and am looking for me a great home!',
    breed: 'Retriever Mix',
    createdAt: '2015-10-15T17:56:55.193Z',
    gender: 'Female',
    image: {
      file: 'boo.jpg'
    },
    name: 'Boo',
    notes: [],
    owners: [
      {
        constituentId: '708',
        createdAt: '2016-02-08T15:15:22.156Z',
        fromDate: '2016-02-08T15:15:22.104Z',
        isActive: true,
        updatedAt: '2016-02-08T15:15:22.156Z'
      }
    ],
    updatedAt: '2016-02-08T15:15:22.198Z'
  }));

  dogs.push(new Dog({
    bio: 'Meet Lilly. Lilly is about 4 years old and around 80 pounds. This girl is VERY shy. Lilly is well mannered but a quiet, shy girl learning to trust again. She is house, crate and leash trained. In fact she loves to go on walks. She knows some basic commands. Lilly\'s coat seems to be darkening as she gets fitter. She is great with other dogs, but probably best with older children given her shyness. Lilly would be best in a quiet home with other dogs and a patient, loving owner.',
    breed: 'Labrador Retriever',
    createdAt: '2015-10-15T18:03:41.918Z',
    gender: 'Female',
    image: {
      file: 'lilly.jpg'
    },
    name: 'Lilly',
    notes: [
      {
        createdAt: '2015-10-15T18:11:05.387Z',
        date: '2015-10-15T18:12:00.000Z',
        description: 'Lilly got her rabies shot.  Such a good girl!',
        title: 'Got rabies shot',
        updatedAt: '2015-10-19T18:43:32.981Z'
      },
      {
        createdAt: '2016-01-06T05:54:32.247Z',
        date: '2016-01-06T05:54:32.188Z',
        description: 'Lilly is flea free',
        title: 'Flea',
        updatedAt: '2016-01-06T05:54:32.247Z'
      }
    ],
    owners: [
      {
        constituentId: '778',
        createdAt: '2016-01-06T05:53:28.374Z',
        fromDate: '2016-01-06T05:53:28.345Z',
        isActive: true,
        updatedAt: '2016-01-06T05:53:28.374Z'
      }
    ],
    updatedAt: '2016-01-06T05:53:28.410Z'
  }));

  dogs.push(new Dog({
    bio: 'Komeki is a calm and quiet girl who turns funny once she warms up to you. She somehow became separated from her family and was found wandering around. She\'d like a new family to hang out with. She likes sunbaths, going for walks, and relaxing at home. She has been fine with other dogs but is unknown with cats or children. She is estimated to be 5-6 years old.',
    breed: 'Akita',
    createdAt: '2015-10-16T19:44:00.123Z',
    gender: 'Female',
    image: {
      file: 'komeki.jpg'
    },
    name: 'Komeki',
    notes: [],
    owners: [
      {
        constituentId: '187',
        createdAt: '2016-02-16T22:01:04.151Z',
        fromDate: '2016-02-16T22:01:04.117Z',
        isActive: true,
        updatedAt: '2016-02-16T22:01:04.151Z'
      }
    ],
    updatedAt: '2016-02-16T22:01:04.208Z'
  }));

  dogs.push(new Dog({
    bio: 'Eva is 3 years old and weighs about 66 pounds. She is waiting patiently for a loving home. She is heartworm negative, has been dewormed, received a DAPP, Bordatella and Rabies Vaccines, and has been spayed. ',
    breed: 'Labrador Retriever',
    createdAt: '2015-10-15T18:01:27.831Z',
    gender: 'Female',
    image: {
      file: 'eva.jpg'
    },
    name: 'Eva',
    notes: [],
    owners: [
      {
        constituentId: '280',
        createdAt: '2016-01-06T05:52:02.710Z',
        fromDate: '2016-01-06T05:52:02.673Z',
        isActive: true,
        updatedAt: '2016-01-06T05:52:02.710Z'
      }
    ],
    updatedAt: '2016-01-06T05:52:02.764Z'
  }));

  dogs.push(new Dog({
    bio: 'Meet Jeb. Jeb is 8 years old and working to lose a little weight. This fellow is good with dogs, cats, and kids. He loves to be inside or outside and is perfectly house-trained. Jeb is good on leash and knows basic commands. This guy really wants to please his people. Jeb needs a family willing to take him on walks to help him lose some weight and improve his fitness. He really is the perfect dog to have for anyone at any age.',
    breed: 'Black Labrador Retriever',
    createdAt: '2015-10-15T18:02:44.400Z',
    gender: 'Male',
    image: {
      file: 'jeb.jpg'
    },
    name: 'Jeb',
    notes: [
      {
        createdAt: '2016-02-16T21:59:31.863Z',
        date: '2016-02-16T21:59:31.786Z',
        description: 'Jeb received his vaccine shots today. He\'s good for another year.',
        title: 'Vaccine',
        updatedAt: '2016-02-16T21:59:31.863Z'
      }
    ],
    owners: [
      {
        constituentId: '222',
        createdAt: '2016-02-16T21:58:47.061Z',
        fromDate: '2016-02-16T21:58:47.000Z',
        isActive: true,
        updatedAt: '2016-02-16T21:58:47.061Z'
      }
    ],
    updatedAt: '2016-02-16T21:58:47.142Z'
  }));

  dogs.push(new Dog({
    bio: 'Hi! My name is Elsa. I am a very sweet, friendly and well socialized baby girl that is just waiting for my *furever* home. My approximate date of birth is 7/10/15 and I weigh just around 15 pounds. My breeds are a 100% guess as my mother was not found with me... I am spayed, current on vaccines and microchipped.',
    breed: 'Labrador Retriever/Hound Mix',
    createdAt: '2015-10-16T19:50:20.836Z',
    gender: 'Female',
    image: {
      file: 'elsa.jpg'
    },
    name: 'Elsa',
    notes: [
      {
        createdAt: '2015-10-26T21:02:20.698Z',
        date: '2015-10-26T21:02:20.633Z',
        description: 'We found Elsa to be heartworm positive when we did her initial vet check-up. Put her on heartworm meds.',
        title: 'Heartworm',
        updatedAt: '2015-10-26T21:02:20.698Z'
      },
      {
        createdAt: '2015-10-26T21:13:34.678Z',
        date: '2015-10-26T21:13:34.653Z',
        description: 'We gave Elsa her shots before James picks her up.',
        title: 'Shots',
        updatedAt: '2015-10-26T21:13:34.678Z'
      }
    ],
    owners: [
      {
        constituentId: '187',
        createdAt: '2015-10-27T03:46:02.002Z',
        fromDate: '2015-10-27T03:46:01.933Z',
        isActive: true,
        updatedAt: '2015-10-27T03:46:02.002Z'
      },
      {
        constituentId: '508',
        createdAt: '2015-10-27T03:18:38.774Z',
        fromDate: '2015-10-27T03:18:38.637Z',
        toDate: '2015-10-27T03:46:01.933Z',
        updatedAt: '2015-10-27T03:46:01.962Z'
      }
    ],
    updatedAt: '2015-10-27T03:46:02.044Z'
  }));

  dogs.push(new Dog({
    bio: 'They call me Boomer. Yea, that\'s right Boomer. My new family says it is a perfect name for me, I guess I don\'t do anything quietly even sleep. I love my new crate I sleep in it every night and take most of my naps in it with the door open. Don\'t be fooled though I dream a lot...my crates rocks and rolls all night and I wake myself up howling softly at the moon. (Side note, from Boomer\'s foster mom: I just wanted to describe what a sweet and haunting sound his little howl is. It does not wake anyone up, we have just heard it when he goes to sleep while we are still awake.) Boomer here again, yeah see these new people right? Well they got something called A/C. Yeah, yeah I heard of it before, but never had much experience with being outside a lot and all. I got it made in the shade now, hehehe, I\'m kind of on the funny side.',
    breed: 'Boxer',
    createdAt: '2015-10-16T19:15:10.076Z',
    gender: 'Male',
    image: {
      file: 'boomer.jpg'
    },
    name: 'Boomer',
    notes: [],
    owners: [],
    updatedAt: '2015-10-16T20:07:44.656Z'
  }));

  dogs.forEach(function (dog) {
    dog.save(function (error) {
      ++counter;

      if (error) {
        console.log(colors.red('[ERROR] Database entry could not be created for ' + dog.name + '!'));
        return;
      }

      console.log(colors.grey('Database entry created for ' + dog.name + '.'));

      if (counter === dogs.length) {
        console.log('Done creating database.'.green);
        callback();
      }
    });
  });
}

function addImages(callback) {
  const fs = require('fs');
  const path = require('path');
  const imageBasePath = './server/database/setup/images/';

  // Convert images to Base64.
  fs.readdir(imageBasePath, function (error, files) {
    if (error) {
      console.log(error);
      return;
    }

    const images = [];
    let counter = 0;

    files.forEach(function (file) {
      switch (path.extname(file)) {
      case '.gif':
      case '.jpeg':
      case '.jpg':
      case '.png':
        images.push(file);
        break;
      }
    });

    const imagesLength = images.length;

    console.log(colors.cyan('Converting ' + imagesLength + ' images...'));

    images.forEach(function (file, i) {
      const bitmap = fs.readFileSync(imageBasePath + file);
      const encoded = Buffer.from(bitmap).toString('base64');

      // Search dog until you find the one with the same file name
      Dog.findOne({
        'image.file': file
      }, function (error, dog) {
        if (error) {
          console.log('Error:', error);
          console.log('Image:', file);
          console.log('Dog:', dog);
          return;
        }

        dog.image.data = encoded;

        dog.save(function (err, result) {
          if (err) {
            console.error(colors.red('Error saving file ' + file + '!'), err);
          }

          ++counter;

          console.log('(' + counter + ' of ' + imagesLength + ') ' + colors.grey(file + ' converted to Base64 and saved.'));

          if (counter === imagesLength) {
            console.log('Database images converted.'.green);
            callback();
          }
        });
      });
    });
  });
}

module.exports = function (callback) {
  buildDatabase(function () {
    addImages(callback);
  });
};
