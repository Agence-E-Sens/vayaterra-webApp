angular.module('vayaterra.controllers', ['uiGmapgoogle-maps', 'LocalForageModule'])

.controller('AppCtrl', function ($scope, $rootScope, $http, $ionicModal, $localForage, $timeout, $state, $ionicSideMenuDelegate) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.geolocate = true;

    var user = $localForage.createInstance({
        name: 'userdata',
    });
    var appdata = $localForage.createInstance({
        name: 'appdata',
    });

    //    $rootScope.user = $localForage.instance('userdata');
    //    $rootScope.user.getItem('data').then(function (data) {
    //        if (data == null) {
    //            $rootScope.logged = false;
    //        } else {
    //            $scope.userdata = data;
    //            $rootScope.logged = true;
    //        }
    //    });

    $rootScope.logged = true;



    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/modals/connect.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
        $scope.animate();
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
        $scope.modal.show();
    };

    // Soumission du formulaire de connexion
    $scope.doLogin = function () {

        $http({
                method: 'POST',
                url: 'http://vayaterra.local/connect.php',
                data: $.param($scope.loginData), // pass in data as strings
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            })
            .success(function (data) {

                if (!data.success) {
                    $scope.errorPasswd = data.errors.password;
                    $scope.errorUsername = data.errors.username;

                } else {
                    //Connexion réussie
                    $scope.userdata = data.message;
                    $scope.user.setItem('data', data.message).then(
                        function () {
                            $rootScope.logged = true;
                            $scope.closeLogin();
                            $state.go('app.profile');
                        });
                }
            });
    };

    //deconnexion
    $scope.disconnect = function () {
        $scope.user.removeItem('data');
        $scope.userdata = null;
        $rootScope.logged = false;
        $ionicHistory.nextViewOptions({
            historyRoot: false
        });
        $state.go('app.events');
    };

    $scope.animate = function (isOpen) {

        var child;
        var content = $('#content')

        var button = document.getElementById('hamburger');

        child = button.childNodes[1].classList;

        if (!isOpen) {
            if (content.hasClass('background--blur')) content.removeClass('background--blur');
            console.log('Menu fermé ' + isOpen);
            child.remove('material-design-hamburger__icon--to-arrow');
            child.add('material-design-hamburger__icon--from-arrow');
        } else {
            console.log('Menu Ouvert ' + isOpen);
            content.addClass('background--blur');
            child.remove('material-design-hamburger__icon--from-arrow');
            child.add('material-design-hamburger__icon--to-arrow');
        }
    };

    $scope.$watch(function () {
            return $ionicSideMenuDelegate.isOpenLeft();
        },
        function (isOpen) {
            $scope.animate(isOpen);
        });
})

.controller('EventsCtrl', function ($scope) {
    $scope.events = [
        {
            title: 'Festival de la Musique',
            id: 1
        },
        {
            title: 'Carnaval',
            id: 2
        },
        {
            title: 'Union pour la paix',
            id: 3
        },
        {
            title: "Envol d'oiseaux migratoires",
            id: 4
        }
    ];


    $scope.refresh = function () {
        $http({
                method: 'POST',
                url: 'http://vayaterra.local/getEvents.php',
                data: $.param($scope.loginData), // pass in data as strings
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            })
            .success(function (data) {

                if (!data.success) {
                    $scope.errorPasswd = data.errors.password;
                    $scope.errorUsername = data.errors.username;

                } else {
                    //Connexion réussie
                    $scope.userdata = data.message;
                    $scope.user.setItem('data', data.message).then(
                        function () {

                        });
                }
            });

    };
})

.controller('ProfileCtrl', function ($scope) {

})

.controller('EventCtrl', function ($scope, $stateParams) {


})

