angular.module('HylanApp').factory('DailiesService', ['DataContext', 'Utility', 'NOTIFYTYPE', 'AppConfig', '$rootScope', 'hylanCache',
     function (DataContext, Utility, NOTIFYTYPE, AppConfig, $rootScope, hylanCache) {
         var DailiesApiController = "Dailies";
         var schema =
         {
             model: {
                 id: "DAILY_ID",
                 fields: {
                      ROW_HEADER: { editable: false },
                      DAILY_ID: { title: "Job ID", editable: false },
                      JOB_ID: { title: "Job ID", editable: false },
                      PROJECT_ID: { title: "Project ID", editable: false },
                      VIEW_EDIT: { title: "Project ID", editable: false },

                      HYLAN_PROJECT_ID: { title: "Project ID", editable: false },
                      JOB_FILE_NUMBER: { title: "Job File Number", editable: false },

                      DAILY_TYPE: { title: "Daily Type", editable: false },
                      DAILY_TYPE_NAME: { title: "Daily Type", editable: false },
                      DAILY_DATE: { type: "date", title: "Work Date", editable: false },
                      DAY_OF_WEEK: { title: "Day of Week", editable: false },
                      DAILY_DAYS: { title: "Day", editable: false },
                      STATUS: { title: "Status", editable: false },
                      DAILY_STATUS_NAME: { title: "Status", editable: false },
                      SHIFT: { title: "Shift", editable: false },
                      DAILY_SHIFT_NAME: { title: "Shift", editable: false },
                      WORK_ORDER_NUMBER: { title: "Work Order #", editable: false },
                      DAILY_TYPE_NOTES: { title: "Notes", editable: false },

                      CLIENT_NAME: { title: "Client", editable: false },
                      NODE_ID1: { title: "Node ID 1", editable: false },
                      NODE_ID2: { title: "Node ID 2", editable: false },
                      NODE_ID3: { title: "Node ID 3", editable: false },
                      HUB: { title: "HUB", editable: false },
                      STREET_ADDRESS: { title: "Street Address", editable: false },
                      CITY: { title: "City", editable: false },
                      STATE: { title: "State", editable: false },
                      ZIP: { title: "Zip", editable: false },
                      LAT: { title: "Lat", editable: false },
                      LONG: { title: "Long", editable: false },
                      POLE_LOCATION: { title: "Pole Location", editable: false },
                      
                      CREATED_BY: { title: "CREATED_BY", editable: false },
                      CREATED_ON: {type:  "date", title: "CREATED_ON", editable: false },
                      MODIFIED_BY: { title: "MODIFIED_BY", editable: false },
                      MODIFIED_BY_NAME: { title: "MODIFIED_BY_NAME", editable: false },
                      MODIFIED_ON: { type: "date", title: "MODIFIED_ON", editable: false },
                      LOCK_COUNTER: { title: "LOCK_COUNTER", editable: false },
                 }
             }
         };

         var defaultSort = {
             field: "MODIFIED_ON",
             dir: "desc"
         };
             
       
         var deleteDailies = function (list) {
           var api = "Dailies/Delete";
           return Globals.Post(api, JSON.stringify(list),true); //true = a sync 
         };
         var getLocationParams = function() {
            objParams = { projectIDs: 'All', dailyTypeIDs: 'All', statusIDs: 'All', shiftIDs: 'All', dailyDate: 'All', dailyEndDate: 'All' };

            //var selectedProjectsList = hylanCache.GetValue(hylanCache.Keys.PROJECTS);
            //if (selectedProjectsList == undefined)
            //   selectedProjectsList = hylanCache.GetValue(hylanCache.Keys.LATEST_PROJECTS, Globals.Screens.MANAGE_DAILIES.ID);

            var selectedDailyTypeList = hylanCache.GetValue(hylanCache.Keys.DAILY_TYPE, Globals.Screens.MANAGE_DAILIES.ID);
            //var selectedDailyStatusList = hylanCache.GetValue(hylanCache.Keys.DAILY_STATUS, Globals.Screens.MANAGE_DAILIES.ID);
            //var selectedDailyShiftList = hylanCache.GetValue(hylanCache.Keys.DAILY_SHIFT, Globals.Screens.MANAGE_DAILIES.ID);
            var selectedDailyDate = hylanCache.GetValue(hylanCache.Keys.START_DATE, Globals.Screens.MANAGE_DAILIES.ID);
            //var selectedEndDailyDate = hylanCache.GetValue(hylanCache.Keys.END_DATE, Globals.Screens.MANAGE_DAILIES.ID);

            //if (selectedProjectsList && selectedProjectsList.length > 0) objParams.projectIDs = getIDFromList(selectedProjectsList, 'PROJECT_ID');
            if (selectedDailyTypeList && selectedDailyTypeList.length > 0) objParams.dailyTypeIDs = getIDFromList(selectedDailyTypeList, 'LOOK_UP_ID');
            //if (selectedDailyStatusList && selectedDailyStatusList.length > 0) objParams.statusIDs = getIDFromList(selectedDailyStatusList, 'LOOK_UP_ID');
            //if (selectedDailyShiftList && selectedDailyShiftList.length > 0) objParams.shiftIDs = getIDFromList(selectedDailyShiftList, 'LOOK_UP_ID');
            if (selectedDailyDate && selectedDailyDate != "All" && selectedDailyDate != "") objParams.dailyDate = selectedDailyDate;
            //if (selectedEndDailyDate && selectedEndDailyDate != "All" && selectedEndDailyDate != "") objParams.dailyEndDate = selectedEndDailyDate;

            return objParams;
         }

         var GetLocationReport = function(options) {
            var params = getLocationParams();
            var api = DailiesApiController + "/GetAll";            
            return Globals.Get(api, params, false);
         };

         var getHoursParams = function () {
             objParams = { projectIDs: 'All', dailyTypeIDs: 'All', statusIDs: 'All', shiftIDs: 'All', dailyDate: 'All', dailyEndDate: 'All' };

             //var selectedProjectsList = hylanCache.GetValue(hylanCache.Keys.PROJECTS);
             //if (selectedProjectsList == undefined)
             //   selectedProjectsList = hylanCache.GetValue(hylanCache.Keys.LATEST_PROJECTS, Globals.Screens.MANAGE_DAILIES.ID);

             var selectedDailyTypeList = hylanCache.GetValue(hylanCache.Keys.DAILY_TYPE, Globals.Screens.MANAGE_DAILIES.ID);
             //var selectedDailyStatusList = hylanCache.GetValue(hylanCache.Keys.DAILY_STATUS, Globals.Screens.MANAGE_DAILIES.ID);
             //var selectedDailyShiftList = hylanCache.GetValue(hylanCache.Keys.DAILY_SHIFT, Globals.Screens.MANAGE_DAILIES.ID);
             var selectedDailyDate = hylanCache.GetValue(hylanCache.Keys.START_DATE, Globals.Screens.MANAGE_DAILIES.ID);
             var selectedEndDailyDate = hylanCache.GetValue(hylanCache.Keys.END_DATE, Globals.Screens.MANAGE_DAILIES.ID);

             //if (selectedProjectsList && selectedProjectsList.length > 0) objParams.projectIDs = getIDFromList(selectedProjectsList, 'PROJECT_ID');
             if (selectedDailyTypeList && selectedDailyTypeList.length > 0) objParams.dailyTypeIDs = getIDFromList(selectedDailyTypeList, 'LOOK_UP_ID');
             //if (selectedDailyStatusList && selectedDailyStatusList.length > 0) objParams.statusIDs = getIDFromList(selectedDailyStatusList, 'LOOK_UP_ID');
             //if (selectedDailyShiftList && selectedDailyShiftList.length > 0) objParams.shiftIDs = getIDFromList(selectedDailyShiftList, 'LOOK_UP_ID');
             if (selectedDailyDate && selectedDailyDate != "All" && selectedDailyDate != "") objParams.dailyDate = selectedDailyDate;
             if (selectedEndDailyDate && selectedEndDailyDate != "All" && selectedEndDailyDate != "") objParams.dailyEndDate = selectedEndDailyDate;

             return objParams;
         }

         var GetHoursReport = function (options) {
             var params = getHoursParams();
             var api = DailiesApiController + "/GetHoursReport";
             return Globals.Get(api, params, false);
         };


         var getParams = function () {
            objParams = { projectIDs: 'All', dailyTypeIDs: 'All', statusIDs: 'All', shiftIDs: 'All', dailyDate: 'All', dailyEndDate: 'All' };

             var selectedProjectsList = hylanCache.GetValue(hylanCache.Keys.PROJECTS);
             if (selectedProjectsList == undefined)
                 selectedProjectsList = hylanCache.GetValue(hylanCache.Keys.LATEST_PROJECTS, Globals.Screens.MANAGE_DAILIES.ID);

             var selectedDailyTypeList = hylanCache.GetValue(hylanCache.Keys.DAILY_TYPE, Globals.Screens.MANAGE_DAILIES.ID);
             var selectedDailyStatusList = hylanCache.GetValue(hylanCache.Keys.DAILY_STATUS, Globals.Screens.MANAGE_DAILIES.ID);
             var selectedDailyShiftList = hylanCache.GetValue(hylanCache.Keys.DAILY_SHIFT, Globals.Screens.MANAGE_DAILIES.ID);
             var selectedDailyDate = hylanCache.GetValue(hylanCache.Keys.START_DATE, Globals.Screens.MANAGE_DAILIES.ID);
             var selectedEndDailyDate = hylanCache.GetValue(hylanCache.Keys.END_DATE, Globals.Screens.MANAGE_DAILIES.ID);

             if (selectedProjectsList && selectedProjectsList.length > 0) objParams.projectIDs = getIDFromList(selectedProjectsList, 'PROJECT_ID');
             if (selectedDailyTypeList && selectedDailyTypeList.length > 0) objParams.dailyTypeIDs = getIDFromList(selectedDailyTypeList, 'LOOK_UP_ID');
             if (selectedDailyStatusList && selectedDailyStatusList.length > 0) objParams.statusIDs = getIDFromList(selectedDailyStatusList, 'LOOK_UP_ID');
             if (selectedDailyShiftList && selectedDailyShiftList.length > 0) objParams.shiftIDs = getIDFromList(selectedDailyShiftList, 'LOOK_UP_ID');
             if (selectedDailyDate && selectedDailyDate != "All" && selectedDailyDate != "") objParams.dailyDate = selectedDailyDate;
             if (selectedEndDailyDate && selectedEndDailyDate != "All" && selectedEndDailyDate != "") objParams.dailyEndDate = selectedEndDailyDate;

             return objParams;
         }

         var GetAll = function (options) {
             var params = getParams();
             $.ajax({
                 url: AppConfig.ApiUrl + "/" + DailiesApiController + "/GetAll",
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

         var dataSource = DataContext.CreateDataSource(DailiesApiController, schema, null, null, null, defaultSort);
         dataSource.transport.read = GetAll;

         return {
             dataSource: dataSource,
             defaultSort: defaultSort,
             deleteDailies: deleteDailies,
             GetLocationReport: GetLocationReport,
             GetHoursReport: GetHoursReport
         };
     }]);