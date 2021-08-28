angular.module('HylanApp').factory('TaskService', ['DataContext', function (DataContext) {
    var RetrieveTasks = function (TASK_TITLE_ID, JOB_ID, asyn) {
        var api = "Tasks/Get";
        var params = { TASK_TITLE_ID: TASK_TITLE_ID, JOB_ID: JOB_ID };
        return Globals.Get(api, params, asyn);
    };

    var InsertUpdateTasks = function (hylanTaskList, asyn) {
        var api = "Tasks/InsertUpdateTasks";
        return Globals.Post(api, hylanTaskList, asyn);
    };

    return {
        RetrieveTasks: RetrieveTasks,
        InsertUpdateTasks: InsertUpdateTasks
    };
}]);