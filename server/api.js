/*jshint node: true */
'use strict';

/**
 * Class which lightly wraps the RENXT API endpoints.
 * Currently passes all info after /api to the RENXT API.  This will be replaced by concrete endpoints.
 * @constructor
 * @param {Object} config
 * @param {string} config.AUTH_SUBSCRIPTION_KEY
 * @returns {Object}
 *  {@link getApi}
 */
module.exports = function (config, auth) {

    var https = require('request'),
        Parse = require('parse/node').Parse;

    Parse.initialize(config.PARSE_APP_ID, config.PARSE_JS_KEY);

    /**
     * Proxy method to the RENXT api.
     * Validates the session before initiating request.
     * @name getConstituents
     * @param {Object} request
     * @param {Object} response
     */
    function getProxy(request, response) {
        var options;

        auth.validate(request, function (success) {
            if (!success) {
                response.status(403).json({
                    error: 'Invalid session.'
                });
            } else {
                options = {
                    url: 'https://api.nxt.blackbaud-dev.com' + request.params[0],
                    headers: {
                        'bb-api-subscription-key': config.AUTH_SUBSCRIPTION_KEY,
                        'Authorization': 'Bearer ' + request.session.ticket.access_token
                    }
                };
                https(options, function (apiError, apiResponse, apiBody) {
                    response.json(JSON.parse(apiBody));
                });
            }
        });
    }

    function getUsers(request, response) {

    }

    return {
        getProxy: getProxy
    };
};
