angular.module('vayaterra.controllers', ['uiGmapgoogle-maps', 'LocalForageModule'])

.controller('AppCtrl', function ($scope, $rootScope, $http, $ionicModal, $localForage, $timeout, $state, $ionicSideMenuDelegate, $ionicHistory) {

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
        if (data === null) {
            $rootScope.logged = false;
        } else {
            data.logged = true;
            $scope.userdata = data;
            $rootScope.logged = true;
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
            data: $.param($scope.loginData), // pass in data as strings
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        })
            .success(function (data) {
                if (!data.success) {
                    $scope.errorPasswd = ((data.errors.password) ? data.errors.password : false);
                    $scope.errorUsername = ((data.errors.username) ? data.errors.username : false);

                } else {
                    //Connexion r�ussie

                    $scope.user.getItem('data').then(function (storeddata) {
                        console.log(storeddata);
                        if ( storeddata !== null && storeddata.shareLoc != 'undefined' && storeddata.shareLoc != null && storeddata.id_auteur == data.message.id_auteur) {
                            data.message.shareLoc = storeddata.shareLoc;
                        }
                        else {
                            data.message.shareLoc = true;
                        }

                        $scope.userdata = data.message;
                        $scope.user.setItem('data', data.message).then(function () {
                            $rootScope.logged = true;
                            $scope.closeLogin();
                            $state.go('app.profile');
                            console.log(data.message);
                        });

                    });
                }
            });
    };

    //deconnexion
    $scope.disconnect = function () {
        //$scope.user.removeItem('data');
        //$scope.userdata = null;
        $scope.userdata.logged = false;
        $scope.user.setItem('data', $scope.userdata).then(function () {
            $rootScope.logged = false;
            $ionicHistory.nextViewOptions({
                historyRoot: false
            });
            $state.go('app.events');
        })


    };

    $scope.animate = function (isOpen) {

        var child;
        var content = $('#content')

        var button = document.getElementById('hamburger');

        child = button.childNodes[1].classList;

        if (!isOpen) {
            if (content.hasClass('background--blur')) content.removeClass('background--blur');
            //console.log('Menu ferm� ' + isOpen);
            child.remove('material-design-hamburger__icon--to-arrow');
            child.add('material-design-hamburger__icon--from-arrow');
        } else {
            //console.log('Menu Ouvert ' + isOpen);
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


    $rootScope.fivelastpos = {};

    $rootScope.recordLocation = function () {
        var watchOptions = {
            timeout: 4000,
            enableHighAccuracy: false // may cause errors if true
        };
        $rootScope.SGL = $cordovaGeolocation.watchPosition(watchOptions);
        $rootScope.SGL.then(
            null,
            function (err) {
                //if ($cordovaNetwork.isOffline)
                //    alert($scope.logs.deviceOffline);
                //else
                //    alert($scope.logs.gpsOff);
                $scope.stopWatch();
            },
            function (position) {
                var date = new Date();
                var day = ("0" + date.getDate()).slice(-2);
                var month = ("0" + (date.getMonth() + 1)).slice(-2);
                var dateP = date.getFullYear() + '-' + month + '-' + day;

                var pos = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.latitude,
                    date : date
                }
                $rootScope.fivelastpos.push(pos);
                if ($rootScope.fivelastpos.length === 5) {
                    $rootScope.sendSGL();
                }
            });
    };
    $rootScope.sendSGL = function () {
        
        $http({
            method: 'POST',
            url: 'http://vayaterra.local/userlocation.php',
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
            //Connexion r�ussie
            $scope.userdata = data.message;
            $scope.user.setItem('data', data.message).then(
                function () {

                });
        }
    });


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
                    //Connexion r�ussie
                    $scope.userdata = data.message;
                    $scope.user.setItem('data', data.message).then(
                        function () {

                        });
                }
            });

    };
})

.controller('ProfileCtrl', function ($scope, $localForage) {
    $scope.user = $localForage.instance('userdata');
    $scope.user.getItem('data').then(function (data) {
        $scope.userdata = data;
    });
    $scope.sharelocation = function () {

        $scope.user.setItem('data', $scope.userdata).then(function () {
            console.log('ShareLog toggled : ' + $scope.userdata.shareLoc);
        });
    }
})

.controller('EventCtrl', function ($scope, $stateParams) {


})

