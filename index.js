/*jshint node: true */
'use strict';

var apiDogs,
    apiNxt,
    app,
    auth,
    bodyParser,
    cors,
    express,
    fs,
    http,
    https,
    httpsOptions,
    session;

// Application dependencies
auth = require('./server/auth.js')();
apiNxt = require('./server/api-nxt.js')(auth);
apiDogs = require('./server/api-dogs.js')(apiNxt);
bodyParser = require('body-parser');
cors = require('cors');
express = require('express');
fs = require('fs');
http = require('http');
https = require('https');
session = require('express-session');

// Create our application and register its dependencies
app = express();
app.use(bodyParser.json());
app.use(cors({
    credentials: true,
    origin: [
        'http://localhost:5000',
        'http://localhost:8080',
        'https://glacial-mountain-6366.herokuapp.com'
    ]
}));
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

// Register our Dogs API GET routes
app.get('/api/dogs', apiDogs.getDogs);
app.get('/api/dogs/:dogId', apiDogs.getDog);
app.get('/api/dogs/:dogId/notes', apiDogs.getNotes);
app.get('/api/dogs/:dogId/currenthome', apiDogs.getCurrentHome);
app.get('/api/dogs/:dogId/previoushomes', apiDogs.getPreviousHomes);

// Register our Dogs API POST routes
app.post('/api/dogs/:dogId/notes', apiDogs.postNotes);

// Register our UI routes
app.use('/', express.static(__dirname + '/ui'));

function onListen() {
    console.log('Barkbaud app running for %s on port %s', process.env.DEPLOY_REMOTE, process.env.PORT);
}

// Create our server.
// For production we don't need to worry about using https as Heroku handles this for us.
if (process.env.DEPLOY_REMOTE === 'production') {
    http.createServer(app).listen(process.env.PORT, onListen);
} else {
    httpsOptions = {
        key: fs.readFileSync('sslcerts/server.key', 'utf8'),
        cert: fs.readFileSync('sslcerts/server.crt', 'utf8')
    };
    https.createServer(httpsOptions, app).listen(process.env.PORT, onListen);
}
