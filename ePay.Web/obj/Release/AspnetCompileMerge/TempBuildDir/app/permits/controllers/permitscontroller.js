angular.module('HylanApp').controller("PermitsController", ['$rootScope', '$scope', '$controller', '$timeout', 'PermitService', 'ngDialog', 'Utility', 'NOTIFYTYPE', '$interval', '$filter', 'hylanCache',
function ($rootScope, $scope, $controller, $timeout, PermitService, ngDialog, Utility, NOTIFYTYPE, $interval, $filter, hylanCache) {
    $scope.AddButtonText = "Add Permit";

    $controller('BaseController', { $scope: $scope });
    $scope.multiSelectControl = {};
    $scope.multiSelectProjIdControl = {};
    if ($rootScope.isUserLoggedIn == false)
        return false;
    $scope.AllowToEdit = true;
    $scope.ApiResource = "Permits";
    var editPerm = Globals.CheckEditPermission($scope.Screens.MANAGE_PERMITS.ID);
    if (editPerm == false) {
        $scope.AllowToEdit = false;
    }
    //var onDataBound = function (args) {
    //    $scope.handleDataBound(true);
    //    $scope.$emit("ChildGridLoaded", args.sender);
    //};

    Globals.GetProjects().then(function (result) {
        //$scope.projectsDS = result.objResultList;
        //$scope.projectsDS = $filter('orderBy')($scope.projectsDS, '-CREATED_ON');

        var unknownPrj = { PROJECT_ID: -1, HYLAN_PROJECT_ID: "Unknown" };
        if (result.objResultList && result.objResultList.length == 0)
            result.objResultList = [];

        $scope.projectsDS = $filter('orderBy')(result.objResultList, 'HYLAN_PROJECT_ID');
        $scope.projectsDS.splice(0, 0, unknownPrj);

    });

    $scope.defaultSort = PermitService.defaultSort;

       //-- if searchcolumn type = number then operator will be equal
    $scope.searchColumns = [
            //{ field: "PERMIT_ID" },
            //{ field: "PROJECT_ID" },
            { field: "HYLAN_PROJECT_ID" },
            { field: "JOB_FILE_NUMBER" },
            { field: "PermitLinkText" },
            { field: "SUBMITTED_DATE", type: 'date' },
            { field: "PERMIT_STATUS_NAME" },
            { field: "PERMIT_NUMBER_TEXT" },
            { field: "PERMIT_TYPE" },
            { field: "PERMIT_DESCRIPTION" },
            { field: "PERMIT_CATEGORY_NAME" },
            { field: "IS_PROTECTED_STREET1" },
            { field: "STIPULATION_DAY1" },
            { field: "STIPULATION_NIGHT1" },
            { field: "STIPULATION_WEEKEND1" },
            { field: "STIPULATIONS_OTHER" },
            { field: "SEGMENT" },
            { field: "MARKOUT_START_DATE", type: 'date' },
            { field: "MARKOUT_END_DATE", type: 'date' },
            { field: "ISSUED_DATE", type: 'date' },
            { field: "VALID_DATE", type: 'date' },
            { field: "EXPIRES_DATE", type: 'date' },
            { field: "REJECTED_DATE", type: 'date' },
            { field: "REJECTED_REASON_NAME" },
            { field: "NOTES" },
            { field: "CLIENT" },
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
            { field: "ATTACHMENTS_COUNT", type:'number' }
            //{ field: "CREATED_BY" },
            //{ field: "CREATED_ON" },
            //{ field: "MODIFIED_BY" },
            //{ field: "MODIFIED_ON" },
            //{ field: "LOCK_COUNTER" },


    ];

    //prepare the toolbar for filter and to add, deleted record
    $scope.GetCustomToolbar = function () {
        var toolbar = [];
        var deleteBtn = { name: "custom_destroy", template: '<a class="k-button k-button-icontext k-grid-destroyRecord" id="toolbar-custom_destroy" ng-click="destroyRecords();"><span class="k-icon k-i-delete"></span>Delete</a>' }
        var addBtn = { name: "Add Job", template: '<a class="k-button k-button-icontext k-grid-save-changes" ng-click="OpenPermitCRUDWindow(0,' + $scope.AllowToEdit +')"><span class="k-icon k-i-add"></span>' + $scope.AddButtonText + '</a>' };
        //toolbar.push(deleteBtn);
        toolbar.push(addBtn);
        return toolbar;

        //if ($scope.gridOptions.toolbar)
        // $scope.gridOptions.toolbar.unshift({ name: "custom_destroy", template: '<a class="k-button k-button-icontext k-grid-destroyRecord" id="toolbar-custom_destroy" ng-click="destroyRecord();"><span class="k-icon k-delete"></span>Delete</a>' });
    };

    $scope.ResetFilter = function () {
        $scope.clearFilters();
        $scope.gridOptions.dataSource.read();
        $scope.selectedProjectsList = [];

        if ($scope.multiSelectControl.resetQuerySearchBox != undefined) {
            $scope.multiSelectControl.resetQuerySearchBox();
        }

        if ($scope.multiSelectProjIdControl.resetQuerySearchBox != undefined) {
            $scope.multiSelectProjIdControl.resetQuerySearchBox();
        }
        $scope.ApplyCache();
        $("form.k-filter-menu button[type='reset']").trigger("click");
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

        // Internet Explorer 6-11
        var isIE = /*@cc_on!@*/false || !!document.documentMode;
        if (!isIE) {
            Globals.resizeGrid("#responsive-tables #grid1", availableHeight * 0.89);
        }
    }
    $scope.gridOptions.editable = false;
    PermitService.dataSource._filter = [];

    //binding grid datasource
    $scope.gridOptions.dataSource = PermitService.dataSource;
    $scope.gridOptions.dataBound = function (args) {
        $scope.handleDataBound(true);
        $scope.$emit("ChildGridLoaded", args.sender);
        hilightEnteredRow();
    }

        //fixing for hand held devices
        var strColWidth = '9%';
        var numColWidth = '7%';
        maxlen = 6;
        if (/iPad/.test(Globals.UserAgent) || /Android/.test(Globals.UserAgent)) {
            strColWidth = '150px';
            numColWidth = '85px';
        }
        var permitAttachmentsTemplate
        if (Globals.IsScreenVisible($scope.Screens.PERMIT_ATTACHMENTS.ID)) {
            permitAttachmentsTemplate = "<a href='javascript:;' ng-click='setScreenAndRowID(#:PERMIT_ID#); OpenAttachmentCRUDWindow(#:PERMIT_ID#, #:JOB_ID#, #:PROJECT_ID#, \"#:HYLAN_PROJECT_ID#\", \"#:JOB_FILE_NUMBER#\", \"ATTACHMENTS\")' >(#:ATTACHMENTS_COUNT#)</a>";
        }
        else {
            permitAttachmentsTemplate = "#: ATTACHMENTS_COUNT == null ? '' : ATTACHMENTS_COUNT#";
        }
        //creating link that will display inside the grid        
        //var permitTemplate = "<a href='javascript:;' ng-click='OpenPermitCRUDWindow(#:PERMIT_ID#," + $scope.AllowToEdit + " )' >View/Edit</a>";
        var PermitLinkTextTemplate = "<a href='javascript:;' ng-click='setScreenAndRowID(#:PERMIT_ID#); OpenPermitCRUDWindow(#:PERMIT_ID#," + $scope.AllowToEdit + "," + $scope.Screens.MANAGE_PERMITS.ID + " )' >#: PermitLinkText == null ? '' : PermitLinkText#</a>";
        var dotTrackingNoTemplate = "<a href='javascript:;' ng-click='setScreenAndRowID(#:PERMIT_ID#); OpenPermitCRUDWindow(#:PERMIT_ID#," + $scope.AllowToEdit + "," + $scope.Screens.MANAGE_PERMITS.ID + " )' >#: DOT_TRACKING_NUMBER == null ? '' : DOT_TRACKING_NUMBER#</a>";
        var hylenProjectIDTemplate
        if (Globals.IsScreenVisible($scope.Screens.MANAGE_PROJECTS.ID)) {
            hylenProjectIDTemplate = function (dataItem) {
                if (dataItem.PROJECT_ID != null && dataItem.PROJECT_ID != -1) {
                    var hylanProjectID = dataItem.HYLAN_PROJECT_ID == null && dataItem.HYLAN_PROJECT_ID != 'Unknown' ? '' : dataItem.HYLAN_PROJECT_ID
                    return "<a href='javascript:;' ng-click='setScreenAndRowID(" + dataItem.PERMIT_ID + "); OpenProjectCRUDWindow(" + dataItem.PROJECT_ID + ")' >" + dataItem.HYLAN_PROJECT_ID + "</a>";
                } else {
                    return "Unknown";
                }
            }
        }
        else {
            hylenProjectIDTemplate = function (dataItem) {
                if (dataItem.PROJECT_ID != null && dataItem.PROJECT_ID != -1) {
                    var hylanProjectID = dataItem.HYLAN_PROJECT_ID == null && dataItem.HYLAN_PROJECT_ID != 'Unknown' ? '' : dataItem.HYLAN_PROJECT_ID
                    return  dataItem.HYLAN_PROJECT_ID;
                } else {
                    return "Unknown";
                }
            }

        }
        var jobFileNumberTemplate
        if (Globals.IsScreenVisible($scope.Screens.MANAGE_JOBS.ID)) {
            jobFileNumberTemplate = function (dataItem) {
                if (dataItem.JOB_ID != null && dataItem.JOB_ID != -1) {
                    var jobFileNo = dataItem.JOB_FILE_NUMBER == null && dataItem.JOB_FILE_NUMBER != 'Unknown' ? '' : dataItem.JOB_FILE_NUMBER
                    return "<a href='javascript:;' ng-click='setScreenAndRowID(" + dataItem.PERMIT_ID + "); OpenJobCRUDWindow(" + dataItem.JOB_ID + "," + $scope.AllowToEdit + " )' >" + jobFileNo + "</a>";
                } else {
                    return "Unknown";
                }
            }
        }
        else {
            jobFileNumberTemplate = function (dataItem) {
                if (dataItem.JOB_ID != null && dataItem.JOB_ID != -1) {
                    var jobFileNo = dataItem.JOB_FILE_NUMBER == null && dataItem.JOB_FILE_NUMBER != 'Unknown' ? '' : dataItem.JOB_FILE_NUMBER
                    return  jobFileNo;
                } else {
                    return "Unknown";
                }
            }
        }

        var sumTemplate = "#=(sum == undefined || sum == null) ? 0 : kendo.toString(sum,'n0')#";
        
        var JobNotesTemplate
        if (Globals.IsScreenVisible($scope.Screens.JOB_NOTES.ID)) {
            JobNotesTemplate = "<a href='javascript:;' ng-click='setScreenAndRowID(#:PERMIT_ID#); OpenNotesWindow(#:JOB_ID#)' >#:JOB_NOTES#</a>";
        }
        else {
            JobNotesTemplate = "#: JOB_NOTES == null ? '(0)' : JOB_NOTES#";
        }
        $scope.gridOptions.columns = [
                { field: "ROW_HEADER", width: "20px", title: "   .", sortable: false, locked: true, headerAttributes: { "class": "sub-col darkYellow-col rowHeaderHeadYellow", "style": "border-right: 0px !important;" }, attributes: { "class": "contert-alpha GridBorder rowHeaderCell" }, filterable: false },
                //{ field: "VIEW_EDIT", title: "View/Edit", width: "100px",sortable: false, locked: true, headerAttributes: { "class": "sub-col darkYellow-col rowHeaderHead2" }, attributes: { "class": "GridBorder" }, template: permitTemplate, filterable: false },
                //{ field: "PermitLinkText", title: "View/Edit", width: "100px", locked: true, headerAttributes: { "class": "sub-col darkYellow-col rowHeaderHead2" }, attributes: { "class": "GridBorder" }, template: PermitLinkTextTemplate , filterable: stringFilterAttributes },
                { field: "PERMIT_ID", type: "number", title: "Project ID11", width: "80px", hidden: true, locked: true, headerAttributes: { "class": "sub-col darkYellow-col rowHeaderHead2" }, attributes: { "class": "GridBorder" }, template: "#: PERMIT_ID == null ? '' : PERMIT_ID#", filterable: stringFilterAttributes },
                { field: "PROJECT_ID", title: "Project ID11", width: "80px", hidden: true, locked: true, headerAttributes: { "class": "sub-col darkYellow-col rowHeaderHead2" }, attributes: { "class": "GridBorder" }, template: "#: PROJECT_ID == null ? '' : PROJECT_ID#", filterable: stringFilterAttributes },
                { field: "HYLAN_PROJECT_ID", title: "<sup><img src='../../../Content/images/red_asterisk.png' /></sup>Project ID", width: "150px", locked: true, headerAttributes: { "class": "sub-col darkYellow-col rowHeaderHead2" }, attributes: { "class": "GridBorder" }, template: hylenProjectIDTemplate, footerAttributes: { "class": "section-border" }, filterable: stringFilterAttributes }, //, aggregates: ["count"], footerTemplate: sumTemplate
                { field: "JOB_FILE_NUMBER", title: "<sup><img src='../../../Content/images/red_asterisk.png' /></sup>Job File<br/>Number", width: "100px", locked: true, headerAttributes: { "class": "sub-col darkYellow-col rowHeaderHead2" }, attributes: { "class": "GridBorder" }, template: jobFileNumberTemplate, filterable: stringFilterAttributes },
                { field: "PermitLinkText", title: "<sup><img src='../../../Content/images/red_asterisk.png' /></sup>DOT<br/>TRACKING #", width: "210px", locked: true, headerAttributes: { "class": "sub-col darkYellow-col rowHeaderHead2 section-border" }, attributes: { "class": "GridBorder section-border" }, template: PermitLinkTextTemplate, filterable: stringFilterAttributes },

                { field: "SUBMITTED_DATE", title: "<sup><img src='../../../Content/images/red_asterisk.png' /></sup>SUBMITTED DATE", width: "170px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-number GridBorder" }, format: "{0: MM/dd/yyyy}", filterable: { cell: { operator: "eq", showOperators: true } } },
                { field: "PERMIT_STATUS_NAME", title: "<sup><img src='../../../Content/images/red_asterisk.png' /></sup>PERMIT<br/>STATUS", width: "120px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#: PERMIT_STATUS_NAME == null ? '' : PERMIT_STATUS_NAME#", filterable: stringFilterAttributes },
                { field: "ATTACHMENTS_COUNT", title: "ATTACHMENTS", width: "120px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "GridBorder" }, template: permitAttachmentsTemplate, filterable: false },

                { field: "PERMIT_NUMBER_TEXT", title: "PERMIT #", width: "120px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#: PERMIT_NUMBER_TEXT == null ? '' : PERMIT_NUMBER_TEXT#", filterable: stringFilterAttributes },
                { field: "PERMIT_TYPE", title: "PERMIT TYPE", width: "120px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-number GridBorder" }, template: "#: PERMIT_TYPE == null ? '' : PERMIT_TYPE#", filterable: stringFilterAttributes },
                { field: "PERMIT_DESCRIPTION", title: "PERMIT DESCRIPTION", width: "220px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#: PERMIT_DESCRIPTION == null ? '' : PERMIT_DESCRIPTION#", filterable: stringFilterAttributes },
                { field: "PERMIT_CATEGORY_NAME", title: "PERMIT CATEGORY", width: "220px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#: PERMIT_CATEGORY_NAME == null ? '' : PERMIT_CATEGORY_NAME#", filterable: stringFilterAttributes },

                { field: "IS_PROTECTED_STREET1", title: "PROTECTED STREET", width: "100px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#= YesNoTemplate(IS_PROTECTED_STREET1)#", filterable: { cell: { template: YesNoFilterTemplate, showOperators: false } } },
                { field: "STIPULATION_DAY1", title: "STIPULATION<br/>DAY", width: "100px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#= YesNoTemplate(STIPULATION_DAY1)#", filterable: { cell: { template: YesNoFilterTemplate, showOperators: false } } },
                { field: "STIPULATION_NIGHT1", title: "STIPULATION<br/>NIGHT", width: "100px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#= YesNoTemplate(STIPULATION_NIGHT1)#", filterable: { cell: { template: YesNoFilterTemplate, showOperators: false } } },
                { field: "STIPULATION_WEEKEND1", title: "STIPULATION<br/>WEEKEND", width: "100px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#= YesNoTemplate(STIPULATION_WEEKEND1)#", filterable: { cell: { template: YesNoFilterTemplate, showOperators: false } } },

                { field: "STIPULATIONS_OTHER", title: "OTHER STIPULATIONS", width: "120px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#: STIPULATIONS_OTHER == null ? '' : STIPULATIONS_OTHER#", filterable: stringFilterAttributes },
                { field: "SEGMENT", title: "SEGMENT/<br/>BLOCK", width: "120px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#: SEGMENT == null ? '' : SEGMENT#", filterable: stringFilterAttributes },
                { field: "MARKOUT_START_DATE", title: "MARKOUT<br/>START DATE", width: "170px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-number GridBorder" }, format: "{0: MM/dd/yyyy}", filterable: { cell: { operator: "eq", showOperators: true } } },
                { field: "MARKOUT_END_DATE", title: "MARKOUT<br/>END DATE", width: "170px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-number GridBorder" }, format: "{0: MM/dd/yyyy}", filterable: { cell: { operator: "eq", showOperators: true } } },

                { field: "ISSUED_DATE", title: "ISSUED DATE", width: "170px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-number GridBorder" }, format: "{0: MM/dd/yyyy}", filterable: { cell: { operator: "eq", showOperators: true } } },
                { field: "VALID_DATE", title: "VALID DATE", width: "170px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-number GridBorder" }, format: "{0: MM/dd/yyyy}", filterable: { cell: { operator: "eq", showOperators: true } } },
                { field: "EXPIRES_DATE", title: "EXPIRES DATE", width: "170px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-number GridBorder" }, format: "{0: MM/dd/yyyy}", filterable: { cell: { operator: "eq", showOperators: true } } },
                { field: "REJECTED_DATE", title: "REJECTED<br/>DATE", width: "170px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-number GridBorder" }, format: "{0: MM/dd/yyyy}", filterable: { cell: { operator: "eq", showOperators: true } } },

                { field: "REJECTED_REASON_NAME", title: "REJECTED<br/>REASON", width: "120px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#: REJECTED_REASON_NAME == null ? '' : REJECTED_REASON_NAME#", filterable: stringFilterAttributes },
                { field: "NOTES", title: "NOTES", width: "160px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#= checkTextLength('', checkNull(PermitLinkText), '' , checkNull(data.NOTES))#", filterable: stringFilterAttributes },

                { field: "CLIENT", title: "<sup><img src='../../../Content/images/red_asterisk.png' /></sup>CLIENT", width: "120px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#: CLIENT == null ? '' : CLIENT#", filterable: stringFilterAttributes },
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
                { field: "CREATED_BY", title: "CREATED_BY", width: "150px", hidden: true, headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "GridBorder" }, template: "#: CREATED_BY == null ? '' : CREATED_BY#" },
                { field: "CREATED_ON", title: "CREATED_ON", width: "150px", hidden: true, headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "GridBorder" }, template: "#: CREATED_ON == null ? '' : moment(CREATED_ON).format('MM/DD/YYYY')#" },
                { field: "MODIFIED_BY", title: "MODIFIED_BY", width: "150px", hidden: true, headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "GridBorder" }, template: "#: MODIFIED_BY == null ? '' : MODIFIED_BY#" },
                { field: "MODIFIED_ON", title: "MODIFIED_ON", width: "150px", hidden: true, headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "GridBorder" }, template: "#: MODIFIED_ON == null ? '' : moment(MODIFIED_ON).format('MM/DD/YYYY')#" },
                { field: "LOCK_COUNTER", title: "LOCK_COUNTER", width: "150px", hidden: true, headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "GridBorder" }, template: "#: LOCK_COUNTER == null ? '' : LOCK_COUNTER#" }
        ];

        $scope.gridOptions.filterable = true;
        $scope.gridOptions.filterable = {
            mode: "row"
        }
    //$scope.gridOptions.dataBound = onDataBound;

    $scope.$on("CRUD_OPERATIONS_SUCCESS", function (event, args) {
        $scope.RefreshGrid();
    });
    $scope.$on("CLOSE_WITHOUT_CHANGE", function (event, args) {
        hilightEnteredRow();
    });
    $scope.OpenModalWindow = function (jobID, hylanProjectID, jobNumberID, window) {
        screenId = Globals.Screens.MANAGE_JOBS.ID;
        screenRecordId = jobID;
        $scope.isPopup = true;
        jobID = (jobID ? jobID : 0);
        var param = { USER_ID: $rootScope.currentUser.USER_ID, SCREEN_ID: Globals.Screens.MANAGE_JOBS.ID, SCREEN_RECORD_ID: jobID, HYLAN_PROJECT_ID: hylanProjectID, JOB_NUMBER_ID: jobNumberID };
        $scope.ngDialogData = param;
        if (($scope.AllowToEdit == false && jobID != 0) || $scope.AllowToEdit == true) {
            $scope.openDialog(window, param);
        }
    };

    $scope.OpenNotesWindow = function (jobID) {
        screenId = Globals.Screens.MANAGE_JOBS.ID;
        screenRecordId = jobID;
        $scope.isPopup = true;
        jobID = (jobID ? jobID : 0);
        var param = { USER_ID: $rootScope.currentUser.USER_ID, SCREEN_ID: Globals.Screens.MANAGE_JOBS.ID, SCREEN_RECORD_ID: jobID };
        $scope.ngDialogData = param;
        $scope.openDialog("NOTES", param);
    };

    $scope.RefreshGrid = function () {
        $scope.gridOptions.dataSource.read();
    }
    $scope.setScreenAndRowID = function (rowID) {
       
        hylanCache.SetValue(hylanCache.Keys.NEWLYADDED_ROWID, rowID, $scope.Screens.MANAGE_PERMITS.ID);
    }
    var hilightEnteredRow = function () {
        
        var newlyAddedRecordID = hylanCache.GetValue(hylanCache.Keys.NEWLYADDED_ROWID, $scope.Screens.MANAGE_PERMITS.ID);
        if (newlyAddedRecordID) {
            $("#grid1 tr.k-state-selected").removeClass("k-state-selected");
            var grid = $scope.gridOptions.dataSource;
             $.each(grid._data, function (index, value) {
                var model = value;
                if (model.PERMIT_ID == newlyAddedRecordID) {//some condition
                    $('[data-uid=' + model.uid + ']').addClass('k-state-selected');
                }
               
            });

            hylanCache.RemoveKey(hylanCache.Keys.NEWLYADDED_ROWID, $scope.Screens.MANAGE_PERMITS.ID);

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
        var objMulti = multiSelectObject;  //need to set
        objMulti.selectedList = [];
        var projects = hylanCache.GetValue(objMulti.key);
        if (projects) {
            //add values in control ,values came from cache
            angular.forEach(projects, function (value) {
                objMulti.selectedList.push(value);
            });
            setTooltipOnMultiSelect(objMulti.controlID, objMulti.selectedList, objMulti.displayProp);
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

        if (Globals.changedModelIds <= 0) {
            return;
        }
        var message = Globals.BasicDeleteConfirmation;
        if (confirm(message) == true) {; }
        else return;

        PermitService.deleteJobs(selDataItems).then(function (result) {
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