.controller('MapCtrl', function ($scope, $rootScope, $cordovaGeolocation, $cordovaNetwork, uiGmapGoogleMapApi) {


    $scope.isWatching = false;
    $scope.notWatchin = true;

    $scope.tools = [
        {
            name: 'Refresh',
            cssClass: 'geoRefresh',
            fn: 'currentPos()',
            show: '',
            hide: '',
        },
        {
            name: 'Watch',
            cssClass: 'geoWatch',
            fn: 'watchPos()',
            show: 'notWatchin',
            hide: 'isWatching',
        },
        {
            name: 'Stop Watch',
            cssClass: 'geoWatchStop',
            fn: 'stopWatch()',
            show: 'isWatching',
            hide: 'notWatchin',
        },
        {
            name: 'add poi',
            cssClass: 'addPoi',
            fn: 'addPoi()',
            show: 'logged',
            hide: '',
        },
        {
            name: 'add event',
            cssClass: 'addPoi',
            fn: 'addPoi()',
            show: 'logged',
            hide: '',
        },
    ];

    $scope.logs = {
        deviceOffline: 'Veuillez vérifier votre connexion à internet.',
        gpsOff: 'La géolocalisation de votre téléphone est desactivée, veuillez l\'activer pour continuer.',
        apiLoading: 'Google map api loading',
        endWatch: 'My watch ends here',
    };

    $scope.stopWatch = function () {
        if (typeof $scope.watch != 'undefined') {
            console.log($scope.logs.endWatch);
            $scope.watch.clearWatch();
            $scope.isWatching = false;
            $scope.notWatchin = true;
        }
    }

    $scope.watchPos = function () {

        var watchOptions = {
            timeout: 500,
            enableHighAccuracy: false // may cause errors if true
        };

        $scope.watch = $cordovaGeolocation.watchPosition(watchOptions);
        $scope.isWatching = true;
        $scope.notWatchin = false;

        $scope.watch.then(
            null,
            function (err) {
                //if ($cordovaNetwork.isOffline)
                //    alert($scope.logs.deviceOffline);
                //else
                //    alert($scope.logs.gpsOff);
                $scope.stopWatch;
            },
            function (position) {
                $scope.map.center.latitude = position.coords.latitude;
                $scope.map.center.longitude = position.coords.longitude;
            });


    };

    $scope.currentPos = function () {
        console.log('refresh');
        var posOptions = {
            timeout: 10000,
            enableHighAccuracy: false
        };
        $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function (position) {
                $scope.map.center.latitude = position.coords.latitude;
                $scope.map.center.longitude = position.coords.longitude;
            }, function (err) {
                //if ($cordovaNetwork.isOffline)
                //    alert($scope.logs.deviceOffline);
                //else
                //    alert($scope.logs.gpsOff);
            });

    };


    $scope.startGeo = function () {

        console.log("Api Loaded");
        $scope.map = {
            center: {
                latitude: 0,
                longitude: 0
            },
            zoom: 18,
            options: {
                disableDefaultUI: true
            }
        };
        $scope.currentPos();
    };

    $scope.loadApi = function () {
        if ($cordovaNetwork.isOnline()) {
            console.log($scope.logs.apiLoading);
            $.getScript('http://maps.googleapis.com/maps/api/js?sensor=false', function () {

                uiGmapGoogleMapApi.then(function (maps) {
                    $scope.startGeo();
                });
            });
        } else if ($cordovaNetwork.isOffline()) {
            alert($scope.logs.deviceOffline);
        }

    };


    $scope.$on('$ionicView.afterLeave', function () {
        $scope.stopWatch();
    });


    $scope.$on('$ionicView.loaded', function () {

        if (typeof google === 'object' && typeof google.maps === 'object') {
            console.log("Google Map api fully loaded");
            //alert($rootScope.logged);
            $scope.startGeo();
        } else {
            console.log("Google map api not loaded");
            $scope.loadApi();
        }
        console.log('Is watching : ' + $scope.isWatching);
    });

})


.controller('SafetyGeoCtrl', function ($scope, $rootScope, $cordovaGeolocation, $cordovaNetwork) {



    $scope.monitoring = function () {

        var watchOptions = {
            timeout: 500,
            enableHighAccuracy: false // may cause errors if true
        };

        $scope.watch = $cordovaGeolocation.watchPosition(watchOptions);

        $scope.watch.then(
            null,
            function (err) {
                //if ($cordovaNetwork.isOffline)
                //    alert($scope.logs.deviceOffline);
                //else
                //    alert($scope.logs.gpsOff);
                $scope.stopWatch;
            },
            function (position) {
                var pos = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                }

                $scope.geo.latitude = position.coords.latitude;
                $scope.geo.longitude = position.coords.longitude;
            });


    };

})

;
