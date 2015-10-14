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
    auth_client_id: process.env.AUTH_CLIENT_ID || '<Your-Client-Id>',
    auth_client_secret: process.env.AUTH_CLIENT_SECRET || '<Your-Client-Secret>',
    auth_subscription_key: process.env.AUTH_SUBSCRIPTION_KEY || '<Your-Subscription-Key>',
    auth_redirect_uri: process.env.AUTH_REDIRECT_URI || '<Your-Redirect-Uri>',
    parse_app_id: process.env.PARSE_APP_ID || '<Your-Parse-App-Id>',
    parse_js_key: process.env.PARSE_JS_KEY || '<Your-Parse-JS-Key>',
    pets_key: process.env.PETS_KEY || '<Your-PetFinder-Developer-Key>',
    port: process.env.PORT || 5000
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
app.listen(config.port, function () {
    console.log('Node app is running on port', config.port);
});
