const crypto = require('crypto');
const oauth2 = require('simple-oauth2').create({
    client: {
        id: process.env.AUTH_CLIENT_ID,
        secret: process.env.AUTH_CLIENT_SECRET
    },
    auth: {
        tokenHost: process.env.AUTH_SITE_URL || 'https://oauth2.sky.blackbaud.com',
        tokenPath: process.env.AUTH_TOKEN_PATH || '/token',
        authorizePath: process.env.AUTH_PATH || '/authorization'
    }
});

/**
 *
 * @name checkSession
 * @param {Object} request
 * @param {Object} response
 * @param {Object} next
 */
function checkSession(request, response, next) {
    validate(request, function (valid) {
        if (valid) {
            next();
        } else {
            response.sendStatus(401);
        }
    });
}

/**
 * An interface for our front-end to see if we're authenticated.
 * @name getAuthenticated
 * @param {Object} request
 * @param {Object} response
 */
function getAuthenticated(request, response) {
    validate(request, function (success) {
        const json = {
            authenticated: success
        };

        if (success) {
            json.environment_id = request.session.ticket.environment_id;
        }

        response.json(json);
    });
}

/**
 * Prepares our initial request to the oauth endpoint and redirects the user.
 * Handles an optional "redirect" querystring parameter, which we redirect to in getCallback.
 * @name getLogin
 * @param {Object} request
 * @param {Object} response
 */
function getLogin(request, response) {
    request.session.redirect = request.query.redirect;
    request.session.state = crypto.randomBytes(48).toString('hex');

    const authorizationUri = oauth2.authorizationCode.authorizeURL({
        redirect_uri: process.env.AUTH_REDIRECT_URI,
        state: request.session.state
    });

    response.redirect(authorizationUri);
}

/**
 * Handles oauth response.
 * Validates the code and state querystring params.
 * Exchanges code for an access token and redirects user back to app home.
 * @name getCallback
 * @param {Object} request
 * @param {Object} response
 */
function getCallback(request, response) {
    let error;

    if (request.query.error) {
        error = request.query.error;
    } else if (!request.query.code) {
        error = 'auth_missing_code';
    } else if (!request.query.state) {
        error = 'auth_missing_state';
    } else if (request.session.state !== request.query.state) {
        error = 'auth_invalid_state';
    }

    if (!error) {
        const options = {
            code: request.query.code,
            redirect_uri: process.env.AUTH_REDIRECT_URI
        };

        oauth2.authorizationCode.getToken(options, function (errorToken, ticket) {
            if (errorToken) {
                error = errorToken.message;
            } else {
                let redirect = request.session.redirect || '/';

                request.session.redirect = '';
                request.session.state = '';

                saveTicket(request, ticket);
                response.redirect(redirect);
            }
        });
    }

    if (error) {
        response.redirect('/#?error=' + error);
    }
}

/**
 * Revokes the tokens, clears our session, and redirects the user.
 * Handles an optional "redirect" querystring parameter.
 * @name getCallback
 * @param {Object} request
 * @param {Object} response
 */
function getLogout(request, response) {
    const redirect = request.session.redirect || '/';

    function go() {
        request.session.destroy();
        response.redirect(redirect);
    }

    if (!request.session.ticket) {
        go();
    } else {
        const token = oauth2.accessToken.create(request.session.ticket);
        token.revoke('access_token', function () {
            token.revoke('refresh_token', go);
        });
    }
}

/**
 * Internal function for saving ticket + expiration.
 * @internal
 * @name saveTicket
 * @param {Object} request
 * @param {Object} ticket
 */
function saveTicket(request, ticket) {
    request.session.ticket = ticket;
    request.session.expires = (new Date().getTime() + (1000 * ticket.expires_in));
}

/**
 *
 * @internal
 * @name validate
 * @param {Object} request
 * @param {Object} onComplete
 */
function validate(request, onComplete) {
    if (request && request.session && request.session.ticket && request.session.expires) {
        const dtCurrent = new Date();
        const dtExpires = new Date(request.session.expires);

        if (dtCurrent >= dtExpires) {
            console.log('BARKBAUD - Token expired');
            try {
                const token = oauth2.accessToken.create(request.session.ticket);
                token.refresh(function (error, ticket) {
                    if (!ticket || !ticket.token) {
                        return onComplete(false);
                    }

                    saveTicket(request, ticket.token);
                    return onComplete(!error);
                });
            } catch (e) {
                onComplete(false);
            }
        } else {
            onComplete(true);
        }
    } else {
        onComplete(false);
    }
}

module.exports = {
    checkSession,
    getAuthenticated,
    getCallback,
    getLogin,
    getLogout
};
