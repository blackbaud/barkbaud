/*jshint node: true */
module.exports = function (grunt) {
    'use strict';

    function addApiConfig() {
        var apiConfig,
            body,
            html,
            index;

        index = 'ui/index.html';
        body = '</body>';
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
        html = grunt.file.read(index);
        html = html.replace(body, apiConfig.join("\n") + body);

        grunt.file.write(index, html);
    }

    grunt.loadNpmTasks('grunt-contrib-copy');

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
    grunt.registerTask('api', addApiConfig);
    grunt.registerTask('build', [
        'copy:build',
        'api'
    ]);
    grunt.registerTask('default', ['build']);
};