//'use strict';
angular.module('HylanApp').factory('hylanCache',['$cacheFactory','$rootScope',
    function ($cacheFactory, $rootScope) {

        var vm = this;
        var cache = $cacheFactory('hylanCache');
        vm.CheckScreenID = function (argKey, argScreenID) {
            var screenId = "";
            if (this.Keys && this.Keys.PROJECTS != argKey) { // Ignore screenId for project-key to make application level impact.
                screenId = argScreenID ? argScreenID : "";
            }
            return screenId;
        };

        var SetValue = function (thisKey, thisValue, screenID) {
            screenID = vm.CheckScreenID(thisKey, screenID);
            thisKey = thisKey + screenID + $rootScope.currentUser.USER_ID;
                    if (angular.isDefined(cache.get(thisKey))) {
                        cache.remove(thisKey);
                        cache.put(thisKey, thisValue);
                    }
                    else {
                        cache.put(thisKey, thisValue);
                    }
                   
        }

        var GetValue = function (thisKey, screenID)
        {
            screenID = vm.CheckScreenID(thisKey, screenID);
            return cache.get(thisKey + screenID + $rootScope.currentUser.USER_ID);
        }

        var RemoveKey = function (thisKey, screenID){
            screenID = vm.CheckScreenID(thisKey, screenID);
            thisKey = thisKey +screenID +$rootScope.currentUser.USER_ID;
            //if (angular.isDefined(cache.get(thisKey))) {
                cache.remove(thisKey);
            //}
        }

        vm.Keys = {
            TASK_BACKBUTTON: "TASK_BACKBUTTON",
            NEWLYADDED_ROWID: "NEWLYADDED_ROWID",
            LATEST_PROJECTS: "LATEST_PROJECTS",
            PROJECTS: "PROJECTS",
            LATEST_JOBS: "LATEST_JOBS",
            DOITT_NTP_STATUS: "DOITT_NTP_STATUS",
            JOB_CATEGORY: "JOB_CATEGORY",
            JOB_STATUS: "JOB_STATUS",
            PROJECT_STATUS: "PROJECT_STATUS",
            CLIENTS: "CLIENTS",
            DAILY_TYPE: "DAILY_TYPE",
            DAILY_SHIFT: "DAILY_SHIFT",
            DAILY_STATUS: "DAILY_STATUS",
            ATTACHMENT_TYPES: "ATTACHMENT_TYPES",
            DAILY_DATE: "DAILY_DATE",
            TASK_STATUS: "TASK_STATUS",
            TM_DATE: "TM_DATE",
            JOB_FILE_NUMBER: "JOB_FILE_NUMBER",
            TASK_NAME: "TASK_NAME",
            START_DATE: "START_DATE",
            END_DATE: "END_DATE",
            MAP_SEARCH: "MAP_SEARCH",
            IS_DEFAULT_FOR_DATES: "IS_DEFAULT_FOR_DATES"  //consider only two values Y and N
           
        };

        return {
            SetValue : SetValue,
            GetValue: GetValue,
            Keys: vm.Keys,
            RemoveKey: RemoveKey
        };

}]);

