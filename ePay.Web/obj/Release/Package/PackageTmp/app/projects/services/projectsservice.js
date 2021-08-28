angular.module('HylanApp').factory('ProjectsService', ['DataContext', 'Utility', 'NOTIFYTYPE', 'AppConfig', '$rootScope', 'hylanCache',
     function (DataContext, Utility, NOTIFYTYPE, AppConfig, $rootScope, hylanCache) {
         var resource = "Project";
         var schema = {
             model: {
                 id: "PROJECT_ID",
                 fields: {
                     ROW_HEADER: { editable: false },
                     PROJECT_ID: {},
                     HYLAN_JOB_NUMBER: {},
                     JOBS: {type: "string"},
                     PROJECT_BID_NAME: {},
                     CLIENT: {},
                     CLIENT_NAME: {},
                     PROJECT_STATUS: {},
                     TENTATIVE_PROJECT_START_DATE: { type: "date"},
                     ACTUAL_PROJECT_START_DATE: { type: "date" },
                     PROJECTED_END_DATE: { type: "date" },
                     ACTUAL_PROJECT_CLOSE_DATE: { type: "date" },
                     PROJECT_BID_DATE: { type: "date" },
                     PROJECT_AWARDED: { type: "date" },
                     BID_DOCUMENTS: {type: "string"},
                     NOTES: {},
                     PO_NUMBER: {}
                 }
             }
         };

         var defaultSort = {
             field: "HYLAN_PROJECT_ID",
             dir: "asc"
         };

         var getParams = function () {
             objParams = { clientIDs: 'All', projectStatusIDs : 'All' };

             var selectedClientList = hylanCache.GetValue(hylanCache.Keys.CLIENTS, Globals.Screens.MANAGE_PROJECTS.ID);
             var selectedProjectStatusList = hylanCache.GetValue(hylanCache.Keys.PROJECT_STATUS, Globals.Screens.MANAGE_PROJECTS.ID);
             
             if (selectedClientList && selectedClientList.length > 0) objParams.clientIDs = getIDFromList(selectedClientList, 'COMPANY_ID');
             if (selectedProjectStatusList && selectedProjectStatusList.length > 0) objParams.projectStatusIDs = getIDFromList(selectedProjectStatusList, 'LOOK_UP_ID');

             return objParams;
         }

         var GetAll = function (options) {
             var params = getParams();
             $.ajax({
                 url: AppConfig.ApiUrl + "/" + resource + "/GetAll",
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
                     //hilightEnteredRow();
                 },
                 error: function (XMLHttpRequest, textStatus, errorThrown) {
                     var exception = XMLHttpRequest.responseText ? XMLHttpRequest.responseText : errorThrown;
                     Utility.Notify({ type: NOTIFYTYPE.ERROR, message: exception });
                 }
             });

         };

         var datasource = DataContext.CreateDataSource(resource, schema, null, null, null, defaultSort);
         datasource.transport.read = GetAll;

         return {
             //ResetPassword: ResetPassword,
             dataSource: datasource,
             defaultSort: defaultSort
         };
     }]);