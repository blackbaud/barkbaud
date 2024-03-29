const fs = require('fs');
const yesno = require('yesno');
const dotenv = require('dotenv');
const sequence = require('./lib/sequence');

function start() {
  console.log('Setup started (this may take a few minutes)...'.cyan);

  const commands = [];

  sequence(commands, function () {
    // Setting this config var will tell Barkbaud to build the database.
    process.env.npm_config_build_database = true;

    // Run the app (equivalent to `node index.js`).
    const app = require('../index');
    app.ready(function () {
      console.log('Setup complete!'.cyan);
    });
  });
}

fs.open('node_modules', 'r', function (error) {
  if (error && error.code === 'ENOENT') {
    console.log('ERROR: Please run `npm install`, first.');
    process.exit();
  } else {
    const colors = require('colors');

    fs.open('barkbaud.env', 'r', function (error) {
      if (error && error.code === 'ENOENT') {
        console.log('ERROR: barkbaud.env environment file not found!'.red);
        console.log('Please add a barkbaud.env file to your project root. See https://github.com/blackbaud/barkbaud for more information.');
        process.exit();
      }

      dotenv.config({ path: 'barkbaud.env' });

      yesno.ask(
        'This process will autopopulate your database with default information. Any existing data will be overwritten.' +
        colors.yellow('\nAre you sure you want to continue? (y/n)'), true, function (ok) {
          if (ok) {
            start();
          } else {
            console.log('Setup cancelled.'.grey);
            process.exit();
          }
        }
      );
    });
  }
});
