angular.module('vayaterra.controllers', ['uiGmapgoogle-maps', 'LocalForageModule'])

.controller('AppCtrl', function ($scope, $rootScope, $http, $ionicModal, $localForage, $timeout, $state, $ionicSideMenuDelegate, $ionicHistory, $cordovaGeolocation) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});
    document.addEventListener("deviceready", function () {
        cordova.plugins.backgroundMode.setDefaults({
            title: "L'application tourne en fond",
            text: ''
        })
    }, false);
    // Form data for the login modal

    var user = $localForage.createInstance({
        name: 'userdata',
    });
    var appdata = $localForage.createInstance({
        name: 'appdata',
    });

    //$rootScope.disturl = 'http://vayaterra.local/';
    $rootScope.rootUrl = 'http://www.vayaterra.maamar.fr/';
    $rootScope.disturl = 'http://www.vayaterra.maamar.fr/appli/';

    //Récuperation de l'instance de stockage local liée au données de l'utilisateur
    $rootScope.user = $localForage.instance('userdata');

    //Récuperation de l'instance de stockage local liée au données de l'application
    $rootScope.appdata = $localForage.instance('appdata');

    $rootScope.user.getItem('data').then(function (data) {
        if (data === null) {
            $rootScope.userdata = {
                logged: false,
            };
        } else {
            $rootScope.userdata = data;
            $rootScope.userdata.logged = true;
            $rootScope.recordLocation();
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
            url: $rootScope.disturl + 'connect.php',
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
                    //Connexion réussie
                    //console.log(data.message);

                    $rootScope.userdata = angular.copy(data.message);
                    $rootScope.userdata.shareLoc = ((data.message.shareLoc !== '0' && data.message.shareLoc !== '1') ? false : Boolean(data.message.shareLoc));
                    $rootScope.userdata.safetyLoc = ((data.message.safetyLoc !== '0' && data.message.safetyLoc !== '1') ? false : Boolean(data.message.safetyLoc));
                    $rootScope.userdata.logged = true;
                    data.message.img = $rootScope.userdata.img = $rootScope.getProfileImg($rootScope.userdata.id_auteur);
                    //console.log($rootScope.userdata);
                    $rootScope.user.setItem('data', data.message).then(function () {
                        $scope.closeLogin();
                        $state.go('app.profile');
                        $rootScope.recordLocation();
                        $rootScope.updLocParams();
                    });

                }
            });
    };

    //var getProfileImg = function (path) {

    //}

    $rootScope.getProfileImg = function (idauteur) {
        var path = $rootScope.rootUrl + "IMG/auton" + idauteur;
        var def = $rootScope.rootUrl + "IMG/autondefault.jpg";
        if (testImg(path + '.jpg')) {
            return path + '.jpg';
        }
        else if (testImg(path + '.gif')) {
            return path + '.gif';
        }

        else if (testImg(path + '.png')) {
            return path + '.png';
        }

        else return def;
    }
    var testImg = function (url) {
        var http = new XMLHttpRequest();

        http.open('HEAD', url, false);
        http.send();

        if (http.status != 404)
            return true;
        else return false;
    }



    //deconnexion
    $scope.disconnect = function () {
        //$scope.user.removeItem('data');
        //$rootScope.userdata = null;
        $rootScope.userdata = undefined;
        $rootScope.userdata = {
            logged: false,
        };
        $rootScope.user.removeItem('data');
        $rootScope.userdata.logged = false;
        $ionicHistory.nextViewOptions({
            historyRoot: false
        });
        $state.go('app.events');
        $rootScope.recordLocation();
    };

    //Anime l'icone hamburger du menu et floute le contenu

    $scope.animate = function (isOpen) {

        var child;
        var content = $('#content')

        var button = document.getElementById('hamburger');

        child = button.childNodes[1].classList;

        if (!isOpen) {
            if (content.hasClass('background--blur')) content.removeClass('background--blur');
            //console.log('Menu fermé ' + isOpen);
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

    // FOnctions qui permettent de mettre en forme la date et l'heure.
    var addZero = function (i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }

    var getTime = function () {
        var d = new Date();
        var h = addZero(d.getHours());
        var m = addZero(d.getMinutes());
        var s = addZero(d.getSeconds());
        return h + ":" + m + ":" + s;
    }

    var getDate = function () {
        var date = new Date();
        var day = ("0" + date.getDate()).slice(-2);
        var month = ("0" + (date.getMonth() + 1)).slice(-2);
        var dateP = date.getFullYear() + '-' + month + '-' + day;

        return dateP;
    }

    //Fonction qui permet de lancer la géolocalisation de fond
    $rootScope.SGLWatch = function () {
        document.addEventListener("deviceready", function () {

        }, false);


        if (!cordova.plugins.backgroundMode.isEnabled()) {
            cordova.plugins.backgroundMode.enable();

        }
        cordova.plugins.backgroundMode.onactivate = function () {
            $rootScope.counterDataSent = 0;
        };


        $rootScope.fivelastpos = [];
        var watchOptions = {
            timeout: 30000,
            enableHighAccuracy: true // may cause errors if true
        };
        $rootScope.SGL = $cordovaGeolocation.watchPosition(watchOptions);
        $rootScope.SGL.then(
            null,
            function (err) {
                //if ($cordovaNetwork.isOffline)
                //    alert($scope.logs.deviceOffline);
                //else
                //    alert($scope.logs.gpsOff);
                $rootScope.SGLStop($rootScope.SGLWatch);
            },
            function (position) {
                //console.log('new pos');
                //console.log($rootScope.fivelastpos.length);
                //console.log('new pos');
                var pos = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    date: getDate(),
                    heure: getTime()
                }

                $rootScope.fivelastpos[$rootScope.fivelastpos.length] = pos;
                if ($rootScope.fivelastpos !== null && $rootScope.fivelastpos.length === 5) {
                    $rootScope.sendSGL();
                }
            });
    }

    //Fonction qui permet de stopper la géolocalisation de fond 
    $rootScope.SGLStop = function (callback) {
        document.addEventListener("deviceready", function () {
            cordova.plugins.backgroundMode.disable();
        }, false);
        $rootScope.SGL.clearWatch();
        $rootScope.sendSGL();
        $rootScope.SGL = undefined;
        callback;
    }

    //Fonction qui permet d'évaluer différentes conditions pour lancer ou stopper la géolocalisation de fond.
    $rootScope.recordLocation = function () {

        //console.log('recordlocation');
        if ($rootScope.userdata.logged) {
            //On check si l'utilisateur est connecté
            if ($rootScope.userdata.shareLoc || $rootScope.userdata.safetyLoc) {
                //On vérifie si l'utilisateur a choisi de partager sa position ou s'il a activé le mode suivi géolocalisé
                if ($rootScope.SGL) {
                    //On vérifié que celle ci n'ést pas déjà lancée
                    //console.log('Already monitoring your location');
                }
                else {
                    //Sinon on lance la fonction
                    //console.log('Launching the monitoring function');
                    $rootScope.SGLWatch();
                }
            }
            else {
                //L'utilisateur a décidé de ne pas partager sa position
                //console.log('User has disabled the monitoring function');
                if ($rootScope.SGL) {
                    //On vérifie qu'il n'y plus de surveillance, sinon on désactive
                    //console.log('Because the user has shutdown the monitoring function, we must stop the watch');
                    $rootScope.SGLStop();
                }
            }
        }
        else if ($rootScope.SGL) {
            //SI l'utilisateur n'est pas connecté on vérifie que la fonction ne tourne pas en fond
            //Si oui on la stop   
            //console.log('The user is disconnected, no need to monitor his location');
            $rootScope.SGLStop();
        }
        else {
            //L'utilisateur est déconnecté et la fonction ne tourne pas
            //console.log('Désactivé')
        }
    };

    //Fonction d'envoi des données de géolocalisation
    $rootScope.sendSGL = function () {

        var positions = angular.copy($rootScope.fivelastpos);

        if (positions.length > 0) {

            //On ajoute les nouvelles données de géolocalisation sur la mémoire du téléphone
            $rootScope.user.getItem('tracing').then(function (data) {
                if (data === null) {
                    var array = [];
                }
                else {
                    var array = data;
                }
                var index = ((array !== null) ? array.length : 0);
                array[index] = positions;
                $rootScope.user.setItem('tracing', array);

            });


            $rootScope.fivelastpos = [];
            console.log('Function d envoi ');

            var post = {
                positions: JSON.stringify(positions),
                storingLoc: true,
                id_voyageur: $rootScope.userdata.id_auteur
            };

            //console.log(post);

            //console.log('sending the positions !');
            //console.log(post);
            //On envoie les cinq dernières positions
            $http({
                method: 'POST',
                url: $rootScope.disturl + 'userlocation.php',
                data: $.param(post), // pass in data as strings
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            })
            .success(function (data) {
                console.log('data sent');
                $rootScope.counterDataSent++;
                cordova.plugins.backgroundMode.configure({
                    title: "Données envoyées " + $rootScope.counterDataSent + " fois",
                });
                //console.log(data);
                //if (data.success) {

                //}
                //else {
                //    console.log(data.error)
                //}

            }).error(function (data, status, headers, config) {
                console.log(status);
            });


        }


    };

    $rootScope.updLocParams = function () {
        var post = {
            updateSafetyLoc: true,
            safetyLoc: $rootScope.userdata.safetyLoc,
            shareLoc: $rootScope.userdata.shareLoc,
            id_voyageur: $rootScope.userdata.id_auteur
        };
        $http({
            method: 'POST',
            url: $rootScope.disturl + 'userlocation.php',
            data: $.param(post), // pass in data as strings
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        }).success(function (data) {

        });
    }
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
            url: $rootScope.disturl + 'getEvents.php',
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
                    $rootScope.userdata = data.message;
                    $rootScope.user.setItem('data', data.message).then(
                        function () {

                        });
                }
            });

    };
})