.controller('MapCtrl', function ($scope, $http, $rootScope, $ionicModal, $cordovaGeolocation, $cordovaNetwork, $cordovaDeviceOrientation, $localForage, uiGmapGoogleMapApi) {

    //USER DATA

    $scope.user = $localForage.instance('userdata');
    $scope.user.getItem('data').then(function (data) {
        $scope.userdata = data;
        //console.log(data);
    });


    //Variables bool�enne permettant l'activation des bouton watch /stop watch
    $scope.isWatching = false;
    $scope.notWatchin = true;

    //Tableau des boutons de la carte (ex : watch actualiser etc...)
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
            fn: 'OpenAddPoi()',
            show: 'logged',
            hide: '',
        },
        {
            name: 'add event',
            cssClass: 'addPoi',
            fn: 'OpenAddPoi()',
            show: 'logged',
            hide: '',
        },
        {
            name: 'update poi',
            cssClass: 'addPoi',
            fn: 'updatePoi()',
            show: '',
            hide: '',
        },
    ];

    //initialisation des param�tres de la carte
    $scope.map = {
        id: 1,
        center: {
            latitude: 0,
            longitude: 0
        },
        zoom: 18,
        options: {
            disableDefaultUI: true
        }
    };

    //Messages des variables de logs
    $scope.logs = {
        deviceOffline: 'Veuillez v�rifier votre connexion � internet.',
        gpsOff: 'La g�olocalisation de votre t�l�phone est desactiv�e, veuillez l\'activer pour continuer.',
        apiLoading: 'Google map api loading',
        endWatch: 'My watch ends here',
    };

    //___________________________________________________________________________
    // Les points d'int�r�t
    //___________________________________________________________________________


    //R�cuperation de l'instance de stockage local li�e au donn�es de l'application

    $scope.appdata = $localForage.instance('appdata');

    //Fonction qui initialise les donn�es li�es aux points d'inter�t de la carte
    var startPoi = function () {
        $scope.appdata.getItem('poiList').then(function (data) {
            $scope.poilist = JSON.parse(data);
            if (typeof $scope.poilist != null && typeof $scope.poilist != null) {
                MarkPoi()
                getPoiDist();
            }
            else getPoiDist(startPoi());
        });
    };

    //Fonction qui r�cup�re les donn�es distantes li�es aux points d'inter�t de la carte
    var getPoiDist = function (callback) {
        var post = {};
        post.getPoi = true;
        post.allorpublic = ((typeof $scope.userdata.id_auteur != undefined) ? $scope.userdata.id_auteur : false);
        //console.log($.param(post));
        $http({
            method: 'POST',
            url: 'http://vayaterra.local/poi.php?getPoi=true',
            data: $.param(post), // pass in data as strings
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        }).success(function (data) {
            if (!data.success) {
                console.log(data);
            } else {
                updatePoi(data.data, callback);
                console.log(data.data);
            }
        });
    };

    //Fonction qui place les marqueurs des points d'int�rets
    var MarkPoi = function () {
        //angular.element(document.getElementById('map')).append("<ui-gmap-markers models='poilist' idKey='poilist.id' coords=\"'self'\"></ui-gmap-markers>");
        //console.log('markpoi');
        //console.log($scope.poilist);
    };

    var updatePoi = function (data, callback) {

        $scope.poilist = data;
        var encPoiLi = JSON.stringify($scope.poilist);
        $scope.appdata.setItem('poiList', encPoiLi).then(callback);
        //console.log('poilist updated')
        //console.log($scope.poilist);
    };

    $scope.addPoi = function () {
        var date = new Date();
        var dateP = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();

        var addPoi = {
            nom: $scope.poi.name,
            desc: $scope.poi.desc,
            type: $scope.poi.type,
            privacy: $scope.poi.privacy,
            id_voyageur: $scope.userdata.id_auteur,
            latitude: $scope.poi.pos.latitude,
            longitude: $scope.poi.pos.longitude,
        }
        //console.log(addPoi);
        $http({
            method: 'POST',
            url: 'http://vayaterra.local/poi.php?sendPOI=true',
            data: $.param(addPoi), // pass in data as strings
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        }).success(function (data) {
            if (!data.success) {
                console.log(data);
            } else {
                getPoiDist()
            }
        });

        $scope.closeAddPoi();

    };

    $scope.poi = {
        count: 0,
        id: 99999999,
        pos: {

        },
        options: {
            draggable: true,
            visible: false,
        },

    };

    // Creation du modal de la fen�tre d'ajout de point d'inter�t
    $ionicModal.fromTemplateUrl('templates/modals/addPOI.html', {
        scope: $scope,
        focusFirstInput: true,
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function (POI) {
        $scope.addPOI = POI;
    });

    // Triggered in the login modal to close it
    $scope.closeAddPoi = function () {
        $scope.addPOI.hide();
        $scope.poi.options.visible = false;
        $scope.poi.count = 0;
    };

    // Open the login modal
    $scope.OpenAddPoi = function () {
        $scope.poi.count++;
        $scope.poi.options.visible = true;

        if ($scope.poi.count == 2) {
            $scope.addPOI.show();
        }
        else if ($scope.poi.count == 3) {
            $scope.closeAddPoi();
        }
    };


    // Creation du modal de la fen�tre des point d'inter�t
    $ionicModal.fromTemplateUrl('templates/modals/DetailPOI.html', {
        scope: $scope
    }).then(function (POI) {
        $scope.POI = POI;
    });

    // Triggered in the login modal to close it
    $scope.closePoi = function () {
        $scope.POI.hide();
    };

    // Open the login modal
    $scope.OpenPoi = function () {
        $scope.POI.show();
    };


    //___________________________________________________________________________
    //Fonctions boussole, permettent de determiner la direction de l'utilisateur
    //___________________________________________________________________________

    //initialisation des param�tres du marqueur de l'utilisateur
    var defaultMarker = function () {
        $scope.userLocate = {
            id: 999,
            pos: {
                latitude: 0,
                longitude: 0
            },
            options: {
                icon: {
                    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                    scale: 5,
                    rotation: 0,
                }
            }

        };
    };

    //Retourne la derni�re direction point� par l'utilisateur
    var currentHeading = function () {

        $cordovaDeviceOrientation
            .getCurrentHeading()
            .then(function (result) {
                $scope.userLocate.options.icon.rotation = result.trueHeading;
            }, function (err) {
                //if ($cordovaNetwork.isOffline)
                //    alert($scope.logs.deviceOffline);
                //else
                //    alert($scope.logs.gpsOff);
            });
    };

    //Retourne en temps r�el la direction point�e par l'utilisateur
    var watchHeading = function () {

        //console.log("let's start the watch");
        var options = {
            frequency: 100,
        };

        $scope.watchdirection = $cordovaDeviceOrientation.watchHeading(options);
        $scope.watchdirection.then(
            null,
            function (err) {
                //console.log(err);
            },
            function (result) {
                $scope.userLocate.options.icon.rotation = result.magneticHeading;
                //console.log(result);
            })
    };

    //stope le suivi en temps r�el
    var stopWatchHeading = function () {
        $scope.watchdirection.clearWatch();
    }

    //___________________________________________________________________________
    //Fonctions g�olocalisation
    //___________________________________________________________________________

    //Fonction de suivi g�olocalis�, met � jour la carte avec les derni�res infos de l'utilisateur
    $scope.currentPos = function () {
        currentHeading();
        var posOptions = {
            timeout: 10000,
            enableHighAccuracy: false
        };
        $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function (position) {
                //On actualise la position de l'utilisateur
                $scope.userLocate.pos.latitude = position.coords.latitude;
                $scope.userLocate.pos.longitude = position.coords.longitude;
                //On actualise le centre de la carte
                $scope.map.center.latitude = position.coords.latitude;
                $scope.map.center.longitude = position.coords.longitude;
                //On actualise le marker d'ajout de poi
                $scope.poi.pos.latitude = position.coords.latitude;
                $scope.poi.pos.longitude = position.coords.longitude;

            }, function (err) {
                //if ($cordovaNetwork.isOffline)
                //    alert($scope.logs.deviceOffline);
                //else
                //    alert($scope.logs.gpsOff);
            });
    };

    //Fonction de suivi g�olocalis�, met � jour les infos sur la carte en temps r�el
    $scope.watchPos = function () {

        watchHeading();
        var watchOptions = {
            timeout: 100,
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
                $scope.stopWatch();
            },
            function (position) {
                //On actualise la position de l'utilisateur
                $scope.userLocate.pos.latitude = position.coords.latitude;
                $scope.userLocate.pos.longitude = position.coords.longitude;
                //On actualise le centre de la carte
                $scope.map.center.latitude = position.coords.latitude;
                $scope.map.center.longitude = position.coords.longitude;
                //On actualise le marker d'ajout de poi
                $scope.poi.pos.latitude = position.coords.latitude;
                $scope.poi.pos.longitude = position.coords.longitude;
            });
    };

    //Stope le suivi en temps r�el
    $scope.stopWatch = function () {
        if (typeof $scope.watch != 'undefined') {
            //On clear la session de suivi g�olocalis�
            $scope.watch.clearWatch();
            //On clear la session de suivi de direction  
            stopWatchHeading();
            $scope.isWatching = false;
            $scope.notWatchin = true;
        }
    }

    //Fonction d'initialisation de la carte
    var startGeo = function () {
        startPoi();
        defaultMarker();
        $scope.currentPos();
    };

    //___________________________________________________________________________
    // Les �v�nements et les fonctions associ�es
    //___________________________________________________________________________

    //On charge l'api Gmap, on attend la fin de son chargement
    loadApi = function () {
        if ($cordovaNetwork.isOnline()) {
            uiGmapGoogleMapApi.then(function (maps) {
                startGeo();
            });
        }
        else if ($cordovaNetwork.isOffline()) {
            alert($scope.logs.deviceOffline);
        }
    };

    //On quitte la vue donc on arrete la surveillance google map
    $scope.$on('$ionicView.afterLeave', function () {
        $scope.stopWatch();
    });

    //On v�rifie que l'api est charg�e
    $scope.$on('$ionicView.loaded', function () {

        if (typeof google === 'object' && typeof google.maps === 'object') {
            startGeo();
        } else {
            loadApi();
        }
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
