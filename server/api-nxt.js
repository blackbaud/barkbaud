/*jshint node: true */
'use strict';

/**
 * Class which lightly wraps a few of RENXT API endpoints.
 * @constructor
 * @returns {Object}
 *  {@link getConstituent}
 */
module.exports = function (auth) {

    var promise = require('request-promise');

    /**
     * Proxy method to the RENXT api.
     * Validates the session before initiating request.
     * @private
     * @name getProxy
     * @param {Object} request
     * @param {string} method
     * @param {string} endpoint
     * @param {Function} callback
     */
    function proxy(request, method, endpoint, body, callback) {
        var options;

        auth.validate(request, function (success) {
            if (!success) {
                callback({
                    error: 'Invalid session.'
                });
            } else {
                options = {
                    json: true,
                    method: method,
                    body: body,
                    url: 'https://api.nxt.blackbaud-dev.com/' + endpoint,
                    headers: {
                        'bb-api-subscription-key': process.env.AUTH_SUBSCRIPTION_KEY,
                        'Authorization': 'Bearer ' + request.session.ticket.access_token
                    }
                };
                promise(options).then(callback).catch(function (err) {
                    console.log(err);
                });
            }
        });
    }

    /**
     * Wrap all GET proxy calls.
     * @private
     * @name get
     * @param {Object} request
     * @param {String} endpoint
     * @param {Function} callback
     */
    function get(request, endpoint, callback) {
        return proxy(request, 'GET', endpoint, '', callback);
    }

    /**
     * Wrap all POST proxy calls.
     * @private
     * @name get
     * @param {Object} request
     * @param {String} endpoint
     * @param {Function} callback
     */
    function post(request, endpoint, body, callback) {
        return proxy(request, 'POST', endpoint, body, callback);
    }

    /**
     * Gets the requested constituent
     * @name getConstituent
     * @param {Object} request
     * @param {string} constituentId Id of the constituent to retrieve
     * @param {Function} callback
     */
    function getConstituent(request, constituentId, callback) {
        get(request, 'constituents/' + constituentId, callback);
    }

    /**
     * Posts a note to the specified constituent
     * @name postNotes
     * @param {Object} request
     * @param {string} constituentId Id of the constituent to retrieve
     * @param {Function} callback
     */
    function postNotes(request, constituentId, body, callback) {
        post(request, 'constituents/' + constituentId + '/notes', body, callback);
    }

    // Expose any methods from our module
    return {
        getConstituent: getConstituent,
        postNotes: postNotes
    };
};
