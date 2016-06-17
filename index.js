/*jslint node: true, nomen: true*/
(function () {
    'use strict';

    var app,
        bodyParser,
        callbacks,
        colors,
        cors,
        Database,
        database,
        databaseUri,
        environment,
        express,
        fs,
        http,
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
            url: databaseUri,
            autoRemove: 'native'
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
    app.get('/api/dogs', routes.auth.checkSession, routes.api.getDogs);
    app.get('/api/dogs/:dogId', routes.auth.checkSession, routes.api.getDog);
    app.get('/api/dogs/:dogId/notes', routes.auth.checkSession, routes.api.getNotes);
    app.get('/api/dogs/:dogId/currenthome', routes.auth.checkSession, routes.api.getCurrentHome);
    app.get('/api/dogs/:dogId/previoushomes', routes.auth.checkSession, routes.api.getPreviousHomes);
    app.get('/api/dogs/:dogId/findhome', routes.auth.checkSession, routes.api.getFindHome);

    // API POST routes.
    app.post('/api/dogs/:dogId/currenthome', routes.auth.checkSession, routes.api.postCurrentHome);
    app.post('/api/dogs/:dogId/notes', routes.auth.checkSession, routes.api.postNotes);

    // Connect to the database.
    database.connect(function () {

        // If we're running database setup, we don't need to start the server.
        // `node index.js --build-database`
        if (process.env.npm_config_build_database) {
            database.setup(function () {
                triggerReady();
                process.exit();
            });

        } else {

            server = http.createServer(app);

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
}());
