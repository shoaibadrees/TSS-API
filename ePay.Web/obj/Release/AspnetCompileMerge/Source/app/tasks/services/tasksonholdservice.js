angular.module('HylanApp').factory('TaskOnHoldService', ['DataContext', 'Utility', 'NOTIFYTYPE', 'AppConfig', '$rootScope', 'hylanCache',
     function (DataContext, Utility, NOTIFYTYPE, AppConfig, $rootScope, hylanCache) {
         var api_resource = "Tasks";
         var columns = {};
         var defaultSort = {
             field: "HYLAN_PROJECT_ID",
             dir: "asc"
         };
         var onHoldReasonFields = [];
         var aggs = []; // Will be populated dynamically
         Globals.GetLookUp(Globals.LookUpTypes.TASK_HOLD_REASON, false, function (result) {
             $.each(result, function (lu_Ind, lu) {
                 if (lu.LU_NAME != "Not On-Hold") {
                     var columnName = lu.LU_NAME.replace(/ /g, "_").toUpperCase();
                     var aggCol = { field: columnName, aggregate: "sum" };
                     aggs.push(aggCol);
                     onHoldReasonFields.push({ field: columnName, title: lu.LU_NAME });
                 }
             });
         });
         


         var getParams = function () {
             objParams = { projectIDs: 'All', jfnIDs: 'All', jobStatusIDS: 'All', taskNames: 'All', tmDate: FormatDate(new Date()) };

             var selectedProjectsList = hylanCache.GetValue(hylanCache.Keys.PROJECTS);

             if (selectedProjectsList == undefined)
                 selectedProjectsList = hylanCache.GetValue(hylanCache.Keys.LATEST_PROJECTS, Globals.Screens.TASK_ON_HOLD.ID);

             var selectedJFNList = hylanCache.GetValue(hylanCache.Keys.JOB_FILE_NUMBER, Globals.Screens.TASK_ON_HOLD.ID);
             var selectedJobStatusList = hylanCache.GetValue(hylanCache.Keys.JOB_STATUS, Globals.Screens.TASK_ON_HOLD.ID);
             var selectedTaskNamesList = hylanCache.GetValue(hylanCache.Keys.TASK_NAME, Globals.Screens.TASK_ON_HOLD.ID);
             var selectedDate = hylanCache.GetValue(hylanCache.Keys.TM_DATE, Globals.Screens.TASK_ON_HOLD.ID);

             if (selectedProjectsList && selectedProjectsList.length > 0)
                 objParams.projectIDs = getIDFromList(selectedProjectsList, 'PROJECT_ID');

             if (selectedJFNList && selectedJFNList.length > 0)
                 objParams.jfnIDs = getIDFromList(selectedJFNList, 'TEXT');

             if (selectedJobStatusList && selectedJobStatusList.length > 0)
                 objParams.jobStatusIDS = getIDFromList(selectedJobStatusList, 'LOOK_UP_ID');

             if (selectedTaskNamesList && selectedTaskNamesList.length > 0)
                 objParams.taskNames = getIDFromList(selectedTaskNamesList, 'LOOK_UP_ID');

             if (selectedDate && selectedDate != "")
                 objParams.tmDate = selectedDate;

             return objParams;
         }

         var GetAll = function (options) {
             var params = getParams();
             $.ajax({
                 url: AppConfig.ApiUrl + "/" + api_resource + "/GetOnHold",
                 dataType: "json",
                 data: params,
                 cache: false,
                 headers: {
                     "Authorization": "UserID" + $rootScope.currentUser.USER_ID
                 },
                 success: function (result, textStatus, xhr) {
                     $rootScope.lastServerDateTime = xhr.getResponseHeader('X-LastServerDateTime');
                     var resultJson = "";
                     if (result.objResultList && result.objResultList.length > 0) {
                         resultJson = JSON.stringify(result.objResultList);
                         $.each(result.objResultList, function (taskIndex, task) {
                             if (task.ON_HOLD_REASONS) {
                                 $.each(task.ON_HOLD_REASONS, function (reasonIndex, reason) {
                                     if (reason.TEXT != "ON_HOLD_REASON_OTHER") {
                                         task[reason.TEXT] = reason.VALUE;
                                     }
                                     else
                                         task[reason.TEXT] = reason.TEXT2;
                                 });
                             }
                         });
                     }

                     options.success(result.objResultList);
                 },
                 error: function (XMLHttpRequest, textStatus, errorThrown) {
                     var exception = XMLHttpRequest.responseText ? XMLHttpRequest.responseText : errorThrown;
                     Utility.Notify({ type: NOTIFYTYPE.ERROR, message: exception });
                 }
             });

         };
         
         var dataSource = DataContext.CreateDataSource(api_resource, columns, aggs, null, null, defaultSort);
         dataSource.transport.read = GetAll;
         dataSource.transport.read.cache = false;

         return {
             dataSource: dataSource,
             defaultSort: defaultSort,
             onHoldReasonFields: onHoldReasonFields
         };

     }]);