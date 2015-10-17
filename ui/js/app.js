/*globals angular */

(function () {
    'use strict';

    var barkbaudConfig = {
        apiUrl: 'https://glacial-mountain-6366.herokuapp.com/'
    };

    function config($locationProvider, $urlRouterProvider, $stateProvider, bbWindowConfig) {
        $locationProvider.html5Mode(false);
        $urlRouterProvider.otherwise('/home');
        $stateProvider
            .state('login', {
                controller: 'LoginPageController as loginPage',
                templateUrl: 'pages/login/loginpage.html',
                url: '/login'
            })
            .state('home', {
                controller: 'DashboardPageController as dashboardPage',
                templateUrl: 'pages/dashboard/dashboardpage.html',
                url: '/home'
            })
            .state('dog', {
                abstract: true,
                controller: 'DogPageController as dogPage',
                templateUrl: 'pages/dogs/dogpage.html',
                url: '/dogs/:dogId',
                resolve: {
                    dogId: ['$stateParams', function ($stateParams) {
                        return $stateParams.dogId;
                    }]
                }
            })
            .state('dog.views', {
                url: '',
                views: {
                    'summary': {
                        controller: 'DogSummaryTileController as dogSummaryTile',
                        templateUrl: 'pages/dogs/summary/summarytile.html'
                    },
                    'notes': {
                        controller: 'DogNotesTileController as dogNotesTile',
                        templateUrl: 'pages/dogs/notes/notestile.html'
                    }
                }
            });

        bbWindowConfig.productName = 'Barkbaud';
    }

    config.$inject = ['$locationProvider', '$urlRouterProvider', '$stateProvider', 'bbWindowConfig'];

    function run(bbDataConfig, barkbaudAuthService, $rootScope, $state) {

        $rootScope.$on('$stateChangeStart', function (event, toState) {
            if (!barkbaudAuthService.authenticated && toState.name !== 'login') {
                event.preventDefault();
                $state.go('login');
            }
        });

        function addBaseUrl(url) {
            return barkbaudConfig.apiUrl + url;
        }

        bbDataConfig.dataUrlFilter = addBaseUrl;
        bbDataConfig.resourceUrlFilter = addBaseUrl;
    }

    run.$inject = ['bbDataConfig', 'barkbaudAuthService', '$rootScope', '$state'];

    angular.module('barkbaud', ['sky', 'ui.bootstrap', 'ui.router', 'ngAnimate', 'barkbaud.templates'])
        .constant('barkbaudConfig', barkbaudConfig)
        .config(config)
        .run(run)
        .controller('MainController', angular.noop);
}());

/*global angular */

(function () {
    'use strict';

    function barkPhoto() {
        return {
            scope: {
                barkPhotoUrl: '='
            },
            link: function (scope, el) {
                scope.$watch('barkPhotoUrl', function (newValue) {
                    if (newValue) {
                        el.css('background-image', 'url(\'' + newValue + '\')');
                    }
                });
            },
            replace: true,
            templateUrl: 'components/photo.html'
        };
    }

    angular.module('barkbaud')
        .directive('barkPhoto', barkPhoto);
}());

/*global angular */

(function () {
    'use strict';

    function DashboardPageController($stateParams, bbData, bbWindow) {
        var self = this;

        bbWindow.setWindowTitle('Dashboard');

        bbData.load({
            data: 'api/dogs'
        }).then(function (result) {
            self.dogs = result.data.data;
        });
    }

    DashboardPageController.$inject = ['$stateParams', 'bbData', 'bbWindow'];

    angular.module('barkbaud')
        .controller('DashboardPageController', DashboardPageController);
}());

/*global angular */

