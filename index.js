/*jslint node: true, nomen: true*/
(function () {
    'use strict';

    var app,
        bodyParser,
        callbacks,
        colors,
        cookieParser,
        cors,
        Database,
        database,
        databaseUri,
        environment,
        express,
        fs,
        http,
        https,
        MongoStore,
        mongoose,
        port,
        routes,
        server,
        session,
        sessionConfig,
        timeout;

    // Dependencies.
    fs = require('fs');
    cors = require('cors');
    http = require('http');
    https = require('https');
    routes = require('./server/routes');
    colors = require('colors');
    express = require('express');
    session = require('express-session');
    timeout = require('connect-timeout');
    Database = require('./server/database');
    mongoose = require('mongoose');
    MongoStore = require('connect-mongo/es5')(session);
    bodyParser = require('body-parser');

    callbacks = [];
    databaseUri = process.env.DATABASE_URI || null;
    environment = process.env.NODE_ENV || 'development';
    port = process.env.PORT || 5000;
    sessionConfig = {
        resave: false,
        saveUninitialized: true,
        secret: '+rEchas&-wub24dR'
    };

    // Check if database URI has been provided.
    if (databaseUri === null) {
        console.log(colors.red("Please specify a DATABASE_URI in .env!"));
        process.exit();
    }

    // Only cache the authorized session in production.
    if (environment === "production") {
        sessionConfig.store = new MongoStore({
            url: databaseUri
        });
    }

    // Connect to the database.
    database = new Database({
        uri: databaseUri,
        service: mongoose
    });

    // Create the app.
    app = express();
    app.set('port', port);
    app.use(bodyParser.json());
    app.use(timeout('120s'));
    app.use(session(sessionConfig));
    app.use(cors({
        credentials: true,
        origin: [
            'http://localhost:5000',
            'http://localhost:8080'
        ]
    }));

    // Routes.
    app.use('/', express.static(__dirname + '/ui'));

    // Authentication routes.
    app.get('/auth/authenticated', routes.auth.getAuthenticated);
    app.get('/auth/login', routes.auth.getLogin);
    app.get('/auth/callback', routes.auth.getCallback);
    app.get('/auth/logout', routes.auth.getLogout);

    // API GET routes.
    app.get('/api/dogs', routes.auth.checkSession, routes.api.dog.getDogs);
    app.get('/api/dogs/:dogId', routes.auth.checkSession, routes.api.dog.getDog);
    app.get('/api/dogs/:dogId/notes', routes.auth.checkSession, routes.api.dog.getNotes);
    app.get('/api/dogs/:dogId/currenthome', routes.auth.checkSession, routes.api.dog.getCurrentHome);
    app.get('/api/dogs/:dogId/previoushomes', routes.auth.checkSession, routes.api.dog.getPreviousHomes);
    app.get('/api/dogs/:dogId/findhome', routes.auth.checkSession, routes.api.dog.getFindHome);

    // API POST routes.
    app.post('/api/dogs/:dogId/currenthome', routes.auth.checkSession, routes.api.dog.postCurrentHome);
    app.post('/api/dogs/:dogId/notes', routes.auth.checkSession, routes.api.dog.postNotes);

    // Connect to the database.
    database.connect(function () {

        // If we're building the database, we don't need to create the server.
        // `node index.js --build-database`
        if (process.env.npm_config_build_database) {
            database.setup(function () {
                triggerReady();
                process.exit();
            });

        } else {

            // Create the server.
            if (environment === 'production') {
                server = http.createServer(app);
            } else {
                server = https.createServer({
                    key: fs.readFileSync('./server/sslcerts/server.key', 'utf8'),
                    cert: fs.readFileSync('./server/sslcerts/server.crt', 'utf8')
                }, app);
            }

            // Listen to the port.
            server.listen(app.get('port'), function () {
                console.log('Node app is running on port', app.get('port'));
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
}());