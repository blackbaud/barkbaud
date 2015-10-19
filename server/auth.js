/*jshint node: true */
'use strict';

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
module.exports = function () {

    var crypto = require('crypto'),
        oauth2 = require('simple-oauth2')({
            clientID: process.env.AUTH_CLIENT_ID,
            clientSecret: process.env.AUTH_CLIENT_SECRET,
            authorizationPath: '/renxt/authorization',
            site: 'https://oauth2.apim.blackbaud-dev.com',
            tokenPath: '/token'
        }),
        user;

    /**
     * An interface for our front-end to see if we're authenticated.
     * @name getAuthenticated
     * @param {Object} request
     * @param {Object} response
     */
    function validate(request, callback) {
        if (request.session.ticket) {
            oauth2.accessToken.create(request.session.ticket);
            if (oauth2.accessToken.expired()) {
                oauth2.accessToken.refresh(function (error, ticket) {
                    request.session.ticket = ticket;
                    return callback(!error);
                });
            } else {
                callback(true);
            }
        } else {
            callback(false);
        }
    }

    /**
     * An interface for our front-end to see if we're authenticated.
     * @name getAuthenticated
     * @param {Object} request
     * @param {Object} response
     */
    function getAuthenticated(request, response) {
        validate(request, function (success) {
            response.json({
                authenticated: success
            });
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
        var options,
            redirect;

        if (!request.query.code) {
            response.send('Invalid response.  Code is required.');
        } else if (!request.query.state) {
            response.send('Invalid response.  State is required.');
        } else if (request.session.state !== request.query.state) {
            response.send('Invalid response.  States do not match.');
        } else {
            options = {
                code: request.query.code,
                redirect_uri: process.env.AUTH_REDIRECT_URI
            };
            oauth2.authCode.getToken(options, function (error, ticket) {
                if (error) {
                    response.send('Invalid request.  ' + error.message);
                } else {
                    redirect = request.session.redirect || '/#/dashboard';
                    request.session.redirect = '';
                    request.session.ticket = ticket;
                    response.redirect(redirect);
                }
            });
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
        var redirect = request.session.redirect || '/';
        oauth2.accessToken.create(request.session.ticket);
        oauth2.accessToken.revoke('access_token', function () {
            oauth2.accessToken.revoke('refresh_token', function () {
                request.session.destroy();
                response.redirect(redirect);
            });
        });
    }

    return {
        validate: validate,
        getAuthenticated: getAuthenticated,
        getLogin: getLogin,
        getCallback: getCallback,
        getLogout: getLogout
    };

};
