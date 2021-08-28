var startInd = 0;
var endInd = 0;
var allKeys;
var mapJobs = [];
var allMarkers = [];
var centerAdded = false;
var invalidAddress = "";
var map;
var invalidInfoBox;
var percentBar = null;
var markerCluster = null;
var clusterStyles = [[{
    url: '../../Content/images/m3.png',
    height: 46,
    width: 46,
    textColor: '#000000',
    textSize: 10
}, {
    url: '../../Content/images/m3.png',
    height: 46,
    width: 46,
    textColor: '#000000',
    textSize: 10
}, {
    url: '../../Content/images/m3.png',
    height: 46,
    width: 46,
    textColor: '#000000',
    textSize: 10
}, {
    url: '../../Content/images/m3.png',
    height: 46,
    width: 46,
    textColor: '#000000',
    textSize: 10
}, {
    url: '../../Content/images/m3.png',
    height: 46,
    width: 46,
    textColor: '#000000',
    textSize: 10
}]];
angular.module('HylanApp').controller("MapsController", ['$rootScope', '$scope', '$controller', '$timeout', 'MapsService', 'Utility', 'NOTIFYTYPE', 'CompaniesService', '$window', 'hylanCache', '$state', '$filter',
function ($rootScope, $scope, $controller, $timeout, MapsService, Utility, NOTIFYTYPE, CompaniesService, $window, hylanCache, $state, $filter) {
    try {
        $controller('BaseController', { $scope: $scope });
        $scope.mapparm = "";  // being used to pass the value for links on popup
        $scope.multiSelectControl = {};
        if ($rootScope.isUserLoggedIn == false) return false;
        $scope.mapZoom = 14;

        var winHeight = $(window).height();
        var threshold = 130 / winHeight;
        $("#mapDiv").height(winHeight);
        $("#map_canvas").height(winHeight - (winHeight * threshold));
        //load definition tables
        Globals.GetProjects().then(function (result) {
            $scope.projectsDS = result.objResultList;
            $scope.projectsDS = $filter('orderBy')($scope.projectsDS, 'HYLAN_PROJECT_ID');
        });
        Globals.GetCompanies(false).then(function (result) {
            $scope.ClientsDS = result.objResultList;
        });

        Globals.GetLookUp(Globals.LookUpTypes.JOB_STATUS, false, function (result) {
            $scope.jobStatusLU = result;
        });

        //load basic settings like key
        function loadGoogleMapApi() {
            var googleapiJS = document.createElement('script');
            googleapiJS.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyD9NmMl27VPOgqJ1jQbK4jR2vsZB21EiCE&v=3&libraries=places&sensor=false&fields=street_address&language=en&callback=initialize';
            document.body.appendChild(googleapiJS);
        }
        loadGoogleMapApi();
        $scope.CreateMapInstance = function () {
            startInd = 0;
            endInd = 0;
            allKeys = [];
            mapJobs = [];
            allMarkers = [];
            centerAdded = false;
            invalidAddress = "";
            percentBar = null;
            invalidInfoBox = false;
            if ($scope.defaultLocation == undefined)
                $scope.defaultLocation = new google.maps.LatLng(40.849335, -74.45533);
            $scope.mapId = 'map_canvas';
            $scope.mapOptions = {
                mapTypeControl: true,
                mapTypeControlOptions: {
                    style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                    position: google.maps.ControlPosition.TOP_RIGHT
                },
                panControl: true,
                panControlOptions: {
                    position: google.maps.ControlPosition.RIGHT_CENTER
                },
                zoomControlOptions: {
                    style: google.maps.ZoomControlStyle.LARGE,
                    position: google.maps.ControlPosition.RIGHT_TOP
                },
                streetViewControl: true,
                streetViewControlOptions: {
                    position: google.maps.ControlPosition.RIGHT_BOTTOM
                },
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                zoom: (Globals.MapState.zoom != null) ? Globals.MapState.zoom : $scope.mapZoom,
                center: (Globals.MapState.center != null) ? new google.maps.LatLng(Globals.MapState.center.lat(), Globals.MapState.center.lng()) : $scope.defaultLocation
                //, styles: mapStyles // Uncomment this line to apply grayscale style on the map
            };
            map = new google.maps.Map(document.getElementById($scope.mapId), $scope.mapOptions);
            $scope.geocoder = new google.maps.Geocoder(); //Geo coder read the addresses and convert it into Latitude and Longitude
            var toggleBox = document.createElement('div');
            toggleBox.className = "togglebox";

            //top Left bar
            var html = '<span>JOB STATUS</span><ul>';
            $.each($scope.jobStatusLU, function (index, item) {
                var statusName = item.LU_NAME.split(" ").join("_").split("&").join("And");
                html += '<li><img id="' + statusName + '" alt="" src="Content/images/' + statusName + '_checked.png" onclick="ToggleJobStatus(this);" /><label> ' + item.LU_NAME + '</label></li>';
            });

            toggleBox.innerHTML = html;
            map.controls[google.maps.ControlPosition.TOP_LEFT].push(toggleBox);

            //start search bar 
            var searchSection = document.createElement("div");
            searchSection.className = "SearchAddressSection";
            var input = document.createElement("input");
            input.id = "address";
            input.type = "text";
            var onclicklistener = window.attachEvent || window.addEventListener;
            var onclickevent = window.attachEvent ? 'onclick' : 'click';
            onclicklistener(onclickevent, $scope.HideNotification);
            searchSection.appendChild(input);
            map.controls[google.maps.ControlPosition.TOP_CENTER].push(searchSection);
            var searchBox = new google.maps.places.SearchBox(input);
            google.maps.event.addListener(searchBox, 'places_changed', Places_Changed);
            //end search bar 

            //percent bar
            percentBar = document.createElement("span");
            percentBar.id = "lblPct";
            map.controls[google.maps.ControlPosition.TOP_RIGHT].push(percentBar);

            google.maps.event.addListener(map, 'zoom_changed', function () {
                $scope.mapZoom = this.getZoom();
            });
            google.maps.event.addListener(map, 'center_changed', function () {
                $scope.defaultLocation = this.getCenter();
            });
        };


        $window.initialize = function () {
            $scope.CreateMapInstance();
            $.when(
                $.getScript("https://www.google-analytics.com/ga.js"),
                $.getScript("../../../Scripts/infobox.js"),
                $.getScript("../../../Scripts/markerclusterer.js"),
                $.Deferred(function (deferred) {
                    $(deferred.resolve);
                })
            ).done(function () {
                CreateMarkerClusterInstance();
                $scope.applySearch();
            });
        }


        $scope.ResetFilters = function () {
            if ($scope.multiSelectControl.resetQuerySearchBox != undefined) {
                $scope.multiSelectControl.resetQuerySearchBox();
            }
            //hylanCache.RemoveKey($scope.MSClients.key);
            //hylanCache.RemoveKey($scope.MSProjects.key);
            hylanCache.RemoveKey($scope.MSJobStatus.key);
            $scope.ApplyCache();
            $scope.applySearch();
        };

        $scope.applySearch = function () {
            $scope.CreateMapInstance();
            CreateMarkerClusterInstance();
            MapsService.LoadMapData($scope.mapStruct).then(function (result) {
                mapJobs = result.objResultList;
                if (mapJobs && mapJobs.length > 0) {
                    endInd = mapJobs.length;
                    $scope.DrawMarkersAsync(startInd);
                }
            }, onError);
        };
        var setDefaultValuesOnMultiSelect = function (multiSelectObject) {
            var objMulti = multiSelectObject;  //need to set
            objMulti.selectedList = [];
            var objList = hylanCache.GetValue(objMulti.key);
            if (objList) {
                //add values in control ,values came from cache
                angular.forEach(objList, function (value) {
                    if (isObjectExist(objMulti.controlID, value[objMulti.controlID], objMulti.options))
                        objMulti.selectedList.push(value);
                });
            }
            setTooltipOnMultiSelect(objMulti.controlID, objMulti.selectedList, objMulti.displayProp);
        };
        $scope.DrawMarkersAsync = function (ind) {

            if (ind < endInd) {
                setTimeout(function () {
                    if (ind == 0) invalidAddress = "";
                    var curMapJob = mapJobs[ind];
                    if (curMapJob != null) {
                        var progress = (((ind + 1) / mapJobs.length) * 100).toFixed(0);
                        percentBar.innerHTML = "Preparing... (" + progress + "%)";
                        if ((curMapJob.STREET_ADDRESS == null || curMapJob.STREET_ADDRESS == '') &&
                            (curMapJob.CITY == null || curMapJob.CITY == '') &&
                            (curMapJob.STATE == null || curMapJob.STATE == '')) {
                            invalidAddress += "<li id='" + curMapJob.JOB_ID + "' onclick='ShowInvalidAddress(this);'>" + curMapJob.JOB_FILE_NUMBER + ' (' + curMapJob.HYLAN_PROJECT_ID + ')' + "</li>";
                            startInd++;
                            $scope.DrawMarkersAsync(startInd);
                        }
                            //else if ((curMapJob.LAT != null && curMapJob.LAT != '') &&
                            //    (curMapJob.LONG != null && curMapJob.LONG != '')) {
                            //    try {
                            //        if (isNaN(curMapJob.LAT) && isNaN(xcurMapJob.LONG)) {
                            //            var latLong = new google.maps.LatLng(parseFloat(curMapJob.LAT), parseFloat(curMapJob.LONG));
                            //            PlaceMarker(latLong, curMapJob);
                            //            if (centerAdded == false && Globals.MapState.center == null) {
                            //                centerAdded = true;
                            //                map.setCenter(latLong);
                            //            }
                            //        }
                            //        else
                            //            invalidAddress += "<li id='" + curMapJob.JOB_ID + "' onclick='ShowInvalidAddress(this);'>" + curMapJob.JOB_FILE_NUMBER + "</li>";
                            //    } catch (e) {
                            //        invalidAddress += "<li id='" + curMapJob.JOB_ID + "' onclick='ShowInvalidAddress(this);'>" + curMapJob.JOB_FILE_NUMBER + "</li>";
                            //    }
                            //    finally {
                            //        startInd++;
                            //        $scope.DrawMarkersAsync(startInd);
                            //    }
                            //}
                        else {
                            var address = curMapJob.STREET_ADDRESS + ',' + curMapJob.CITY + ',' + curMapJob.STATE + ',' + curMapJob.ZIP;
                            $scope.geocoder.geocode({ 'address': address }, function (results, status) {
                                if (status == google.maps.GeocoderStatus.OK) {
                                    if (results && results != null && results.length > 0) {
                                        var latitude = results[0].geometry.location.lat();
                                        var longitude = results[0].geometry.location.lng();
                                        var latLong = new google.maps.LatLng(latitude, longitude);

                                        PlaceMarker(latLong, curMapJob);
                                        if (centerAdded == false && Globals.MapState.center == null) {
                                            centerAdded = true;
                                            map.setCenter(latLong);
                                        }
                                    }
                                }
                                else if (status == google.maps.GeocoderStatus.REQUEST_DENIED) {
                                    invalidAddress += "<li id='" + curMapJob.JOB_ID + "' onclick='ShowInvalidAddress(this);'>" + curMapJob.JOB_FILE_NUMBER + '(' + curMapJob.HYLAN_PROJECT_ID + ')' + "</li>";
                                }
                                else if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
                                    var tempIndex = startInd;

                                    //setTimeout(function (tempIndex) {
                                    //Geocode(address);
                                    var tindex = tempIndex;
                                    $scope.DrawMarkersAsync(tindex);
                                    //    }, 200);


                                    // $scope.DrawMarkersAsync(startInd);
                                    //invalidAddress += "<li id='" + curMapJob.JOB_ID + "' onclick='ShowInvalidAddress(this);'>" + curMapJob.JOB_FILE_NUMBER + ' (' + curMapJob.HYLAN_PROJECT_ID + ')' + "</li>";
                                }
                                else if (status == google.maps.GeocoderStatus.ZERO_RESULTS ||
                                         status == google.maps.GeocoderStatus.INVALID_REQUEST) {

                                    invalidAddress += "<li id='" + curMapJob.JOB_ID + "' onclick='ShowInvalidAddress(this);'>" + curMapJob.JOB_FILE_NUMBER + ' (' + curMapJob.HYLAN_PROJECT_ID + ')' + "</li>";
                                }
                                startInd++;
                                $scope.DrawMarkersAsync(startInd);
                            });
                        }
                    }
                    else {
                        startInd++;
                        $scope.DrawMarkersAsync(startInd);
                    }
                }, 400);
            }
            else {
                percentBar.style.display = "none";
                if (invalidAddress != "") {
                    var div = document.createElement('div');
                    div.className = "invAddressesDiv";
                    div.id = "invalidDiv";
                    div.innerHTML = "<span>UNKNOWN ADDRESSES</span>";
                    div.style.maxHeight = ($("#map_canvas").height() - $('.togglebox').height() - 70) + "px";
                    var invAddressesDiv = document.createElement('ul');
                    invAddressesDiv.innerHTML = invalidAddress;
                    div.appendChild(invAddressesDiv);
                    if (map.controls[google.maps.ControlPosition.LEFT_TOP].length > 0) {  //inorder to handle multiple clicks
                        map.controls[google.maps.ControlPosition.LEFT_TOP] = [];
                    }
                    map.controls[google.maps.ControlPosition.LEFT_TOP].push(div);
                }
                try {
                    if (Globals.MapState.zoom != null) {
                        map.setZoom(Globals.MapState.zoom);
                    }
                    if (Globals.MapState.center != null) {
                        map.setCenter(new google.maps.LatLng(Globals.MapState.center.lat(), Globals.MapState.center.lng()));
                    }
                } catch (e) {
                    //alert('Error: ' + e.message);
                }
            }
        }

        function PlaceMarker(latLong, curMapJob) {
            var pinIcon = undefined;
            var jobStatusClass = curMapJob.JOB_STATUS_LU.LU_NAME.split(" ").join("_").split("&").join("And");
            if (curMapJob.JOB_STATUS_LU) {
                pinIcon = "../../Content/images/" + jobStatusClass + "_pin.png";
            }
            marker = new google.maps.Marker(
            {
                category: jobStatusClass,
                map: map,
                position: latLong,
                title: curMapJob.JOB_FILE_NUMBER + ' (' + curMapJob.HYLAN_PROJECT_ID + ')',
                icon: pinIcon
            });

            var content = '<div class="iw-title ' + jobStatusClass + '">' + curMapJob.HYLAN_PROJECT_ID + '</div>' + GetContents(curMapJob);
            content += '<div class="arrow-down"></div>';
            var myOptions = {
                alignBottom: true
                , disableAutoPan: false
                , maxWidth: 0
                , pixelOffset: new google.maps.Size(-14, -34)
                , zIndex: null
                , closeBoxMargin: "7px 6px 2px 2px"
                , closeBoxURL: "../../Content/images/closeIW.png"
                , infoBoxClearance: new google.maps.Size(1, 1)
                , isHidden: false
                , pane: "floatPane"
                , enableEventPropagation: false
            };
            var infobox = new InfoBox(myOptions);
            marker.infobox = infobox;
            google.maps.event.addListener(marker, 'click', (function (marker, content, infobox) {
                return function () {
                    infobox.setContent(content);
                    infobox.open(map, marker);
                };
            })(marker, content, infobox));
            allMarkers.push(marker);
            markerCluster.addMarker(marker);
        }
        function Places_Changed() {
            var places = this.getPlaces();
            if (places && places.length > 0 && places[0].geometry) {
                place = places[0];
                map.setCenter(place.geometry.location);
                var marker = new google.maps.Marker({
                    map: map,
                    position: place.geometry.location,
                    title: place.name
                });
                var contentString = '<div>' + '<p>' + place.formatted_address + '</p>' + '</div>';
                var infowindow = new google.maps.InfoWindow({ content: contentString, maxWidth: 250 });
                google.maps.event.addListener(marker, 'click', function () {
                    infowindow.open(map, marker);
                });
                markerCluster.addMarker(marker);
            }
            else {
                Utility.Notify({ type: NOTIFYTYPE.INFO, message: 'We could not find ' + document.getElementById("address").value + '\n\rMake sure your search is spelled correctly.\n\rTry adding a city, state, or zip code.' });
            }
        }

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            try {
                if (map && map != null) {
                    var mapCenter = map.getCenter();
                    Globals.MapState.center = new google.maps.LatLng(mapCenter.lat(), mapCenter.lng());
                    Globals.MapState.zoom = map.getZoom();
                }
            } catch (e) { }
        });
        $scope.OpenManageJobs = function (JOB_ID) {
            var item = $.grep(mapJobs, function (e) {
                return e.JOB_ID == JOB_ID;
            });
            if (item.length == 0) {
                return;
            }
            selectedRow = item[0];

            //var selectedList = [];
            //selectedList.push(selectedRow);
            //hylanCache.SetValue(hylanCache.Keys.PROJECTS, selectedList);

            ////set remaining filters to all
            //hylanCache.SetValue(hylanCache.Keys.DOITT_NTP_STATUS, [], Globals.Screens.MANAGE_JOBS.ID);
            //hylanCache.SetValue(hylanCache.Keys.JOB_CATEGORY, [], Globals.Screens.MANAGE_JOBS.ID);
            //hylanCache.SetValue(hylanCache.Keys.JOB_STATUS, [], Globals.Screens.MANAGE_JOBS.ID);
            //hylanCache.SetValue(hylanCache.Keys.CLIENTS, [], Globals.Screens.MANAGE_JOBS.ID);
            //re-direct to manage Jobs page
            //$state.go('Jobs', {
            //    url: '/Jobs',
            //    views: {
            //        'PageButtons': {
            //            templateUrl: Globals.BaseUrl + 'app/Jobs/views/menu.html'
            //        },
            //        'BodyContent': {
            //            templateUrl: Globals.BaseUrl + 'app/Jobs/views/index.html',
            //            controller: 'JobsController'
            //        }
            //    },
            //    title: 'Manage Jobs - Hylan',
            //    screenId: Globals.Screens.MANAGE_JOBS.ID
            //});

            screenId = Globals.Screens.MANAGE_JOBS.ID;
            screenRecordId = selectedRow.JOB_ID;;
            $scope.isPopup = true;
            //jobID = (jobID ? jobID: 0);
            var param = {
                USER_ID: $rootScope.currentUser.USER_ID, SCREEN_ID: screenId, SCREEN_RECORD_ID: screenRecordId, JOB_ID: screenRecordId
            };
            $scope.ngDialogData = param;
            //if ($scope.AllowToEdit == false && jobID != 0) {
            $scope.openDialog("JOB-CRUD", param);
            //    }
            //else if ($scope.AllowToEdit == true) {
            //    $scope.openDialog("JOB-CRUD", param);
            //    }

        }

        $scope.OpenManagePermits = function (JOB_ID) {
            var item = $.grep(mapJobs, function (e) {
                return e.JOB_ID == JOB_ID;
            });
            if (item.length == 0) {
                return;
            }
            selectedRow = item[0];

            var selectedList = [];
            selectedList.push(selectedRow);
            hylanCache.SetValue(hylanCache.Keys.PROJECTS, selectedList);

            //set remaining filters to all
            //hylanCache.SetValue(hylanCache.Keys.DOITT_NTP_STATUS, [], Globals.Screens.MANAGE_JOBS.ID);
            //hylanCache.SetValue(hylanCache.Keys.JOB_CATEGORY, [], Globals.Screens.MANAGE_JOBS.ID);
            //hylanCache.SetValue(hylanCache.Keys.JOB_STATUS, [], Globals.Screens.MANAGE_JOBS.ID);
            //hylanCache.SetValue(hylanCache.Keys.CLIENTS, [], Globals.Screens.MANAGE_JOBS.ID);
            //re-direct to manage Jobs page
            $state.go('Permits', {
                url: '/Permits/{id}',
                views: {
                    'BodyContent': {
                        templateUrl: Globals.BaseUrl + '/app/permits/views/index.html',
                        controller: 'PermitsController'
                    }
                },
                title: 'Manage Permits - Hylan',
                screenId: Globals.Screens.MANAGE_PERMITS.ID
            });
        }

        $scope.OpenManageDailies = function (JOB_ID) {
            var item = $.grep(mapJobs, function (e) {
                return e.JOB_ID == JOB_ID;
            });
            if (item.length == 0) {
                return;
            }
            selectedRow = item[0];

            var selectedList = [];
            selectedList.push(selectedRow);
            hylanCache.SetValue(hylanCache.Keys.PROJECTS, selectedList);

            //set remaining filters to all
            //hylanCache.SetValue(hylanCache.Keys.DOITT_NTP_STATUS, [], Globals.Screens.MANAGE_JOBS.ID);
            //hylanCache.SetValue(hylanCache.Keys.JOB_CATEGORY, [], Globals.Screens.MANAGE_JOBS.ID);
            //hylanCache.SetValue(hylanCache.Keys.JOB_STATUS, [], Globals.Screens.MANAGE_JOBS.ID);
            //hylanCache.SetValue(hylanCache.Keys.CLIENTS, [], Globals.Screens.MANAGE_JOBS.ID);
            //re-direct to manage Jobs page
            $state.go('Dailies', {
                url: '/Dailies/{id}',
                views: {
                    'BodyContent': {
                        templateUrl: Globals.BaseUrl + '/app/dailies/views/index.html',
                        controller: 'DailiesController'
                    }
                },
                title: 'Manage Dailies - Hylan',
                screenId: Globals.Screens.MANAGE_DAILIES.ID
            });
        }

        $scope.OpenManageAttachments = function (JOB_ID) {
            var item = $.grep(mapJobs, function (e) {
                return e.JOB_ID == JOB_ID;
            });
            if (item.length == 0) {
                return;
            }
            selectedRow = item[0];

            var selectedList = [];
            selectedList.push(selectedRow);
            hylanCache.SetValue(hylanCache.Keys.PROJECTS, selectedList);

            //set remaining filters to all
            //hylanCache.SetValue(hylanCache.Keys.DOITT_NTP_STATUS, [], Globals.Screens.MANAGE_JOBS.ID);
            //hylanCache.SetValue(hylanCache.Keys.JOB_CATEGORY, [], Globals.Screens.MANAGE_JOBS.ID);
            //hylanCache.SetValue(hylanCache.Keys.JOB_STATUS, [], Globals.Screens.MANAGE_JOBS.ID);
            //hylanCache.SetValue(hylanCache.Keys.CLIENTS, [], Globals.Screens.MANAGE_JOBS.ID);
            //re-direct to manage Jobs page
            $state.go('Attachments', {
                url: '/Attachments',
                views: {
                        'BodyContent': {
                            templateUrl: Globals.BaseUrl + 'app/attachments/views/attachment.html',
                            controller: 'AttachmentsController as vm'
                        }
                },
                title: 'Manage Attachments - Hylan',
                screenId: Globals.Screens.MANAGE_ATTACHMENTS.ID
            });
        }

        $scope.OpenManageTasks = function (JOB_ID) {
            var item = $.grep(mapJobs, function (e) {
                  return e.JOB_ID == JOB_ID;
                  });
            if (item.length == 0) {
                return;
            }

            selectedRow = item[0];

            var selectedList =[];
            selectedList.push(selectedRow);
            hylanCache.SetValue(hylanCache.Keys.PROJECTS, selectedList);

            //set remaining filters to all
            //hylanCache.SetValue(hylanCache.Keys.DOITT_NTP_STATUS, [], Globals.Screens.MANAGE_JOBS.ID);
            //hylanCache.SetValue(hylanCache.Keys.JOB_CATEGORY, [], Globals.Screens.MANAGE_JOBS.ID);
            //hylanCache.SetValue(hylanCache.Keys.JOB_STATUS, [], Globals.Screens.MANAGE_JOBS.ID);
            //hylanCache.SetValue(hylanCache.Keys.CLIENTS, [], Globals.Screens.MANAGE_JOBS.ID);
            //re-direct to manage Jobs page
            $state.go('TasksRoster', {
                url: '/Tasks/{id}',
                views: {
                    'BodyContent': {
                templateUrl: Globals.BaseUrl + 'app/tasks/views/roster-index.html',
                                        controller: 'TaskRosterController'
                                }
                                },
                                        title: 'Manage Tasks - Hylan',
                                                screenId : Globals.Screens.MANAGE_TASKS.ID
                                        });
         }       


        //--------------------------Start Projects MultiSelect-----------------  
        var projectsMultiSelect = function () {

            var objMulti = {
                    controlID : 'divMultiSelProjects', options: $scope.projectsDS, selectedList: [],
                            idProp: 'HYLAN_PROJECT_ID', displayProp: 'HYLAN_PROJECT_ID', key: hylanCache.Keys.PROJECTS
                            };
                $scope.MSProjects = objMulti;
                $scope.MSProjects.settings = {
                    externalIdProp : '',
                            idProp: objMulti.idProp,
                        displayProp: objMulti.displayProp,
                        enableSearch: true,
                        scrollable: true,
                        showCheckAll: false,
                        showUncheckAll: true,
                        smartButtonMaxItems: 3,  //need to change depends on size of control 
                        closeOnBlur: true
                //  ,
                        //smartButtonTextConverter: function (itemText, originalItem) {
                        //  if (itemText.length > 23)
                        //    return itemText.substring(0, 23) + '..';
                        //}
                    };


                $scope.MSProjects.events = {
                    onItemSelect : function (item) {
                        setTooltipOnMultiSelect(objMulti.controlID, objMulti.selectedList, objMulti.displayProp);
                        hylanCache.SetValue(objMulti.key, objMulti.selectedList.slice());
                        $scope.applySearch();
                },
                        onItemDeselect: function (item) {
                            setTooltipOnMultiSelect(objMulti.controlID, objMulti.selectedList, objMulti.displayProp);
                            hylanCache.SetValue(objMulti.key, objMulti.selectedList.slice());
                            $scope.applySearch();
                },
                        onDeselectAll: function (items) {

                            setTooltipOnMultiSelect(objMulti.controlID, [], objMulti.displayProp);
                            hylanCache.SetValue(objMulti.key, []);
                            $scope.applySearch();
                }
                            };
                    }
            var RefreshProjectsMS = function () {
                MapsService.GetAllProjects().then(function (result) {;
                    $scope.MSProjects.options = result.objResultList;
                        //clear the selected list
                    hylanCache.RemoveKey($scope.MSProjects.key);
                    $scope.MSProjects.selectedList =[];
                    });
                    }
        projectsMultiSelect();
        //--------------------------Start Clients MultiSelect-----------------  
        var clientsMultiSelect = function () {

            var objMulti = {
                    controlID : 'divMSClients', options: $scope.ClientsDS, selectedList: [],
                            idProp: 'COMPANY_ID', displayProp: 'COMPANY_NAME', key: hylanCache.Keys.CLIENTS
                            };
                $scope.MSClients = objMulti;
                $scope.MSClients.settings = {
                    externalIdProp : '',
                            idProp: objMulti.idProp,
                        displayProp: objMulti.displayProp,
                        enableSearch: true,
                        scrollable: true,
                        showCheckAll: false,
                        showUncheckAll: true,
                        smartButtonMaxItems: 3,  //need to change depends on size of control 
                        closeOnBlur: true
            };

                $scope.MSClients.events = {
                    onItemSelect : function (item) {
                        setTooltipOnMultiSelect(objMulti.controlID, objMulti.selectedList, objMulti.displayProp);
                        hylanCache.SetValue(objMulti.key, objMulti.selectedList.slice());
                        RefreshProjectsMS();
                        $scope.applySearch();
                },
                        onItemDeselect: function (item) {
                            setTooltipOnMultiSelect(objMulti.controlID, objMulti.selectedList, objMulti.displayProp);
                            hylanCache.SetValue(objMulti.key, objMulti.selectedList.slice());
                            RefreshProjectsMS();
                            $scope.applySearch();
                },
                        onDeselectAll: function (items) {

                            setTooltipOnMultiSelect(objMulti.controlID, [], objMulti.displayProp);
                            hylanCache.SetValue(objMulti.key, []);
                            RefreshProjectsMS();
                            $scope.applySearch();
                }
                            };
                    };

        clientsMultiSelect();
        //--------------------------End Clients MultiSelect----------------- 
        //--------------------------Start Job Status MultiSelect-----------------               


        var jobStatusMultiSelect = function () {
            var objMulti = {
                controlID : 'divMultiSelJobStatus', options: $scope.jobStatusLU, selectedList: [],
                        idProp: 'LOOK_UP_ID', displayProp: 'LU_NAME', key: hylanCache.Keys.JOB_STATUS +Globals.Screens.JOB_MAP.ID
                        };
            $scope.MSJobStatus = objMulti;

            $scope.MSJobStatus.settings = {
                externalIdProp : '',
                        idProp: objMulti.idProp,
                    displayProp: objMulti.displayProp,
                    enableSearch: true,
                    scrollable: true,
                    showCheckAll: false,
                    showUncheckAll: true,
                    smartButtonMaxItems: 3,  //need to change depends on size of control 
                    closeOnBlur: true
            };

            $scope.MSJobStatus.events = {
                onItemSelect : function (item) {
                    setTooltipOnMultiSelect(objMulti.controlID, objMulti.selectedList, objMulti.displayProp);
                    hylanCache.SetValue(objMulti.key, objMulti.selectedList.slice());
                    $scope.applySearch();
                },
                    onItemDeselect: function (item) {
                        setTooltipOnMultiSelect(objMulti.controlID, objMulti.selectedList, objMulti.displayProp);
                        hylanCache.SetValue(objMulti.key, objMulti.selectedList.slice());
                        $scope.applySearch();
                },
                    onDeselectAll: function (items) {

                        setTooltipOnMultiSelect(objMulti.controlID, [], objMulti.displayProp);
                        hylanCache.SetValue(objMulti.key, []);
                        $scope.applySearch();
                }
                        };
                }
        jobStatusMultiSelect();
        //var setJobStatusMultiSelectDefaultValues = function () {
        //    $scope.MSJobStatus.selectedList = [];
        //    var selectedObjects = hylanCache.GetValue(hylanCache.Keys.JOB_STATUS, Globals.Screens.JOB_MAP.ID);
        //    if (selectedObjects) {

        //        //add values on control, values came from cache
        //        angular.forEach(selectedObjects, function (value) {
        //            $scope.MSJobStatus.selectedList.push(value);
        //        });
        //        setTooltipOnMultiSelect('divMultiSelJobStatus', $scope.MSJobStatus.selectedList, 'LU_NAME');
        //    }
        //    else {
        //        //if no filter is set and comming to screen first time then set the active filter and set it in the cache
        //        var item = $.grep($scope.jobStatusLU, function (e) {
        //            return e.LU_NAME == 'Active';
        //        });
        //        $scope.MSJobStatus.selectedList.push(item[0]);
        //        setTooltipOnMultiSelect('divMultiSelJobStatus', $scope.MSJobStatus.selectedList, 'LU_NAME');
        //        hylanCache.SetValue(hylanCache.Keys.JOB_STATUS, $scope.MSJobStatus.selectedList.slice(), Globals.Screens.JOB_MAP.ID);
        //    }
        //};
        $scope.ApplyCache = function () {  //being called from baseController
            //setJobStatusMultiSelectDefaultValues();
            setDefaultValuesOnMultiSelect($scope.MSJobStatus);
            setDefaultValuesOnMultiSelect($scope.MSClients);
            setDefaultValuesOnMultiSelect($scope.MSProjects);

            };
        $scope.ApplyCache();
        $scope.SetCookie = function () {
            Cookies.set('selectedEvent', $scope.mapStruct.EVENT_ID, { path: '' });
                Utility.HideNotification();
                };
        $scope.HideNotification = function () {
            Utility.HideNotification();
            };

        function onSuccess(result) {
            Utility.Notify({
            type: NOTIFYTYPE.SUCCESS, message: "Message Sent"
            });
            }
        function onError(XMLHttpRequest, textStatus, errorThrown) {
            Utility.Notify({
            type: NOTIFYTYPE.ERROR, message: XMLHttpRequest.responseText
            });
            }
            } catch (e)
        {
    alert(e.toString());
    }
    }
    ]);
