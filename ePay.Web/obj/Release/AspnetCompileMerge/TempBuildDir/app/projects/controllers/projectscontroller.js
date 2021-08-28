var genEditAccessType = "GLOBAL";
var screenId = null;
var screenRecordId = null;
angular.module('HylanApp').controller("ProjectsController", ['$rootScope', '$scope', '$controller', '$timeout', 'ProjectsService', 'Utility', 'hylanCache', '$state',
function ($rootScope, $scope, $controller, $timeout, ProjectsService, Utility, hylanCache, $state) {
    $scope.AddButtonText = "Add Project";
    $controller('BaseController', { $scope: $scope });
    $scope.multiSelectControl = {};
    if ($rootScope.isUserLoggedIn == false)
        return false;
    var SelID = 0;
    $scope.ApiResource = "Projects";
    $scope.CurrentView = "ManageProjects";
    var selectedpProjectType = 0;
    $scope.AllowToEdit = true;
    var editPerm = Globals.CheckEditPermission($scope.Screens.MANAGE_PROJECTS.ID);
    if (editPerm == false) {
        $scope.AllowToEdit = false;
        $scope.gridOptions.editable = false;
        $('#grid1 .k-grid-custom_add').addClass('hide');
        $('#grid1 .k-grid-save-changes').addClass('hide');

    }
    Globals.GetLookUp(Globals.LookUpTypes.PROJECT_STATUS, false, function (result) {
        $scope.ProjectStatusDS1 = result;
    });


    Globals.GetCompanies(false).then(function (result) {
        $scope.ClientsDS = result.objResultList;
    });

    var onDataBound = function (args) {

        $scope.handleDataBound(true, false, SelID);
        $scope.$emit("ChildGridLoaded", args.sender);

        hilightEnteredRow();
    };

    // Defining Filters here.
    //filters work with dropdown being displayed in dropdown
    //$scope.filters = {
    //    "CLIENT_NAME": { name: "CLIENT_NAME", operator: "eq", value: "0", elementType: "select" },
    //    "PROJECT_STATUS_LU": { name: "PROJECT_STATUS_LU", operator: "eq", value: "Active", field: "PROJECT_STATUS_LU.LU_NAME", elementType: "multi-select", logic: "or", fieldValueOperation: 'add' }
    //};

    ////default sortings  
    //$scope.defaultFilter = { name: "PROJECT_STATUS_LU", operator: "eq", value: "Active", field: "PROJECT_STATUS_LU.LU_NAME", elementType: "multi-select", logic: "or", fieldValueOperation: 'add' };
    $scope.defaultSort = ProjectsService.defaultSort;

    //filters column works with Global search
    //-- if searchcolumn type = number then operator will be equal
    $scope.searchColumns = [
            //{ field: "PROJECT_ID", type: 'number' },
            { field: "HYLAN_PROJECT_ID" },
            { field: "HYLAN_JOB_NUMBER", type: 'number' },
            { field: "JOBS" },
            { field: "PROJECT_BID_NAME" },
            { field: "CLIENT_NAME" },
            { field: "PROJECT_STATUS_LU.LU_NAME", type: 'number' },
            { field: "TENTATIVE_PROJECT_START_DATE", type: 'date' },
            { field: "ACTUAL_PROJECT_START_DATE", type: 'date' },
            { field: "PROJECTED_END_DATE", type: 'date' },
            { field: "ACTUAL_PROJECT_CLOSE_DATE", type: 'date' },
            { field: "PROJECT_BID_DATE", type: 'date' },
            { field: "PROJECT_AWARDED", type: 'date' },
            { field: "ATTACHMENTS" },
            { field: "NOTES" },
            { field: "PO_NUMBER" },
            { field: "PO_AMOUNT" }
    ];

    //prepare the toolbar for filter and to add, deleted record
    $scope.GetCustomToolbar = function () {
        var toolbar = [];
        var add = { name: "Add Project", template: '<a class="k-button k-button-icontext k-grid-save-changes" ng-click="OpenProjectCRUDWindow()"><span class="k-icon k-i-add"></span>' + $scope.AddButtonText + '</a>' };
        toolbar.push(add);
        return toolbar;
    };

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
    ProjectsService.dataSource._filter = [];
    if ($scope.AllowToEdit == false) {
        $('#grid1 .k-grid-toolbar').addClass('hide');
        $(".k-button").addClass("k-state-disabled").removeClass("k-grid-save-changes");
    }
    //binding grid datasource
    $scope.gridOptions.dataSource = ProjectsService.dataSource;

    //fixing for hand held devices
    var strColWidth = '9%';
    var numColWidth = '7%';
    maxlen = 6;
    if (/iPad/.test(Globals.UserAgent) || /Android/.test(Globals.UserAgent)) {
        strColWidth = '150px';
        numColWidth = '85px';
    }
    //creating link that will display inside the grid
    var hylenProjectIDTemplate = "<a href='javascript:;' ng-click='setScreenAndRowID(#:PROJECT_ID#); OpenProjectCRUDWindow(#:PROJECT_ID#)' >#: HYLAN_PROJECT_ID == null ? '' : HYLAN_PROJECT_ID#</a>";
    var ProjectNotesTemplate
    if (Globals.IsScreenVisible($scope.Screens.PROJECT_NOTES.ID)) {
        ProjectNotesTemplate = "<a href='javascript:;' ng-click='setScreenAndRowID(#:PROJECT_ID#); OpenModalWindow(#:PROJECT_ID#,\"#:HYLAN_PROJECT_ID#\", #:HYLAN_JOB_NUMBER#, \"NOTES\")' >#:NOTES#</a>";
    }
    else {
        ProjectNotesTemplate = "#: NOTES == null ? '(0)' : NOTES#";
    }
    var ProjectAttachmentsTemplate
    if (Globals.IsScreenVisible($scope.Screens.PROJECT_ATTACHMENTS.ID)) {
        ProjectAttachmentsTemplate = "<a href='javascript:;' ng-click='setScreenAndRowID(#:PROJECT_ID#); OpenAttachmentsWindow(#:PROJECT_ID#, \"#:HYLAN_PROJECT_ID#\", #:HYLAN_JOB_NUMBER#, \"ATTACHMENTS\")' >#:ATTACHMENTS#</a>";
    }
    else {
        ProjectAttachmentsTemplate = "#: ATTACHMENTS == null ? '(0)' : ATTACHMENTS#";
    }
    var viewJobTemplate
    if (Globals.IsScreenVisible($scope.Screens.MANAGE_JOBS.ID)) {
        viewJobTemplate = "<a href='javascript:;' ng-click='setScreenAndRowID(#:PROJECT_ID#); OpenManageJobs(dataItem)' >#: JOBS == null ? '' : JOBS#</a>";
    }
    else {
        viewJobTemplate = "#: JOBS == null ? '' : JOBS#";
    }
    //_ProjectStatusDS = Globals.GetLookUp(Globals.LookUpTypes.PROJECT_STATUS, false);
    //$scope.ProjectStatus = _ProjectStatusDS;
    $scope.gridOptions.columns = [
        { field: "ROW_HEADER", width: "20px", title: "   .", sortable: false, locked: true, headerAttributes: { "class": "sub-col darkYellow-col rowHeaderHeadYellow", "style": "border-right: 0px !important;" }, attributes: { "class": "contert-alpha GridBorder rowHeaderCell" }, filterable: false },
        { field: "PROJECT_ID", title: "Project ID", hidden: true, width: "150px", locked: true, headerAttributes: { "class": "sub-col darkYellow-col rowHeaderHead2" }, attributes: { "class": "contert-number GridBorder" }, template: "#: PROJECT_ID == null ? '' : PROJECT_ID#"  },
        { field: "HYLAN_PROJECT_ID", title: "PROJECT ID", locked: true, width: "150px", headerAttributes: { "class": "sub-col darkYellow-col rowHeaderHead2" }, attributes: { "class": "GridBorder" }, template: hylenProjectIDTemplate, filterable: stringFilterAttributes },
        { field: "HYLAN_JOB_NUMBER", title: "HYLAN<br/>JOB NUMBER", locked: true, width: "150px", headerAttributes: { "class": "sub-col darkYellow-col rowHeaderHead2" }, attributes: { "class": "GridBorder" }, template: "#: HYLAN_JOB_NUMBER == null ? '' : HYLAN_JOB_NUMBER#", filterable: stringFilterAttributes },
        { field: "JOBS", title: "JOBS", width: "120px", locked: true, headerAttributes: { "class": "sub-col darkYellow-col rowHeaderHead2 section-border" }, attributes: { "class": "GridBorder section-border" }, template: viewJobTemplate, filterable: false },
        { field: "PROJECT_BID_NAME", title: "<sup><img src='../../../Content/images/red_asterisk.png' /></sup>PROJECT/BID NAME", width: "250px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#: PROJECT_BID_NAME == null ? '' : PROJECT_BID_NAME#", filterable: stringFilterAttributes },
        //{ field: "CLIENT", title: "CLIENT", width: "200px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#: CLIENT == null ? '' : CLIENT#" },
        { field: "CLIENT_NAME", title: "<sup><img src='../../../Content/images/red_asterisk.png' /></sup>CLIENT", width: "150px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#: CLIENT_NAME == null ? '' : CLIENT_NAME#", filterable: stringFilterAttributes },
        { field: "PROJECT_STATUS_LU.LU_NAME", title: "<sup><img src='../../../Content/images/red_asterisk.png' /></sup>PROJECT STATUS", width: "150px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#: PROJECT_STATUS_LU.LU_NAME == null ? '' : PROJECT_STATUS_LU.LU_NAME#", filterable: stringFilterAttributes },
        { field: "TENTATIVE_PROJECT_START_DATE", title: "TENTATIVE<br/>START DATE", width: "170px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-number GridBorder" }, format: "{0: MM/dd/yyyy}", filterable: { cell: { operator: "eq", showOperators: true } } },
        { field: "ACTUAL_PROJECT_START_DATE", title: "ACTUAL<br/>START DATE", width: "170px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-number GridBorder" }, format: "{0: MM/dd/yyyy}", filterable: { cell: { operator: "eq", showOperators: true } } },
        { field: "PROJECTED_END_DATE", title: "PROJECTED<br/>END DATE", width: "170px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-number GridBorder" }, format: "{0: MM/dd/yyyy}", filterable: { cell: { operator: "eq", showOperators: true } } },
        { field: "ACTUAL_PROJECT_CLOSE_DATE", title: "ACTUAL<br/>CLOSE DATE", width: "170px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-number GridBorder" }, format: "{0: MM/dd/yyyy}", filterable: { cell: { operator: "eq", showOperators: true } } },
        { field: "PROJECT_BID_DATE", title: "BID DATE", width: "170px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-number GridBorder" }, format: "{0: MM/dd/yyyy}", filterable: { cell: { operator: "eq", showOperators: true } } },
        { field: "PROJECT_AWARDED", title: "PROJECT AWARDED", width: "170px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-number GridBorder" }, format: "{0: MM/dd/yyyy}", filterable: { cell: { operator: "eq", showOperators: true } } },
        { field: "ATTACHMENTS", title: "BID<br/>DOCUMENTS", width: "110px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "GridBorder" }, template: ProjectAttachmentsTemplate, filterable: false },
        { field: "NOTES", title: "NOTES", width: "180px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "GridBorder" }, template: ProjectNotesTemplate, filterable: false },
        { field: "PO_NUMBER", title: "PO NUMBER", width: "200px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#: PO_NUMBER == null ? '' : PO_NUMBER#", filterable: stringFilterAttributes },
        { field: "PO_AMOUNT", title: "PO Amount", type: "number", width: "110px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-number GridBorder" }, format: "{0:c}", filterable: numberFilterAttributes },
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
    $scope.gridOptions.editable = false;
    $scope.gridOptions.dataBound = onDataBound;



    //managing add edit windows
    $scope.OpenProjectCRUDWindow = function (projectID) {

        $scope.isPopup = true;
        projectID = (projectID ? projectID : 0);
        var param = { USER_ID: $rootScope.currentUser.USER_ID, ID: projectID };
        $scope.ngDialogData = param;
        if ($scope.AllowToEdit == false && projectID > 0) {
            $scope.openDialog("PROJECT-CRUD", param);
        }
        else if ($scope.AllowToEdit == true) {
            $scope.openDialog("PROJECT-CRUD", param);
        }
    };

    $scope.$on("CRUD_OPERATIONS_SUCCESS", function (event, args) {
        $scope.RefreshGrid();
    });
    $scope.$on("CLOSE_WITHOUT_CHANGE", function (event, args) {
        hilightEnteredRow();
    });
    $scope.OpenModalWindow = function (projectID, hylanProjectID, jobNumberID, window) {
        screenId = Globals.Screens.MANAGE_PROJECTS.ID;
        screenRecordId = projectID;
        $scope.isPopup = true;
        projectID = (projectID ? projectID : 0);
        var param = { USER_ID: $rootScope.currentUser.USER_ID, SCREEN_ID: Globals.Screens.MANAGE_PROJECTS.ID, SCREEN_RECORD_ID: projectID, HYLAN_PROJECT_ID: hylanProjectID, JOB_NUMBER_ID: jobNumberID };
        $scope.ngDialogData = param;
        $scope.openDialog(window, param);
    };
    $scope.OpenAttachmentsWindow = function (projectID, hylanProjectID, jobNumberID, window) {
        screenId = Globals.Screens.MANAGE_PROJECTS.ID;
        screenRecordId = projectID;
        $scope.isPopup = true;
        projectID = (projectID ? projectID : 0);
        var param = { USER_ID: $rootScope.currentUser.USER_ID, SCREEN_ID: Globals.Screens.MANAGE_PROJECTS.ID, SCREEN_RECORD_ID: projectID, HYLAN_PROJECT_ID: hylanProjectID, JOB_NUMBER_ID: jobNumberID };
        $scope.ngDialogData = param;
        $scope.openDialog(window, param);
    };
    $scope.OpenManageJobs = function (selectedRow) {
        var selectedList = [];
        selectedList.push(selectedRow);
        hylanCache.SetValue(hylanCache.Keys.PROJECTS, selectedList);

        //set remaining filters to all
        hylanCache.SetValue(hylanCache.Keys.DOITT_NTP_STATUS, [], Globals.Screens.MANAGE_JOBS.ID);
        hylanCache.SetValue(hylanCache.Keys.JOB_CATEGORY, [], Globals.Screens.MANAGE_JOBS.ID);
        hylanCache.SetValue(hylanCache.Keys.JOB_STATUS, [], Globals.Screens.MANAGE_JOBS.ID);
        hylanCache.SetValue(hylanCache.Keys.CLIENTS, [], Globals.Screens.MANAGE_JOBS.ID);
        //re direct to manage projects page
        $state.go('Jobs', {
            url: '/Jobs',
            views: {
                'PageButtons': {
                    templateUrl: Globals.BaseUrl + 'app/Jobs/views/menu.html'
                },
                'BodyContent': {
                    templateUrl: Globals.BaseUrl + 'app/Jobs/views/index.html',
                    controller: 'JobsController'
                }
            },
            title: 'Manage Jobs - Hylan',
            screenId: Globals.Screens.MANAGE_JOBS.ID
        });
    }
    $scope.$on("NOTES_SUCCESS", function (event, args) {
        $scope.RefreshGrid();
    });
    $scope.RefreshGrid = function () {
        $scope.gridOptions.dataSource.read();

    }
    $scope.setScreenAndRowID = function (rowID) {

        hylanCache.SetValue(hylanCache.Keys.NEWLYADDED_ROWID, rowID, $scope.Screens.MANAGE_PROJECTS.ID);
    }
    var hilightEnteredRow = function () {
        var newlyAddedRecordID = hylanCache.GetValue(hylanCache.Keys.NEWLYADDED_ROWID, $scope.Screens.MANAGE_PROJECTS.ID);
        if (newlyAddedRecordID) {
            $("#grid1 tr.k-state-selected").removeClass("k-state-selected");
            var grid = $scope.gridOptions.dataSource;

            $.each(grid._data, function (index, value) {
                var model = value;
                if (model.PROJECT_ID == newlyAddedRecordID) {//some condition
                    $('[data-uid=' + model.uid + ']').addClass('k-state-selected');
                }

            });

            hylanCache.RemoveKey(hylanCache.Keys.NEWLYADDED_ROWID, $scope.Screens.MANAGE_PROJECTS.ID);



        }

    }



    $scope.ResetFilter = function () {
        $scope.clearFilters();

        //$scope.selectedStatusList = [];

        //setMultiSelectDefaultValues();        
        if ($scope.multiSelectControl.resetQuerySearchBox != undefined) {
            $scope.multiSelectControl.resetQuerySearchBox();
        }
        hylanCache.RemoveKey($scope.MSClients.key);
        hylanCache.RemoveKey($scope.MSProjectStatus.key);
        $scope.ApplyCache();
        $scope.gridOptions.dataSource.read();
    }

    //--------------------------Start Clients MultiSelect-----------------  
    var clientsMultiSelect = function () {

        var objMulti = {
            controlID: 'divMSClients', options: $scope.ClientsDS, selectedList: [],
            idProp: 'COMPANY_ID', displayProp: 'COMPANY_NAME', key: hylanCache.Keys.CLIENTS + Globals.Screens.MANAGE_PROJECTS.ID
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
    };

    clientsMultiSelect();
    //--------------------------End Clients MultiSelect----------------- 
    //var setClientsMultiSelectDefaultValues = function () {
    //    $scope.MSClients.selectedList = [];
    //    var latestClients = hylanCache.GetValue(hylanCache.Keys.CLIENTS , Globals.Screens.MANAGE_PROJECTS.ID);
    //    if (latestClients) {
    //        //add values in control ,values came from cache
    //        angular.forEach(latestClients, function (value) {
    //            $scope.MSClients.selectedList.push(value);
    //        });
    //        setTooltipOnMultiSelect('divMSClients', $scope.MSClients.selectedList, 'COMPANY_ID');
    //    }
    //};
    //        

    //--------------------------Start ProjectStatus MultiSelect-----------------               
    $scope.projectStatusOptions = Globals.GetLookUp(Globals.LookUpTypes.PROJECT_STATUS, false);//_ProjectStatusDS;//result.objResultList;

    var projectStatusMultiSelect = function () {

        var objMulti = {
            controlID: 'divMSProjectStatus', options: $scope.projectStatusOptions, selectedList: [],
            idProp: 'LOOK_UP_ID', displayProp: 'LU_NAME', key: hylanCache.Keys.PROJECT_STATUS + Globals.Screens.MANAGE_PROJECTS.ID
        };
        $scope.MSProjectStatus = objMulti;
        $scope.MSProjectStatus.settings = {
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

        $scope.MSProjectStatus.events = {
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
    };

    projectStatusMultiSelect();

    var setDefaultValuesOnMultiSelect = function (multiSelectObject) {
        var objMulti = multiSelectObject;  //need to set
        objMulti.selectedList = [];
        var latestProjects = hylanCache.GetValue(objMulti.key);
        if (latestProjects) {
            //add values in control ,values came from cache
            angular.forEach(latestProjects, function (value) {
                objMulti.selectedList.push(value);
            });
            setTooltipOnMultiSelect(objMulti.controlID, objMulti.selectedList, objMulti.displayProp);
        }
        else {  //loading first time
            if (objMulti.controlID == 'divMSProjectStatus') {
                var item = $.grep(objMulti.options, function (e) {
                    return e.LU_NAME == 'Active';
                });
                objMulti.selectedList.push(item[0]);
                setTooltipOnMultiSelect(objMulti.controlID, objMulti.selectedList, objMulti.displayProp);
                hylanCache.SetValue(objMulti.key, objMulti.selectedList.slice());
            }

        }
    };

    //var setMultiSelectDefaultValues = function () {
    //    var item = $.grep($scope.projectStatusOptions, function (e) {
    //        return e.LU_NAME == 'Active';
    //    });
    //    $scope.MSProjectStatus.push(item[0]);
    //    setTooltipOnMultiSelect('divMultiSelProjectStatus', $scope.selectedStatusList, 'LU_NAME');
    //};
    //setMultiSelectDefaultValues();
    //--------------------------End ProjectStatus MultiSelect-----------------    
    $scope.ApplyCache = function () {  //being called from baseController
        setDefaultValuesOnMultiSelect($scope.MSClients);
        setDefaultValuesOnMultiSelect($scope.MSProjectStatus);
    };

    $scope.ApplyCache();


}

]);

