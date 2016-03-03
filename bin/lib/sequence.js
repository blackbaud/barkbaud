/*jslint node: true, nomen: true*/
(function () {
    'use strict';

    var exec;

    exec = require('child_process').exec;

    // This module allows console commands to be executed in order.
    module.exports = function (commands, callback) {
        function executeNext() {
            var command;
            if (commands.length > 0) {
                command = commands.shift();
                exec(command, function (error, output, outputLog) {

                    if (error) {
                        console.log('Error: ' + error);
                        return;
                    }
                    if (output) {
                        console.log(output);
                    }
                    if (outputLog) {
                        console.log(outputLog);
                    }
                    if (commands.length) {
                        executeNext();
                    } else {
                        callback();
                    }
                });
            } else {
                if (callback) {
                    callback();
                }
            }
        }
        executeNext();
    };
}());