/*jshint node: true */
'use strict';

var api,
    app,
    auth,
    config,
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
    PORT: process.env.PORT || 5000
};

// Application dependencies
auth = require('./server/auth.js')(config);
api = require('./server/api.js')(config, auth);
pets = require('./server/pets.js')(config);
express = require('express');
session = require('express-session');

// Create our application and register its dependencies
app = express();
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: '+rEchas&-wub24dR'
}));

// Register our OAUTH2 routes
app.get('/auth/authenticated', auth.getAuthenticated);
app.get('/auth/login', auth.getLogin);
app.get('/auth/callback', auth.getCallback);
app.get('/auth/logout', auth.getLogout);

// Register our NXT API routes.
app.get('/api*', api.getProxy);

// Register our pet API routes
app.get('/pets/random', pets.getRandom);

// Register our UI routes
app.use('/', express.static(__dirname + '/ui'));

// Create our server
app.listen(config.PORT, function () {
    console.log('Node app is running on port', config.PORT);
});
