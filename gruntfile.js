/*jshint node: true */
module.exports = function (grunt) {
    'use strict';

    var ui = 'ui/',
        body = '</body>',
        apiConfig = [
            "<script>",
            "(function () {",
            "    'use strict';",
            "    function config(barkbaudConfig) {",
            "        barkbaudConfig.apiUrl = '/';",
            "    }",
            "    config.$inject = ['barkbaudConfig'];",
            "    angular.module('barkbaud')",
            "        .config(config);",
            "}());",
            "</script>"
        ];

    grunt.initConfig({
        copy: {
            build: {
                files: [{
                    expand: true,
                    src: ['**/*.*'],
                    cwd: 'bower_components/barkbaud-ui/build',
                    dest: 'ui'
                }]
            }
        }
    });

    // Added the AngularJS config to make the api calls relative
    grunt.registerTask('api', function () {
        var index = ui + 'index.html',
            html = grunt.file.read(index);
        html = html.replace(body, apiConfig.join("\n") + body);
        grunt.file.write(index, html);
    });

    grunt.registerTask('build', [
        'copy:build',
        'api'
    ]);

    grunt.loadNpmTasks('grunt-contrib-copy');
};