(function () {
    'use strict';

    function DogPageController($stateParams, bbData, bbWindow, dogId) {
        var self = this;

        self.tiles = [
            {
                id: 'DogSummaryTile',
                view_name: 'summary',
                collapsed: false,
                collapsed_small: false
            },
            {
                id: 'DogNotesTile',
                view_name: 'notes',
                collapsed: false,
                collapsed_small: false
            }
        ];

        self.layout = {
            one_column_layout: [
                'DogSummaryTile',
                'DogNotesTile'
            ],
            two_column_layout: [
                [
                    'DogSummaryTile'
                ],
                [
                    'DogNotesTile'
                ]
            ]
        };

        bbData.load({
            data: 'api/dogs/' + encodeURIComponent(dogId)
        }).then(function (result) {
            self.dog = result.data.data;
            bbWindow.setWindowTitle(self.dog.name);
        });
    }

    DogPageController.$inject = ['$stateParams', 'bbData', 'bbWindow', 'dogId'];

    angular.module('barkbaud')
        .controller('DogPageController', DogPageController);
}());

/*global angular */

(function () {
    'use strict';

    function NoteAddController() {
    }

    function barkNoteAdd(bbModal) {
        return {
            open: function () {
                return bbModal.open({
                    controller: 'NoteAddController as noteAdd',
                    templateUrl: 'pages/dogs/notes/noteadd.html'
                });
            }
        };
    }

    barkNoteAdd.$inject = ['bbModal'];

    angular.module('barkbaud')
        .controller('NoteAddController', NoteAddController)
        .factory('barkNoteAdd', barkNoteAdd);
}());

/*global angular */

(function () {
    'use strict';

    function DogNotesTileController($timeout, bbData, bbMoment, barkNoteAdd, dogId) {
        var self = this;

        bbData.load({
            data: 'api/dogs/' + encodeURIComponent(dogId) + '/notes'
        }).then(function (result) {
            self.notes = result.data.data;
        });

        self.getNoteDate = function (date) {
            if (date && date.iso) {
                return bbMoment(date.iso).calendar();
            }
        };

        self.addNote = function () {
            barkNoteAdd.open();
        };
    }

    DogNotesTileController.$inject = ['$timeout', 'bbData', 'bbMoment', 'barkNoteAdd', 'dogId'];

    angular.module('barkbaud')
        .controller('DogNotesTileController', DogNotesTileController);
}());

/*global angular */

(function () {
    'use strict';

    function DogSummaryTileController($timeout, bbData, bbMoment, dogId) {
        var self = this;

        bbData.load({
            data: 'api/dogs/' + encodeURIComponent(dogId) + '/summary'
        }).then(function (result) {
            self.summary = result.data.data;
        });

        self.getSummaryDate = function (date) {
            if (date && date.iso) {
                return bbMoment(date.iso).format('MMM Do YY');
            }
        };
    }

    DogSummaryTileController.$inject = ['$timeout', 'bbData', 'bbMoment', 'dogId'];

    angular.module('barkbaud')
        .controller('DogSummaryTileController', DogSummaryTileController);
}());

/*global angular */

(function () {
    'use strict';

    function LoginPageController(bbWindow, barkbaudAuthService) {
        var self = this;

        self.isAuthenticated = false;
        self.login = barkbaudAuthService.login;
        self.logout = barkbaudAuthService.logout;

        barkbaudAuthService.isAuthenticated().then(function (r) {
            self.isAuthenticated = r;
        });

        bbWindow.setWindowTitle('Login');
    }

    LoginPageController.$inject = [
        'bbWindow',
        'barkbaudAuthService'
    ];

    angular.module('barkbaud')
        .controller('LoginPageController', LoginPageController);
}());

/*global angular */

(function () {
    'use strict';

    function barkbaudAuthService(barkbaudConfig, bbData, $q, $window) {
        var service = {};

        service.isAuthenticated = function () {
            var deferred = $q.defer();
            bbData.load({
                data: 'auth/authenticated'
            }).then(function (result) {
                service.authenticated = result.data.authenticated;
                deferred.resolve(result.data.authenticated);
            });
            return deferred.promise;
        };

        service.login = function () {
            $window.location.href = barkbaudConfig.apiUrl + 'auth/login';
        };

        service.logout = function () {
            $window.location.href = barkbaudConfig.apiUrl + 'auth/logout';
        };

        service.isAuthenticated();
        return service;
    }

    barkbaudAuthService.$inject = [
        'barkbaudConfig',
        'bbData',
        '$q',
        '$window'
    ];

    angular.module('barkbaud')
        .factory('barkbaudAuthService', barkbaudAuthService);
}());

