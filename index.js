/*jshint node: true */
'use strict';

var apiDogs,
    apiNxt,
    app,
    auth,
    config,
    cors,
    corsOptions,
    corsWhitelist,
    express,
    pets,
    session;

// Application configuration
config = {
    AUTH_CLIENT_ID: process.env.AUTH_CLIENT_ID || '<Your-Client-Id>',
    AUTH_CLIENT_SECRET: process.env.AUTH_CLIENT_SECRET || '<Your-Client-Secret>',
    AUTH_SUBSCRIPTION_KEY: process.env.AUTH_SUBSCRIPTION_KEY || '<Your-Subscription-Key>',
    AUTH_REDIRECT_URI: process.env.AUTH_REDIRECT_URI || '<Your-Redirect-Uri>',
    PARSE_APP_ID: process.env.PARSE_APP_ID || '<Your-Parse-App-Id>',
    PARSE_JS_KEY: process.env.PARSE_JS_KEY || '<Your-Parse-JS-Key>',
    PETS_KEY: process.env.PETS_KEY || '<Your-PetFinder-Developer-Key>',
    PORT: process.env.PORT || 9090
};

// DEBUGGING.  PlEASE DELETE
config.PARSE_APP_ID = 'CkFcgnAJEOEWcBSbhrm7MeYUi4lFJqOpLw6xDYj7';
config.PARSE_JS_KEY = 'mXBdYlSnBQn1GU71mM4davaSlrbPTYW0kzRa5DjQ';
// DEBUGGING.  PlEASE DELETE

// Application dependencies
auth = require('./server/auth.js')(config);
apiDogs = require('./server/api-dogs.js')(config);
apiNxt = require('./server/api-nxt.js')(config, auth);
cors = require('cors');
express = require('express');
session = require('express-session');
pets = require('./server/pets.js')(config);

// Create our application and register its dependencies
app = express();
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: '+rEchas&-wub24dR'
}));

// Configure cors to allow credentials and * origin.
corsWhitelist = [
    'http://localhost:5000',
    'http://localhost:8080',
    'https://glacial-mountain-6366.herokuapp.com'
];
corsOptions = {
    origin: function (origin, callback) {
        callback(null, corsWhitelist.indexOf(origin) !== -1);
    }
};

// Register our OAUTH2 routes
app.get('/auth/authenticated', auth.getAuthenticated);
app.get('/auth/login', auth.getLogin);
app.get('/auth/callback', auth.getCallback);
app.get('/auth/logout', auth.getLogout);

// Register our Dogs API routes
app.get('/api/dogs', cors(corsOptions), apiDogs.getDogs);
app.get('/api/dogs/:dogId', cors(corsOptions), apiDogs.getDog);
app.get('/api/dogs/:dogId/summary', cors(corsOptions), apiDogs.getDogSummary);
app.get('/api/dogs/:dogId/notes', cors(corsOptions), apiDogs.getDogNotes);

// Register our NXT API routes
//app.get('/api*', apiNxt.getProxy);

// Register our pet API routes
app.get('/pets/random', pets.getRandom);

// Register our UI routes
app.use('/', express.static(__dirname + '/ui'));

// Create our server
app.listen(config.PORT, function () {
    console.log('Node app is running on port', config.PORT);
});
