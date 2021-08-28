angular.module('HylanApp').factory('ProjectCRUDService', ['DataContext', function (DataContext) {
    var RetrieveProject = function (projectId) {
        var api = "Project/Get";
        var params = { id: projectId };
        return Globals.Get(api, params, false);
    };

    var UpdateProject = function (projectDC) {
        var api = "Project/Update";
        return Globals.Post(api, projectDC, true);
    };

    var CreateProject = function (projectDC) {
        var api = "Project/Insert";
        return Globals.Post(api, projectDC, true);
    };
    return {
        CreateProject: CreateProject,
        RetrieveProject: RetrieveProject,
        UpdateProject: UpdateProject
    };
}]);