angular.module('barkbaud.templates', []).run(['$templateCache', function($templateCache) {
    $templateCache.put('components/photo.html',
        '<div class="bark-dog-photo img-circle center-block">\n' +
        '</div>\n' +
        '');
    $templateCache.put('pages/dashboard/dashboardpage.html',
        '<div class="container-fluid">\n' +
        '  <h1>Dashboard</h1>\n' +
        '  <section class="panel" ng-repeat="dog in dashboardPage.dogs">\n' +
        '    <div class="panel-body">\n' +
        '      <div class="row">\n' +
        '          <div class="col-md-3 col-lg-2">\n' +
        '              <bark-photo bark-photo-url="dog.image.url"></bark-photo>\n' +
        '          </div>\n' +
        '          <div class="col-md-9 col-lg-10">\n' +
        '              <h1>\n' +
        '                <a ui-sref="dog.views({dogId: dog.objectId})">{{dog.name}}</a>\n' +
        '              </h1>\n' +
        '              <h4>{{dog.breed}} &middot; {{dog.gender}}</h4>\n' +
        '              <p class="bb-text-block bark-dog-bio">{{dog.bio}}</p>\n' +
        '          </div>\n' +
        '      </div>\n' +
        '    </div>\n' +
        '  </section>\n' +
        '</div>\n' +
        '');
    $templateCache.put('pages/dogs/dogpage.html',
        '<div class="bb-page-header">\n' +
        '    <div class="container-fluid">\n' +
        '        <div class="row">\n' +
        '            <div class="col-md-3 col-lg-2">\n' +
        '                <bark-photo bark-photo-url="dogPage.dog.image.url"></bark-photo>\n' +
        '            </div>\n' +
        '            <div class="col-md-9 col-lg-10">\n' +
        '                <h1>\n' +
        '                  {{dogPage.dog.name}}\n' +
        '                </h1>\n' +
        '                <h4>{{dogPage.dog.breed}} &middot; {{dogPage.dog.gender}}</h4>\n' +
        '                <p></p>\n' +
        '                <p class="bb-text-block bark-dog-bio">{{dogPage.dog.bio}}</p>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '    </div>\n' +
        '</div>\n' +
        '<div class="container-fluid">\n' +
        '    <bb-tile-dashboard bb-layout="dogPage.layout" bb-tiles="dogPage.tiles"></bb-tile-dashboard>\n' +
        '</div>\n' +
        '');
    $templateCache.put('pages/dogs/notes/noteadd.html',
        '<bb-modal>\n' +
        '  <div class="modal-form">\n' +
        '    <bb-modal-header>Add note</bb-modal-header>\n' +
        '    <div bb-modal-body>\n' +
        '      <form>\n' +
        '        <div class="form-group">\n' +
        '          <label class="control-label">Date</label>\n' +
        '          <bb-datepicker type="text" ng-model="noteAdd.date"></bb-date-picker>\n' +
        '        </div>\n' +
        '        <div class="form-group">\n' +
        '          <label class="control-label">Note</label>\n' +
        '          <input type="text" class="form-control" ng-model="noteAdd.title" />\n' +
        '        </div>\n' +
        '        <div class="form-group">\n' +
        '          <textarea class="form-control" ng-model="noteAdd.description"></textarea>\n' +
        '        </div>\n' +
        '        <div class="form-group">\n' +
        '          <label class="control-label">\n' +
        '            <input type="checkbox" bb-check ng-model="noteAdd.addConstituentNote" />\n' +
        '            Also add this note to the dog\'s current owner\n' +
        '          </label>\n' +
        '        </div>\n' +
        '      </form>\n' +
        '    </div>\n' +
        '    <bb-modal-footer>\n' +
        '      <bb-modal-footer-button-primary></bb-modal-footer-button-primary>\n' +
        '      <bb-modal-footer-button-cancel></bb-modal-footer-button-cancel>\n' +
        '    </bb-modal-footer>\n' +
        '  </div>\n' +
        '</bb-modal>\n' +
        '');
    $templateCache.put('pages/dogs/notes/notestile.html',
        '<bb-tile bb-tile-header="\'Notes\'">\n' +
        '  <div>\n' +
        '    <div class="toolbar bb-tile-toolbar">\n' +
        '      <button type="button" class="btn bb-btn-secondary" ng-click="dogNotesTile.addNote()"><i class="fa fa-plus-circle"></i> Add Note</button>\n' +
        '    </div>\n' +
        '    <div ng-show="dogNotesTile.notes">\n' +
        '      <div ng-switch="dogNotesTile.notes.length || 0">\n' +
        '        <div bb-tile-section ng-switch-when="0" class="bb-no-records">\n' +
        '          This dog has no notes.\n' +
        '        </div>\n' +
        '        <div ng-switch-default class="bb-repeater">\n' +
        '          <div ng-repeat="note in dogNotesTile.notes" class="bb-repeater-item">\n' +
        '            <h4 class="bb-repeater-item-title">{{ note.title }}</h4>\n' +
        '            <h5>{{ dogNotesTile.getNoteDate(note.date) }}</h5>\n' +
        '            <p>{{ note.description }}</p>\n' +
        '          </div>\n' +
        '        </div>\n' +
        '      </div>\n' +
        '    </div>\n' +
        '  </div>\n' +
        '</bb-tile>\n' +
        '');
    $templateCache.put('pages/dogs/summary/summarytile.html',
        '<bb-tile bb-tile-header="\'Summary\'">\n' +
        '  <div>\n' +
        '    <div ng-show="dogSummaryTile.summary">\n' +
        '      <div ng-switch="dogSummaryTile.summary.length || 0">\n' +
        '        <div bb-tile-section ng-switch-when="0" class="bb-no-records">\n' +
        '          This dog has no summary.\n' +
        '        </div>\n' +
        '        <div ng-switch-default class="bb-repeater">\n' +
        '          <div ng-repeat="summary in dogSummaryTile.summary" class="bb-repeater-item">\n' +
        '            <h4 class="bb-repeater-item-title">{{ summary.constituent.name }}</h4>\n' +
        '            <h5>\n' +
        '              {{ dogSummaryTile.getSummaryDate(summary.fromDate) }}\n' +
        '              <span ng-show="summary.toDate">\n' +
        '                to {{ dogSummaryTile.getSummaryDate(summary.toDate) }}\n' +
        '              </span>\n' +
        '            </h5>\n' +
        '          </div>\n' +
        '        </div>\n' +
        '      </div>\n' +
        '    </div>\n' +
        '  </div>\n' +
        '</bb-tile>\n' +
        '');
    $templateCache.put('pages/login/loginpage.html',
        '<div class="container-fluid">\n' +
        '  <h1>Login</h1>\n' +
        '  <div class="panel">\n' +
        '    <div class="panel-body">\n' +
        '      <div ng-if="loginPage.isAuthenticated">\n' +
        '        <button type="button" class="btn btn-primary" ng-click="loginPage.logout()">\n' +
        '          Logout\n' +
        '        </button>\n' +
        '      </div>\n' +
        '      <div ng-if="!loginPage.isAuthenticated">\n' +
        '        <button type="button" class="btn btn-primary" ng-click="loginPage.login()">\n' +
        '          Login with Blackbaud\n' +
        '        </button>\n' +
        '      <div>\n' +
        '    </div>\n' +
        '  </div>\n' +
        '</div>\n' +
        '');
}]);

//# sourceMappingURL=app.js.map