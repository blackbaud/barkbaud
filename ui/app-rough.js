/*jshint node: true */
/*globals jQuery*/
'use strict';

(function ($) {
    $(function () {
        $.get('/auth/authenticated', function (response) {
            $('.state-logged-out').toggleClass('hide', response.authenticated);
            $('.state-logged-in').toggleClass('hide', !response.authenticated);
        });

        $('.btn-get-constituent').on('click', function (e) {
            e.preventDefault();
            $.get('/api/constituents/280', function (response) {
                $('.api-response').text(JSON.stringify(response, null, "\t"));
            });
        });

        $('.btn-get-pet').on('click', function (e) {
            e.preventDefault();
            $.get('/pets/random', function (response) {
                $('.api-response').text(JSON.stringify(response, null, "\t"));
            });
        });
    });
}(jQuery));
