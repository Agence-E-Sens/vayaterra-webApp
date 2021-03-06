// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('vayaterra', ['ionic', 'ngCordova', 'vayaterra.controllers', 'uiGmapgoogle-maps'])

.run(function ($ionicPlatform, $localForage) {
    $ionicPlatform.ready(function () {

        //// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        //// for form inputs)
        //if (window.cordova && window.cordova.plugins.Keyboard) {
        //    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        //    cordova.plugins.Keyboard.disableScroll(true);

        //}
        //if (window.StatusBar) {
        //    // org.apache.cordova.statusbar required
        //    StatusBar.styleDefault();
        //}

    });
})

.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

        .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })

    .state('app.profile', {
        url: '/profile',
        views: {
            'menuContent': {
                templateUrl: 'templates/profile.html',
                controller: 'ProfileCtrl'
            }
        }
    })

    .state('app.project', {
        url: '/project',
        views: {
            'menuContent': {
                templateUrl: 'templates/project.html'
            }
        }
    })

    .state('app.safetygeo', {
        url: '/safetygeo',
        views: {
            'menuContent': {
                templateUrl: 'templates/safetygeo.html',
                controller : 'SafetyGeoCtrl'

            }
        }
    })

    .state('app.map', {
        url: '/map',
        cache: false,
        views: {
            'menuContent': {
                templateUrl: 'templates/map.html',
                controller: 'MapCtrl'
            }
        }
    })

    .state('app.events', {
        url: '/events',
        views: {
            'menuContent': {
                templateUrl: 'templates/events.html',
                controller: 'EventsCtrl'
            }
        }
    })

    .state('app.single', {
        url: '/events/:eventId',
        views: {
            'menuContent': {
                templateUrl: 'templates/event.html',
                controller: 'EventCtrl'
            }
        }
    })

    .state('app.settings', {
        url: '/settings',
        views: {
            'menuContent': {
                templateUrl: 'templates/settings.html'
            }
        }
    });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/events');

})

.config(function (uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyBtwtCB8BIFShMXDR1WzJdI19o-fd2RzgY',
        v: '3.24', //defaults to latest 3.X anyhow
        libraries: 'places'
    });
});