function GetFormattedValue(value) {
    var result = '';
    if(value && value != null && value != '')
        result = value;
    return result;
    }


    var callControllerFunction = function (name, JOB_ID) {

        var scopeBaseController = angular.element(document.getElementById('divBaseController')).scope();
        var scopeMap = scopeBaseController.$$childHead.$$nextSibling;
        if (name == 'JOB') {
            scopeMap.OpenManageJobs(JOB_ID);
        }
        else if (name == 'TASK') {
            scopeMap.OpenManageTasks(JOB_ID);
        }
        else if (name == 'PERMIT') {
            scopeMap.OpenManagePermits(JOB_ID);
        }
        else if (name == 'DAILY') {
            scopeMap.OpenManageDailies(JOB_ID);
        }
        else if (name == 'ATTACHMENT') {
            scopeMap.OpenManageAttachments(JOB_ID);
        }
     };

    function GetContents(curMapJob) {
        var scopeBaseController = angular.element(document.getElementById('divBaseController')).scope();
        var scopeMap = scopeBaseController.$$childHead.$$nextSibling;
        scopeMap.mapparm = curMapJob;
        var taskTag = "<a href='javascript:;' onclick= 'callControllerFunction(\"TASK\"," +curMapJob.JOB_ID+ ")'>TASKS  </a> ";
        var permitTag = "<a href='javascript:;' onclick= 'callControllerFunction(\"PERMIT\"," +curMapJob.JOB_ID+ ")'>PERMITS  </a> ";
        var dailiesTag = "<a href='javascript:;' onclick= 'callControllerFunction(\"DAILY\"," +curMapJob.JOB_ID+ ")'>DALIES  </a> ";
        var attachmentTag = "<a href='javascript:;' onclick= 'callControllerFunction(\"ATTACHMENT\"," +curMapJob.JOB_ID+ ")'>ATTACHMENTS</a> ";;

        var innerContents = "<table class='InnerContents' cellpadding='0' border='0' cellspacing='0'>";
        innerContents += "<tr><td class='ContentTitles'>PROJECT ID:</td><td class='Text'>" +GetFormattedValue(curMapJob.HYLAN_PROJECT_ID) + "</td></tr>";
        innerContents += "<tr><td class='ContentTitles'>JOB FILE NUMBER:</td><td class='Text'>" + "<a href='javascript:;' onclick= 'callControllerFunction(\"JOB\"," +curMapJob.JOB_ID+ ")'>" + GetFormattedValue(curMapJob.JOB_FILE_NUMBER) + "</a>" + "</td></tr>";
        innerContents += "<tr><td class='ContentTitles'>CLIENT:</td><td class='Text'>" +GetFormattedValue(curMapJob.CLIENT_NAME) + "</td></tr>";
        innerContents += "<tr><td class='ContentTitles'>HYLAN PM:</td><td class='Text'>" +GetFormattedValue(curMapJob.HYLAN_PM_NAME) + "</td></tr>";
        innerContents += "<tr><td class='ContentTitles'>JOB CATEGORY:</td><td class='Text'>" +GetFormattedValue(curMapJob.JOB_CATEGORY_LU.LU_NAME) + "</td></tr>";
        innerContents += "<tr><td class='ContentTitles'>POLE LOCATION:</td><td class='Text'>" +GetFormattedValue(curMapJob.POLE_LOCATION) + "</td></tr>";

        innerContents += "<tr><td class='Text' colspan=2 >"+taskTag+permitTag+ dailiesTag + attachmentTag + " </td></tr>";
        innerContents += "</table>";
        return innerContents;
    }
        function ToggleJobStatus(sender) {
            var src = $(sender).attr('src');
            var checked =(src.indexOf('unchecked') < 0);
            if(checked) {
                $(sender).attr('src', '../../Content/images/' +sender.id + '_unchecked.png');
                }
                else {
                $(sender).attr('src', '../../Content/images/' +sender.id + '_checked.png');
                }


            $.each(allMarkers, function (index, marker) {
                if (sender.id == marker.category) {
                    marker.setVisible(!checked);
                    marker.infobox.close();
                    markerCluster.repaint();
        }
        });
        }
        function ShowInvalidAddress(sender) {
            $('#invalidDiv ul li').removeClass("selected");
            $(sender).addClass("selected");
            var curMapJob = _.findWhere(mapJobs, { JOB_ID : parseInt(sender.id) });
            var jobStatusClass = curMapJob.JOB_STATUS_LU.LU_NAME.split(" ").join("_").split("&").join("And");
            var content = '<div class="arrow-left"></div><div class="iw-title ' +jobStatusClass + '">' + curMapJob.HYLAN_PROJECT_ID +
                '<img src="Content/images/closeIW.png" style="position: absolute;top: 7px;right: 5px;" onclick="ClosePopup();"></div>' +
                           GetContents(curMapJob);

            var unkAddPanel = document.createElement('div');
            unkAddPanel.id = "unkAddPopup";
            unkAddPanel.innerHTML = content;
            if (invalidInfoBox)
        map.controls[google.maps.ControlPosition.TOP_LEFT].pop(unkAddPanel);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(unkAddPanel);
    invalidInfoBox = true;
        }
        function ClosePopup() {
    $('#invalidDiv ul li').removeClass("selected");
    if (invalidInfoBox)
        map.controls[google.maps.ControlPosition.TOP_LEFT].pop();
    invalidInfoBox = false;
    }
    function PointTolatLng(point) {
        var topRight = map.getProjection().fromLatLngToPoint(map.getBounds().getNorthEast());
        var bottomLeft = map.getProjection().fromLatLngToPoint(map.getBounds().getSouthWest());
        var scale = Math.pow(2, map.getZoom());
        return map.getProjection().fromPointToLatLng(new google.maps.Point((point.x / scale) +bottomLeft.x, (point.y / scale) +topRight.y));
        }
    function CreateMarkerClusterInstance() {
        markerCluster = new MarkerClusterer(map, null, {
            styles: clusterStyles[0],
                    zoomOnClick: true,
                    maxZoom: 14,
                ignoreHidden: true
            });
            google.maps.event.addListener(markerCluster, 'clusterclick', function (cluster) {
                if(map.getZoom() > markerCluster.getMaxZoom() +1) // If zoomed in past 15 (first level without clustering), zoom out to 15
                    map.setZoom(markerCluster.getMaxZoom() +1);
                    });

    }
