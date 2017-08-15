const exec = require('child_process').exec;

// This module allows console commands to be executed in order.
module.exports = function (commands, callback) {
    function executeNext() {
        if (commands.length > 0) {
            const command = commands.shift();
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
