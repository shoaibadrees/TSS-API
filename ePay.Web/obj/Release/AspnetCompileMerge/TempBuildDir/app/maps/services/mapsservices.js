angular.module('HylanApp').factory('MapsService', ['DataContext', '$rootScope', 'AppConfig', 'hylanCache', function (DataContext, $rootScope, AppConfig, hylanCache) {
    var apiControllerName = "Jobs";
    var getParams = function () {
        objParams = { projectIDs: 'All', jobStatusIDs: 'All', clientIDs: 'All' };

        var selectedProjectsList = hylanCache.GetValue(hylanCache.Keys.PROJECTS);
        if (selectedProjectsList == undefined) selectedProjectsList = hylanCache.GetValue(hylanCache.Keys.LATEST_PROJECTS, Globals.Screens.JOB_MAP.ID);

        var selectedJobStatusList = hylanCache.GetValue(hylanCache.Keys.JOB_STATUS, Globals.Screens.JOB_MAP.ID);
        var selectedClientsList = hylanCache.GetValue(hylanCache.Keys.CLIENTS, Globals.Screens.JOB_MAP.ID);

        if (selectedProjectsList && selectedProjectsList.length > 0) objParams.projectIDs = getIDFromList(selectedProjectsList, 'PROJECT_ID');
        if (selectedJobStatusList && selectedJobStatusList.length > 0) objParams.jobStatusIDs = getIDFromList(selectedJobStatusList, 'LOOK_UP_ID');
        if (selectedClientsList && selectedClientsList.length > 0) objParams.clientIDs = getIDFromList(selectedClientsList, 'COMPANY_ID');

        return objParams;
    }


    var LoadMapData = function (mapStruct) {
        var params = getParams();
        var api = AppConfig.ApiUrl + "/" + apiControllerName + "/GetMapJobsByFilters";
        return $.ajax({
            url: api,
            dataType: "json",
            data: params,
            cache: false,
            headers: {
                "Authorization": "UserID" + $rootScope.currentUser.USER_ID
            }
        });


        //return Globals.Get(api, params, true);
    };

    var GetAllProjects = function () {
        objParams = { clientIDs: 'All' };
        var selectedClientList = hylanCache.GetValue(hylanCache.Keys.CLIENTS);
        if (selectedClientList && selectedClientList.length > 0) objParams.clientIDs = getIDFromList(selectedClientList, 'COMPANY_ID');

        var api = "Project/GetAll";
        return Globals.Get(api, objParams, false);
    };
   
    return {
        LoadMapData: LoadMapData,
        GetAllProjects: GetAllProjects
    };
}]);