const cors = require('cors');
const http = require('http');
const https = require('https');
const routes = require('./server/routes');
const colors = require('colors');
const express = require('express');
const session = require('express-session');
const timeout = require('connect-timeout');
const Database = require('./server/database');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const bodyParser = require('body-parser');

const callbacks = [];
const databaseUri = process.env.DATABASE_URI || null;
const environment = process.env.NODE_ENV || 'development';
const port = process.env.PORT || 5000;
const sessionConfig = {
  resave: false,
  saveUninitialized: true,
  secret: '+rEchas&-wub24dR'
};

// Check if database URI has been provided.
if (databaseUri === null) {
  console.log(colors.red('Please specify a DATABASE_URI in .env!'));
  process.exit();
}

// Only cache the authorized session in production.
if (environment === 'production') {
  sessionConfig.store = new MongoStore({
    url: databaseUri,
    autoRemove: 'native'
  });
} else {
  sessionConfig.cookie = {
    secure: false // only false when using http in local development
  };
}

// Connect to the database.
const database = new Database({
  uri: databaseUri,
  service: mongoose
});

// Create the app.
const app = express();
app.set('port', port);
app.use(bodyParser.json());
app.use(timeout('120s'));
app.use(session(sessionConfig));
app.use(cors({
  credentials: true,
  origin: [
    'https://host.nxt.blackbaud.com'
  ]
}));

// Authentication routes.
app.get('/auth/user', routes.auth.getUser);
app.get('/auth/login', routes.auth.getLogin);
app.get('/auth/callback', routes.auth.getCallback);
app.get('/auth/logout', routes.auth.getLogout);

// API GET routes.
app.get('/api/dogs/notetypes', routes.auth.checkSession, routes.api.getNoteTypes);
app.get('/api/dogs', routes.auth.checkSession, routes.api.getDogs);
app.get('/api/dogs/:dogId', routes.auth.checkSession, routes.api.getDog);
app.get('/api/dogs/:dogId/notes', routes.auth.checkSession, routes.api.getNotes);
app.get('/api/dogs/:dogId/currenthome', routes.auth.checkSession, routes.api.getCurrentHome);
app.get('/api/dogs/:dogId/previoushomes', routes.auth.checkSession, routes.api.getPreviousHomes);
app.get('/api/dogs/:dogId/findhome', routes.auth.checkSession, routes.api.getFindHome);
app.get('/api/dogs/:dogId/ratings/:dogRatingId', routes.auth.checkSession, routes.api.getDogRating);
app.get('/api/dogs/:dogId/ratings', routes.auth.checkSession, routes.api.getDogRatings);
app.get('/api/dogs/ratings/categories', routes.auth.checkSession, routes.api.getDogRatingCategories);
app.get('/api/dogs/ratings/categories/values', routes.auth.checkSession, routes.api.getDogRatingCategoryValues);
app.get('/api/dogs/ratings/sources', routes.auth.checkSession, routes.api.getDogRatingSources);

// API POST routes.
app.post('/api/dogs/:dogId/currenthome', routes.auth.checkSession, routes.api.postCurrentHome);
app.post('/api/dogs/:dogId/notes', routes.auth.checkSession, routes.api.postNotes);
app.post('/api/dogs/:dogId/ratings', routes.auth.checkSession, routes.api.postDogRating);

// API PATCH routes.
app.patch('/api/dogs/:dogId/ratings/:dogRatingId', routes.auth.checkSession, routes.api.patchDogRating)

// API DELETE routes.
app.delete('/api/dogs/:dogId/ratings/:dogRatingId', routes.auth.checkSession, routes.api.deleteDogRating);

// Last, Angular Routes.
const ui = './skyux-spa-ui/dist/skyux-spa-ui';
app.get('/monitor', (req, res) => res.json({ running: true }));
app.use('/', express.static(ui));
app.all('*', (req, res) => res.status(200).sendFile('/', { root: ui }));

// Connect to the database.
database.connect(() => {
  // If we're running database setup, we don't need to start the server.
  // `node index.js --build-database`
  if (process.env.npm_config_build_database) {
    database.setup(function () {
      triggerReady();
      process.exit();
    });
  } else {
    let server;

    if (environment === 'production') {
      console.log('Using HTTPS protocol');
      server = https.createServer(
        {
          cert: 'path_to_cert_file',
          key: 'path_to_key_file'
        },
        app
      );
    } else {
      // for local development, use HTTP
      console.log('Using HTTP protocol');
      server = http.createServer({}, app);
    }

    // Listen to the port.
    server.listen(port, function () {
      console.log('Barkbaud is running on port', port);
      triggerReady();
    });
  }
});

// Alerts outside resources when server has been created.
function triggerReady() {
  if (callbacks.length > 0) {
    callbacks.forEach(function (callback) {
      callback();
    });
  }
}

module.exports = {
  ready: function (callback) {
    callbacks.push(callback);
  }
};
