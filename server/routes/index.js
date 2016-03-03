/*jslint node: true, nomen: true*/
(function () {
    'use strict';

    var routes;

    routes = {
        api: {}
    };

    routes.auth = require('./auth');
    routes.api.sky = require('./api/sky');
    routes.api.dog = require('./api/dog')(routes.api.sky);

    module.exports = routes;
}());