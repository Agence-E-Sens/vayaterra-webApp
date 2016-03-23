angular.module('starter.controllers', [])

.controller('AppCtrl', function ($scope, $ionicModal, $timeout) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
        $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
        console.log('Doing login', $scope.loginData);

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function () {
            $scope.closeLogin();
        }, 1000);
    };
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
})

.controller('EventCtrl', function ($scope, $stateParams) {})

.controller('MapCtrl', function ($scope) {
    $scope.cities = [
        {
            title: 'Paris',
            id: 1
        },
        {
            title: 'Dublin',
            id: 2
        },
        {
            title: 'London',
            id: 3
        },
        {
            title: 'Oran',
            id: 4
        },
        {
            title: 'Tokyo',
            id: 5
        },
        {
            title: 'Washington',
            id: 6
        }
    ];
    $scope.map = {
        center: {
            latitude: 45,
            longitude: -73
        },
        zoom: 8
    };


    //GESTION DE LA CARTE
    var map;

    angular.element(document).ready(function () {

        var div = document.getElementById("map");

        map = plugin.google.maps.Map.getMap(div);

        map.addEventListener(plugin.google.maps.event.MAP_READY, onMapReady);

    });

    var onMapReady = function () {
        var button = document.getElementById("button");
        button.addEventListener("click", onBtnClicked, false);
    };

    var onBtnClicked = function () {
        map.showDialog();
    };




});
