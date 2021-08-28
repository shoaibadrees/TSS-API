angular.module('HylanApp').factory('TaskRosterService', ['DataContext', 'Utility', 'NOTIFYTYPE', 'AppConfig', '$rootScope', 'hylanCache',
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
             TOTAL_TASKS: { type: "number", editable: false },

             CTZ_REQUIRED: { type: "boolean", editable: false },
             CTZ_FORECAST_DATE: { type: "date", editable: false },
             CTZ_ACT_COMPLETION_DATE: { type: "date", editable: false },
             CTZ_PARTY_RESPONSIBLE: { editable: false },
             CTZ_NOTES: { editable: false },

             FDW_REQUIRED: { type: "boolean", editable: false },
             FDW_TYPE: { editable: false },
             FWD_FORECAST_START_DATE: { type: "date", editable: false },
             FDW_ACT_START_DATE: { type: "date", editable: false },
             FDW_ACT_COMPLETION_DATE: { type: "date", editable: false },
             FDW_CONED_TICKET_NUMBER: { editable: false },
             FDW_ON_HOLD_REASON: { editable: false },
             FDW_ON_HOLD_OTHER: { editable: false },
             FDW_NOTES: { editable: false },

             PLW_REQUIRED: { type: "boolean", editable: false },
             PLW_TYPE: { editable: false },
             PLW_FORECAST_START_DATE: { type: "date", editable: false },
             PLW_ACT_START_DATE: { type: "date", editable: false },
             PLW_ACT_COMPLETION_DATE: { type: "date", editable: false },
             PLW_ON_HOLD_REASON: { editable: false },
             PLW_ON_HOLD_OTHER: { editable: false },
             PLW_NOTES: { editable: false },

             FBD_REQUIRED: { type: "boolean", editable: false },
             FBD_TYPE: { editable: false },
             FBD_FORECAST_START_DATE: { type: "date", editable: false },
             FBD_ACT_START_DATE: { type: "date", editable: false },
             FBD_ACT_COMPLETION_DATE: { type: "date", editable: false },
             FBD_EST_LENGTH: { type: "number", editable: false },
             FBD_ACT_LENGTH: { type: "number", editable: false },
             FBD_ON_HOLD_REASON: { editable: false },
             FBD_ON_HOLD_OTHER: { editable: false },
             FBD_NOTES: { editable: false },
             FBD_VAULT: { editable: false },

             PWD_REQUIRED: { type: "boolean", editable: false },
             PWD_FORECAST_START_DATE: { type: "date", editable: false },
             PWD_ACT_START_DATE: { type: "date", editable: false },
             PWD_ACT_COMPLETION_DATE: { type: "date", editable: false },
             PWD_EST_LENGTH: { type: "number", editable: false },
             PWD_ACT_LENGTH: { type: "number", editable: false },
             PWD_ON_HOLD_REASON: { editable: false },
             PWD_ON_HOLD_OTHER: { editable: false },
             PWD_NOTES: { editable: false },

             UGM_REQUIRED: { type: "boolean", editable: false },
             UGM_ACT_COMPLETION_DATE: { type: "date", editable: false },
             UGM_ON_HOLD_REASON: { editable: false },
             UGM_ON_HOLD_OTHER: { editable: false },
             UGM_NOTES: { editable: false },

             FBP_REQUIRED: { type: "boolean", editable: false },
             FBP_TYPE: { editable: false },
             FBP_Lateral_Node_Tail: { editable: false },
             FBP_ACT_COMPLETION_DATE: { type: "date", editable: false },
             FBP_ON_HOLD_REASON: { editable: false },
             FBP_ON_HOLD_OTHER: { editable: false },
             FBP_NOTES: { editable: false },

             FBS_REQUIRED: { type: "boolean", editable: false },
             FBS_TYPE: { editable: false },
             FBS_ACT_COMPLETION_DATE: { type: "date", editable: false },
             FBS_ON_HOLD_REASON: { editable: false },
             FBS_ON_HOLD_OTHER: { editable: false },
             FBS_NOTES: { editable: false },
             FBS_LIGHT_TEST_CLIENT_DATE: { type: "date", editable: false },

             APP_REQUIRED: { type: "boolean", editable: false },
             APP_ACT_COMPLETION_DATE: { type: "date", editable: false },
             APP_ON_HOLD_REASON: { editable: false },
             APP_ON_HOLD_OTHER: { editable: false },
             APP_NOTES: { editable: false },

             SRA_REQUIRED: { type: "boolean", editable: false },
             SRA_FORECAST_START_DATE: { type: "date", editable: false },
             SRA_ACT_COMPLETION_DATE: { type: "date", editable: false },
             SRA_SHROUD_INSTALLED: { type: "boolean", editable: false },
             SRA_ANTENA_INSTALLED: { type: "boolean", editable: false },
             SRA_SHROUD_SERIAL_NUMBER: { editable: false },
             SRA_ION_SERIAL_NUMBER: { editable: false },
             SRA_ON_HOLD_REASON: { editable: false },
             SRA_ON_HOLD_OTHER: { editable: false },
             SRA_NOTES: { editable: false },

             PMS_REQUIRED: { type: "boolean", editable: false },
             PMS_ACT_COMPLETION_DATE: { type: "date", editable: false },
             PMS_SUBMITTED_DATE: { type: "date", editable: false },
             PMS_CLIENT_APPROVAL_DATE: { type: "date", editable: false },
             PMS_ON_HOLD_REASON: { editable: false },
             PMS_ON_HOLD_OTHER: { editable: false },
             PMS_NOTES: { editable: false },

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
             DOITT_NTP_STATUS_NAME: { title: "DOITT NTP Status", editable: false },
             DOITT_NTP_GRANTED_DATE: { type: "date", title: "DOITT NTP Granted Date", editable: false },
             JOB_CATEGORY_NAME: { title: "Job Category", editable: false },
             JOB_STATUS_NAME: { title: "Job Status", editable: false },
             ON_HOLD_REASON: { title: "On-Hold Reason", editable: false },
             CLIENT_PM: { title: "Client PM", editable: false },
             JOB_NOTES: { title: "Job Notes", editable: false },
             NUMBER_OF_SUBMITTED_PERMITS: { title: "Number of Submitted Permits", editable: false },
             PERMIT_NOTES: { title: "Permit Notes", editable: false },
             PUNCHLIST_COMPLETE: { title: "Punchlist Complete", editable: false },
             PUNCHLIST_SUBMITTED_DATE: { type: "date", title: "Punchlist Submitted Date", editable: false },
             CLIENT_APPROVAL_DATE: { type: "date", title: "Client Approval Date", editable: false },
             NOTES_COUNT: { title: "Total Notes", editable: false },
             NOTES_DATE: { type: "date", title: "Latest Notes Date", editable: false },

             PERMITS_COUNT: { title: "Total Permits", editable: false, type: "number" },
             ACTIVE_COUNT: { title: "ACTIVE", editable: false, type: "number" },
             EXPIRED_COUNT: { title: "EXPIRED", editable: false, type: "number" },
             EXPIRING_5DAYS_COUNT: { title: "EXPIRING_5DAYS_COUNT", editable: false, type: "number" },
             ON_HOLD_COUNT: { title: "ON_HOLD", editable: false, type: "number" },
             REQUEST_EXTENSION_COUNT: { title: "REQUEST EXTENSION", editable: false, type: "number" },
             REQUEST_RENEWAL_COUNT: { title: "REQUEST", editable: false, type: "number" },
             PENDING_COUNT: { title: "PENDING", editable: false, type: "number" },
             REJECTED_COUNT: { title: "REJECTED", editable: false, type: "number" }
           }
         },
         group: [{ field: "HYLAN_PROJECT_ID", aggregate: "sum" }],
       };

       var aggs = [{ field: "TOTAL_TASKS", aggregate: "sum" },
           //{ field: "FBD_EST_LENGTH", aggregate: "sum" },
           //{ field: "FBD_ACT_LENGTH", aggregate: "sum" },
           //{ field: "PWD_EST_LENGTH", aggregate: "sum" },
           //{ field: "PWD_ACT_LENGTH", aggregate: "sum" },
           { field: "NUMBER_OF_SUBMITTED_PERMITS", aggregate: "sum" },
            { field: "PERMITS_COUNT", aggregate: "sum" },
            { field: "ACTIVE_COUNT", aggregate: "sum" },
            { field: "EXPIRED_COUNT", aggregate: "sum" },
            { field: "EXPIRING_5DAYS_COUNT", aggregate: "sum" },
            { field: "ON_HOLD_COUNT", aggregate: "sum" },
            { field: "REQUEST_EXTENSION_COUNT", aggregate: "sum" },
            { field: "REQUEST_RENEWAL_COUNT", aggregate: "sum" },
            { field: "PENDING_COUNT", aggregate: "sum" },
            { field: "REJECTED_COUNT", aggregate: "sum" }
       ];

       var groups = [{
         id: "General", title: "General", isChecked: true,
         columns: [{ name: "HYLAN_PROJECT_ID" }, { name: "JOB_FILE_NUMBER" }, { name: "TOTAL_TASKS" }]
       },
         {
           id: "Continuity", title: "Continuity", isChecked: true,
           columns: [{ name: "CTZ_REQUIRED" }, { name: "CTZ_FORECAST_DATE" }, { name: "CTZ_ACT_COMPLETION_DATE" }, { name: "CTZ_PARTY_RESPONSIBLE" }, { name: "CTZ_NOTES" }]
         },
         {
           id: "Foundation_Pole", title: "Foundation/Pole", isChecked: true,
           columns: [{ name: "FDW_REQUIRED" }, { name: "FDW_TYPE" }, { name: "FWD_FORECAST_START_DATE" }, { name: "FDW_ACT_START_DATE" }, { name: "FDW_ACT_COMPLETION_DATE" }, { name: "FDW_CONED_TICKET_NUMBER" }, { name: "FDW_ON_HOLD_REASON" }, { name: "FDW_ON_HOLD_OTHER" }, { name: "FDW_NOTES" },
                     { name: "PLW_REQUIRED" }, { name: "PLW_TYPE" }, { name: "PLW_FORECAST_START_DATE" }, { name: "PLW_ACT_START_DATE" }, { name: "PLW_ACT_COMPLETION_DATE" }, { name: "PLW_ON_HOLD_REASON" }, { name: "PLW_ON_HOLD_OTHER" }, { name: "PLW_NOTES" }]
         },
         {
           id: "Underground", title: "Underground", isChecked: true,
           columns: [{ name: "FBD_REQUIRED" }, { name: "FBD_TYPE" }, { name: "FBD_FORECAST_START_DATE" }, { name: "FBD_ACT_START_DATE" }, { name: "FBD_ACT_COMPLETION_DATE" }, { name: "FBD_EST_LENGTH" }, { name: "FBD_ACT_LENGTH" }, { name: "FBD_ON_HOLD_REASON" }, { name: "FBD_ON_HOLD_OTHER" }, { name: "FBD_NOTES" }, { name: "FBD_VAULT" },
                     { name: "PWD_REQUIRED" }, { name: "PWD_FORECAST_START_DATE" }, { name: "PWD_ACT_START_DATE" }, { name: "PWD_ACT_COMPLETION_DATE" }, { name: "PWD_EST_LENGTH" }, { name: "PWD_ACT_LENGTH" }, { name: "PWD_ON_HOLD_REASON" }, { name: "PWD_ON_HOLD_OTHER" }, { name: "PWD_NOTES" },
                     { name: "UGM_REQUIRED" }, { name: "UGM_ACT_COMPLETION_DATE" }, { name: "UGM_ON_HOLD_REASON" }, { name: "UGM_ON_HOLD_OTHER" }, { name: "UGM_NOTES" }]
         },
         {
           id: "Fiber", title: "Fiber", isChecked: true,
           columns: [{ name: "FBP_REQUIRED" }, { name: "FBP_TYPE" }, { name: "FBP_Lateral_Node_Tail" }, { name: "FBP_ACT_COMPLETION_DATE" }, { name: "FBP_ON_HOLD_REASON" }, { name: "FBP_ON_HOLD_OTHER" }, { name: "FBP_NOTES" },
                     { name: "FBS_REQUIRED" }, { name: "FBS_TYPE" }, { name: "FBS_ACT_COMPLETION_DATE" }, { name: "FBS_ON_HOLD_REASON" }, { name: "FBS_ON_HOLD_OTHER" }, { name: "FBS_NOTES" }, { name: "FBS_LIGHT_TEST_CLIENT_DATE" }]
         },
         {
           id: "Others", title: "Others", isChecked: true,
           columns: [{ name: "APP_REQUIRED" }, { name: "APP_ACT_COMPLETION_DATE" }, { name: "APP_ON_HOLD_REASON" }, { name: "APP_ON_HOLD_OTHER" }, { name: "APP_NOTES" },
                     { name: "SRA_REQUIRED" }, { name: "SRA_FORECAST_START_DATE" }, { name: "SRA_ACT_COMPLETION_DATE" }, { name: "SRA_SHROUD_INSTALLED" }, { name: "SRA_ANTENA_INSTALLED" }, { name: "SRA_SHROUD_SERIAL_NUMBER" }, { name: "SRA_ION_SERIAL_NUMBER" }, { name: "SRA_ON_HOLD_REASON" }, { name: "SRA_ON_HOLD_OTHER" }, { name: "SRA_NOTES" },
                     { name: "PMS_REQUIRED" }, { name: "PMS_ACT_COMPLETION_DATE" }, { name: "PMS_SUBMITTED_DATE" }, { name: "PMS_CLIENT_APPROVAL_DATE" }, { name: "PMS_ON_HOLD_REASON" }, { name: "PMS_ON_HOLD_OTHER" }, { name: "PMS_NOTES" }]
         },
         {
           id: "Job", title: "Job", isChecked: true,
           columns: [{ name: "NODE_ID1" }, { name: "NODE_ID2" }, { name: "NODE_ID3" }, { name: "HUB" }, { name: "HYLAN_PM" }, { name: "STREET_ADDRESS" }, { name: "CITY" }, { name: "STATE" }, { name: "ZIP" }, { name: "LAT" },
                     { name: "LONG" }, { name: "POLE_LOCATION" }, { name: "DOITT_NTP_STATUS_NAME" }, { name: "DOITT_NTP_GRANTED_DATE" }, { name: "JOB_CATEGORY_NAME" }, { name: "JOB_STATUS_NAME" }, { name: "ON_HOLD_REASON" }, { name: "CLIENT_PM" },
                     { name: "JOB_NOTES" }, { name: "NUMBER_OF_SUBMITTED_PERMITS" }, { name: "PERMIT_NOTES" }, { name: "PUNCHLIST_COMPLETE" }, { name: "PUNCHLIST_SUBMITTED_DATE" }, { name: "CLIENT_APPROVAL_DATE" }, { name: "TOTAL_PERMITS" }, { name: "ACTIVE" },
                     { name: "EXPIRED" }, { name: "EXPIRING_5DAY" }, { name: "ON_HOLD" }, { name: "REQUEST_EXTENSION" }, { name: "REQUEST_RENEWAL" }, { name: "TASKS" }, { name: "ATTACHMENTS_COUNT" },

                    { name: "PERMITS_COUNT" }, { name: "ACTIVE_COUNT" }, { name: "EXPIRED_COUNT" }, { name: "EXPIRING_FIVEDAYS_COUNT" }, { name: "ON_HOLD_COUNT" }, { name: "REQUEST_EXTENSION_COUNT" },
                    { name: "REQUEST_RENEWAL_COUNT" },{ name: "PENDING_COUNT" },{ name: "REJECTED_COUNT" }
           ]
         },
         { id: "All", title: "All", isChecked: true }];

       var defaultSort = {
         field: "HYLAN_PROJECT_ID",
         dir: "asc"
       };

       var getParams = function () {
           objParams = { projectIDs: 'All' };

           var selectedProjectsList = hylanCache.GetValue(hylanCache.Keys.PROJECTS);
           if (selectedProjectsList == undefined) selectedProjectsList = hylanCache.GetValue(hylanCache.Keys.LATEST_PROJECTS, Globals.Screens.MANAGE_TASKS.ID);

           if (selectedProjectsList && selectedProjectsList.length > 0) objParams.projectIDs = getIDFromList(selectedProjectsList, 'PROJECT_ID');
           return objParams;
       }

       var GetAll = function (options) {
           var params = getParams();
           $.ajax({
               url: AppConfig.ApiUrl + "/" + api_resource + "/GetRoster",
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
       var dataSource = DataContext.CreateDataSource(api_resource, columns, aggs, null, null, defaultSort);
       dataSource.transport.read = GetAll;

       return {
         dataSource: dataSource,
         defaultSort: defaultSort,
         columns: columns,
         groups: groups
       };

     }]);