angular.module('vayaterra.controllers', ['uiGmapgoogle-maps', 'LocalForageModule'])

.controller('AppCtrl', function ($scope, $http, $ionicModal, $localForage, $timeout, $state) {

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

    $scope.user = $localForage.instance('userdata');
    $scope.user.getItem('data').then(function (data) {
        if (data == null) {
            $scope.logged = false;
        }
        else {
            $scope.userdata = data;
            $scope.logged = true;
        }
    });


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
            data: $.param($scope.loginData),  // pass in data as strings
            headers: { 'Content-Type': 'application/x-www-form-urlencoded',
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
                      function(){
                          $scope.logged = true;
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
        $scope.logged = false;
        $ionicHistory.nextViewOptions({
            historyRoot: false
        });
        $state.go('app.events');
    };

    $scope.animate = function () {

        var child;

        button = document.getElementById('hamburger');

        document.getElementById('content').classList.toggle('background--blur');

        child = button.childNodes[1].classList;

        if (child.contains('material-design-hamburger__icon--to-arrow')) {
            child.remove('material-design-hamburger__icon--to-arrow');
            child.add('material-design-hamburger__icon--from-arrow');
        } else {
            child.remove('material-design-hamburger__icon--from-arrow');
            child.add('material-design-hamburger__icon--to-arrow');
        }
    };

    $scope.$on('$ionicView.afterLeave', function () {
        $scope.animate();
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
            data: $.param($scope.loginData),  // pass in data as strings
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

.controller('MapCtrl', function ($scope, $cordovaGeolocation, uiGmapGoogleMapApi) {

    $scope.$on('$ionicView.afterLeave', function () {
        console.log('The Watch shall stop here then');
    });

    $scope.map = {
        center : {
            latitude: 0,
            longitude:0
        },
        zoom: 18,
        options: {
            disableDefaultUI: true
        }
    };

    var posOptions = { timeout: 10000, enableHighAccuracy: false };
    $cordovaGeolocation
      .getCurrentPosition(posOptions)
      .then(function (position) {
          $scope.map.center.latitude = position.coords.latitude;
          $scope.map.center.longitude = position.coords.longitude;
      }, function (err) {
          alert("Veuillez activer les options GPS et Réseau de votre mobile");
      });


    uiGmapGoogleMapApi.then(function (maps) {

        var watchOptions = {
            timeout: 500,
            enableHighAccuracy: false // may cause errors if true
        };

        var watch = $cordovaGeolocation.watchPosition(watchOptions);
        watch.then(
          null,
          function (err) {
              alert("Veuillez activer les options GPS et Réseau de votre mobile");
          },
          function (position) {
              $scope.map.center.latitude = position.coords.latitude;
              $scope.map.center.longitude = position.coords.longitude;
          });


    });

});
