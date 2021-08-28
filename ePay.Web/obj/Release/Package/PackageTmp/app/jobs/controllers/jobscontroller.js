angular.module('HylanApp').controller("JobsController", ['$rootScope', '$scope', '$controller', '$timeout', 'JobsService', 'ngDialog', 'Utility', 'NOTIFYTYPE', '$interval', '$filter', 'hylanCache','$state',
function ($rootScope, $scope, $controller, $timeout, JobsService, ngDialog, Utility, NOTIFYTYPE, $interval, $filter, hylanCache, $state) {
    $scope.AddButtonText = "Add Job";
    var SelID = 0;
    $controller('BaseController', { $scope: $scope });
    $scope.multiSelectControl = {};
    $scope.multiSelectProjIdControl = {};
    if ($rootScope.isUserLoggedIn == false)
        return false;

    $scope.ApiResource = "Jobs";
    $scope.CurrentView = "ManageJobs";
    $scope.AllowToEdit = true;

    $scope.AllowToEdit = true;
    var editPerm = Globals.CheckEditPermission($scope.Screens.MANAGE_JOBS.ID);
    if (editPerm == false) {
        $scope.AllowToEdit = false;
        $scope.gridOptions.editable = false;
        $('#grid1 .k-grid-custom_add').addClass('hide');
        $('#grid1 .k-grid-save-changes').addClass('hide');

    }

    var onDataBound = function (args) {
        $scope.handleDataBound(true);
        args.sender.view = "ManageJobs";
        $scope.$emit("ChildGridLoaded", args.sender);
        $("#grid1 .k-grid-footer-locked tr.k-footer-template").addClass("SummaryRow");

        //summaryTitle = "SUMMARY: ";
        //$("#" + 'grid1' + ' tr.SummaryRow > td:visible').eq(1).append(function () {
        //    return $(this).css("text-align", "left").html('<label>' + summaryTitle + '</label>').next().contents();
        //});

        $("#grid1 .k-grid-footer-locked tr.k-footer-template").addClass("SummaryRow");
        $('#grid1 .k-grid-footer-locked tr.SummaryRow > td:nth-child(4)').append(function () {
            return $(this).attr("colspan", "2").css("text-align", "left").html('<label style="color:darkgray">SUMMARY</label>').next().remove().contents();
        });
        var TaskBackButton = hylanCache.GetValue(hylanCache.Keys.TASK_BACKBUTTON, $scope.Screens.MANAGE_JOBS.ID);

        if (TaskBackButton && $scope.loadCount > 0 || TaskBackButton == undefined)
            hilightEnteredRow();
    };
    var hilightEnteredRow = function () {
        var newlyAddedRecordID = hylanCache.GetValue(hylanCache.Keys.NEWLYADDED_ROWID, $scope.Screens.MANAGE_JOBS.ID);
        var TaskBackButton = hylanCache.GetValue(hylanCache.Keys.TASK_BACKBUTTON, $scope.Screens.MANAGE_JOBS.ID);
        if (newlyAddedRecordID) {
            $("#grid1 tr.k-state-selected").removeClass("k-state-selected");
            var grid = $scope.gridOptions.dataSource;
            $.each(grid._data, function (index, value) {
                var model = value;
                if (model.JOB_ID == newlyAddedRecordID) {//match ids
                    $('[data-uid=' + model.uid + ']').addClass('k-state-selected');
                }

            });
            hylanCache.RemoveKey(hylanCache.Keys.NEWLYADDED_ROWID, $scope.Screens.MANAGE_JOBS.ID);
        }
        hylanCache.RemoveKey(hylanCache.Keys.TASK_BACKBUTTON, $scope.Screens.MANAGE_JOBS.ID);
    }

    Globals.GetProjects().then(function (result) {
        $scope.projectsDS = result.objResultList;
        //$scope.projectsDS = $filter('orderBy')($scope.projectsDS, '-CREATED_ON');     
        $scope.projectsDS = $filter('orderBy')($scope.projectsDS, 'HYLAN_PROJECT_ID');
    });

    Globals.GetCompanies(false).then(function (result) {
        $scope.clientsDS = result.objResultList;
    });


    //filters  these are required for default filters
    //$scope.filters = {
    //  "JOB_STATUS_LU": { name: "JOB_STATUS_LU", operator: "eq", value: "Active", field: "JOB_STATUS_LU.LU_NAME", elementType: "multi-select", logic: "or", fieldValueOperation: 'add' },
    //  "HYLAN_PROJECT_ID": { name: "HYLAN_PROJECT_ID", operator: "eq", value: "Active", field: "HYLAN_PROJECT_ID", elementType: "multi-select", logic: "or", fieldValueOperation: 'add' }
    //};
    //default sortings
    ////$scope.defaultFilter = { name: "JOB_STATUS_LU", operator: "eq", value: "Active", field: "JOB_STATUS_LU.LU_NAME", elementType: "multi-select", logic: "or", fieldValueOperation: 'add' };
    $scope.defaultSort = JobsService.defaultSort;

    //-- if searchcolumn type = number then operator will be equal
    $scope.searchColumns = [
        { field: "NEEDED_TASKS_COUNT" },
        { field: "HYLAN_PROJECT_ID" },
        { field: "JOB_FILE_NUMBER" },
        { field: "CLIENT_NAME" },
        { field: "NODE_ID1" },
        { field: "NODE_ID2" },
        { field: "NODE_ID3" },
        { field: "HUB" },
        { field: "HYLAN_PM_NAME" },
        { field: "STREET_ADDRESS" },
        { field: "CITY" },
        { field: "STATE" },
        { field: "ZIP" },
        { field: "LAT" },
        { field: "LONG" },
        { field: "POLE_LOCATION" },
        { field: "DOITT_NTP_STATUS_LU.LU_NAME" },
        { field: "DOITT_NTP_GRANTED_DATE", type: 'date' },
        { field: "JOB_CATEGORY_LU.LU_NAME" },
        { field: "JOB_STATUS_LU.LU_NAME" },
        { field: "ON_HOLD_REASON" },
        { field: "CLIENT_PM" },
        { field: "JOB_NOTES" },
        { field: "PERMIT_NOTES" },
        { field: "PUNCHLIST_COMPLETE" },
        { field: "PRIORITY" },
        { field: "CJ_NUMBER" },
        { field: "DID_NUMBER" },
        { field: "PUNCHLIST_SUBMITTED_DATE", type: 'date' },
        { field: "CLIENT_APPROVAL_DATE", type: 'date' },
        { field: "NUMBER_OF_SUBMITTED_PERMITS", type: 'number' },
        { field: "PO_NUMBER"},
        { field: "PO_AMOUNT", type: 'number' },
        { field: "INVOICE_DATE", type: 'date' },
        { field: "INVOICE_AMOUNT", type: 'number'}
    ];

    //prepare the toolbar for filter and to add, deleted record
    $scope.GetCustomToolbar = function () {
        var toolbar = [];     
        var deleteBtn = { name: "custom_destroy", template: '<a class="k-button k-button-icontext k-grid-destroyRecord" id="toolbar-custom_destroy" ng-click="destroyRecords();"><span class="k-icon k-i-delete"></span>Delete</a>' }
        var addBtn = { name: "Add Job", template: '<a class="k-button k-button-icontext k-grid-save-changes" ng-click="OpenJobCRUDWindow(0,' + $scope.AllowToEdit + ')"><span class="k-icon k-i-add"></span>' + $scope.AddButtonText + '</a>' };
        if (/iPad/.test(Globals.UserAgent) == false && (/Android/.test(Globals.UserAgent)) == false) {
            toolbar.push(deleteBtn);
        }
        toolbar.push(addBtn);
        return toolbar;
    };

    $scope.ResetFilter = function () {
        $scope.clearFilters();

        if ($scope.multiSelectControl.resetQuerySearchBox != undefined) {
            $scope.multiSelectControl.resetQuerySearchBox();
        }

        if ($scope.multiSelectProjIdControl.resetQuerySearchBox != undefined) {
            $scope.multiSelectProjIdControl.resetQuerySearchBox();
        }

        hylanCache.RemoveKey(hylanCache.Keys.LATEST_PROJECTS, Globals.Screens.MANAGE_JOBS.ID);
        hylanCache.RemoveKey(hylanCache.Keys.JOB_STATUS, Globals.Screens.MANAGE_JOBS.ID);
        hylanCache.RemoveKey(hylanCache.Keys.JOB_CATEGORY, Globals.Screens.MANAGE_JOBS.ID);
        hylanCache.RemoveKey(hylanCache.Keys.DOITT_NTP_STATUS, Globals.Screens.MANAGE_JOBS.ID);
        hylanCache.RemoveKey(hylanCache.Keys.CLIENTS, Globals.Screens.MANAGE_JOBS.ID);
        $scope.ApplyCache();
        $scope.gridOptions.dataSource.read();
    }


    //binding tool bar
    if ($scope.AllowToEdit) {
        $scope.gridOptions.toolbar = $scope.GetCustomToolbar();
    }
    else {
        $scope.gridOptions.toolbar = "";
        var winHeight = $(window).height(),
     mainHead = $(".main-head").outerHeight();
        var availableHeight = winHeight - (mainHead);
        Globals.resizeGrid("#responsive-tables #grid1", availableHeight * 0.90);
    }
    $scope.gridOptions.editable = false;
    JobsService.dataSource._filter = [];
    if ($scope.AllowToEdit == false) {
        $('#grid1 .k-grid-toolbar').addClass('hide');
        $('#grid1 .k-grid-save-changes').addClass('hide');
    }
    var DeleteJobPerm = Globals.GetSpecificPermission(Globals.Screens.MANAGE_JOBS.ID, "SPECIAL_FUNCTION", Globals.Screens.MANAGE_JOBS.SPECIAL_FUNCTION.DELETE_JOB);
    if (DeleteJobPerm != undefined && DeleteJobPerm != null) {
        if (!DeleteJobPerm.EDIT_ACCESS) {
            $("#grid1 toolbar-custom_destroy").hide();
            $(".k-grid-destroyRecord", "#grid1").hide();
            $("#grid1").find(".k-grid-delete").hide();
        }
    }
    //binding grid datasource
    $scope.gridOptions.dataSource = JobsService.dataSource;
    $scope.gridOptions.dataBound = function (args) {
        $scope.handleDataBound(true);
    }

    //fixing for hand held devices
    var strColWidth = '9%';
    var numColWidth = '7%';
    maxlen = 6;
    if (/iPad/.test(Globals.UserAgent) || /Android/.test(Globals.UserAgent)) {
        strColWidth = '150px';
        numColWidth = '85px';
    }
    //creating link that will display inside the grid
    var JobAttachmentsTemplate
    if (Globals.IsScreenVisible($scope.Screens.JOB_ATTACHMENTS.ID)) {
        JobAttachmentsTemplate = "<a href='javascript:;' ng-click='setScreenAndRowID(#:JOB_ID#); OpenModalWindow(#:JOB_ID#, #:PROJECT_ID#, \"#:HYLAN_PROJECT_ID#\", \"#:JOB_FILE_NUMBER#\", \"ATTACHMENTS\")' >#:ATTACHMENTS#</a>";
    }
    else {
        JobAttachmentsTemplate = "#: ATTACHMENTS == null ? '' : ATTACHMENTS#";
    }

   //creating link that will display inside the grid
    var DailiesTemplate
    if (Globals.IsScreenVisible($scope.Screens.JOB_ATTACHMENTS.ID)) {
       DailiesTemplate = "<a href='javascript:;' ng-click='setScreenAndRowID(#:JOB_ID#); OpenManageDailies(dataItem)' >#:DAILIES#</a>";
    }
    else {
       DailiesTemplate = "#: DAILIES == null ? '' : DAILIES#";
    }


    $scope.OpenManageDailies = function (selectedRow) {
       var selectedList = [];
       var item = $.grep($scope.projectsDS, function (e) {
          return e.PROJECT_ID == selectedRow.PROJECT_ID;
       });
       if (item.length > 0)
       {
          selectedList.push(item[0]);
       }
       hylanCache.SetValue(hylanCache.Keys.PROJECTS, selectedList);

       var dailyTypeKeyForDailyScreen = hylanCache.Keys.DAILY_TYPE + Globals.Screens.MANAGE_DAILIES.ID;
       var statusKeyForDailyScreen = hylanCache.Keys.DAILY_STATUS + Globals.Screens.MANAGE_DAILIES.ID;
       //reset remaining filters to all
       hylanCache.RemoveKey(dailyTypeKeyForDailyScreen);
       hylanCache.RemoveKey(statusKeyForDailyScreen);
       hylanCache.RemoveKey(hylanCache.Keys.START_DATE, Globals.Screens.MANAGE_DAILIES.ID);
       hylanCache.RemoveKey(hylanCache.Keys.END_DATE, Globals.Screens.MANAGE_DAILIES.ID);
     
       //re direct to manage projects page
       $state.go('Dailies', {
          url: '/Dailies/{id}',
          views: {
             'BodyContent': {
                templateUrl: '/app/dailies/views/index.html',
                controller: 'DailiesController'
             }
          },
          title: 'Manage Dailies - Hylan',
          screenId: Globals.Screens.MANAGE_DAILIES.ID
       });
    }

   //creating link that will display inside the grid
    var PermitsTemplate
    if (Globals.IsScreenVisible($scope.Screens.JOB_ATTACHMENTS.ID)) {
       PermitsTemplate = "<a href='javascript:;' ng-click='setScreenAndRowID(#:JOB_ID#); OpenManagePermits(dataItem)' >#:PERMITS#</a>";
    }
    else {
       PermitsTemplate = "#: PERMITS == null ? '' : PERMITS#";
    }

    $scope.OpenManagePermits = function (selectedRow) {
       var selectedList = [];
       var item = $.grep($scope.projectsDS, function (e) {
          return e.PROJECT_ID == selectedRow.PROJECT_ID;
       });
       if (item.length > 0) {
          selectedList.push(item[0]);
       }
       hylanCache.SetValue(hylanCache.Keys.PROJECTS, selectedList);

       //re direct to manage projects page
       $state.go('Permits', {
          url: '/Permits/{id}',
          views: {
             'BodyContent': {
                templateUrl: '/app/permits/views/index.html',
                controller: 'PermitsController'
             }
          },
          title: 'Manage Permits - Hylan',
          screenId: Globals.Screens.MANAGE_PERMITS.ID
       });
    }

    var hylenProjectIDTemplate
    if (Globals.IsScreenVisible($scope.Screens.MANAGE_PROJECTS.ID)) {
        hylenProjectIDTemplate = "<a href='javascript:;' ng-click='setScreenAndRowID(#:JOB_ID#); OpenProjectCRUDWindow(#:PROJECT_ID#)' >#: HYLAN_PROJECT_ID == null ? '' : HYLAN_PROJECT_ID#</a>";
    }
    else {
        hylenProjectIDTemplate = "#: HYLAN_PROJECT_ID == null ? '' : HYLAN_PROJECT_ID#";
    }
    var jobFileNumberTemplate
    // if (Globals.CheckEditPermission($scope.Screens.MANAGE_JOBS.ID)) {
    jobFileNumberTemplate = "<a href='javascript:;' ng-click='setScreenAndRowID(#:JOB_ID#); OpenJobCRUDWindow(#:JOB_ID#," + $scope.AllowToEdit + ")' >#: JOB_FILE_NUMBER == null ? '' : JOB_FILE_NUMBER#</a>";
    // }
    //else {
    //   jobFileNumberTemplate = "#: JOB_FILE_NUMBER == null ? '' : JOB_FILE_NUMBER#";
    //  }
    var taskTemplate
    if (Globals.IsScreenVisible($scope.Screens.MANAGE_TASKS.ID)) {
        taskTemplate = "<a href='javascript:;' ui-sref='Tasks({JOB: {JOB_ID:#:JOB_ID#, HYLAN_PROJECT_ID:\"#:HYLAN_PROJECT_ID#\",JOB_FILE_NUMBER:\"#:JOB_FILE_NUMBER#\", BACK_STATE:\"Jobs\"}})' >(#:NEEDED_TASKS_COUNT#)</a>";
    }
    else {
        taskTemplate = "#: NEEDED_TASKS_COUNT == null ? '(0)' : NEEDED_TASKS_COUNT#";
    }
    var JobNotesTemplate
    if (Globals.IsScreenVisible($scope.Screens.JOB_NOTES.ID)) {
        JobNotesTemplate = "<a href='javascript:;' ng-click='setScreenAndRowID(#:JOB_ID#); OpenNotesWindow(#:JOB_ID#, \"#:HYLAN_PROJECT_ID#\", \"#:JOB_FILE_NUMBER#\")' >#:JOB_NOTES#</a>";
    }
    else {
        JobNotesTemplate = "#: JOB_NOTES == null ? '(0)' : JOB_NOTES#";
    }

    var sumTemplate = "#=(sum == undefined || sum == null) ? 0 : kendo.toString(sum,'n0')#";
    $scope.setScreenAndRowID = function (rowID) {
        hylanCache.SetValue(hylanCache.Keys.NEWLYADDED_ROWID, rowID, $scope.Screens.MANAGE_JOBS.ID);
    }
    $scope.gridOptions.columns = [
            { field: "ROW_HEADER", width: "20px", title: "   .", sortable: false, locked: true, headerAttributes: { "class": "sub-col darkYellow-col rowHeaderHeadYellow", "style": "border-right: 0px !important;" }, attributes: { "class": "contert-alpha GridBorder rowHeaderCell" }, filterable:false },
            { field: "JOB_ID", type: "number", title: "Project ID11", width: "80px", hidden: true, locked: true, headerAttributes: { "class": "sub-col darkYellow-col rowHeaderHead2" }, attributes: { "class": "GridBorder" }, template: "#: JOB_ID == null ? '' : JOB_ID#" },
            { field: "PROJECT_ID", title: "Project ID11", width: "80px", hidden: true, locked: true, headerAttributes: { "class": "sub-col darkYellow-col rowHeaderHead2" }, attributes: { "class": "GridBorder" }, template: "#: PROJECT_ID == null ? '' : PROJECT_ID#" },
            { field: "HYLAN_PROJECT_ID", title: "<sup><img src='../../../Content/images/red_asterisk.png' /></sup>Project ID", width: "150px", locked: true, headerAttributes: { "class": "sub-col darkYellow-col rowHeaderHead2" }, attributes: { "class": "GridBorder" }, template: hylenProjectIDTemplate, filterable: stringFilterAttributes  },
            { field: "JOB_FILE_NUMBER", title: "<sup><img src='../../../Content/images/red_asterisk.png' /></sup>Job File Number", width: "120px", locked: true, headerAttributes: { "class": "sub-col darkYellow-col rowHeaderHead2" }, attributes: { "class": "GridBorder" }, template: jobFileNumberTemplate, filterable: stringFilterAttributes },
            { field: "CLIENT_NAME", title: "CLIENT", width: "160px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#: CLIENT_NAME == null ? '' : CLIENT_NAME#", filterable: stringFilterAttributes },
            { field: "NEEDED_TASKS_COUNT", title: "TASKS", width: "90px", locked: true, headerAttributes: { "class": "sub-col no-left-border darkYellow-col section-border", "style": "border-left: 0px white;" }, attributes: { "class": "GridBorder section-border" }, template: taskTemplate, aggregates: ["sum"], footerTemplate: sumTemplate, footerAttributes: { "class": "section-border" }, filterable: false },

            { field: "CJ_NUMBER", title: "CJ #", width: "85px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#: CJ_NUMBER == null ? '' : CJ_NUMBER#", filterable: stringFilterAttributes },
            { field: "DID_NUMBER", title: "DID #", width: "95px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#: DID_NUMBER == null ? '' : DID_NUMBER#", filterable: stringFilterAttributes },
            //{ field: "DAILIES", title: "DAILIES", width: "120px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "GridBorder" }, template: DailiesTemplate, filterable: false },
            //{ field: "PERMITS", title: "PERMITS", width: "120px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "GridBorder" }, template: PermitsTemplate, filterable: false },
            { field: "ATTACHMENTS", title: "ATTACHMENTS", width: "120px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "GridBorder" }, template: JobAttachmentsTemplate, filterable: false },

            { field: "NODE_ID1", title: "Node ID 1", width: "160px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#: NODE_ID1 == null ? '' : NODE_ID1#", filterable: stringFilterAttributes },
            { field: "NODE_ID2", title: "Node ID 2", width: "160px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#: NODE_ID2 == null ? '' : NODE_ID2#", filterable: stringFilterAttributes },
            { field: "NODE_ID3", title: "Node ID 3", width: "160px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#: NODE_ID3 == null ? '' : NODE_ID3#", filterable: stringFilterAttributes },
            { field: "HUB", title: "HUB", width: "160px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#: HUB == null ? '' : HUB#", filterable: stringFilterAttributes },
            { field: "HYLAN_PM_NAME", title: "Hylan PM", width: "120px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#: HYLAN_PM_NAME == null ? '' : HYLAN_PM_NAME#", filterable: stringFilterAttributes },
            { field: "STREET_ADDRESS", title: "<sup><img src='../../../Content/images/red_asterisk.png' /></sup>Street Address", width: "180px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#: STREET_ADDRESS == null ? '' : STREET_ADDRESS#", filterable: stringFilterAttributes },
            { field: "CITY", title: "<sup><img src='../../../Content/images/red_asterisk.png' /></sup>City", width: "80px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#: CITY == null ? '' : CITY#", filterable: stringFilterAttributes },
            { field: "STATE", title: "<sup><img src='../../../Content/images/red_asterisk.png' /></sup>State", width: "80px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-alpha" }, template: "#: STATE == null ? '' : STATE#", filterable: stringFilterAttributes },
            { field: "ZIP", title: "Zip", width: "80px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-number GridBorder" }, template: "#: ZIP == null ? '' : ZIP#", filterable: stringFilterAttributes },
            { field: "LAT", title: "Latitude", width: "100px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-number GridBorder" }, template: "#: LAT == null ? '' : LAT#", filterable: stringFilterAttributes },
            { field: "LONG", title: "Longitude", width: "110px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-number GridBorder" }, template: "#: LONG == null ? '' : LONG#", filterable: stringFilterAttributes },
            { field: "POLE_LOCATION", title: "Pole<br/>Location", width: "120px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#: POLE_LOCATION == null ? '' : POLE_LOCATION#", filterable: stringFilterAttributes },
            { field: "DOITT_NTP_STATUS_LU.LU_NAME", title: "DOITT NTP<br/>Status", width: "100px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#: DOITT_NTP_STATUS_LU.LU_NAME == null ? '' : DOITT_NTP_STATUS_LU.LU_NAME#", filterable: stringFilterAttributes },
            { field: "DOITT_NTP_GRANTED_DATE", title: "DOITT NTP<br/>Granted Date", width: "170px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-number GridBorder" }, format: "{0: MM/dd/yyyy}", filterable: { cell: { operator: "eq", showOperators: true } } },
            { field: "JOB_CATEGORY_LU.LU_NAME", title: "Job<br/>Category", width: "120px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#: JOB_CATEGORY_LU.LU_NAME == null ? '' : JOB_CATEGORY_LU.LU_NAME#", filterable: stringFilterAttributes },
            { field: "JOB_STATUS_LU.LU_NAME", title: "<sup><img src='../../../Content/images/red_asterisk.png' /></sup>Job Status", width: "120px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#: JOB_STATUS_LU.LU_NAME == null ? '' : JOB_STATUS_LU.LU_NAME#", filterable: stringFilterAttributes },
            { field: "ON_HOLD_REASON", title: "On-Hold Reason", width: "120px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#: ON_HOLD_REASON == null ? '' : ON_HOLD_REASON#", filterable: stringFilterAttributes },
            { field: "CLIENT_PM", title: "Client PM", width: "120px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#: CLIENT_PM == null ? '' : CLIENT_PM#", filterable: stringFilterAttributes },
            { field: "JOB_NOTES", title: "Job Notes", width: "180px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "GridBorder" }, template: JobNotesTemplate, filterable: stringFilterAttributes },
            { field: "NUMBER_OF_SUBMITTED_PERMITS", type: "number", title: "Number of Submitted<br/>Permits", width: "160px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-number GridBorder" }, template: "#: NUMBER_OF_SUBMITTED_PERMITS == null ? '' : NUMBER_OF_SUBMITTED_PERMITS#", aggregates: ["sum"], footerTemplate: sumTemplate, filterable: stringFilterAttributes },
            { field: "PERMIT_NOTES", title: "Permit Notes", width: "160px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#: PERMIT_NOTES == null ? '' : PERMIT_NOTES#", filterable: stringFilterAttributes },

            { field: "PermitsSummary.PERMITS_COUNT", title: "TOTAL<br/>PERMITS", width: "100px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-number GridBorder" }, template: "#: PermitsSummary.PERMITS_COUNT == null ? 0 : PermitsSummary.PERMITS_COUNT#", aggregates: ["sum"], footerTemplate: sumTemplate, filterable: numberFilterAttributes },
            { field: "PermitsSummary.ACTIVE_COUNT", title: "ACTIVE", width: "80px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-number GridBorder" }, template: "#: PermitsSummary.ACTIVE_COUNT == null ? 0 : PermitsSummary.ACTIVE_COUNT#", aggregates: ["sum"], footerTemplate: sumTemplate, filterable: numberFilterAttributes },
            { field: "PermitsSummary.EXPIRED_COUNT", title: "EXPIRED", width: "100px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-number GridBorder" }, template: "#: PermitsSummary.EXPIRED_COUNT == null ? 0 : PermitsSummary.EXPIRED_COUNT#", aggregates: ["sum"], footerTemplate: sumTemplate, filterable: numberFilterAttributes },
            { field: "PermitsSummary.EXPIRING_5DAYS_COUNT", title: "EXPIRING<br/>5 DAY", width: "80px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-number GridBorder" }, template: "#: PermitsSummary.EXPIRING_5DAYS_COUNT == null ? 0 : PermitsSummary.EXPIRING_5DAYS_COUNT#", aggregates: ["sum"], footerTemplate: sumTemplate, filterable: numberFilterAttributes },
            { field: "PermitsSummary.ON_HOLD_COUNT", title: "ON<br/>HOLD", width: "80px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-number GridBorder" }, template: "#: PermitsSummary.ON_HOLD_COUNT == null ? 0 : PermitsSummary.ON_HOLD_COUNT#", aggregates: ["sum"], footerTemplate: sumTemplate, filterable: numberFilterAttributes },
            { field: "PermitsSummary.REQUEST_EXTENSION_COUNT", title: "REQUEST<br/>EXTENSION", width: "120px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-number GridBorder" }, template: "#: PermitsSummary.REQUEST_EXTENSION_COUNT == null ? 0 : PermitsSummary.REQUEST_EXTENSION_COUNT#", aggregates: ["sum"], footerTemplate: sumTemplate, filterable: numberFilterAttributes },
            { field: "PermitsSummary.REQUEST_RENEWAL_COUNT", title: "REQUEST<br/>RENEWAL", width: "100px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-number GridBorder" }, template: "#: PermitsSummary.REQUEST_RENEWAL_COUNT == null ? 0 : PermitsSummary.REQUEST_RENEWAL_COUNT#", aggregates: ["sum"], footerTemplate: sumTemplate, filterable: numberFilterAttributes },
            { field: "PermitsSummary.PENDING_COUNT", title: "PENDING", width: "100px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-number GridBorder" }, template: "#: PermitsSummary.PENDING_COUNT == null ? 0 : PermitsSummary.PENDING_COUNT#", aggregates: ["sum"], footerTemplate: sumTemplate, filterable: numberFilterAttributes },
            { field: "PermitsSummary.REJECTED_COUNT", title: "REJECTED", width: "100px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-number GridBorder" }, template: "#: PermitsSummary.REJECTED_COUNT == null ? 0 : PermitsSummary.REJECTED_COUNT#", aggregates: ["sum"], footerTemplate: sumTemplate, filterable: numberFilterAttributes },

            { field: "PUNCHLIST_COMPLETE", title: "Punchlist<br/>Complete", width: "120px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#: PUNCHLIST_COMPLETE.replace(/ /g,'')#", filterable: stringFilterAttributes },
            { field: "PUNCHLIST_SUBMITTED_DATE", title: "Punchlist<br/>Submitted Date", width: "170px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-number GridBorder" }, format: "{0: MM/dd/yyyy}", filterable: { cell: { operator: "eq", showOperators: true } } },
            { field: "CLIENT_APPROVAL_DATE", title: "Client Approval<br/>Date", width: "170px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-number GridBorder" }, format: "{0: MM/dd/yyyy}", filterable: { cell: { operator: "eq", showOperators: true } } },

            { field: "PRIORITY", title: "PRIORITY", width: "160px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#: PRIORITY == null ? '' : PRIORITY#", filterable: stringFilterAttributes },
            { field: "PO_NUMBER", title: "PO NUMBER", width: "200px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#: PO_NUMBER == null ? '' : PO_NUMBER#", filterable: stringFilterAttributes },
            { field: "PO_AMOUNT", title: "PO Amount", type: "number", width: "110px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-number GridBorder" }, format: "{0:c}", filterable: numberFilterAttributes },
            { field: "INVOICE_DATE", title: "Invoice Date", width: "170px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-number GridBorder" }, format: "{0: MM/dd/yyyy}", filterable: { cell: { operator: "eq", showOperators: true } } },
            { field: "INVOICE_AMOUNT", title: "Invoice Amount", type: "number", width: "110px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-number GridBorder" }, format: "{0:c}", filterable: numberFilterAttributes },

            { field: "CREATED_BY", title: "CREATED_BY", width: "150px", hidden: true, headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "GridBorder" }, template: "#: CREATED_BY == null ? '' : CREATED_BY#" },
            { field: "CREATED_ON", title: "CREATED_ON", width: "150px", hidden: true, headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "GridBorder" }, template: "#: CREATED_ON == null ? '' : moment(CREATED_ON).format('MM/DD/YYYY')#", filterable: { cell: { operator: "eq", showOperators: true } } },
            { field: "MODIFIED_BY", title: "MODIFIED_BY", width: "150px", hidden: true, headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "GridBorder" }, template: "#: MODIFIED_BY == null ? '' : MODIFIED_BY#" },
            { field: "MODIFIED_ON", title: "MODIFIED_ON", width: "150px", hidden: true, headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "GridBorder" }, template: "#: MODIFIED_ON == null ? '' : moment(MODIFIED_ON).format('MM/DD/YYYY')#" },
            { field: "LOCK_COUNTER", title: "LOCK_COUNTER", width: "150px", hidden: true, headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "GridBorder" }, template: "#: LOCK_COUNTER == null ? '' : LOCK_COUNTER#" }
    ];
    $scope.gridOptions.dataBound = onDataBound;

    $scope.gridOptions.filterable = true;
    $scope.gridOptions.filterable = {
       mode: "row"
    }

    $scope.$on("CRUD_OPERATIONS_SUCCESS", function (event, args) {
        $scope.RefreshGrid();

    });
    $scope.$on("CLOSE_WITHOUT_CHANGE", function (event, args) {
        hilightEnteredRow();
    });
    $scope.OpenModalWindow = function (jobID, projectID, hylanProjectID, jobNumberID, window) {
        screenId = Globals.Screens.MANAGE_JOBS.ID;
        screenRecordId = jobID;
        $scope.isPopup = true;
        jobID = (jobID ? jobID : 0);
        var param = { USER_ID: $rootScope.currentUser.USER_ID, SCREEN_ID: Globals.Screens.MANAGE_JOBS.ID, SCREEN_RECORD_ID: jobID, HYLAN_PROJECT_ID: hylanProjectID, JOB_NUMBER_ID: jobNumberID, PROJECT_ID: projectID };
        $scope.ngDialogData = param;
        if ($scope.AllowToEdit == false && jobID != 0) {
            $scope.openDialog(window, param);
        }
        else if ($scope.AllowToEdit == true) {
            $scope.openDialog(window, param);
        }
    };

    $scope.OpenNotesWindow = function (jobID, hylanProjectID, jobNumberID) {
        screenId = Globals.Screens.MANAGE_JOBS.ID;
        screenRecordId = jobID;
        $scope.isPopup = true;
        jobID = (jobID ? jobID : 0);
        var param = { USER_ID: $rootScope.currentUser.USER_ID, SCREEN_ID: Globals.Screens.MANAGE_JOBS.ID, SCREEN_RECORD_ID: jobID, HYLAN_PROJECT_ID: hylanProjectID, JOB_NUMBER_ID: jobNumberID };
        $scope.ngDialogData = param;
        if ($scope.AllowToEdit == false && jobID != 0) {
            $scope.openDialog("NOTES", param);
        }
        else if ($scope.AllowToEdit == true) {
            $scope.openDialog("NOTES", param);
        }

    };

    $scope.RefreshGrid = function () {

        $scope.gridOptions.dataSource.read();

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
            //  ,
            //smartButtonTextConverter: function (itemText, originalItem) {
            //  if (itemText.length > 23)
            //    return itemText.substring(0, 23) + '..';
            //}
        };


        $scope.MSProjects.events = {
            onItemSelect: function (item) {
                setTooltipOnMultiSelect(objMulti.controlID, objMulti.selectedList, objMulti.displayProp);
                hylanCache.SetValue(objMulti.key, objMulti.selectedList.slice());
                $scope.RefreshGrid();
            },
            onItemDeselect: function (item) {
                setTooltipOnMultiSelect(objMulti.controlID, objMulti.selectedList, objMulti.displayProp);
                hylanCache.SetValue(objMulti.key, objMulti.selectedList.slice());
                $scope.RefreshGrid();
            },
            onDeselectAll: function (items) {

                setTooltipOnMultiSelect(objMulti.controlID, [], objMulti.displayProp);
                hylanCache.SetValue(objMulti.key, []);
                $scope.RefreshGrid();
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
    };


    var setDefaultValuesOnClientsMultiSelect = function (multiSelectObject) {
        var objMulti = multiSelectObject;  //need to set
        objMulti.selectedList = [];
        var objList = hylanCache.GetValue(objMulti.key);
        if (objList) {
            //add values in control ,values came from cache
            angular.forEach(objList, function (value) {
                objMulti.selectedList.push(value);
            });
            setTooltipOnMultiSelect(objMulti.controlID, objMulti.selectedList, objMulti.displayProp);
        }
    };

    //--------------------------Start DOITT_NTP_STATUS ProjectStatus MultiSelect-----------------               
    Globals.GetLookUp(Globals.LookUpTypes.DOITT_NTP_STATUS, false, function (result) {
        $scope.ntpStatusOptions = result;
    });

    var ntpStatusSelect = function () {
        $scope.selectedDOITTNTPStatusList = [];
        var objMulti = { controlID: 'divMultiSelDOITTNTPStatus', idProp: 'LOOK_UP_ID', displayProp: 'LU_NAME', filterField: 'DOITT_NTP_STATUS_LU.LU_NAME' };
        $scope.ntpStatusSettings = {
            externalIdProp: '',
            idProp: objMulti.idProp,
            displayProp: objMulti.displayProp,
            enableSearch: true,
            scrollable: true,
            showCheckAll: false,
            showUncheckAll: true,
            smartButtonMaxItems: 3,
            closeOnBlur: true
        };



        $scope.DOITTNTPStatusEvents = {
            onItemSelect: function (item) {
                setTooltipOnMultiSelect(objMulti.controlID, $scope.selectedDOITTNTPStatusList, objMulti.displayProp);
                hylanCache.SetValue(hylanCache.Keys.DOITT_NTP_STATUS, $scope.selectedDOITTNTPStatusList.slice(), Globals.Screens.MANAGE_JOBS.ID);
                $scope.RefreshGrid();
            },
            onItemDeselect: function (item) {
                setTooltipOnMultiSelect(objMulti.controlID, $scope.selectedDOITTNTPStatusList, objMulti.displayProp);
                hylanCache.SetValue(hylanCache.Keys.DOITT_NTP_STATUS, $scope.selectedDOITTNTPStatusList.slice(), Globals.Screens.MANAGE_JOBS.ID);
                $scope.RefreshGrid();
            },
            onDeselectAll: function (items) {
                //remove all values on control
                setTooltipOnMultiSelect(objMulti.controlID, [], objMulti.displayProp);
                hylanCache.SetValue(hylanCache.Keys.DOITT_NTP_STATUS, [], Globals.Screens.MANAGE_JOBS.ID);
                $scope.RefreshGrid();
            }
        };
    }

    var setDoITTNTPStatusMultiSelectDefaultValues = function () {
        $scope.selectedDOITTNTPStatusList = [];
        var selectedObjects = hylanCache.GetValue(hylanCache.Keys.DOITT_NTP_STATUS, Globals.Screens.MANAGE_JOBS.ID);
        if (selectedObjects) {

            //add values on control, values came from cache
            angular.forEach(selectedObjects, function (value) {
                $scope.selectedDOITTNTPStatusList.push(value);
            });
            setTooltipOnMultiSelect('divMultiSelDOITTNTPStatus', $scope.selectedDOITTNTPStatusList, 'LU_NAME');
        }
    };

    ntpStatusSelect();
    //--------------------------End DOITT_NTP_STATUS MultiSelect-----------------    

    //--------------------------Start Job Categories MultiSelect-----------------               
    Globals.GetLookUp(Globals.LookUpTypes.JOB_CATEGORY, false, function (result) {
        $scope.jobCategoryLU = result;
    });

    var jobCategoryMultiSelect = function () {
        $scope.selectedJobCategoryList = [];
        var objMulti = { controlID: 'divMultiSelJobCategory', idProp: 'LU_NAME', displayProp: 'LU_NAME', filterField: 'JOB_CATEGORY_LU.LU_NAME' };
        $scope.jobCategorySettings = {
            externalIdProp: '',
            idProp: objMulti.idProp,
            displayProp: objMulti.displayProp,
            enableSearch: true,
            scrollable: true,
            showCheckAll: false,
            showUncheckAll: true,
            smartButtonMaxItems: 3,
            closeOnBlur: true
        };



        $scope.JobCategoriesEvents = {
            onItemSelect: function (item) {
                setTooltipOnMultiSelect(objMulti.controlID, $scope.selectedJobCategoryList, objMulti.displayProp);
                hylanCache.SetValue(hylanCache.Keys.JOB_CATEGORY, $scope.selectedJobCategoryList.slice(), Globals.Screens.MANAGE_JOBS.ID);
                $scope.RefreshGrid();
            },
            onItemDeselect: function (item) {
                setTooltipOnMultiSelect(objMulti.controlID, $scope.selectedJobCategoryList, objMulti.displayProp);
                hylanCache.SetValue(hylanCache.Keys.JOB_CATEGORY, $scope.selectedJobCategoryList.slice(), Globals.Screens.MANAGE_JOBS.ID);
                $scope.RefreshGrid();
            },
            onDeselectAll: function (items) {
                setTooltipOnMultiSelect(objMulti.controlID, [], objMulti.displayProp);
                hylanCache.SetValue(hylanCache.Keys.JOB_CATEGORY, [], Globals.Screens.MANAGE_JOBS.ID);
                $scope.RefreshGrid();
            }
        };
    }

    var setJobCategoryMultiSelectDefaultValues = function () {
        $scope.selectedJobCategoryList = [];
        var selectedObjects = hylanCache.GetValue(hylanCache.Keys.JOB_CATEGORY, Globals.Screens.MANAGE_JOBS.ID);
        if (selectedObjects) {

            //add values on control, values came from cache
            angular.forEach(selectedObjects, function (value) {
                $scope.selectedJobCategoryList.push(value);
            });

            setTooltipOnMultiSelect('divMultiSelJobCategory', $scope.selectedJobCategoryList, 'LU_NAME');
        }
    };

    jobCategoryMultiSelect();
    //--------------------------End Job Categories MultiSelect-----------------    

    //--------------------------Start Job Status MultiSelect-----------------               
    Globals.GetLookUp(Globals.LookUpTypes.JOB_STATUS, false, function (result) {
        $scope.jobStatusLU = result;
    });

    var jobStatusMultiSelect = function () {
        $scope.selectedJobStatusList = [];
        var objMulti = { controlID: 'divMultiSelJobStatus', idProp: 'LOOK_UP_ID', displayProp: 'LU_NAME', filterField: 'JOB_STATUS_LU.LU_NAME' };
        $scope.jobStatusSettings = {
            externalIdProp: '',
            idProp: objMulti.idProp,
            displayProp: objMulti.displayProp,
            enableSearch: true,
            scrollable: true,
            showCheckAll: false,
            showUncheckAll: true,
            smartButtonMaxItems: 3,
            closeOnBlur: true
        };



        $scope.JobStatusEvents = {
            onItemSelect: function (item) {
                setTooltipOnMultiSelect(objMulti.controlID, $scope.selectedJobStatusList, objMulti.displayProp);
                hylanCache.SetValue(hylanCache.Keys.JOB_STATUS, $scope.selectedJobStatusList.slice(), Globals.Screens.MANAGE_JOBS.ID);
                $scope.RefreshGrid();
            },
            onItemDeselect: function (item) {
                setTooltipOnMultiSelect(objMulti.controlID, $scope.selectedJobStatusList, objMulti.displayProp);
                hylanCache.SetValue(hylanCache.Keys.JOB_STATUS, $scope.selectedJobStatusList.slice(), Globals.Screens.MANAGE_JOBS.ID);
                $scope.RefreshGrid();

            },
            onDeselectAll: function (items) {
                setTooltipOnMultiSelect(objMulti.controlID, [], objMulti.displayProp);
                hylanCache.SetValue(hylanCache.Keys.JOB_STATUS, [], Globals.Screens.MANAGE_JOBS.ID);
                $scope.RefreshGrid();
            }
        };
    }
    jobStatusMultiSelect();



    var setJobStatusMultiSelectDefaultValues = function () {
        $scope.selectedJobStatusList = [];
        var selectedObjects = hylanCache.GetValue(hylanCache.Keys.JOB_STATUS, Globals.Screens.MANAGE_JOBS.ID);
        if (selectedObjects) {

            //add values on control, values came from cache
            angular.forEach(selectedObjects, function (value) {
                $scope.selectedJobStatusList.push(value);
            });
            setTooltipOnMultiSelect('divMultiSelJobStatus', $scope.selectedJobStatusList, 'LU_NAME');
        }
        else {
            //if no filter is set and comming to screen first time then set the active filter and set it in the cache
            var item = $.grep($scope.jobStatusLU, function (e) {
                return e.LU_NAME == 'Active';
            });
            $scope.selectedJobStatusList.push(item[0]);
            setTooltipOnMultiSelect('divMultiSelJobStatus', $scope.selectedJobStatusList, 'LU_NAME');
            hylanCache.SetValue(hylanCache.Keys.JOB_STATUS, $scope.selectedJobStatusList.slice(), Globals.Screens.MANAGE_JOBS.ID);
        }
    };
    //--------------------------End Job Categories MultiSelect-----------------    
    //--------------------------Start Clients MultiSelect-----------------  
    Globals.GetLookUp(Globals.LookUpTypes.DAILY_SHIFT, false, function (result) {
        $scope.dailyShiftDS = result;
    });

    var ClientstMultiSelect = function () {

        var objMulti = {
            controlID: 'divMultiSelClients', options: $scope.clientsDS, selectedList: [],
            idProp: 'COMPANY_ID', displayProp: 'COMPANY_NAME', key: hylanCache.Keys.CLIENTS + Globals.Screens.MANAGE_JOBS.ID
        };
        $scope.MSClients = objMulti;
        $scope.MSClients.settings = {
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



        $scope.MSClients.events = {
            onItemSelect: function (item) {
                setTooltipOnMultiSelect(objMulti.controlID, objMulti.selectedList, objMulti.displayProp);
                hylanCache.SetValue(objMulti.key, objMulti.selectedList.slice());
                $scope.RefreshGrid();
            },
            onItemDeselect: function (item) {
                setTooltipOnMultiSelect(objMulti.controlID, objMulti.selectedList, objMulti.displayProp);
                hylanCache.SetValue(objMulti.key, objMulti.selectedList.slice());
                $scope.RefreshGrid();
            },
            onDeselectAll: function (items) {

                setTooltipOnMultiSelect(objMulti.controlID, [], objMulti.displayProp);
                hylanCache.SetValue(objMulti.key, []);
                $scope.RefreshGrid();
            }
        };
    }

    ClientstMultiSelect();
    //--------------------------End Clients MultiSelect----------------- 
    $scope.ApplyCache = function () {  //being called from baseController
        setJobStatusMultiSelectDefaultValues();
        setDefaultValuesOnMultiSelect($scope.MSProjects);
        setDoITTNTPStatusMultiSelectDefaultValues();
        setJobCategoryMultiSelectDefaultValues();
        setDefaultValuesOnClientsMultiSelect($scope.MSClients);
    }
    $scope.ApplyCache();

    $scope.destroyRecords = function (e) {
        Utility.HideNotification();
        Globals.changedModelIds = [];
        var grid = $scope.grid;
        var selectedRows = grid.select();
        var selDataItems = [];

        $.each(selectedRows, function (index, value) {
            var dataItem = grid.dataItem(value);
            if ($.inArray(dataItem.id, Globals.changedModelIds) == -1) {
                Globals.changedModelIds.push(dataItem.id);
                selDataItems.push(grid.dataItem(value));
            }
        });

        if (selectedRows.length == 0) {
            alert(Globals.NoRowSelectedToDeleteMessage);
            return;
        }

        if (Globals.changedModelIds <= 0) {
            return;
        }
        var message = Globals.BasicDeleteConfirmation;
        if (confirm(message) == true) {; }
        else return;

        JobsService.deleteJobs(selDataItems).then(function (result) {
            onSuccess(result);
        }).fail(onError);
    };

    function onSuccess(result) {
        Globals.changedModelIds = [];
        $scope.gridOptions.dataSource.read();
        Utility.Notify({ type: NOTIFYTYPE.SUCCESS, message: "Changes Saved.", IsPopUp: false });

    }

    function onError(XMLHttpRequest, textStatus, errorThrown) {
        var changedModelIds = Globals.changedModelIds;
        $rootScope.$broadcast('dbCommandCompleted', { source: 'update' });

        $('.k-grid-save-changes').removeClass('disabled');
        IsPopUp = false;
        var exception = XMLHttpRequest.responseText ? XMLHttpRequest.responseText : errorThrown;

        var exceptionfieldindex = exception.indexOf('$');
        var exceptionMsg = exception.substring(0, exceptionfieldindex);
        var exceptionfieldids = exception.substring(exceptionfieldindex + 2, exception.length).split(',');

        //ids other than exception remove it from grid
        $(changedModelIds).each(function (index, value) {
            if ($.inArray(value.toString(), exceptionfieldids) == -1) {
                var grid = $scope.grid;
                grid.dataSource.remove(grid.dataSource.get(value));
            }
        });

        //highligh the remaining ids
        if (changedModelIds.length > 0) {
            $(changedModelIds).each(function (index, value) {
                var hasidError = false;
                var item;

                item = $.grep($("#grid1").data("kendoGrid")._data, function (item) { return (item.id == value); });

                if (item.length != 0) {
                    for (var i = 0; i <= exceptionfieldids.length; i++) {
                        if (item[0].id == exceptionfieldids[i]) {
                            hasidError = true;
                            break;
                        }
                    }
                }

                if (hasidError) {
                    $("#grid1 .k-grid-content-locked").find("tr[data-uid='" + item[0].uid + "']").removeClass('k-state-selected');
                    $("#grid1 .k-grid-content").find("tr[data-uid='" + item[0].uid + "']").removeClass('k-state-selected');
                    $("#grid1 .k-grid-content-locked").find("tr[data-uid='" + item[0].uid + "']").css("background-color", "#FDCCCC");
                    $("#grid1 .k-grid-content").find("tr[data-uid='" + item[0].uid + "']").css("background-color", "#FDCCCC");
                    hasidError = false;
                }
            });

            Globals.changedModelIds = [];
        }

        if (Utility.IsJSON(exception)) {
            var jsonObj = JSON.parse(exception)
            if (jsonObj.Message) {
                var dollarIndex = jsonObj.Message.indexOf('$');
                if (dollarIndex > -1)
                    exceptionMsg = jsonObj.Message.substring(0, dollarIndex);
                else
                    exceptionMsg = jsonObj.Message;
            }
        }
        Utility.Notify({ type: NOTIFYTYPE.ERROR, message: exceptionMsg, IsPopUp: IsPopUp });
    }
}
]);

