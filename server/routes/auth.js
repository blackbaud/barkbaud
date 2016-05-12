/*jshint node: true */

/**
 * Auth class which lightly wraps the simple-oauth2 package.
 * Provides the necessary methods for interacting with Blackbaud's OAUTH2 implemenation.
 * @constructor
 * @returns {Object}
 *  {@link getAuthenticated}
 *  {@link getLogin}
 *  {@link getCallback}
 *  {@link getLogout}
 */

(function () {
    'use strict';

    var crypto,
        oauth2;

    crypto = require('crypto');
    oauth2 = require('simple-oauth2')({
        clientID: process.env.AUTH_CLIENT_ID,
        clientSecret: process.env.AUTH_CLIENT_SECRET,
        authorizationPath: process.env.AUTH_PATH || '/authorization',
        site: process.env.AUTH_SITE_URL || 'https://oauth2.sky.blackbaud.com',
        tokenPath: process.env.AUTH_TOKEN_PATH || '/token'
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
            var json = {
                authenticated: success
            };
            if (success) {
                json.tenant_id = request.session.ticket.tenant_id;
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
        response.redirect(oauth2.authCode.authorizeURL({
            redirect_uri: process.env.AUTH_REDIRECT_URI,
            state: request.session.state
        }));
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
        var error,
            options,
            redirect;

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
            options = {
                code: request.query.code,
                redirect_uri: process.env.AUTH_REDIRECT_URI
            };
            oauth2.authCode.getToken(options, function (errorToken, ticket) {
                if (errorToken) {
                    error = errorToken.message;
                } else {
                    redirect = request.session.redirect || '/';

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
        var redirect,
            token;

        redirect = request.session.redirect || '/';

        function go() {
            request.session.destroy();
            response.redirect(redirect);
        }

        if (!request.session.ticket) {
            go();
        } else {
            token = oauth2.accessToken.create(request.session.ticket);
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
     * @param {Object} callback
     */
    function validate(request, callback) {
        var dtCurrent,
            dtExpires,
            token;

        if (request && request.session && request.session.ticket && request.session.expires) {

            dtCurrent = new Date();
            dtExpires = new Date(request.session.expires);

            if (dtCurrent >= dtExpires) {
                console.log('BARKBAUD - Token expired');
                try {
                    token = oauth2.accessToken.create(request.session.ticket);
                    token.refresh(function (error, ticket) {
                        if (!ticket || !ticket.token) {
                            return callback(false);
                        }
                        saveTicket(request, ticket.token);
                        return callback(!error);
                    });
                } catch (e) {
                    callback(false);
                }
            } else {
                callback(true);
            }
        } else {
            callback(false);
        }
    }

    module.exports = {
        checkSession: checkSession,
        getAuthenticated: getAuthenticated,
        getCallback: getCallback,
        getLogin: getLogin,
        getLogout: getLogout
    };
}());
