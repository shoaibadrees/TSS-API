angular.module('HylanApp').factory('DailiesCRUDService', ['DataContext', function (DataContext) {
    var DailiesApiController = "Dailies";
    var RetrieveDaily = function (dailyid) {
        var api = DailiesApiController + "/GetByID";
        var params = { 'dailyid': dailyid };
        return Globals.Get(api, params, false);
    };

    var RetrieveWholeDailyByID = function (dailyid) {
        var api = DailiesApiController + "/GetWholeDailyByID";
        var params = { 'dailyid': dailyid };
        return Globals.Get(api, params, false);
    };

    var UpdateDaily = function (projectDC) {
        var api = DailiesApiController + "/Update";
        return Globals.Post(api, projectDC, false); //true = a sync 
    };

    var SendDailyEmail = function (dailyID, isNewDaily) {
        objParams = { dailyID: dailyID, isNewDaily: isNewDaily };
        var api = DailiesApiController + "/SendDailyEmail";      
        return Globals.Get(api, objParams, true); //true = a sync 
    };

    var CreateDaily = function (projectDC) {
        var api = DailiesApiController + "/Insert";
        return Globals.Post(api, projectDC, true);
    };

    var RetrieveManPower = function (params) {
        var api = DailiesApiController + "/GetManPower";
        return Globals.Get(api, params, false);
    };    
    var DeleteManPower = function (params) {
        var api = DailiesApiController + "/DeleteManPower";
        return Globals.Post(api, params, false);
    };

    var RetrieveVehicles = function (params) {
        var api = DailiesApiController + "/GetVehicles";
        return Globals.Get(api, params, false);
    };

    var RetrieveMaterials = function (params) {
        var api = DailiesApiController + "/GetMaterials";
        return Globals.Get(api, params, false);
    };
    var RetrieveLabors = function (params) {
        var api = DailiesApiController + "/GetLabors";
        return Globals.Get(api, params, false);
    };
    var RetrieveWorkDetails = function (params) {
        var api = DailiesApiController + "/GetWorkDetails";
        return Globals.Get(api, params, false);
    };
    
    var schemaManPower =
         {
             model: {
                 id: "MAN_POWER_ID",
                 fields: {
                     ROW_HEADER: { editable: false },
                     MAN_POWER_ID: { title: "MAN_POWER_ID", editable: false },
                     DAILY_ID: { title: "DAILY_ID", editable: false },
                     FIRST_NAME: { title: "First Name", editable: false },
                     LAST_NAME: { title: "Last Name", editable: false },
                     ST_HOURS: { title: "ST Hours", editable: false },
                     OT_HOURS: { title: "OT Hours", editable: false },
                     HOURS_DIFF: { title: "Diff. Hours", editable: false },
                     CREATED_BY: { title: "CREATED_BY", editable: false },
                     CREATED_ON: { type: "date", title: "CREATED_ON", editable: false },
                     MODIFIED_BY: { title: "MODIFIED_BY", editable: false },
                     MODIFIED_ON: { type: "date", title: "MODIFIED_ON", editable: false },
                     LOCK_COUNTER: { title: "LOCK_COUNTER", editable: false },
                 }
             }
         };
    var defaultSortMaPower = {
        field: "MAN_POWER_ID",
        dir: "asc"
    };

    var dataSourceManPower = DataContext.CreateDataSource(DailiesApiController, schemaManPower, null, null, null, defaultSortMaPower);

    return {
        CreateDaily: CreateDaily,
        RetrieveDaily: RetrieveDaily,
        UpdateDaily: UpdateDaily,
        RetrieveManPower: RetrieveManPower,
        RetrieveVehicles: RetrieveVehicles,
        RetrieveMaterials: RetrieveMaterials,
        RetrieveLabors: RetrieveLabors,
        RetrieveWorkDetails: RetrieveWorkDetails,
        DeleteManPower: DeleteManPower,
        SendDailyEmail: SendDailyEmail,
        RetrieveWholeDailyByID: RetrieveWholeDailyByID
    };
}]);