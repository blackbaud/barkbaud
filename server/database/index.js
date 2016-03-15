/*jslint node: true, nomen: true*/
(function () {
    'use strict';

    var setup;

    setup = require(__dirname + '/setup');

    function Database(options) {
        var service,
            uri;

        uri = options.uri;
        service = options.service;

        this.connect = function (callback) {
            service.connect(uri);
            callback();
        };

        this.setup = setup;

        return this;
    }

    module.exports = Database;
}());