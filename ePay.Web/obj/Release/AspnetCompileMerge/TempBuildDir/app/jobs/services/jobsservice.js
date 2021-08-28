angular.module('HylanApp').factory('JobsService', ['DataContext', 'Utility', 'NOTIFYTYPE', 'AppConfig', '$rootScope', 'hylanCache',
     function (DataContext, Utility, NOTIFYTYPE, AppConfig, $rootScope, hylanCache) {
         var apiControllerName = "Jobs";
         var schema =
         {
             model: {
                 id: "JOB_ID",
                 fields: {
                     ROW_HEADER: { editable: false },
                     JOB_ID: { title: "Job ID", editable: false },
                     PROJECT_ID: { title: "Project ID", editable: false },
                     HYLAN_PROJECT_ID: { title: "Project ID", editable: false },
                     JOB_FILE_NUMBER: { title: "Job File Number", editable: false },
                     NODE_ID1: { title: "Node ID 1", editable: false },
                     NODE_ID2: { title: "Node ID 2", editable: false },
                     NODE_ID3: { title: "Node ID 3", editable: false },
                     HUB: { title: "HUB", editable: false },
                     HYLAN_PM: { title: "Hylan PM", editable: false },
                     STREET_ADDRESS: { title: "Street Address", editable: false },
                     CITY: { title: "City", editable: false },
                     STATE: { title: "State", editable: false },
                     ZIP: { title: "Zip", editable: false },
                     LAT: { title: "Lat", editable: false },
                     LONG: { title: "Long", editable: false },
                     POLE_LOCATION: { title: "Pole Location", editable: false },
                     DOITT_NTP_STATUS: { title: "DOITT NTP Status", editable: false },
                     DOITT_NTP_GRANTED_DATE: { type:  "date", title: "DOITT NTP Granted Date", editable: false },
                     JOB_CATEGORY: { title: "Job Category", editable: false },
                     JOB_STATUS: { title: "Job Status", editable: false },
                     ON_HOLD_REASON: { title: "On-Hold Reason", editable: false },
                     CLIENT_PM: { title: "Client PM", editable: false },
                     JOB_NOTES: { title: "Job Notes", editable: false },
                     NUMBER_OF_SUBMITTED_PERMITS: { title: "Number of Submitted Permits", editable: false, type: "number" },
                     PERMIT_NOTES: { title: "Permit Notes", editable: false },
                     PUNCHLIST_COMPLETE: { title: "Punchlist Complete", editable: false },
                     PUNCHLIST_SUBMITTED_DATE: { type: "date", title: "Punchlist Submitted Date", editable: false },
                     CLIENT_APPROVAL_DATE: { type: "date", title: "Client Approval Date", editable: false },
                     PRIORITY: { title: "Priority", editable: false },
                     CREATED_BY: { title: "CREATED_BY", editable: false },
                     CREATED_ON: {type:  "date", title: "CREATED_ON", editable: false },
                     MODIFIED_BY: { title: "MODIFIED_BY", editable: false },
                     MODIFIED_ON: { type: "date", title: "MODIFIED_ON", editable: false },
                     LOCK_COUNTER: { title: "LOCK_COUNTER", editable: false },
                     INVOICE_DATE: { type: "date", title: "Invoice Date", editable: false },

                     JOB_STATUS_LU: { title: "Job Status", defaultValue: { LU_NAME: "" } },
                     JOB_CATEGORY_LU: { title: "Job Category", defaultValue: { LU_NAME: "" } },
                     DOITT_NTP_STATUS_LU: { title: "DOITT NTP Status", defaultValue: { LU_NAME: "" } },
                     NEEDED_TASKS_COUNT: { title: "TASKS", editable: false , type:"number"},

                     PERMITS_COUNT: { title: "Total Permits", editable: false, type: "number"},
                     ACTIVE_COUNT: { title: "ACTIVE", editable: false, type: "number" },
                     EXPIRED_COUNT: { title: "EXPIRED", editable: false, type: "number" },
                     EXPIRING_FIVEDAYS_COUNT: { title: "EXPIRING_5DAYS_COUNT", editable: false, type: "number" },
                     ON_HOLD_COUNT: { title: "ON_HOLD", editable: false, type: "number" },
                     REQUEST_EXTENSION_COUNT: { title: "REQUEST EXTENSION", editable: false, type: "number" },
                     REQUEST_RENEWAL_COUNT: { title: "REQUEST", editable: false, type: "number" },
                     PENDING_COUNT: { title: "PENDING", editable: false, type: "number" },
                     REJECTED_COUNT: { title: "REJECTED", editable: false, type: "number" }
                 }
             }
         };

         var aggs = [{ field: "NEEDED_TASKS_COUNT", aggregate: "sum" },             
             { field: "PermitsSummary.PERMITS_COUNT", aggregate: "sum" },
                        { field: "PermitsSummary.ACTIVE_COUNT", aggregate: "sum" },
                        { field: "PermitsSummary.EXPIRED_COUNT", aggregate: "sum" },
                        { field: "PermitsSummary.EXPIRING_5DAYS_COUNT", aggregate: "sum" },
                        { field: "PermitsSummary.ON_HOLD_COUNT", aggregate: "sum" },
                        { field: "PermitsSummary.REQUEST_EXTENSION_COUNT", aggregate: "sum" },
                        { field: "PermitsSummary.REQUEST_RENEWAL_COUNT", aggregate: "sum" },
                        { field: "PermitsSummary.PENDING_COUNT", aggregate: "sum" },
                        { field: "PermitsSummary.REJECTED_COUNT", aggregate: "sum" }, 
                        { field: "NUMBER_OF_SUBMITTED_PERMITS", aggregate: "sum" }
         ];

         var defaultSort = {
             field: "HYLAN_PROJECT_ID",
             dir: "asc"
         };
             
       
         var deleteJobs = function (list) {
           var api = "Jobs/Delete";
           return Globals.Post(api, JSON.stringify(list),true); //true = a sync 
         };

         var GetAllJobs = function (options) {
             $.ajax({
                 url: AppConfig.ApiUrl + "/" + apiControllerName + "/GetAll",
                 dataType: "json",
                 data: options.data,
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

         var getParams = function () {             
             objParams = { projectIDs: 'All', doITTNTPStatusIDs: 'All', jobCategoriesIDs: 'All', jobStatusIDs: 'All',clientIDs: 'All' };

             var selectedProjectsList = hylanCache.GetValue(hylanCache.Keys.PROJECTS);
             if (selectedProjectsList == undefined) selectedProjectsList = hylanCache.GetValue(hylanCache.Keys.LATEST_PROJECTS, Globals.Screens.MANAGE_JOBS.ID);

             var selectedJobStatusList = hylanCache.GetValue(hylanCache.Keys.JOB_STATUS, Globals.Screens.MANAGE_JOBS.ID);
             var selectedDOITTNTPStatusList = hylanCache.GetValue(hylanCache.Keys.DOITT_NTP_STATUS, Globals.Screens.MANAGE_JOBS.ID);
             var selectedJobCategoryList = hylanCache.GetValue(hylanCache.Keys.JOB_CATEGORY, Globals.Screens.MANAGE_JOBS.ID);
             var selectedClientsList = hylanCache.GetValue(hylanCache.Keys.CLIENTS, Globals.Screens.MANAGE_JOBS.ID);

             if (selectedProjectsList && selectedProjectsList.length>0 ) objParams.projectIDs = getIDFromList(selectedProjectsList, 'PROJECT_ID');
             if (selectedDOITTNTPStatusList && selectedDOITTNTPStatusList.length > 0) objParams.doITTNTPStatusIDs = getIDFromList(selectedDOITTNTPStatusList, 'LOOK_UP_ID');
             if (selectedJobCategoryList && selectedJobCategoryList.length>0) objParams.jobCategoriesIDs = getIDFromList(selectedJobCategoryList, 'LOOK_UP_ID');
             if (selectedJobStatusList && selectedJobStatusList.length > 0) objParams.jobStatusIDs = getIDFromList(selectedJobStatusList, 'LOOK_UP_ID');
             if (selectedClientsList && selectedClientsList.length > 0) objParams.clientIDs = getIDFromList(selectedClientsList, 'COMPANY_ID');

             return objParams;
         }

         var RetrieveJobByFilters = function (options) {
             var params = getParams();
             $.ajax({
                 url: AppConfig.ApiUrl + "/" + apiControllerName + "/GetByFilters",
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
         
         dataSource.transport.read = RetrieveJobByFilters;
         dataSource.transport.read.cache = false;
         //dataSource.transport.update.cache = false;
         

         return {
             dataSource: dataSource,
             defaultSort: defaultSort,
             deleteJobs: deleteJobs,
             RetrieveJobByFilters: RetrieveJobByFilters
         };
     }]);