angular.module('HylanApp').factory('PermitDashboardService', ['DataContext', 'Utility', 'NOTIFYTYPE', 'AppConfig', '$rootScope', 'hylanCache',
     function (DataContext, Utility, NOTIFYTYPE, AppConfig, $rootScope, hylanCache) {
         var apiControllerName = "Permits";
         var schema =
         {
             model: {
                 id: "PERMIT_ID",
                 fields: {
                     ROW_HEADER: { editable: false },
                     PERMIT_ID: { title: "PERMIT ID",type:'number', editable: false },
                     PROJECT_ID: { title: "PROJECT ID", type: 'number', editable: false },
                     JOB_ID: { title: "JOB_ID", type: 'number', editable: false },

                     HYLAN_PROJECT_ID: { title: "HYLAN PROJECT ID", editable: false },
                     JOB_FILE_NUMBER: { title: "JOB FILE NUMBER", editable: false },
                     CLIENT: { title: "CLIENT", editable: false },

                     POLE_LOCATION: { title: "POLE LOCATION", editable: false },
                     PERMIT_NUMBER_TEXT: { title: "PERMIT NUMBER TEXT", editable: false },
                     DOT_TRACKING_NUMBER: { title: "DOT TRACKING NUMBER", editable: false },
                     SEGMENT: { title: "SEGMENT", editable: false },                     
                     
                     SUBMITTED_DATE: { title: "SUBMITTED DATE", editable: false, type: 'date' },
                     ISSUED_DATE: { title: "ISSUED DATE", editable: false, type: 'date' },
                     VALID_DATE: { title: "VALID DATE", editable: false, type: 'date' },
                     EXPIRES_DATE: { title: "EXPIRES DATE", editable: false, type: 'date' },
                     REJECTED_DATE: { title: "REJECTED DATE", editable: false, type: 'date' },

                     PENDING_STATUS: { title: "PENDING_STATUS", editable: false },
                     ACTIVE_STATUS: { title: "ACTIVE_STATUS", editable: false },
                     EXPIRED_STATUS: { title: "EXPIRED_STATUS", editable: false },
                     EXPIRING_5DAYS_STATUS: { title: "EXPIRING_5DAYS_STATUS", editable: false },
                     ON_HOLD_STATUS: { title: "ON_HOLD_STATUS", editable: false },
                     REQUEST_EXTENSION_STATUS: { title: "REQUEST_EXTENSION_STATUS", editable: false },
                     REQUEST_RENEWAL_STATUS: { title: "REQUEST_RENEWAL_STATUS", editable: false },                     
                     REJECTED_STATUS: { title: "REJECTED_STATUS", editable: false },

                     STIPULATION_DAY1: { title: "STIPULATION DAY1", editable: false },
                     STIPULATION_NIGHT1: { title: "STIPULATION NIGHT1", editable: false },
                     STIPULATION_WEEKEND1: { title: "STIPULATION WEEKEND1", editable: false },
                     STIPULATIONS_OTHER: { title: "STIPULATIONS OTHER", editable: false },
                     IS_PROTECTED_STREET1: { title: "IS PROTECTED STREET1", editable: false }

                 }
             }
             ,
             group: [{ field: "HYLAN_PROJECT_ID", aggregate: "sum" }],
         };

         var aggs = [];
         //    [
         // { field: "PENDING_STATUS", aggregate: "count" },
         //    { field: "ACTIVE_STATUS", aggregate: "count" },
         //  { field: "EXPIRED_STATUS", aggregate: "count" },
         //  { field: "EXPIRING_5DAYS_STATUS", aggregate: "count" },
         //  { field: "ON_HOLD_STATUS", aggregate: "count" },
         //  { field: "REQUEST_EXTENSION_STATUS", aggregate: "count" },
         //  { field: "REQUEST_RENEWAL_STATUS", aggregate: "count" },
         //  { field: "REJECTED_STATUS", aggregate: "count" }
         //];

         var groups = [{
             id: "General", title: "General", isChecked: true,
             columns: [{ name: "HYLAN_PROJECT_ID" }, { name: "JOB_FILE_NUMBER" }, { name: "CLIENT" }]
         },
         {
             id: "Continuity", title: "Continuity", isChecked: true,
             columns: [{ name: "POLE_LOCATION" }, { name: "PERMIT_NUMBER_TEXT" }, { name: "DOT_TRACKING_NUMBER" }, { name: "SEGMENT" }]
         },
         {
             id: "Dates", title: "Dates", isChecked: true,
             columns: [
                 { name: "SUBMITTED_DATE" }, { name: "ISSUED_DATE" }, { name: "VALID_DATE" }, { name: "EXPIRES_DATE" }, { name: "REJECTED_DATE" }
             ]
         },
         {
             id: "PermitStatus", title: "Permit Status", isChecked: true,
             columns: [{ name: "EXPIRED_STATUS" }, { name: "EXPIRING_5DAYS_STATUS" }, { name: "ON_HOLD_STATUS" }
                 , { name: "REQUEST_EXTENSION_STATUS" }, { name: "REQUEST_RENEWAL_STATUS" }, { name: "PENDING_STATUS" }
                 , { name: "REJECTED_STATUS" }
             ]
         },
         {
             id: "Stipulations", title: "Stipulations", isChecked: true,
             columns: [
                     { name: "STIPULATION_DAY1" }, { name: "STIPULATION_NIGHT1" }, { name: "STIPULATION_WEEKEND1" }
                     ,{ name: "STIPULATIONS_OTHER" }, { name: "IS_PROTECTED_STREET1" }
             ]
         },
         { id: "All", title: "All", isChecked: true }];



         var defaultSort = {
             field: "HYLAN_PROJECT_ID",
             dir: "asc"
         };
             
       
         var deleteJobs = function (list) {
           var api = "Permits/Delete";
           return Globals.Post(api, JSON.stringify(list),true); //true = a sync 
         };

         var getParams = function () {
             objParams = { projectIDs: 'All', clientIDs: 'All', submitedStartDt: 'All', submitedEndDt: 'All' };

             var selectedProjectsList = hylanCache.GetValue(hylanCache.Keys.PROJECTS);
             if (selectedProjectsList == undefined) selectedProjectsList = hylanCache.GetValue(hylanCache.Keys.LATEST_PROJECTS, Globals.Screens.MANAGE_JOBS.ID);

             if (selectedProjectsList && selectedProjectsList.length > 0) objParams.projectIDs = getIDFromList(selectedProjectsList, 'PROJECT_ID');
             
             var selectedClientList = hylanCache.GetValue(hylanCache.Keys.CLIENTS);
             if (selectedClientList && selectedClientList.length > 0) objParams.clientIDs = getIDFromList(selectedClientList, 'COMPANY_ID');

             var startDate = hylanCache.GetValue(hylanCache.Keys.START_DATE, Globals.Screens.PERMIT_DASHBOARD.ID);
             if (startDate && startDate != '' && startDate != "__/__/____") objParams.submitedStartDt = startDate

             var endDate = hylanCache.GetValue(hylanCache.Keys.END_DATE, Globals.Screens.PERMIT_DASHBOARD.ID);
             if (endDate && endDate != '' && endDate != "__/__/____") objParams.submitedEndDt = endDate

             return objParams;
         }

         var GetAll = function (options) {
             var params = getParams();
             $.ajax({
                 url: AppConfig.ApiUrl + "/" + apiControllerName + "/GetDashboard",
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
         
         var dataSource = DataContext.CreateDataSource(apiControllerName, schema, aggs, null, null, defaultSort);
         dataSource.transport.read = GetAll;


         var GetAllProjects = function () {
             objParams = { clientIDs: 'All' };
             var selectedClientList = hylanCache.GetValue(hylanCache.Keys.CLIENTS);
             if (selectedClientList && selectedClientList.length > 0) objParams.clientIDs = getIDFromList(selectedClientList, 'COMPANY_ID');

             var api = "Project/GetAll";
             return Globals.Get(api, objParams, false);
         };

         return {
             dataSource: dataSource,
             defaultSort: defaultSort,
             deleteJobs: deleteJobs,
             groups: groups,
             GetAllProjects: GetAllProjects
         };
     }]);