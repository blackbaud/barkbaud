/*jshint node: true */
'use strict';

/**
 * Class which lightly wraps a few of RENXT API endpoints.
 * @constructor
 * @param {Object} config
 * @param {string} config.AUTH_SUBSCRIPTION_KEY
 * @returns {Object}
 *  {@link getConstituent}
 */
module.exports = function (config, auth) {

    var promise = require('request-promise');

    /**
     * Proxy method to the RENXT api.
     * Validates the session before initiating request.
     * @private
     * @name getProxy
     * @param {Object} request
     * @param {String} endpoint
     * @returns {Promise}
     */
    function get(request, endpoint, callback) {
        var options;

        auth.validate(request, function (success) {
            if (!success) {
                callback({
                    error: 'Invalid session.'
                });
            } else {
                options = {
                    json: true,
                    url: 'https://api.nxt.blackbaud-dev.com/' + endpoint,
                    headers: {
                        'bb-api-subscription-key': config.AUTH_SUBSCRIPTION_KEY,
                        'Authorization': 'Bearer ' + request.session.ticket.access_token
                    }
                };
                promise(options).then(callback);
            }
        });
    }

    /**
     * Gets the requested constituent
     * @name getConstituent
     * @param {string} constituentId Id of the constituent to retrieve
     */
    function getConstituent(request, constituentId, callback) {
        get(request, 'constituents/' + constituentId, callback);
    }

    // Expose any methods from our module
    return {
        getConstituent: getConstituent
    };
};
