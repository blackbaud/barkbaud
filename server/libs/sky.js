/*jshint node: true */
(function () {
    'use strict';

    var constituentBaseUri,
        rq;

    constituentBaseUri = 'constituent/v1/';
    rq = require('request-promise');

    /**
     * Proxy method to the RENXT api.
     * Validates the session before initiating request.
     * @private
     * @name getProxy
     * @param {Object} request
     * @param {string} method
     * @param {string} endpoint
     */
    function proxy(request, method, endpoint, body) {
        return rq({
            json: true,
            method: method,
            body: body,
            timeout: 29000,
            url: 'https://api.sky.blackbaud.com/' + endpoint,
            headers: {
                'bb-api-subscription-key': process.env.AUTH_SUBSCRIPTION_KEY,
                'Authorization': 'Bearer ' + request.session.ticket.access_token
            }
        });
    }

    /**
     * Wrap all GET proxy calls.
     * @private
     * @name get
     * @param {Object} request
     * @param {String} endpoint
     */
    function get(request, endpoint) {
        return proxy(request, 'GET', endpoint, '');
    }

    /**
     * Wrap all POST proxy calls.
     * @private
     * @name get
     * @param {Object} request
     * @param {String} endpoint
     */
    function post(request, endpoint, body) {
        return proxy(request, 'POST', endpoint, body);
    }

    /**
     * Gets the requested constituent
     * @name getConstituent
     * @param {Object} request
     * @param {string} constituentId Id of the constituent to retrieve
     */
    function getConstituent(request, constituentId) {
        return get(request, constituentBaseUri + 'constituents/' + constituentId);
    }

    function getConstituentNoteTypes(request) {
        return get(request, constituentBaseUri + 'notetypes');
    }

    /**
     * Searches for a constituent.
     * @name getConstituent
     * @param {Object} request
     * @param {string} name Name of the constituent to search for.
     */
    function getConstituentSearch(request, name) {
        return get(request, constituentBaseUri + 'constituents/search?search_text=' + name);
    }

    function getConstituentProfilePicture(request, constituentId) {
        return get(request, constituentBaseUri + 'constituents/' + constituentId + '/profilepicture');
    }

    /**
     * Posts a note to the specified constituent
     * @name postNotes
     * @param {Object} request
     * @param {string} constituentId Id of the constituent to retrieve
     */
    function postNotes(request, body) {
        return post(request, constituentBaseUri + 'notes', body);
    }

    /**
     * Class which lightly wraps a few of RENXT API endpoints.
     * @constructor
     * @returns {Object}
     *  {@link getConstituent}
     */
    module.exports = {
        getConstituent: getConstituent,
        getConstituentNoteTypes: getConstituentNoteTypes,
        getConstituentSearch: getConstituentSearch,
        getConstituentProfilePicture: getConstituentProfilePicture,
        postNotes: postNotes
    };
}());
