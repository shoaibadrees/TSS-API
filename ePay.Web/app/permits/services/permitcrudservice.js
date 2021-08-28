angular.module('HylanApp').factory('PermitCRUDService', ['DataContext', function (DataContext) {
    
    var RetrievePermitByProjectAndFileNo = function (projectId, JOB_FILE_NUMBER) {
        var api = "Permits/Get";
        var params = { projectid: projectId, jobfilenumber: JOB_FILE_NUMBER };
        return Globals.Get(api, params, false);
    };

    var Retrieve = function (permitId) {
        var api = "Permits/GetByID";
        var params = { permitId: permitId };
        return Globals.Get(api, params, false);
    };

    var Update = function (permitDC) {
        var api = "Permits/Update";
        return Globals.Post(api, permitDC, false); //true = a sync 
    };

    var Create = function (permitDC) {
        var api = "Permits/Insert";
        return Globals.Post(api, permitDC, true);
    };

    return {
        RetrieveJobByProjectAndFileNo: RetrievePermitByProjectAndFileNo,
        CreatePermit: Create,
        RetrievePermit: Retrieve,
        UpdatePermit: Update
    };
}]);