.controller('ProfileCtrl', function ($scope, $localForage, $rootScope, $http) {

    $scope.sharelocation = function () {
        $rootScope.user.setItem('data', $rootScope.userdata).then(function () {
            //console.log('ShareLog toggled : ' + $rootScope.userdata.shareLoc);
            $rootScope.recordLocation();
            $rootScope.updLocParams();
        });
    }
})

.controller('EventCtrl', function ($scope, $stateParams) {


})

.controller('MapCtrl', function ($scope, $http, $rootScope, $ionicModal, $cordovaGeolocation, $cordovaNetwork, $cordovaDeviceOrientation, $localForage, uiGmapGoogleMapApi) {


    //Variables booléenne permettant l'activation des bouton watch /stop watch
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
        }
    ];

    //initialisation des paramètres de la carte
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
        deviceOffline: 'Veuillez vérifier votre connexion à internet.',
        gpsOff: 'La géolocalisation de votre téléphone est desactivée, veuillez l\'activer pour continuer.',
        apiLoading: 'Google map api loading',
        endWatch: 'My watch ends here',
    };

    //___________________________________________________________________________
    // Les points d'intérêt
    //___________________________________________________________________________

    //Fonction qui initialise les données liées aux points d'interêt de la carte
    var startPoi = function () {
        $rootScope.appdata.getItem('poiList').then(function (data) {
            $scope.poilist = JSON.parse(data);
            if (typeof $scope.poilist != null && typeof $scope.poilist != null) {
                MarkPoi()
                getPoiDist();
            }
            else getPoiDist(startPoi());
        });
    };

    //Fonction qui récupère les données distantes liées aux points d'interêt de la carte
    var getPoiDist = function (callback) {
        var post = {};
        post.getPoi = true;
        post.allorpublic = ((typeof $rootScope.userdata.id_auteur != undefined) ? $rootScope.userdata.id_auteur : false);
        //console.log($.param(post));
        $http({
            method: 'POST',
            url: $rootScope.disturl + 'poi.php?getPoi=true',
            data: $.param(post), // pass in data as strings
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        }).success(function (data) {
            if (!data.success) {
                //console.log(data);
            } else {
                updatePoi(data.data, callback);
                //console.log(data.data);
            }
        });
    };

    //Fonction qui place les marqueurs des points d'intêrets
    var MarkPoi = function () {
        //angular.element(document.getElementById('map')).append("<ui-gmap-markers models='poilist' idKey='poilist.id' coords=\"'self'\"></ui-gmap-markers>");
        //console.log('markpoi');
        //console.log($scope.poilist);
    };

    //Fonction qui récupère les positions utilsateurs

    var getUsersPos = function () {
        var post = {};
        post.usersPos = true;
        post.id_voyageur = $rootScope.userdata.id_auteur;
        //console.log($.param(post));
        $http({
            method: 'POST',
            url: $rootScope.disturl + 'userlocation.php',
            data: $.param(post), // pass in data as strings
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        }).success(function (data) {
            addUsersonMap(data.autres);
        });
    }

    var addUsersonMap = function (data) {

        $scope.usersPos = [];
        //console.log(data);
        data.forEach(function (obj) {

            obj.serie5 = JSON.parse(obj.serie5);

            var icon = {
                url: $rootScope.getProfileImg(obj.id_auteur),
                scaledSize : new google.maps.Size(30,30),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(0,0),
            }

            var user = {
                idkey: '888' + obj.id_auteur,
                nom: obj.login,
                pos: {
                    latitude: obj.serie5[obj.serie5.length - 1].latitude,
                    longitude: obj.serie5[obj.serie5.length - 1].longitude
                },
                options : {
                    icon: icon
                }

            }

            $scope.usersPos.push(user);
        })
        
        //console.log($scope.usersPos);



    }


    var updatePoi = function (data, callback) {

        $scope.poilist = data;
        var encPoiLi = JSON.stringify($scope.poilist);
        $scope.appdata.setItem('poiList', encPoiLi).then(callback);
        //console.log('poilist updated')
        //console.log($scope.poilist);
    };
    $scope.poi = {
        count: 0,
        id: 9999,
        pos: {
            latitude: 0,
            longitude: 0
        },
        options: {
            draggable: true,
            visible: false,
        },
    };

    $scope.addPoi = function () {

        var addPoi = {
            nom: $scope.poi.name,
            desc: $scope.poi.desc,
            type: $scope.poi.type,
            privacy: $scope.poi.privacy,
            id_voyageur: $rootScope.userdata.id_auteur,
            latitude: $scope.poi.pos.latitude,
            longitude: $scope.poi.pos.longitude,
        }
        //console.log(addPoi);
        $http({
            method: 'POST',
            url: $rootScope.disturl + 'poi.php?sendPOI=true',
            data: $.param(addPoi), // pass in data as strings
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        }).success(function (data) {
            if (!data.success) {
                //console.log(data);  
            } else {
                getPoiDist()
            }
        });

        $scope.closeAddPoi();

    };


    // Triggered in the login modal to close it
    $scope.closeAddPoi = function () {
        //console.log('closeaddpoi');
        $scope.addPOI.hide();
        $scope.addPOI.remove();
        $scope.poi.options.visible = false;
        $scope.poi.count = 0;
    };

    // Open the login modal
    $scope.OpenAddPoi = function () {


        //console.log('openaddpoi');
        //console.log($scope.poi.count);
        $scope.poi.count++;
        if ($scope.poi.count == 1) {
            //console.log('on affiche le marker');
            //console.log($scope.poi);
            //On actualise le marker d'ajout de poi
            $scope.poi.pos = angular.copy($scope.userLocate.pos);
            $scope.poi.options.visible = true;
        }
        if ($scope.poi.count == 2) {
            // Creation du modal de la fenêtre d'ajout de point d'interêt
            $ionicModal.fromTemplateUrl('templates/modals/addPOI.html', {
                scope: $scope,
                focusFirstInput: true,
                backdropClickToClose: false,
                hardwareBackButtonClose: false
            }).then(function (POI) {
                $scope.addPOI = POI;
                $scope.addPOI.show();
            });


        }
        else if ($scope.poi.count == 3) {
            $scope.closeAddPoi();
        }
    };





    // Creation du modal de la fenêtre des point d'interêt
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

    //initialisation des paramètres du marqueur de l'utilisateur
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

    //Retourne la dernière direction pointé par l'utilisateur
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

    //Retourne en temps réel la direction pointée par l'utilisateur
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

    //stope le suivi en temps réel
    var stopWatchHeading = function () {
        $scope.watchdirection.clearWatch();
    }

    //___________________________________________________________________________
    //Fonctions géolocalisation
    //___________________________________________________________________________

    //Fonction de suivi géolocalisé, met à jour la carte avec les dernières infos de l'utilisateur
    $scope.currentPos = function () {
        currentHeading();
        getUsersPos();
        //$scope.closeAddPoi();
        var posOptions = {
            timeout: 10000,
            enableHighAccuracy: true
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

            }, function (err) {
                //if ($cordovaNetwork.isOffline)
                //    alert($scope.logs.deviceOffline);
                //else
                //    alert($scope.logs.gpsOff);
            });
    };

    //Fonction de suivi géolocalisé, met à jour les infos sur la carte en temps réel
    $scope.watchPos = function () {

        watchHeading();
        var watchOptions = {
            timeout: 1000,
            enableHighAccuracy: true // may cause errors if true
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

            });
    };

    //Stope le suivi en temps réel
    $scope.stopWatch = function () {
        if (typeof $scope.watch != 'undefined') {
            //On clear la session de suivi géolocalisé
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
    // Les évènements et les fonctions associées
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

    //On vérifie que l'api est chargée
    $scope.$on('$ionicView.loaded', function () {

        if (typeof google === 'object' && typeof google.maps === 'object') {
            startGeo();
        } else {
            loadApi();
        }
    });

})


.controller('SafetyGeoCtrl', function ($scope, $rootScope, $cordovaGeolocation, $cordovaNetwork, $localForage, $http) {

    $scope.safetyLocCk = function () {
        $rootScope.user.setItem('data', $rootScope.userdata).then(function () {
            //console.log('safetyLoc toggled : ' + $rootScope.userdata.safetyLoc);
            $rootScope.recordLocation();
            $rootScope.updLocParams();
        });
    }
    if ($rootScope.fivelastpos !== undefined) {
        $scope.lastposition = $rootScope.fivelastpos[$rootScope.fivelastpos.length - 1];
    }



});