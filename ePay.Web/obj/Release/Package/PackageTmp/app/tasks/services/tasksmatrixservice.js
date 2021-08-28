angular.module('HylanApp').factory('TaskMatrixService', ['DataContext', 'Utility', 'NOTIFYTYPE', 'AppConfig', '$rootScope', 'hylanCache',
     function (DataContext, Utility, NOTIFYTYPE, AppConfig, $rootScope, hylanCache) {
         var api_resource = "Tasks";
         var columns =
         {
             model: {
                 id: "JOB_ID",
                 fields: {
                     ROW_HEADER: { editable: false },
                     JOB_ID: { title: "Job ID", editable: false },
                     PROJECT_ID: { title: "Project_ID", editable: false },

                     HYLAN_PROJECT_ID: { type: "string", editable: false },
                     JOB_FILE_NUMBER: { type: "string", editable: false },
                     CLIENT_NAME: { type: "string", editable: false },
                     NEEDED_TASKS_COUNT: { title: "TASKS", editable: false },

                     CTZ_STATUS: {  editable: false },
                     FDW_STATUS: {  editable: false },
                     PLW_STATUS: {  editable: false },
                     FBD_STATUS: {  editable: false },
                     PWD_STATUS: {  editable: false },
                     UGM_STATUS: {  editable: false },
                     FBP_STATUS: {  editable: false },
                     FBS_STATUS: {  editable: false },
                     APP_STATUS: {  editable: false },
                     SRA_STATUS: {  editable: false },
                     PMS_STATUS: {  editable: false }
                 }
             },
             group: [{ field: "HYLAN_PROJECT_ID" }],
         };
         var defaultSort = {
             field: "HYLAN_PROJECT_ID",
             dir: "asc"
         };
         var aggs = [{title: "Continuity to Zero M/H", field: "CTZ_STATUS", aggregate: "count" },
           { title: "Foundation Work", field: "FDW_STATUS", aggregate: "count" },
           { title: "Pole Work", field: "PLW_STATUS", aggregate: "count" },
           { title: "Fiber Dig", field: "FBD_STATUS", aggregate: "count" },
           { title: "Power Dig", field: "PWD_STATUS", aggregate: "count" },
           { title: "Underground Misc.", field: "UGM_STATUS", aggregate: "count" },
           { title: "Fiber Pull", field: "FBP_STATUS", aggregate: "count" },
           { title: "Fiber Splicing", field: "FBS_STATUS", aggregate: "count" },
           { title: "AC Power To Pole", field: "APP_STATUS", aggregate: "count" },
           { title: "Shroud/Antenna", field: "SRA_STATUS", aggregate: "count" },
           { title: "PIM'S & Sweeps", field: "PMS_STATUS", aggregate: "count" }
         ];
         var getParams = function () {
             objParams = { projectIDs: 'All', jfnIDs: 'All', jobStatusIDS: 'All', taskStatusIDs: 'All', tmDate: FormatDate(new Date()) };

             var selectedProjectsList = hylanCache.GetValue(hylanCache.Keys.PROJECTS);

             if (selectedProjectsList == undefined)
                 selectedProjectsList = hylanCache.GetValue(hylanCache.Keys.LATEST_PROJECTS, Globals.Screens.TASK_MATRIX.ID);

             var selectedJFNList = hylanCache.GetValue(hylanCache.Keys.JOB_FILE_NUMBER, Globals.Screens.TASK_MATRIX.ID);
             var selectedJobStatusList = hylanCache.GetValue(hylanCache.Keys.JOB_STATUS, Globals.Screens.TASK_MATRIX.ID);
             var selectedTaskStatusList = hylanCache.GetValue(hylanCache.Keys.TASK_STATUS, Globals.Screens.TASK_MATRIX.ID);
             var selectedDate = hylanCache.GetValue(hylanCache.Keys.TM_DATE, Globals.Screens.TASK_MATRIX.ID);

             if (selectedProjectsList && selectedProjectsList.length > 0)
                 objParams.projectIDs = getIDFromList(selectedProjectsList, 'PROJECT_ID');

             if (selectedJFNList && selectedJFNList.length > 0)
                 objParams.jfnIDs = getIDFromList(selectedJFNList, 'TEXT');

             if (selectedJobStatusList && selectedJobStatusList.length > 0)
                 objParams.jobStatusIDS = getIDFromList(selectedJobStatusList, 'LOOK_UP_ID');

             if (selectedTaskStatusList && selectedTaskStatusList.length > 0)
                 objParams.taskStatusIDs = getIDFromList(selectedTaskStatusList, 'LOOK_UP_ID');

             if (selectedDate && selectedDate != "")
                 objParams.tmDate = selectedDate;

             return objParams;
         }

         var GetAll = function (options) {
             var params = getParams();
             $.ajax({
                 url: AppConfig.ApiUrl + "/" + api_resource + "/GetMatrix",
                 dataType: "json",
                 data: params,
                 cache: false,
                 headers: {
                     "Authorization": "UserID" + $rootScope.currentUser.USER_ID
                 },
                 success: function (result, textStatus, xhr) {
                     $rootScope.lastServerDateTime = xhr.getResponseHeader('X-LastServerDateTime');
                     options.success(result.objResultList);
                     isDataChanged = false;
                     isDublicateCompany = false;
                 },
                 error: function (XMLHttpRequest, textStatus, errorThrown) {
                     var exception = XMLHttpRequest.responseText ? XMLHttpRequest.responseText : errorThrown;
                     Utility.Notify({ type: NOTIFYTYPE.ERROR, message: exception });
                 }
             });

         };
         var dataSource = DataContext.CreateDataSource(api_resource, columns, null, null, null, defaultSort);
         dataSource.transport.read = GetAll;

         return {
             dataSource: dataSource,
             defaultSort: defaultSort,
             aggs: aggs
         };

     }]);