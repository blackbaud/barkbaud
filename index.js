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
    RedisStore,
    session,
    sessionConfig,
    timeout;

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
RedisStore = require('connect-redis')(session);
timeout = require('connect-timeout');

// If deployed in our demo site, we store the sessions using Redis
// Locally we store the sessions in memory
sessionConfig = {
    resave: false,
    saveUninitialized: true,
    secret: '+rEchas&-wub24dR'
};

if (process.env.NODE_ENV === 'production') {
    sessionConfig.store = new RedisStore({
        url: process.env.REDIS_URL
    });
}

// Create our application and register its dependencies
app = express();
app.use(bodyParser.json());
app.use(cors({
    credentials: true,
    origin: [
        'http://localhost:5000',
        'http://localhost:8080',
        'https://' + process.env.HEROKU_APP_NAME
    ]
}));
app.use(session(sessionConfig));
app.use(timeout('30s'));

// Register our OAUTH2 routes
app.get('/auth/authenticated', auth.getAuthenticated);
app.get('/auth/login', auth.getLogin);
app.get('/auth/callback', auth.getCallback);
app.get('/auth/logout', auth.getLogout);

// Register our Dogs GET API routes
app.get('/api/dogs', requireSession, apiDogs.getDogs);
app.get('/api/dogs/:dogId', requireSession, apiDogs.getDog);
app.get('/api/dogs/:dogId/notes', requireSession, apiDogs.getNotes);
app.get('/api/dogs/:dogId/photo', requireSession, apiDogs.getPhoto);
app.get('/api/dogs/:dogId/currenthome', requireSession, apiDogs.getCurrentHome);
app.get('/api/dogs/:dogId/previoushomes', requireSession, apiDogs.getPreviousHomes);
app.get('/api/dogs/:dogId/findhome', requireSession, apiDogs.getFindHome);

// Register our Dogs POST API routes
app.post('/api/dogs/:dogId/currenthome', requireSession, apiDogs.postCurrentHome);
app.post('/api/dogs/:dogId/notes', requireSession, apiDogs.postNotes);

// Register our front-end UI routes
app.use('/', express.static(__dirname + '/ui'));

function requireSession(request, response, next) {
    auth.validate(request, function (valid) {
        if (valid) {
            next();
        } else {
            response.sendStatus(401);
        }
    });
}

function onListen() {
    console.log('Barkbaud app running for %s on port %s', process.env.NODE_ENV, process.env.PORT);
}

// Create our server.
// For production we don't need to worry about using https as Heroku handles this for us.
if (process.env.NODE_ENV === 'production') {
    http.createServer(app).listen(process.env.PORT, onListen);
} else {
    httpsOptions = {
        key: fs.readFileSync('sslcerts/server.key', 'utf8'),
        cert: fs.readFileSync('sslcerts/server.crt', 'utf8')
    };
    https.createServer(httpsOptions, app).listen(process.env.PORT, onListen);
}
