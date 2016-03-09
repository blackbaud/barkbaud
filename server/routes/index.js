/*jslint node: true, nomen: true*/
(function () {
    'use strict';

    var routes;

    routes = {};

    routes.auth = require('./auth');
    routes.api = require('./api');

    module.exports = routes;
}());