var app,
    authorization_uri,
    cookieParser,
    express,
    session,
    oauth2;

express = require('express');
cookieParser = require('cookie-parser');
session = require('express-session');

app = express();
app.use(cookieParser());
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: '+rEchas&-wub24dR'
}));

oauth2 = require('simple-oauth2')({
    client_id: 'asdf',
    client_secret: 'asdfasdf',
    site: 'https://oauth2.apim.blackbaud-dev.com',
    tokenPath: '/token',
    authorizationPath: '/renxt/authorization'
});

// Authorization uri definition
authorization_uri = oauth2.authCode.authorizeURL({
    redirect_uri: 'http://localhost:3000/callback',
    response_type: 'code',
    state: '3(#0/!~'
});

// Initial page redirecting to Github
app.get('/auth', function (req, res) {
    res.redirect(authorization_uri);
});

// Callback service parsing the authorization token and asking for the access token
app.get('/callback', function (req, res) {
    var code = req.query.code;
    console.log('/callback');
    oauth2.authCode.getToken({
        code: code,
        redirect_uri: 'http://localhost:3000/callback'
    }, function (error, result) {
        if (error) {
            console.log('Access Token Error', error.message);
        }
        req.session.accessToken = oauth2.accessToken.create(result);
    });
});

app.get('/', function (req, res) {
    if (!req.session.accessToken) {
        res.send('<a href="/auth">Log in with Blackbaud</a>');
    } else {
        res.send('Already logged in');
    }
});

app.listen(80);
console.log('Express server started on port 80');
