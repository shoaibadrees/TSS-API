angular.module('HylanApp').factory('JobCRUDService', ['DataContext', function (DataContext) {
    
    var RetrieveJobByProjectAndFileNo = function (projectId, JOB_FILE_NUMBER) {
        var api = "Jobs/Get";
        var params = { 'projectid': projectId, 'jobfilenumber': JOB_FILE_NUMBER };
        return Globals.Get(api, params, false);
    };

    var RetrieveJob = function (jobId) {
        var api = "Jobs/GetByID";
        var params = { 'jobId': jobId };
        return Globals.Get(api, params, false);
    };

    var UpdateJob = function (projectDC) {
        var api = "Jobs/Update";
        return Globals.Post(api, projectDC, false); //true = a sync 
    };

    var CreateJob = function (projectDC) {
        var api = "Jobs/Insert";
        return Globals.Post(api, projectDC, true);
    };

    return {
        RetrieveJobByProjectAndFileNo :RetrieveJobByProjectAndFileNo,
        CreateJob: CreateJob,
        RetrieveJob: RetrieveJob,
        UpdateJob: UpdateJob
    };
}]);