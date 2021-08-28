var DSAdminUsers = [];
angular.module('HylanApp').controller("TaskRosterController", ['$rootScope', '$scope', '$controller', 'TaskRosterService', '$timeout', '$filter', 'hylanCache',
    function ($rootScope, $scope, $controller, TaskRosterService, $timeout, $filter, hylanCache) {

        $controller('BaseController', { $scope: $scope });
        if ($rootScope.isUserLoggedIn == false)
            return false;

        var groupColumns = [];
        //fixing for hand held devices
        var strColWidth = '9%';
        var numColWidth = '7%';
        maxlen = 6;
        if (/iPad/.test(Globals.UserAgent) || /Android/.test(Globals.UserAgent)) {
            strColWidth = '150px';
            numColWidth = '85px';
        }
        $scope.AllowToEdit = true;
        var editPerm = Globals.CheckEditPermission($scope.Screens.MANAGE_TASKS.ID);
        if (editPerm == false) {
            $scope.AllowToEdit = false;
            $scope.gridOptions.editable = false;
            $('#grid1 .k-grid-custom_add').addClass('hide');
            $('#grid1 .k-grid-save-changes').addClass('hide');

        }
        $scope.ApiResource = "Tasks";
        $scope.CurrentView = "TaskRoster";
        $scope.taskGroups = JSON.parse(JSON.stringify(TaskRosterService.groups));
        $scope.selectedProjectID = "-1";

        Globals.GetProjects().then(function (result) {
            //$scope.projectsDS = result.objResultList;
            //$scope.projectsDS = $filter('orderBy')($scope.projectsDS, '-CREATED_ON');
            $scope.projectsDS = $filter('orderBy')(result.objResultList, 'HYLAN_PROJECT_ID');
        });

        $scope.defaultSort = TaskRosterService.defaultSort;

        $scope.searchColumns = [
          { field: "HYLAN_PROJECT_ID" },
          { field: "JOB_FILE_NUMBER" },
          { field: "TOTAL_TASKS" },

          { field: "CTZ_REQUIRED", type: "boolean" },
          { field: "CTZ_FORECAST_DATE", type: "date" },
          { field: "CTZ_ACT_COMPLETION_DATE", type: "date" },
          { field: "CTZ_PARTY_RESPONSIBLE" },
          { field: "CTZ_NOTES" },

          { field: "FDW_REQUIRED", type: "boolean" },
          { field: "FDW_TYPE" },
          { field: "FWD_FORECAST_START_DATE", type: "date" },
          { field: "FDW_ACT_START_DATE", type: "date" },
          { field: "FDW_ACT_COMPLETION_DATE", type: "date" },
          { field: "FDW_CONED_TICKET_NUMBER" },
          { field: "FDW_ON_HOLD_REASON" },
          { field: "FDW_ON_HOLD_OTHER" },
          { field: "FDW_NOTES" },

          { field: "PLW_REQUIRED", type: "boolean" },
          { field: "PLW_TYPE" },
          { field: "PLW_FORECAST_START_DATE", type: "date" },
          { field: "PLW_ACT_START_DATE", type: "date" },
          { field: "PLW_ACT_COMPLETION_DATE", type: "date" },
          { field: "PLW_ON_HOLD_REASON" },
          { field: "PLW_ON_HOLD_OTHER" },
          { field: "PLW_NOTES" },

          { field: "FBD_REQUIRED", type: "boolean" },
          { field: "FBD_TYPE" },
          { field: "FBD_FORECAST_START_DATE", type: "date" },
          { field: "FBD_ACT_START_DATE", type: "date" },
          { field: "FBD_ACT_COMPLETION_DATE", type: "date" },
          { field: "FBD_EST_LENGTH", type: "number" },
          { field: "FBD_ACT_LENGTH", type: "number" },
          { field: "FBD_ON_HOLD_REASON" },
          { field: "FBD_ON_HOLD_OTHER" },
          { field: "FBD_NOTES" },
          { field: "FBD_VAULT" },

          { field: "PWD_REQUIRED", type: "boolean" },
          { field: "PWD_FORECAST_START_DATE", type: "date" },
          { field: "PWD_ACT_START_DATE", type: "date" },
          { field: "PWD_ACT_COMPLETION_DATE", type: "date" },
          { field: "PWD_EST_LENGTH", type: "number" },
          { field: "PWD_ACT_LENGTH", type: "number" },
          { field: "PWD_ON_HOLD_REASON" },
          { field: "PWD_ON_HOLD_OTHER" },
          { field: "PWD_NOTES" },

          { field: "UGM_REQUIRED", type: "boolean" },
          { field: "UGM_ACT_COMPLETION_DATE", type: "date" },
          { field: "UGM_ON_HOLD_REASON" },
          { field: "UGM_ON_HOLD_OTHER" },
          { field: "UGM_NOTES" },

          { field: "FBP_REQUIRED", type: "boolean" },
          { field: "FBP_TYPE" },
          { field: "FBP_Lateral_Node_Tail" },
          { field: "FBP_ACT_COMPLETION_DATE", type: "date" },
          { field: "FBP_ON_HOLD_REASON" },
          { field: "FBP_ON_HOLD_OTHER" },
          { field: "FBP_NOTES" },

          { field: "FBS_REQUIRED", type: "boolean" },
          { field: "FBS_TYPE" },
          { field: "FBS_ACT_COMPLETION_DATE", type: "date" },
          { field: "FBS_ON_HOLD_REASON" },
          { field: "FBS_ON_HOLD_OTHER" },
          { field: "FBS_NOTES" },
          { field: "FBS_LIGHT_TEST_CLIENT_DATE", type: "date" },

          { field: "APP_REQUIRED", type: "boolean" },
          { field: "APP_ACT_COMPLETION_DATE", type: "date" },
          { field: "APP_ON_HOLD_REASON" },
          { field: "APP_ON_HOLD_OTHER" },
          { field: "APP_NOTES" },

          { field: "SRA_REQUIRED", type: "boolean" },
          { field: "SRA_FORECAST_START_DATE", type: "date" },
          { field: "SRA_ACT_COMPLETION_DATE", type: "date" },
          { field: "SRA_SHROUD_INSTALLED", type: "boolean" },
          { field: "SRA_ANTENA_INSTALLED", type: "boolean" },
          { field: "SRA_SHROUD_SERIAL_NUMBER" },
          { field: "SRA_ION_SERIAL_NUMBER" },
          { field: "SRA_ON_HOLD_REASON" },
          { field: "SRA_ON_HOLD_OTHER" },
          { field: "SRA_NOTES" },

          { field: "PMS_REQUIRED", type: "boolean" },
          { field: "PMS_ACT_COMPLETION_DATE", type: "date" },
          { field: "PMS_SUBMITTED_DATE", type: "date" },
          { field: "PMS_CLIENT_APPROVAL_DATE", type: "date" },
          { field: "PMS_ON_HOLD_REASON" },
          { field: "PMS_ON_HOLD_OTHER" },
          { field: "PMS_NOTES" },

          { field: "NODE_ID1" },
          { field: "NODE_ID2" },
          { field: "NODE_ID3" },
          { field: "HUB" },
          { field: "HYLAN_PM" },
          { field: "STREET_ADDRESS" },
          { field: "CITY" },
          { field: "STATE" },
          { field: "ZIP" },
          { field: "LAT" },
          { field: "LONG" },
          { field: "POLE_LOCATION" },
          { field: "DOITT_NTP_STATUS_NAME" },
          { field: "DOITT_NTP_GRANTED_DATE", type: "date" },
          { field: "JOB_CATEGORY_NAME" },
          { field: "JOB_STATUS_NAME" },
          { field: "ON_HOLD_REASON" },
          { field: "CLIENT_PM" },
          { field: "JOB_NOTES" },
          { field: "NUMBER_OF_SUBMITTED_PERMITS" },
          { field: "PERMIT_NOTES" },
          { field: "PUNCHLIST_COMPLETE" },
          { field: "PUNCHLIST_SUBMITTED_DATE", type: "date" },
          { field: "CLIENT_APPROVAL_DATE", type: "date" },
          { field: "NOTES_COUNT" },
          { field: "NOTES_DATE", type: "date" },
          { field: "PERMITS_COUNT", type: "number" },
          { field: "ACTIVE_COUNT", type: "number" },
          { field: "EXPIRED_COUNT", type: "number" },
          { field: "EXPIRING_5DAYS_COUNT", type: "number" },
          { field: "ON_HOLD_COUNT", type: "number" },
          { field: "REQUEST_EXTENSION_COUNT", type: "number" },
          { field: "REQUEST_RENEWAL_COUNT", type: "number" },
          { field: "PENDING_COUNT", type: "number" },
          { field: "REJECTED_COUNT", type: "number" }
        ];

        var hylenProjectIDTemplate
        if (Globals.IsScreenVisible($scope.Screens.MANAGE_PROJECTS.ID)) {
            hylenProjectIDTemplate = "<a href='javascript:;' ng-click='setScreenAndRowID(#:JOB_ID#); OpenProjectCRUDWindow(#:PROJECT_ID#)' >#= checkNull(data.HYLAN_PROJECT_ID)#</a>";
        }
        else {
            hylenProjectIDTemplate = "#: HYLAN_PROJECT_ID == null ? '' : HYLAN_PROJECT_ID#";
        }
        var jobFileNumberTemplate
        if (Globals.IsScreenVisible($scope.Screens.MANAGE_JOBS.ID)) {
            jobFileNumberTemplate = "<a href='javascript:;' ng-click='setScreenAndRowID(#:JOB_ID#); OpenJobCRUDWindow(#:JOB_ID#," + $scope.AllowToEdit + ")' >#: JOB_FILE_NUMBER == null ? '' : JOB_FILE_NUMBER#</a>";
        }
        else {
            jobFileNumberTemplate = "#: JOB_FILE_NUMBER == null ? '' : JOB_FILE_NUMBER#";
        }
        var taskTemplate
        // if (Globals.CheckEditPermission($scope.Screens.MANAGE_TASKS.ID)) {
        taskTemplate = "<a href='javascript:;' ui-sref='Tasks({JOB: {JOB_ID:#:JOB_ID#, HYLAN_PROJECT_ID:\"#:HYLAN_PROJECT_ID#\",JOB_FILE_NUMBER:\"#:JOB_FILE_NUMBER#\", BACK_STATE:\"TasksRoster\"}})' >(#:TOTAL_TASKS#)</a>";
        //}
        //  else {
        //      taskTemplate = "#: TOTAL_TASKS == null ? '(0)' : TOTAL_TASKS#";
        //  }
        var JobNotesTemplate
        if (Globals.IsScreenVisible($scope.Screens.JOB_NOTES.ID)) {
            JobNotesTemplate = "<a href='javascript:;' ng-click='setScreenAndRowID(#:JOB_ID#); OpenNotesWindow(#:JOB_ID#, \"#:HYLAN_PROJECT_ID#\", \"#:JOB_FILE_NUMBER#\")' >(#:NOTES_COUNT#) #:FormatDate(NOTES_DATE, false, true)#</a>";
        }
        else {
            JobNotesTemplate = "(#:NOTES_COUNT#) #:FormatDate(NOTES_DATE, false, true)#";
        }
        var sumTemplate = "#=(sum == undefined || sum == null) ? 0 : kendo.toString(sum,'n0')#";
        var JobAttachmentsTemplate
        if (Globals.IsScreenVisible($scope.Screens.JOB_ATTACHMENTS.ID)) {
            JobAttachmentsTemplate = "<a href='javascript:;' ng-click='setScreenAndRowID(#:JOB_ID#); OpenModalWindow(#:JOB_ID#, #:PROJECT_ID#, \"#:HYLAN_PROJECT_ID#\", \"#:JOB_FILE_NUMBER#\", \"ATTACHMENTS\")' >(#:ATTACHMENTS_COUNT#)</a>";
        }
        else {
            JobAttachmentsTemplate = "#: ATTACHMENTS_COUNT == null ? '(0)' : ATTACHMENTS_COUNT#";
        }
        var onDataBound = function (args) {
            $scope.$emit("ChildGridLoaded", args.sender);

            $("#grid1 .k-grid-footer-locked tr.k-footer-template").addClass("SummaryRow");
            $('#grid1 .k-grid-footer-locked tr.SummaryRow > td:nth-child(3)').append(function () {
                return $(this).attr("colspan", "2").css("text-align", "left").html('<label style="color:darkgray">SUMMARY</label>').next().remove().contents();
            });
            hilightEnteredRow();
        };
        ////$scope.gridOptions.autoBind = false;
        $scope.gridOptions.editable = false;
        $scope.gridOptions.filterable = {
            extra: true,
            /*operators: {
              string: {
                startswith: "Starts with",
                eq: "Is equal to",
                neq: "Is not equal to"
              }
            }*/
            messages: { isTrue: "True", isFalse: "False" }
        };


        Globals.GetUsers(false, AppSettings.Hylan_PM_RoleName).then(function (result) {
            DSAdminUsers = result.objResultList;
        });
        $scope.gridOptions.dataSource = TaskRosterService.dataSource;
        $scope.gridOptions.dataBound = onDataBound;
        $scope.gridOptions.columns = [
                {
                    title: "General", locked: true, headerAttributes: { "class": "section-border" }, groupId: "General", field: "DUMMY_FIELD",
                    columns: [
                              { field: "ROW_HEADER", width: "20px", title: "   .", sortable: false, locked: true, headerAttributes: { "class": "sub-col darkYellow-col rowHeaderHeadYellow", "style": "border-right: 0px !important;" }, attributes: { "class": "contert-alpha GridBorder rowHeaderCell" }, filterable: false },
                              { field: "PROJECT_ID", title: "Project ID11", width: "80px", hidden: true, locked: true, headerAttributes: { "class": "sub-col darkYellow-col rowHeaderHead2" }, attributes: { "class": "GridBorder" }, template: "#= checkNull(data.PROJECT_ID)#" },
                              { field: "HYLAN_PROJECT_ID", title: "<br/>Project ID", width: "150px", locked: true, headerAttributes: { "class": "sub-col darkYellow-col rowHeaderHead2" }, attributes: { "class": "GridBorder" }, template: hylenProjectIDTemplate, filterable: stringFilterAttributes },
                              { field: "JOB_FILE_NUMBER", title: "Job File Number", width: "120px", locked: true, headerAttributes: { "class": "sub-col no-left-border darkYellow-col", "style": "border-left: 0px white;" }, attributes: { "class": "GridBorder" }, template: jobFileNumberTemplate, filterable: stringFilterAttributes },
                              { field: "TOTAL_TASKS", title: "Tasks", width: "100px", locked: true, headerAttributes: { "class": "sub-col darkYellow-col section-border", "style": "border-left: 0px white;" }, attributes: { "class": "GridBorder section-border" }, template: taskTemplate, aggregates: ["sum"], footerTemplate: sumTemplate, footerAttributes: { "class": "section-border" }, filterable: false },
                    ]
                }
                  ,
                {
                    title: "Continuity to Zero M/H", headerAttributes: { "class": "section-border" }, groupId: "Continuity",
                    columns: [{ field: "CTZ_REQUIRED", title: "<br/>Needed", width: "110px", headerAttributes: { "class": "sub-col continuity" }, attributes: { "class": "contert-alpha center-middle" }, template: "#= ZeroOneTemplate(data.CTZ_REQUIRED)#", filterable: { cell: { template: ZeroOneFilterTemplate, showOperators: false } } },
                              { field: "CTZ_FORECAST_DATE", title: "Forecast Date", width: "120px", headerAttributes: { "class": "sub-col no-left-border continuity" }, attributes: { "class": "contert-number " }, format: "{0: MM/dd/yyyy}", filterable: { cell: { operator: "eq", showOperators: true } } },
                              { field: "CTZ_ACT_COMPLETION_DATE", title: "Actual<br/>Completion Date", width: "190px", headerAttributes: { "class": "sub-col no-left-border continuity" }, attributes: { "class": "contert-number " }, format: "{0: MM/dd/yyyy}", filterable: { cell: { operator: "eq", showOperators: true } } },
                              { field: "CTZ_PARTY_RESPONSIBLE", title: "Party Responsible", width: "160px", headerAttributes: { "class": "sub-col no-left-border continuity" }, attributes: { "class": "contert-alpha" }, template: "#= checkNull(data.CTZ_PARTY_RESPONSIBLE)#", filterable: stringFilterAttributes },
                              { field: "CTZ_NOTES", title: "<br/>Notes", width: "120px", headerAttributes: { "class": "sub-col no-left-border continuity section-border" }, attributes: { "class": "section-border contert-alpha" }, template: "#= checkTextLength('Continuity to Zero M\\/H', data.HYLAN_PROJECT_ID, data.JOB_FILE_NUMBER, checkNull(data.CTZ_NOTES))#", footerAttributes: { "class": "section-border" }, filterable: stringFilterAttributes }]
                },
                {
                    title: "Foundation Work", headerAttributes: { "class": "section-border" }, groupId: "Foundation_Pole",
                    columns: [{ field: "FDW_REQUIRED", title: "<br/>Needed", width: "110px", headerAttributes: { "class": "sub-col foundationpole" }, attributes: { "class": "contert-alpha center-middle" }, template: "#= ZeroOneTemplate(data.FDW_REQUIRED)#", filterable: { cell: { template: ZeroOneFilterTemplate, showOperators: false } } },
                              { field: "FDW_TYPE", title: "<br/>Type", width: "110px", headerAttributes: { "class": "sub-col no-left-border foundationpole" }, attributes: { "class": "contert-alpha " }, template: "#= checkNull(data.FDW_TYPE)#", filterable: stringFilterAttributes },
                              //{ field: "FDW_TYPE", filterable: { ui: cityFilter }, title: "<br/>Type", width: "100px", headerAttributes: { "class": "sub-col no-left-border foundationpolel" }, attributes: { "class": "contert-number " }, template: "#= checkNull(data.FDW_TYPE)#" },
                              { field: "FWD_FORECAST_START_DATE", title: "Forecast Start Date", width: "150px", headerAttributes: { "class": "sub-col no-left-border foundationpole" }, attributes: { "class": "contert-number " }, format: "{0: MM/dd/yyyy}", filterable: { cell: { operator: "eq", showOperators: true } } },
                              { field: "FDW_ACT_START_DATE", title: "Actual Start Date", width: "150px", headerAttributes: { "class": "sub-col no-left-border foundationpole" }, attributes: { "class": "contert-number " }, format: "{0: MM/dd/yyyy}", filterable: { cell: { operator: "eq", showOperators: true } } },
                              { field: "FDW_ACT_COMPLETION_DATE", title: "Actual Completion Date", width: "190px", headerAttributes: { "class": "sub-col no-left-border foundationpole" }, attributes: { "class": "contert-number " }, format: "{0: MM/dd/yyyy}", filterable: { cell: { operator: "eq", showOperators: true } } },
                              { field: "FDW_CONED_TICKET_NUMBER", title: "ConEd Ticket Num", width: "150px", headerAttributes: { "class": "sub-col no-left-border foundationpole" }, attributes: { "class": "contert-number " }, template: "#= checkNull(data.FDW_CONED_TICKET_NUMBER)#", filterable: numberFilterAttributes },
                              { field: "FDW_ON_HOLD_REASON", title: "Reason For Hold", width: "120px", headerAttributes: { "class": "sub-col no-left-border foundationpole" }, attributes: { "class": "contert-alpha " }, template: "#= checkNull(data.FDW_ON_HOLD_REASON)#", filterable: numberFilterAttributes },
                              { field: "FDW_ON_HOLD_OTHER", title: "Other<br/>Reason", width: "130px", headerAttributes: { "class": "sub-col no-left-border foundationpole" }, attributes: { "class": "contert-alpha " }, template: "#= checkNull(data.FDW_ON_HOLD_OTHER)#", filterable: numberFilterAttributes },
                              { field: "FDW_NOTES", title: "<br/>Notes", width: "120px", headerAttributes: { "class": "sub-col no-left-border foundationpole section-border" }, attributes: { "class": "contert-alpha section-border" }, template: "#= checkTextLength('Foundation Work', data.HYLAN_PROJECT_ID, data.JOB_FILE_NUMBER, checkNull(data.FDW_NOTES))#", footerAttributes: { "class": "section-border" }, filterable: numberFilterAttributes }]
                },
                {
                    title: "Pole Work", headerAttributes: { "class": "section-border" }, groupId: "Foundation_Pole",
                    columns: [{ field: "PLW_REQUIRED", title: "<br/>Needed", width: "110px", headerAttributes: { "class": "sub-col foundationpole" }, attributes: { "class": "contert-alpha" }, template: "#= ZeroOneTemplate(data.PLW_REQUIRED)#", filterable: { cell: { template: ZeroOneFilterTemplate, showOperators: false } } },
                                { field: "PLW_TYPE", title: "<br/>Type", width: "110px", headerAttributes: { "class": "sub-col no-left-border foundationpole" }, attributes: { "class": "contert-alpha " }, template: "#= checkNull(data.PLW_TYPE)#", filterable: stringFilterAttributes },
                                { field: "PLW_FORECAST_START_DATE", title: "Forecast<br/>Start Date", width: "150px", headerAttributes: { "class": "sub-col no-left-border foundationpole" }, attributes: { "class": "contert-number " }, format: "{0: MM/dd/yyyy}", filterable: { cell: { operator: "eq", showOperators: true } } },
                                { field: "PLW_ACT_START_DATE", title: "Actual<br/>Start Date", width: "150px", headerAttributes: { "class": "sub-col no-left-border foundationpole" }, attributes: { "class": "contert-number " }, format: "{0: MM/dd/yyyy}", filterable: { cell: { operator: "eq", showOperators: true } } },
                                { field: "PLW_ACT_COMPLETION_DATE", title: "Actual<br/>Completion Date", width: "190px", headerAttributes: { "class": "sub-col no-left-border foundationpole" }, attributes: { "class": "contert-number " }, format: "{0: MM/dd/yyyy}", filterable: { cell: { operator: "eq", showOperators: true } } },
                                { field: "PLW_ON_HOLD_REASON", title: "Reason For<br/>Hold", width: "120px", headerAttributes: { "class": "sub-col no-left-border foundationpole" }, attributes: { "class": "contert-alpha " }, template: "#= checkNull(data.PLW_ON_HOLD_REASON)#", filterable: stringFilterAttributes },
                                { field: "PLW_ON_HOLD_OTHER", title: "Other<br/>Reason", width: "130px", headerAttributes: { "class": "sub-col no-left-border foundationpole" }, attributes: { "class": "contert-alpha " }, template: "#= checkNull(data.PLW_ON_HOLD_OTHER)#", filterable: stringFilterAttributes, filterable: stringFilterAttributes },
                                { field: "PLW_NOTES", title: "<br/>Notes", width: "120px", headerAttributes: { "class": "sub-col no-left-border foundationpole section-border" }, attributes: { "class": "contert-alpha section-border" }, template: "#=  checkTextLength('Pole Work', data.HYLAN_PROJECT_ID, data.JOB_FILE_NUMBER, checkNull(data.PLW_NOTES))#", footerAttributes: { "class": "section-border" }, filterable: stringFilterAttributes }]
                },
                {
                    title: "Fiber Dig", headerAttributes: { "class": "section-border" }, groupId: "Underground",
                    columns: [{ field: "FBD_REQUIRED", title: "<br/>Needed", width: "110px", headerAttributes: { "class": "sub-col underground" }, attributes: { "class": "contert-alpha center-middle" }, template: "#= ZeroOneTemplate(data.FBD_REQUIRED)#", filterable: { cell: { template: ZeroOneFilterTemplate, showOperators: false } } },
                                { field: "FBD_TYPE", title: "<br/>Type", width: "110px", headerAttributes: { "class": "sub-col no-left-border underground" }, attributes: { "class": "contert-alpha " }, template: "#= checkNull(data.FBD_TYPE)#", filterable: stringFilterAttributes },
                                { field: "FBD_FORECAST_START_DATE", title: "Forecast Start Date", width: "150px", headerAttributes: { "class": "sub-col no-left-border underground" }, attributes: { "class": "contert-number " }, format: "{0: MM/dd/yyyy}", filterable: { cell: { operator: "eq", showOperators: true } } },
                                { field: "FBD_ACT_START_DATE", title: "Actual Start Date", width: "150px", headerAttributes: { "class": "sub-col no-left-border underground" }, attributes: { "class": "contert-number " }, format: "{0: MM/dd/yyyy}", filterable: { cell: { operator: "eq", showOperators: true } } },
                                { field: "FBD_EST_LENGTH", title: "Estimated<br/>Length", width: "120px", headerAttributes: { "class": "sub-col no-left-border underground" }, attributes: { "class": "contert-number " }, template: "#= checkNull(data.FBD_EST_LENGTH,0)#", filterable: numberFilterAttributes },
                                { field: "FBD_ACT_COMPLETION_DATE", title: "Actual Completion Date", width: "190px", headerAttributes: { "class": "sub-col no-left-border underground" }, attributes: { "class": "contert-number " }, format: "{0: MM/dd/yyyy}", filterable: { cell: { operator: "eq", showOperators: true } } },
                                { field: "FBD_ACT_LENGTH", title: "Actual<br/>Length", width: "120px", headerAttributes: { "class": "sub-col no-left-border underground" }, attributes: { "class": "contert-number " }, template: "#= checkNull(data.FBD_ACT_LENGTH, 0)#", filterable: numberFilterAttributes },
                                { field: "FBD_ON_HOLD_REASON", title: "Reason For<br/>Hold", width: "120px", headerAttributes: { "class": "sub-col no-left-border underground" }, attributes: { "class": "contert-alpha " }, template: "#= checkNull(data.FBD_ON_HOLD_REASON)#", filterable: stringFilterAttributes },
                                { field: "FBD_ON_HOLD_OTHER", title: "Other<br/>Reason", width: "130px", headerAttributes: { "class": "sub-col no-left-border underground" }, attributes: { "class": "contert-alpha " }, template: "#= checkNull(data.FBD_ON_HOLD_OTHER)#", filterable: stringFilterAttributes },
                                { field: "FBD_VAULT", title: "<br/>Vault", width: "100px", headerAttributes: { "class": "sub-col no-left-border underground" }, attributes: { "class": "contert-alpha " }, template: "#= checkNull(data.FBD_VAULT )#", filterable: stringFilterAttributes },
                                { field: "FBD_NOTES", title: "<br/>Notes", width: "120px", headerAttributes: { "class": "sub-col no-left-border underground section-border" }, attributes: { "class": "contert-alpha section-border" }, template: "#= checkTextLength('Fiber Dig', data.HYLAN_PROJECT_ID, data.JOB_FILE_NUMBER, checkNull(data.FBD_NOTES))#", footerAttributes: { "class": "section-border" }, filterable: stringFilterAttributes }]
                },
                {
                    title: "Power Dig", headerAttributes: { "class": "section-border" }, groupId: "Underground",
                    columns: [{ field: "PWD_REQUIRED", title: "<br/>Needed", width: "110px", headerAttributes: { "class": "sub-col underground" }, attributes: { "class": "contert-alpha" }, template: "#= ZeroOneTemplate(data.PWD_REQUIRED)#", filterable: { cell: { template: ZeroOneFilterTemplate, showOperators: false } } },
                                { field: "PWD_FORECAST_START_DATE", title: "Forecast Start Date", width: "150px", headerAttributes: { "class": "sub-col no-left-border underground" }, attributes: { "class": "contert-number " }, format: "{0: MM/dd/yyyy}", filterable: { cell: { operator: "eq", showOperators: true } } },
                                { field: "PWD_ACT_START_DATE", title: "Actual<br/>Start Date", width: "150px", headerAttributes: { "class": "sub-col no-left-border underground" }, attributes: { "class": "contert-number " }, format: "{0: MM/dd/yyyy}", filterable: { cell: { operator: "eq", showOperators: true } } },
                                { field: "PWD_EST_LENGTH", title: "Estimated<br/>Length", width: "120px", headerAttributes: { "class": "sub-col no-left-border underground" }, attributes: { "class": "contert-number " }, template: "#= checkNull(data.PWD_EST_LENGTH,0)#", filterable: numberFilterAttributes },
                                { field: "PWD_ACT_COMPLETION_DATE", title: "Actual<br/>Completion Date", width: "190px", headerAttributes: { "class": "sub-col no-left-border underground" }, attributes: { "class": "contert-number " }, format: "{0: MM/dd/yyyy}", filterable: { cell: { operator: "eq", showOperators: true } } },
                                { field: "PWD_ACT_LENGTH", title: "Actual<br/>Length", width: "120px", headerAttributes: { "class": "sub-col no-left-border underground" }, attributes: { "class": "contert-number " }, template: "#= checkNull(data.PWD_ACT_LENGTH, 0)#", filterable: numberFilterAttributes },
                                { field: "PWD_ON_HOLD_REASON", title: "Reason For<br/>Hold", width: "120px", headerAttributes: { "class": "sub-col no-left-border underground" }, attributes: { "class": "contert-alpha " }, template: "#= checkNull(data.PWD_ON_HOLD_REASON)#", filterable: stringFilterAttributes },
                                { field: "PWD_ON_HOLD_OTHER", title: "Other<br/>Reason", width: "130px", headerAttributes: { "class": "sub-col no-left-border underground" }, attributes: { "class": "contert-alpha " }, template: "#= checkNull(data.PWD_ON_HOLD_OTHER)#", filterable: stringFilterAttributes },
                                { field: "PWD_NOTES", title: "<br/>Notes", width: "120px", headerAttributes: { "class": "sub-col no-left-border underground section-border" }, attributes: { "class": "contert-alpha section-border" }, template: "#= checkTextLength('Power Dig', data.HYLAN_PROJECT_ID, data.JOB_FILE_NUMBER, checkNull(data.PWD_NOTES))#", footerAttributes: { "class": "section-border" }, filterable: stringFilterAttributes }]
                },
                {
                    title: "Underground Miscellaneous", headerAttributes: { "class": "section-border" }, groupId: "Underground",
                    columns: [{ field: "UGM_REQUIRED", title: "<br/>Needed", width: "110px", headerAttributes: { "class": "sub-col underground" }, attributes: { "class": "contert-alpha" }, template: "#= ZeroOneTemplate(data.UGM_REQUIRED)#", filterable: { cell: { template: ZeroOneFilterTemplate, showOperators: false } } },
                                { field: "UGM_ACT_COMPLETION_DATE", title: "Actual<br/>Completion Date", width: "190px", headerAttributes: { "class": "sub-col no-left-border underground" }, attributes: { "class": "contert-number " }, format: "{0: MM/dd/yyyy}", filterable: { cell: { operator: "eq", showOperators: true } } },
                                { field: "UGM_ON_HOLD_REASON", title: "Reason For<br/>Hold", width: "120px", headerAttributes: { "class": "sub-col no-left-border underground" }, attributes: { "class": "contert-alpha " }, template: "#= checkNull(data.UGM_ON_HOLD_REASON)#", filterable: stringFilterAttributes },
                                { field: "UGM_ON_HOLD_OTHER", title: "Other<br/>Reason", width: "130px", headerAttributes: { "class": "sub-col no-left-border underground" }, attributes: { "class": "contert-alpha " }, template: "#= checkNull(data.UGM_ON_HOLD_OTHER)#", filterable: stringFilterAttributes },
                                { field: "UGM_NOTES", title: "<br/>Notes", width: "120px", headerAttributes: { "class": "sub-col no-left-border underground section-border" }, attributes: { "class": "contert-alpha section-border" }, template: "#= checkTextLength('Underground Miscellaneous', data.HYLAN_PROJECT_ID, data.JOB_FILE_NUMBER, checkNull(data.UGM_NOTES))#", footerAttributes: { "class": "section-border" }, filterable: stringFilterAttributes }]
                },
                {
                    title: "Fiber Pull", headerAttributes: { "class": "section-border" }, groupId: "Fiber",
                    columns: [{ field: "FBP_REQUIRED", title: "<br/>Needed", width: "110px", headerAttributes: { "class": "sub-col fiber" }, attributes: { "class": "contert-alpha" }, template: "#= ZeroOneTemplate(data.FBP_REQUIRED)#", filterable: { cell: { template: ZeroOneFilterTemplate, showOperators: false } } },
                                { field: "FBP_TYPE", title: "<br/>Type", width: "110px", headerAttributes: { "class": "sub-col no-left-border fiber" }, attributes: { "class": "contert-alpha " }, template: "#= checkNull(data.FBP_TYPE)#", filterable: stringFilterAttributes },
                                { field: "FBP_Lateral_Node_Tail", title: "<br/>Lateral/Node Tail", width: "200px", headerAttributes: { "class": "sub-col no-left-border fiber" }, attributes: { "class": "contert-alpha " }, template: "#= checkNull(data.FBP_Lateral_Node_Tail)#", filterable: stringFilterAttributes },
                                { field: "FBP_ACT_COMPLETION_DATE", title: "Actual<br/>Completion Date", width: "190px", headerAttributes: { "class": "sub-col no-left-border fiber" }, attributes: { "class": "contert-number " }, format: "{0: MM/dd/yyyy}", filterable: { cell: { operator: "eq", showOperators: true } } },
                                { field: "FBP_ON_HOLD_REASON", title: "Reason For<br/>Hold", width: "120px", headerAttributes: { "class": "sub-col no-left-border fiber" }, attributes: { "class": "contert-alpha " }, template: "#= checkNull(data.FBP_ON_HOLD_REASON)#", filterable: stringFilterAttributes },
                                { field: "FBP_ON_HOLD_OTHER", title: "Other<br/>Reason", width: "130px", headerAttributes: { "class": "sub-col no-left-border fiber" }, attributes: { "class": "contert-alpha " }, template: "#= checkNull(data.FBP_ON_HOLD_OTHER)#", filterable: stringFilterAttributes },
                                { field: "FBP_NOTES", title: "<br/>Notes", width: "120px", headerAttributes: { "class": "sub-col no-left-border fiber section-border" }, attributes: { "class": "contert-alpha section-border" }, template: "#= checkTextLength('Fiber Pull', data.HYLAN_PROJECT_ID, data.JOB_FILE_NUMBER, checkNull(data.FBP_NOTES))#", footerAttributes: { "class": "section-border" }, filterable: stringFilterAttributes }]
                },
                {
                    title: "Fiber Splicing", headerAttributes: { "class": "section-border" }, groupId: "Fiber",
                    columns: [{ field: "FBS_REQUIRED", title: "<br/>Needed", width: "110px", headerAttributes: { "class": "sub-col fiber" }, attributes: { "class": "contert-alpha" }, template: "#= ZeroOneTemplate(data.FBS_REQUIRED)#", filterable: { cell: { template: ZeroOneFilterTemplate, showOperators: false } } },
                                { field: "FBS_TYPE", title: "<br/>Type", width: "110px", headerAttributes: { "class": "sub-col no-left-border fiber" }, attributes: { "class": "contert-alpha " }, template: "#= checkNull(data.FBS_TYPE)#", filterable: stringFilterAttributes },
                                { field: "FBS_ACT_COMPLETION_DATE", title: "Actual Completion Date", width: "190px", headerAttributes: { "class": "sub-col no-left-border fiber" }, attributes: { "class": "contert-number " }, format: "{0: MM/dd/yyyy}", filterable: { cell: { operator: "eq", showOperators: true } } },
                                { field: "FBS_ON_HOLD_REASON", title: "Reason For Hold", width: "120px", headerAttributes: { "class": "sub-col no-left-border fiber" }, attributes: { "class": "contert-alpha " }, template: "#= checkNull(data.FBS_ON_HOLD_REASON)#", filterable: stringFilterAttributes },
                                { field: "FBS_ON_HOLD_OTHER", title: "Other<br/>Reason", width: "130px", headerAttributes: { "class": "sub-col no-left-border fiber" }, attributes: { "class": "contert-alpha " }, template: "#= checkNull(data.FBS_ON_HOLD_OTHER)#", filterable: stringFilterAttributes },
                                { field: "FBS_LIGHT_TEST_CLIENT_DATE", title: "Light Test to Client", width: "170px", headerAttributes: { "class": "sub-col no-left-border fiber" }, attributes: { "class": "contert-number " }, format: "{0: MM/dd/yyyy}", filterable: { cell: { operator: "eq", showOperators: true } } },
                                { field: "FBS_NOTES", title: "<br/>Notes", width: "120px", headerAttributes: { "class": "sub-col no-left-border fiber section-border" }, attributes: { "class": "contert-alpha section-border" }, template: "#= checkTextLength('Fiber Splicing', data.HYLAN_PROJECT_ID, data.JOB_FILE_NUMBER, checkNull(data.FBS_NOTES))#", footerAttributes: { "class": "section-border" }, filterable: stringFilterAttributes }]
                },
                {
                    title: "AC Power To Pole", headerAttributes: { "class": "section-border" }, groupId: "Others",
                    columns: [  {field: "APP_REQUIRED", title: "<br/>Needed", width: "110px", headerAttributes: { "class": "sub-col others" }, attributes: { "class": "contert-alpha" }, template: "#= ZeroOneTemplate(data.APP_REQUIRED)#", filterable: { cell: { template: ZeroOneFilterTemplate, showOperators: false } }},
                                { field: "APP_ACT_COMPLETION_DATE", title: "Actual<br/>Completion Date", width: "190px", headerAttributes: { "class": "sub-col no-left-border others" }, attributes: { "class": "contert-number " }, format: "{0: MM/dd/yyyy}", filterable: { cell: { operator: "eq", showOperators: true } } },
                                { field: "APP_ON_HOLD_REASON", title: "Reason For<br/>Hold", width: "120px", headerAttributes: { "class": "sub-col no-left-border others" }, attributes: { "class": "contert-alpha " }, template: "#= checkNull(data.APP_ON_HOLD_REASON)#", filterable: stringFilterAttributes },
                                { field: "APP_ON_HOLD_OTHER", title: "Other<br/>Reason", width: "130px", headerAttributes: { "class": "sub-col no-left-border others" }, attributes: { "class": "contert-alpha " }, template: "#= checkNull(data.APP_ON_HOLD_OTHER)#", filterable: stringFilterAttributes },
                                { field: "APP_NOTES", title: "<br/>Notes", width: "120px", headerAttributes: { "class": "sub-col no-left-border others section-border" }, attributes: { "class": "contert-alpha section-border" }, template: "#= checkTextLength('AC Power To Pole', data.HYLAN_PROJECT_ID, data.JOB_FILE_NUMBER, checkNull(data.APP_NOTES))#", footerAttributes: { "class": "section-border" }, filterable: stringFilterAttributes }]
                },
                {
                    title: "Shroud/Antenna", headerAttributes: { "class": "section-border" }, groupId: "Others",
                    columns: [{ field: "SRA_REQUIRED", title: "<br/>Needed", width: "110px", headerAttributes: { "class": "sub-col others" }, attributes: { "class": "contert-alpha" }, template: "#= ZeroOneTemplate(data.SRA_REQUIRED)#", filterable: { cell: { template: ZeroOneFilterTemplate, showOperators: false } } },
                                { field: "SRA_SHROUD_INSTALLED", title: "Shroud<br/>Installed", width: "150px", headerAttributes: { "class": "sub-col no-left-border others" }, attributes: { "class": "contert-alpha center-middle " }, template: "#= ZeroOneTemplate(data.SRA_SHROUD_INSTALLED)#", filterable: { cell: { template: ZeroOneFilterTemplate, showOperators: false } } },
                                { field: "SRA_ANTENA_INSTALLED", title: "Antenna<br/>Installed", width: "150px", headerAttributes: { "class": "sub-col no-left-border others" }, attributes: { "class": "contert-alpha center-middle " }, template: "#= ZeroOneTemplate(data.SRA_ANTENA_INSTALLED)#", filterable: { cell: { template: ZeroOneFilterTemplate, showOperators: false } } },
                                { field: "SRA_ION_SERIAL_NUMBER", title: "Ion Serial<br/>number", width: "120px", headerAttributes: { "class": "sub-col no-left-border others" }, attributes: { "class": "contert-alpha" }, template: "#= checkNull(data.SRA_ION_SERIAL_NUMBER)#", filterable: numberFilterAttributes },
                                { field: "SRA_SHROUD_SERIAL_NUMBER", title: "Shroud<br/>Serial number", width: "160px", headerAttributes: { "class": "sub-col no-left-border others" }, attributes: { "class": "contert-alpha " }, template: "#= checkNull(data.SRA_SHROUD_SERIAL_NUMBER)#", filterable: numberFilterAttributes },
                                { field: "SRA_FORECAST_START_DATE", title: "Forecast<br/>Start Date", width: "150px", headerAttributes: { "class": "sub-col no-left-border others" }, attributes: { "class": "contert-number " }, format: "{0: MM/dd/yyyy}", filterable: { cell: { operator: "eq", showOperators: true } } },
                                { field: "SRA_ACT_COMPLETION_DATE", title: "Actual<br/>Completion Date", width: "190px", headerAttributes: { "class": "sub-col no-left-border others" }, attributes: { "class": "contert-number " }, format: "{0: MM/dd/yyyy}", filterable: { cell: { operator: "eq", showOperators: true } } },
                                { field: "SRA_ON_HOLD_REASON", title: "Reason For<br/>Hold", width: "120px", headerAttributes: { "class": "sub-col no-left-border others" }, attributes: { "class": "contert-alpha " }, template: "#= checkNull(data.SRA_ON_HOLD_REASON)#", filterable: stringFilterAttributes },
                                { field: "SRA_ON_HOLD_OTHER", title: "Other<br/>Reason", width: "130px", headerAttributes: { "class": "sub-col no-left-border others" }, attributes: { "class": "contert-alpha " }, template: "#= checkNull(data.SRA_ON_HOLD_OTHER)#", filterable: stringFilterAttributes },
                                { field: "SRA_NOTES", title: "<br/>Notes", width: "120px", headerAttributes: { "class": "sub-col no-left-border others section-border" }, attributes: { "class": "contert-alpha section-border" }, template: "#= checkTextLength('Shroud/Antenna', data.HYLAN_PROJECT_ID, data.JOB_FILE_NUMBER, checkNull(data.SRA_NOTES))#", footerAttributes: { "class": "section-border" }, filterable: stringFilterAttributes }]
                },
                {
                    title: "PIM'S & Sweeps", headerAttributes: { "class": "section-border" }, groupId: "Others",
                    columns: [{ field: "PMS_REQUIRED", title: "<br/>Needed", width: "110px", headerAttributes: { "class": "sub-col others" }, attributes: { "class": "contert-alpha center-middle" }, template: "#= ZeroOneTemplate(data.PMS_REQUIRED)#", filterable: { cell: { template: ZeroOneFilterTemplate, showOperators: false } } },
                                { field: "PMS_ACT_COMPLETION_DATE", title: "Actual<br/>Completion Date", width: "190px", headerAttributes: { "class": "sub-col no-left-border others" }, attributes: { "class": "contert-number " }, format: "{0: MM/dd/yyyy}", filterable: { cell: { operator: "eq", showOperators: true } } },
                                { field: "PMS_SUBMITTED_DATE", title: "Submitted Date", width: "120px", headerAttributes: { "class": "sub-col no-left-border others" }, attributes: { "class": "contert-number " }, format: "{0: MM/dd/yyyy}", filterable: { cell: { operator: "eq", showOperators: true } } },
                                { field: "PMS_CLIENT_APPROVAL_DATE", title: "Client\'s<br/>Approval Date", width: "160px", headerAttributes: { "class": "sub-col no-left-border others" }, attributes: { "class": "contert-number " }, format: "{0: MM/dd/yyyy}", filterable: { cell: { operator: "eq", showOperators: true } } },
                                { field: "PMS_ON_HOLD_REASON", title: "Reason For<br/>Hold", width: "120px", headerAttributes: { "class": "sub-col no-left-border others" }, attributes: { "class": "contert-alpha " }, template: "#= checkNull(data.PMS_ON_HOLD_REASON)#", filterable: stringFilterAttributes },
                                { field: "PMS_ON_HOLD_OTHER", title: "Other<br/>Reason", width: "130px", headerAttributes: { "class": "sub-col no-left-border others" }, attributes: { "class": "contert-alpha " }, template: "#= checkNull(data.PMS_ON_HOLD_OTHER)#", filterable: stringFilterAttributes },
                                { field: "PMS_NOTES", title: "<br/>Notes", width: "120px", headerAttributes: { "class": "sub-col no-left-border others section-border" }, attributes: { "class": "contert-alpha section-border" }, template: "#= checkTextLength('PIM\\'S \\& Sweeps', data.HYLAN_PROJECT_ID, data.JOB_FILE_NUMBER, checkNull(data.PMS_NOTES))#", footerAttributes: { "class": "section-border" }, filterable: stringFilterAttributes }]
                },
                {
                    title: "Job", groupId: "Job",
                    columns: [{ field: "NODE_ID1", title: "<br/>Node ID 1", width: "120px", headerAttributes: { "class": "sub-col jobs" }, attributes: { "class": "contert-alpha " }, template: "#= checkNull(data.NODE_ID1)#", filterable: stringFilterAttributes },
                              { field: "NODE_ID2", title: "<br/>Node ID 2", width: "120px", headerAttributes: { "class": "sub-col no-left-border jobs" }, attributes: { "class": "contert-alpha " }, template: "#= checkNull(data.NODE_ID2)#", filterable: stringFilterAttributes },
                              { field: "NODE_ID3", title: "<br/>Node ID 3", width: "120px", headerAttributes: { "class": "sub-col no-left-border jobs" }, attributes: { "class": "contert-alpha " }, template: "#= checkNull(data.NODE_ID3)#", filterable: stringFilterAttributes },
                              { field: "HUB", title: "<br/>HUB", width: "90px", headerAttributes: { "class": "sub-col no-left-border jobs" }, attributes: { "class": "contert-alpha " }, template: "#= checkNull(data.HUB)#", filterable: stringFilterAttributes },
                              { field: "HYLAN_PM", title: "Hylan<br/>PM", width: "100px", headerAttributes: { "class": "sub-col no-left-border jobs" }, attributes: { "class": "contert-alpha " }, template: "#= getHylanPMName(data.HYLAN_PM)#", filterable: stringFilterAttributes },
                              { field: "STREET_ADDRESS", title: "Street Address", width: "130px", headerAttributes: { "class": "sub-col no-left-border jobs" }, attributes: { "class": "contert-alpha " }, template: "#= checkNull(data.STREET_ADDRESS)#", filterable: stringFilterAttributes },
                              { field: "CITY", title: "<br/>City", width: "90px", headerAttributes: { "class": "sub-col no-left-border jobs" }, attributes: { "class": "contert-alpha " }, template: "#= checkNull(data.CITY)#", filterable: stringFilterAttributes },
                              { field: "STATE", title: "<br/>State", width: "100px", headerAttributes: { "class": "sub-col no-left-border jobs" }, attributes: { "class": "contert-alpha" }, template: "#= checkNull(data.STATE)#", filterable: stringFilterAttributes },
                              { field: "ZIP", title: "<br/>Zip", width: "80px", headerAttributes: { "class": "sub-col no-left-border jobs" }, attributes: { "class": "contert-number " }, template: "#= checkNull(data.ZIP)#", filterable: stringFilterAttributes },
                              { field: "LAT", title: "<br/>Latitude", width: "120px", headerAttributes: { "class": "sub-col no-left-border jobs" }, attributes: { "class": "contert-number " }, template: "#= checkNull(data.LAT)#", filterable: stringFilterAttributes },
                              { field: "LONG", title: "<br/>Longitude", width: "130px", headerAttributes: { "class": "sub-col no-left-border jobs" }, attributes: { "class": "contert-number " }, template: "#= checkNull(data.LONG)#", filterable: stringFilterAttributes },
                              { field: "POLE_LOCATION", title: "Pole<br/>Location", width: "130px", headerAttributes: { "class": "sub-col no-left-border jobs" }, attributes: { "class": "contert-alpha " }, template: "#= checkNull(data.POLE_LOCATION)#", filterable: stringFilterAttributes },

                                  { field: "DOITT_NTP_STATUS_NAME", title: "DOITT<br/>NTP Status", width: "160px", headerAttributes: { "class": "sub-col no-left-border jobs" }, attributes: { "class": "contert-alpha " }, template: "#= checkNull(data.DOITT_NTP_STATUS_NAME)#", filterable: stringFilterAttributes },
                                  { field: "DOITT_NTP_GRANTED_DATE", title: "DOITT NTP<br/>Granted Date", width: "170px", headerAttributes: { "class": "sub-col no-left-border jobs" }, attributes: { "class": "contert-number " }, format: "{0: MM/dd/yyyy}", filterable: { cell: { operator: "eq", showOperators: true } } },
                                  { field: "JOB_CATEGORY_NAME", title: "Job<br/>Category", width: "130px", headerAttributes: { "class": "sub-col no-left-border jobs" }, attributes: { "class": "contert-alpha " }, template: "#= checkNull(data.JOB_CATEGORY_NAME)#", filterable: stringFilterAttributes },

                                  { field: "JOB_STATUS_NAME", title: "<br/>Job Status", width: "140px", headerAttributes: { "class": "sub-col no-left-border jobs" }, attributes: { "class": "contert-alpha " }, template: "#= checkNull(data.JOB_STATUS_NAME)#", filterable: stringFilterAttributes },
                                  { field: "ON_HOLD_REASON", title: "On-Hold<br/>Reason", width: "120px", headerAttributes: { "class": "sub-col no-left-border jobs" }, attributes: { "class": "contert-alpha " }, template: "#= checkNull(data.ON_HOLD_REASON)#", filterable: stringFilterAttributes },
                                  { field: "CLIENT_PM", title: "<br/>Client PM", width: "130px", headerAttributes: { "class": "sub-col no-left-border jobs" }, attributes: { "class": "contert-alpha " }, template: "#= checkNull(data.CLIENT_PM)#", filterable: stringFilterAttributes },
                                  { field: "JOB_NOTES", title: "<br/>Job Notes", width: "150px", headerAttributes: { "class": "sub-col no-left-border jobs" }, attributes: { "class": "" }, template: JobNotesTemplate, filterable: stringFilterAttributes },
                                  { field: "NUMBER_OF_SUBMITTED_PERMITS", title: "Number of<br/>Submitted Permits", width: "210px", headerAttributes: { "class": "sub-col no-left-border jobs" }, attributes: { "class": "contert-number " }, template: "#= checkNull(data.NUMBER_OF_SUBMITTED_PERMITS)#", aggregates: ["sum"], footerTemplate: sumTemplate, filterable: numberFilterAttributes },
                                  { field: "PERMIT_NOTES", title: "Permit Notes", width: "120px", headerAttributes: { "class": "sub-col no-left-border jobs" }, attributes: { "class": "contert-alpha " }, template: "#= checkTextLength('Job - Permit Notes', data.HYLAN_PROJECT_ID, data.JOB_FILE_NUMBER, checkNull(data.PERMIT_NOTES))#", filterable: stringFilterAttributes },

                                  //{ field: "TOTAL_PERMITS", title: "TOTAL PERMITS", width: "140px", headerAttributes: { "class": "sub-col no-left-border jobs" }, attributes: { "class": "contert-alpha " }, template: "#:'' # " },
                                  //{ field: "ACTIVE", title: "ACTIVE", width: "80px", headerAttributes: { "class": "sub-col no-left-border jobs" }, attributes: { "class": "contert-alpha " }, template: "#:'' # " },
                                  //{ field: "EXPIRED", title: "EXPIRED", width: "110px", headerAttributes: { "class": "sub-col no-left-border jobs" }, attributes: { "class": "contert-alpha " }, template: "#:'' # " },
                                  //{ field: "EXPIRING_5DAY", title: "EXPIRING 5 DAY", width: "130px", headerAttributes: { "class": "sub-col no-left-border jobs" }, attributes: { "class": "contert-alpha " }, template: "#'' # " },
                                  //{ field: "ON_HOLD", title: "ON HOLD", width: "110px", headerAttributes: { "class": "sub-col no-left-border jobs" }, attributes: { "class": "contert-alpha " }, template: "#:'' # " },
                                  //{ field: "REQUEST_EXTENSION", title: "REQUEST EXTENSION", width: "140px", headerAttributes: { "class": "sub-col no-left-border jobs" }, attributes: { "class": "contert-alpha " }, template: "#:'' # " },
                                  //{ field: "REQUEST_RENEWAL", title: "REQUEST RENEWAL", width: "140px", headerAttributes: { "class": "sub-col no-left-border jobs" }, attributes: { "class": "contert-alpha " }, template: "#:'' # " },


                                  { field: "PERMITS_COUNT", title: "TOTAL<br/>PERMITS", width: "130px", headerAttributes: { "class": "sub-col no-left-border jobs" }, attributes: { "class": "contert-number GridBorder" }, template: "#: PERMITS_COUNT == null ? 0 : PERMITS_COUNT#", aggregates: ["sum"], footerTemplate: sumTemplate, filterable: numberFilterAttributes },
                                  { field: "ACTIVE_COUNT", title: "<br/>ACTIVE", width: "110px", headerAttributes: { "class": "sub-col no-left-border jobs" }, attributes: { "class": "contert-number GridBorder" }, template: "#: ACTIVE_COUNT == null ? 0 : ACTIVE_COUNT#", aggregates: ["sum"], footerTemplate: sumTemplate, filterable: numberFilterAttributes },
                                  { field: "EXPIRED_COUNT", title: "<br/>EXPIRED", width: "120px", headerAttributes: { "class": "sub-col no-left-border jobs" }, attributes: { "class": "contert-number GridBorder" }, template: "#: EXPIRED_COUNT == null ? 0 : EXPIRED_COUNT#", aggregates: ["sum"], footerTemplate: sumTemplate, filterable: numberFilterAttributes },
                                  { field: "EXPIRING_5DAYS_COUNT", title: "EXPIRING<br/>5 DAY", width: "120px", headerAttributes: { "class": "sub-col no-left-border jobs" }, attributes: { "class": "contert-number GridBorder" }, template: "#: EXPIRING_5DAYS_COUNT == null ? 0 : EXPIRING_5DAYS_COUNT#", aggregates: ["sum"], footerTemplate: sumTemplate, filterable: numberFilterAttributes },
                                  { field: "ON_HOLD_COUNT", title: "ON<br/>HOLD", width: "100px", headerAttributes: { "class": "sub-col no-left-border jobs" }, attributes: { "class": "contert-number GridBorder" }, template: "#: ON_HOLD_COUNT == null ? 0 : ON_HOLD_COUNT#", aggregates: ["sum"], footerTemplate: sumTemplate, filterable: numberFilterAttributes },
                                  { field: "REQUEST_EXTENSION_COUNT", title: "REQUEST<br/>EXTENSION", width: "130px", headerAttributes: { "class": "sub-col no-left-border jobs" }, attributes: { "class": "contert-number GridBorder" }, template: "#: REQUEST_EXTENSION_COUNT == null ? 0 : REQUEST_EXTENSION_COUNT#", aggregates: ["sum"], footerTemplate: sumTemplate, filterable: numberFilterAttributes },
                                  { field: "REQUEST_RENEWAL_COUNT", title: "REQUEST<br/>RENEWAL", width: "120px", headerAttributes: { "class": "sub-col no-left-border jobs" }, attributes: { "class": "contert-number GridBorder" }, template: "#: REQUEST_RENEWAL_COUNT == null ? 0 : REQUEST_RENEWAL_COUNT#", aggregates: ["sum"], footerTemplate: sumTemplate, filterable: numberFilterAttributes },
                                  { field: "PENDING_COUNT", title: "<br/>PENDING", width: "120px", headerAttributes: { "class": "sub-col no-left-border jobs" }, attributes: { "class": "contert-number GridBorder" }, template: "#: PENDING_COUNT == null ? 0 : PENDING_COUNT#", aggregates: ["sum"], footerTemplate: sumTemplate, filterable: numberFilterAttributes },
                                  { field: "REJECTED_COUNT", title: "<br/>REJECTED", width: "130px", headerAttributes: { "class": "sub-col no-left-border jobs" }, attributes: { "class": "contert-number GridBorder" }, template: "#: REJECTED_COUNT == null ? 0 : REJECTED_COUNT#", aggregates: ["sum"], footerTemplate: sumTemplate, filterable: numberFilterAttributes },

                                  { field: "PUNCHLIST_COMPLETE", title: "Punchlist<br/>Complete", width: "150px", headerAttributes: { "class": "sub-col no-left-border jobs" }, attributes: { "class": "contert-alpha " }, template: "#= YesNoTemplate(PUNCHLIST_COMPLETE)#", filterable: { cell: { template: YesNoFilterTemplate, showOperators: false } } },
                                  { field: "PUNCHLIST_SUBMITTED_DATE", title: "Punchlist<br/>Submitted Date", width: "180px", headerAttributes: { "class": "sub-col no-left-border jobs" }, attributes: { "class": "contert-number " }, format: "{0: MM/dd/yyyy}", filterable: { cell: { operator: "eq", showOperators: true } } },
                                  { field: "CLIENT_APPROVAL_DATE", title: "Client<br/>Approval Date", width: "170px", headerAttributes: { "class": "sub-col no-left-border jobs" }, attributes: { "class": "contert-number " }, format: "{0: MM/dd/yyyy}", filterable: { cell: { operator: "eq", showOperators: true } } },
                                  { field: "ATTACHMENTS_COUNT", title: "ATTACHMENTS", width: "120px", headerAttributes: { "class": "sub-col no-left-border jobs" }, attributes: { "class": "GridBorder" }, template: JobAttachmentsTemplate, filterable: false }]
                }
        ];

        $scope.refreshGrid = function () {
            $scope.gridOptions.dataSource.read();
        }
        $scope.onGroupClick = function (selGroup) {
            $timeout(function () {
                if (selGroup.id == "All") {
                    angular.forEach($scope.taskGroups, function (group, index) {
                        if (group.id != "General") {
                            group.isChecked = selGroup.isChecked;
                            toggleGroup(group);
                        }
                    });
                }
                else {
                    var isAllChecked = true;
                    angular.forEach($scope.taskGroups, function (group, index) {
                        if (isAllChecked && group.id != "All" && group.id != "General") {
                            if (!group.isChecked)
                                isAllChecked = false;
                        }
                    });
                    var taskGroupAll = _.findWhere($scope.taskGroups, { id: "All" })
                    taskGroupAll.isChecked = isAllChecked;
                    toggleGroup(selGroup);
                }
                var grid = $("#grid1").data("kendoGrid");
                if (grid != undefined) {
                    grid.setOptions($scope.gridOptions);
                }
            }, 1, selGroup);
        };
        var toggleGroup = function (selGroup) {
            if (selGroup.columns) {
                var selectedGridGroup = _.filter($scope.gridOptions.columns, function (gridColumnsGrp) {
                    return gridColumnsGrp.groupId != "General" && gridColumnsGrp.groupId == selGroup.id;
                });
                if (selectedGridGroup) {
                    $.each(selectedGridGroup, function (gridGrpInd, gridGrpCol) {
                        $.each(selectedGridGroup[gridGrpInd].columns, function (gridColInd, gridCol) {
                            selectedGridGroup[gridGrpInd].columns[gridColInd].hidden = selGroup.isChecked == true ? false : true;
                        });
                    });
                }
            }
        };

        $scope.$on("CRUD_OPERATIONS_SUCCESS", function (event, args) {
            $scope.refreshGrid();
        });
        $scope.$on("CLOSE_WITHOUT_CHANGE", function (event, args) {
            hilightEnteredRow();
        });
        $scope.OpenNotesWindow = function (jobID, hylanProjectID, jobNumberID) {
            screenId = Globals.Screens.MANAGE_JOBS.ID;
            screenRecordId = jobID;
            $scope.isPopup = true;
            jobID = (jobID ? jobID : 0);
            var param = { USER_ID: $rootScope.currentUser.USER_ID, SCREEN_ID: Globals.Screens.MANAGE_JOBS.ID, SCREEN_RECORD_ID: jobID, HYLAN_PROJECT_ID: hylanProjectID, JOB_NUMBER_ID: jobNumberID };
            $scope.ngDialogData = param;
            $scope.openDialog("NOTES", param);
        };
        $scope.ResetFilter = function () {
            $scope.clearFilters();
            hylanCache.RemoveKey(hylanCache.Keys.LATEST_PROJECTS, Globals.Screens.MANAGE_TASKS.ID);
            $scope.ApplyCache();
            $scope.refreshGrid();

            var allGroup = $.grep($scope.taskGroups, function (e) {
                return e.title == "All";
            });
            if (allGroup && allGroup.length > 0) {
                allGroup = allGroup[0];
                allGroup.isChecked = true;
                $scope.onGroupClick(allGroup);
            }
        }
        $scope.OpenModalWindow = function (jobID, projectID, hylanProjectID, jobNumberID, window) {
            screenId = Globals.Screens.MANAGE_JOBS.ID;
            screenRecordId = jobID;
            $scope.isPopup = true;
            jobID = (jobID ? jobID : 0);
            var param = { USER_ID: $rootScope.currentUser.USER_ID, SCREEN_ID: Globals.Screens.MANAGE_JOBS.ID, SCREEN_RECORD_ID: jobID, HYLAN_PROJECT_ID: hylanProjectID, JOB_NUMBER_ID: jobNumberID, PROJECT_ID: projectID };
            $scope.ngDialogData = param;
            $scope.openDialog(window, param);
        };
        $scope.setScreenAndRowID = function (rowID) {
            hylanCache.SetValue(hylanCache.Keys.NEWLYADDED_ROWID, rowID, $scope.Screens.MANAGE_TASKS.ID);
        }
        var hilightEnteredRow = function () {
            var newlyAddedRecordID = hylanCache.GetValue(hylanCache.Keys.NEWLYADDED_ROWID, $scope.Screens.MANAGE_TASKS.ID);
            if (newlyAddedRecordID) {
                $("#grid1 tr.k-state-selected").removeClass("k-state-selected");

                var grid = $scope.gridOptions.dataSource;
            
                $.each(grid._data, function (index, value) {
                    var model = value;
                    if (model.JOB_ID == newlyAddedRecordID) {//some condition
                        $('[data-uid=' + model.uid + ']').addClass('k-state-selected');
                    }
                  
                });

                hylanCache.RemoveKey(hylanCache.Keys.NEWLYADDED_ROWID, $scope.Screens.MANAGE_TASKS.ID);

    

            }

        }

        //--------------------------Start Projects MultiSelect-----------------  
        var projectsMultiSelect = function () {

            var objMulti = {
                controlID: 'divMultiSelProjects', options: $scope.projectsDS, selectedList: [],
                idProp: 'HYLAN_PROJECT_ID', displayProp: 'HYLAN_PROJECT_ID', key: hylanCache.Keys.PROJECTS
            };
            $scope.MSProjects = objMulti;
            $scope.MSProjects.settings = {
                externalIdProp: '',
                idProp: objMulti.idProp,
                displayProp: objMulti.displayProp,
                enableSearch: true,
                scrollable: true,
                showCheckAll: false,
                showUncheckAll: true,
                smartButtonMaxItems: 3,  //need to change depends on size of control 
                closeOnBlur: true
            };



            $scope.MSProjects.events = {
                onItemSelect: function (item) {
                    setTooltipOnMultiSelect(objMulti.controlID, objMulti.selectedList, objMulti.displayProp);
                    hylanCache.SetValue(objMulti.key, objMulti.selectedList.slice());
                    $scope.refreshGrid();
                },
                onItemDeselect: function (item) {
                    setTooltipOnMultiSelect(objMulti.controlID, objMulti.selectedList, objMulti.displayProp);
                    hylanCache.SetValue(objMulti.key, objMulti.selectedList.slice());
                    $scope.refreshGrid();
                },
                onDeselectAll: function (items) {

                    setTooltipOnMultiSelect(objMulti.controlID, [], objMulti.displayProp);
                    hylanCache.SetValue(objMulti.key, []);
                    $scope.refreshGrid();
                }
            };
        }

        projectsMultiSelect();
        //--------------------------End ProjectStatus MultiSelect----------------- 
        var setDefaultValuesOnMultiSelect = function (multiSelectObject) {
            $scope.MSProjects.selectedList = [];
            var projects = hylanCache.GetValue($scope.MSProjects.key);
            if (projects) {
                //add values in control ,values came from cache
                angular.forEach(projects, function (value) {

                    if (isObjectExist('PROJECT_ID', value['PROJECT_ID'], $scope.projectsDS))
                        $scope.MSProjects.selectedList.push(value);
                });
                hylanCache.SetValue($scope.MSProjects.key, $scope.MSProjects.selectedList.slice());
                setTooltipOnMultiSelect($scope.MSProjects.controlID, $scope.MSProjects.selectedList, $scope.MSProjects.displayProp);
            }
            //else {
            //    if (AppSettings.ShowLatestProjectInFilter && objMulti.controlID == 'divMultiSelProjects') {
            //        if ($scope.projectsDS.length > 0) {
            //            //var latestProjects = [];
            //            objMulti.selectedList.push($scope.projectsDS[0]);
            //            hylanCache.SetValue(hylanCache.Keys.LATEST_PROJECTS, objMulti.selectedList.slice(), Globals.Screens.MANAGE_TASKS.ID);
            //            setTooltipOnMultiSelect(objMulti.controlID, objMulti.selectedList, objMulti.displayProp);
            //        }
            //    }
            //}
        };
        $scope.ApplyCache = function () {  //being called from baseController
            setDefaultValuesOnMultiSelect($scope.MSProjects);
        }
        $scope.ApplyCache();
        $scope.refreshGrid();

    }
]);

//function ZeroOneTemplate(value) {
//  if (value)
//    return "<input type='checkbox' disabled='disabled' checked='checked' class='chkbx' />";
//  else
//    return "<input type='checkbox' disabled='disabled' class='chkbx' />";
//}

function requriedFilter(element) {
    var element;
}

function cityFilter(element) {
    element.kendoDropDownList({
        dataSource: new kendo.data.DataSource({
            data: [
                { title: "Software Engineer" },
                { title: "Quality Assurance Engineer" },
                { title: "Team Lead" }
            ]
        }),
        dataTextField: "title",
        dataValueField: "title",
        optionLabel: "--Select Value--"
    });
}
function getHylanPMName(id) {
    if (id && id != null) {
        var item = $.grep(DSAdminUsers, function (e) {
            return e.USER_ID == id;
        });
        if (item && item.length > 0) {
            return item[0].LAST_NAME + ", " + item[0].FIRST_NAME;
        }
    }
    return "";
}
