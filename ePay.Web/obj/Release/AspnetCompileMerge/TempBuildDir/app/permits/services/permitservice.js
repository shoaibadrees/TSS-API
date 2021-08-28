angular.module('HylanApp').factory('PermitService', ['DataContext', 'Utility', 'NOTIFYTYPE', 'AppConfig', '$rootScope', 'hylanCache',
     function (DataContext, Utility, NOTIFYTYPE, AppConfig, $rootScope, hylanCache) {
         var apiControllerName = "Permits";
         var schema =
         {
             model: {
                 id: "PERMIT_ID",
                 fields: {
                     ROW_HEADER: { editable: false },
                     VIEW_EDIT: { title: "VIEW/EDIT", editable: false },
                     PERMIT_ID: { title: "PERMIT ID",type:'number', editable: false },
                     PROJECT_ID: { title: "PROJECT ID", editable: false },
                     HYLAN_PROJECT_ID: { title: "HYLAN PROJECT ID", editable: false },
                     JOB_FILE_NUMBER: { title: "JOB FILE NUMBER", editable: false },
                     DOT_TRACKING_NUMBER: { title: "DOT TRACKING NUMBER", editable: false },
                     SUBMITTED_DATE: { title: "SUBMITTED DATE", editable: false, type: 'date' },
                     PERMIT_STATUS_NAME: { title: "PERMIT STATUS NAME", editable: false },
                     PERMIT_NUMBER_TEXT: { title: "PERMIT NUMBER TEXT", editable: false },
                     PERMIT_TYPE: { title: "PERMIT TYPE", editable: false },
                     PERMIT_DESCRIPTION: { title: "PERMIT DESCRIPTION", editable: false },
                     PERMIT_CATEGORY_NAME: { title: "PERMIT CATEGORY NAME", editable: false },
                     IS_PROTECTED_STREET1: { title: "IS PROTECTED STREET1", editable: false },
                     STIPULATION_DAY1: { title: "STIPULATION DAY1", editable: false },
                     STIPULATION_NIGHT1: { title: "STIPULATION NIGHT1", editable: false },
                     STIPULATION_WEEKEND1: { title: "STIPULATION WEEKEND1", editable: false },
                     STIPULATIONS_OTHER: { title: "STIPULATIONS OTHER", editable: false },
                     SEGMENT: { title: "SEGMENT", editable: false },
                     MARKOUT_START_DATE: { title: "MARKOUT START DATE", editable: false, type: 'date' },
                     MARKOUT_END_DATE: { title: "MARKOUT END DATE", editable: false, type: 'date' },
                     ISSUED_DATE: { title: "ISSUED DATE", editable: false, type: 'date' },
                     VALID_DATE: { title: "VALID DATE", editable: false, type: 'date' },
                     EXPIRES_DATE: { title: "EXPIRES DATE", editable: false, type: 'date' },
                     REJECTED_DATE: { title: "REJECTED DATE", editable: false, type: 'date' },
                     REJECTED_REASON_NAME: { title: "REJECTED REASON", editable: false },
                     NOTES: { title: "NOTES", editable: false },
                     CLIENT: { title: "CLIENT", editable: false },
                     NODE_ID1: { title: "NODE ID1", editable: false },
                     NODE_ID2: { title: "NODE ID2", editable: false },
                     NODE_ID3: { title: "NODE ID3", editable: false },
                     HUB: { title: "HUB", editable: false },
                     HYLAN_PM: { title: "HYLAN PM", editable: false },
                     STREET_ADDRESS: { title: "STREET ADDRESS", editable: false },
                     CITY: { title: "CITY", editable: false },
                     STATE: { title: "STATE", editable: false },
                     ZIP: { title: "ZIP", editable: false },
                     LAT: { title: "LAT", editable: false },
                     LONG: { title: "LONG", editable: false },
                     POLE_LOCATION: { title: "POLE LOCATION", editable: false },
                     ATTACHMENTS_COUNT: { title: "ATTACHMENTS COUNT", editable: false },
                     CREATED_BY: { title: "CREATED BY", editable: false },
                     CREATED_ON: { title: "CREATED ON", editable: false },
                     MODIFIED_BY: { title: "MODIFIED BY", editable: false },
                     MODIFIED_ON: { title: "MODIFIED ON", editable: false },
                     LOCK_COUNTER: { title: "LOCK COUNTER", editable: false },

                 }
             }
         };

         //var aggs = [{ field: "PERMIT_ID", aggregate: "sum" }];

         var defaultSort = {
             field: "HYLAN_PROJECT_ID",
             dir: "asc"
         };
             
       
         var deleteJobs = function (list) {
           var api = "Permits/Delete";
           return Globals.Post(api, JSON.stringify(list),true); //true = a sync 
         };

         var getParams = function () {
             objParams = { projectIDs: 'All' };

             var selectedProjectsList = hylanCache.GetValue(hylanCache.Keys.PROJECTS);
             if (selectedProjectsList == undefined) selectedProjectsList = hylanCache.GetValue(hylanCache.Keys.LATEST_PROJECTS, Globals.Screens.MANAGE_JOBS.ID);

             if (selectedProjectsList && selectedProjectsList.length > 0) objParams.projectIDs = getIDFromList(selectedProjectsList, 'PROJECT_ID');
             
             return objParams;
         }

         var GetAll = function (options) {
             var params = getParams();
             $.ajax({
                 url: AppConfig.ApiUrl + "/" + apiControllerName + "/GetAll",
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

         var dataSource = DataContext.CreateDataSource(apiControllerName, schema,null, null, null, defaultSort);
         dataSource.transport.read = GetAll;
         return {
             dataSource: dataSource,
             defaultSort: defaultSort,
              deleteJobs: deleteJobs
         };
     }]);