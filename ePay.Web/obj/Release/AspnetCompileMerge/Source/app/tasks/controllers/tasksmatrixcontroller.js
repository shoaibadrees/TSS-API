var DSAdminUsers = [];

var completedTaskTitle = "Completed";
var pendingTaskTitle = "Pending";
var notNeededTaskTitle = "Not Needed";
var onHoldTaskTitle = "On Hold";

angular.module('HylanApp').controller("TaskMatrixController", ['$rootScope', '$scope', '$controller', 'TaskMatrixService', '$timeout', '$filter', 'hylanCache',
    function ($rootScope, $scope, $controller, TaskMatrixService, $timeout, $filter, hylanCache) {
        $scope.ApiResource = "Tasks";
        $scope.CurrentView = "TaskMatrix";
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
        $scope.selectedTMDate = FormatDate(new Date());
        $scope.selectedProjectID = "-1";
        Globals.GetProjects().then(function (result) {
            //$scope.projectsDS = result.objResultList;
            $scope.projectsDS = $filter('orderBy')(result.objResultList, 'HYLAN_PROJECT_ID');
        });
        var AllowToEdit = true;
        var editPerm = Globals.CheckEditPermission($scope.Screens.TASK_MATRIX.ID);
        if (editPerm == false)
            AllowToEdit = false;
        $scope.defaultSort = TaskMatrixService.defaultSort;
        var hylenProjectIDTemplate
        if (Globals.IsScreenVisible($scope.Screens.MANAGE_PROJECTS.ID)) {
            hylenProjectIDTemplate = "<a href='javascript:;' ng-click='setScreenAndRowID(#:JOB_ID#); OpenProjectCRUDWindow(#:PROJECT_ID#)' >#= checkNull(data.HYLAN_PROJECT_ID)#</a>";
        }
        else {
            hylenProjectIDTemplate = "#= checkNull(data.HYLAN_PROJECT_ID)#";
        }
        var jobFileNumberTemplate
        if (Globals.IsScreenVisible($scope.Screens.MANAGE_JOBS.ID)) {
            jobFileNumberTemplate = "<a href='javascript:;' ng-click='setScreenAndRowID(#:JOB_ID#); OpenJobCRUDWindow(#:JOB_ID#," + AllowToEdit + ")' >#: JOB_FILE_NUMBER == null ? '' : JOB_FILE_NUMBER#</a>";
        }
        else {
            jobFileNumberTemplate = "#: JOB_FILE_NUMBER == null ? '' : JOB_FILE_NUMBER#";
        }
        var taskTemplate
        if (Globals.IsScreenVisible($scope.Screens.MANAGE_TASKS.ID)) {
            taskTemplate = "<a href='javascript:;' ui-sref='Tasks({JOB: {JOB_ID:#:JOB_ID#, HYLAN_PROJECT_ID:\"#:HYLAN_PROJECT_ID#\",JOB_FILE_NUMBER:\"#:JOB_FILE_NUMBER#\", BACK_STATE:\"TaskMatrixDashboard\"}})' >(#:NEEDED_TASKS_COUNT#)</a>";
        }
        else {
            taskTemplate = "#:NEEDED_TASKS_COUNT#";
        }
        var onDataBound = function (args) {
            $scope.handleDataBound(true);
            args.sender.view = "TaskMatrix";
            $scope.$emit("ChildGridLoaded", args.sender);
            $scope.CreateSummarySection();
            var TaskBackButton = hylanCache.GetValue(hylanCache.Keys.TASK_BACKBUTTON, $scope.Screens.TASK_MATRIX.ID);

            if (TaskBackButton && $scope.loadCount > 0 || TaskBackButton == undefined)
            hilightEnteredRow();
        };

        $scope.gridOptions.editable = false;
        $scope.gridOptions.toolbar = [];
        $scope.gridOptions.filterable = {
            mode: "row"
        }

        Globals.GetUsers(false, AppSettings.Hylan_PM_RoleName).then(function (result) {
            DSAdminUsers = result.objResultList;
        });
        $scope.searchColumns = [
               { field: "HYLAN_PROJECT_ID" },
               { field: "JOB_FILE_NUMBER" },
               { field: "TOTAL_TASKS" },
               { field: "CLIENT_NAME" },
               { field: "NEEDED_TASKS_COUNT", type: 'number' },
               { field: "CTZ_STATUS" },
               { field: "APP_STATUS" },
               { field: "FDW_STATUS" },
               { field: "PLW_STATUS" },
               { field: "FBD_STATUS" },
               { field: "PWD_STATUS" },
               { field: "UGM_STATUS" },
               { field: "FBP_STATUS" },
               { field: "FBS_STATUS" },
               { field: "SRA_STATUS" },
               { field: "PMS_STATUS" }
        ];

        $scope.gridOptions.dataSource = TaskMatrixService.dataSource;
        $scope.gridOptions.dataBound = onDataBound;
        $scope.gridOptions.columns = [
                {
                    title: "General", locked: true, headerAttributes: { "class": "section-border" },
                    columns: [{ field: "ROW_HEADER", filterable: false, width: "20px", title: "   .", sortable: false, locked: true, headerAttributes: { "class": "sub-col darkYellow-col rowHeaderHeadYellow", "style": "border-right: 0px !important;" }, attributes: { "class": "contert-alpha  rowHeaderCell" } },
                              { field: "PROJECT_ID", title: "Project ID11", width: "80px", hidden: true, locked: true, headerAttributes: { "class": "sub-col darkYellow-col rowHeaderHead2" }, attributes: { "class": "" }, template: "#= checkNull(data.PROJECT_ID)#" },
                              { field: "HYLAN_PROJECT_ID", title: "Project ID", width: "150px", locked: true, headerAttributes: { "class": "sub-col darkYellow-col rowHeaderHead2" }, attributes: { "class": "" }, template: hylenProjectIDTemplate, filterable: stringFilterAttributes },
                              { field: "JOB_FILE_NUMBER", title: "Job File Number", width: "180px", locked: true, headerAttributes: { "class": "sub-col no-left-border darkYellow-col", "style": "border-left: 0px white;" }, attributes: { "class": "" }, template: jobFileNumberTemplate, filterable: stringFilterAttributes },
                              { field: "CLIENT_NAME", title: "Client", width: "120px", locked: true, headerAttributes: { "class": "sub-col no-left-border darkYellow-col", "style": "border-left: 0px white;" }, attributes: { "class": "contert-alpha" }, template: "#= checkNull(data.CLIENT_NAME)#", filterable: stringFilterAttributes },
                              { field: "NEEDED_TASKS_COUNT", title: "TASKS", width: "120px", locked: true, headerAttributes: { "class": "sub-col darkYellow-col section-border", "style": "border-left: 0px white;" }, attributes: { "class": "section-border" }, template: taskTemplate, filterable: false }]
                },
                {
                    title: "Continuity", headerAttributes: { "class": "section-border" },
                    columns: [{
                        field: "CTZ_STATUS", title: "Continuity to Zero M/H", width: "220px", headerAttributes: { "class": "sub-col  continuity  section-border" },
                        attributes: { "class": "contert-alpha section-border" }, template: "#= checkNull(data.CTZ_STATUS)#", filterable: stringFilterAttributes
                    }]
                },
                {
                    title: "Foundation/Pole", headerAttributes: { "class": "section-border" },
                    columns: [
                        {
                            field: "APP_STATUS", title: "AC Power To Pole", width: "180px", headerAttributes: { "class": "sub-col  foundationpole" },
                            attributes: { "class": "contert-alpha" }, template: "#= checkNull(data.APP_STATUS)#", filterable: stringFilterAttributes
                        },
                        {
                            field: "FDW_STATUS", title: "Foundation Work", width: "200px", headerAttributes: { "class": "sub-col  foundationpole" },
                            attributes: { "class": "contert-alpha " }, template: "#= checkNull(data.FDW_STATUS)#", filterable: stringFilterAttributes
                        },
                        {
                            field: "PLW_STATUS", title: "Pole Work", width: "140px", headerAttributes: { "class": "sub-col   section-border foundationpole" },
                            attributes: { "class": "contert-alpha  section-border" }, template: "#= checkNull(data.PLW_STATUS)#", filterable: stringFilterAttributes
                        }]
                },
                {
                    title: "Underground", headerAttributes: { "class": "section-border" },
                    columns: [{
                        field: "FBD_STATUS", title: "Fiber Dig", width: "140px", headerAttributes: { "class": "sub-col  underground" },
                        attributes: { "class": "contert-alpha " }, template: "#= checkNull(data.FBD_STATUS)#", filterable: stringFilterAttributes
                    },
                    {
                        field: "PWD_STATUS", title: "Power Dig", width: "140px", headerAttributes: { "class": "sub-col  underground" },
                        attributes: { "class": "contert-alpha " }, template: "#= checkNull(data.PWD_STATUS)#", filterable: stringFilterAttributes
                    },
                    {
                        field: "UGM_STATUS", title: "Underground Misc.", width: "190px", headerAttributes: { "class": "sub-col  underground  section-border" },
                        attributes: { "class": "contert-alpha  section-border" }, template: "#= checkNull(data.UGM_STATUS)#", filterable: stringFilterAttributes
                    }]
                },
                {
                    title: "Fiber", headerAttributes: { "class": "section-border" },
                    columns: [{
                        field: "FBP_STATUS", title: "Fiber Pull", width: "140px", headerAttributes: { "class": "sub-col  fiber" },
                        attributes: { "class": "contert-alpha " }, template: "#= checkNull(data.FBP_STATUS)#", filterable: stringFilterAttributes
                    },
                    {
                        field: "FBS_STATUS", title: "Fiber Splicing", width: "160px", headerAttributes: { "class": "sub-col  fiber  section-border" },
                        attributes: { "class": "contert-alpha  section-border" }, template: "#= checkNull(data.FBS_STATUS)#", filterable: stringFilterAttributes
                    }]
                },
                {
                    title: "Node Installs", headerAttributes: { "class": "section-border" },
                    columns: [{
                        field: "SRA_STATUS", title: "Shroud/Antenna", width: "180px", headerAttributes: { "class": "sub-col  nodeinstalls" },
                        attributes: { "class": "contert-alpha " }, template: "#= checkNull(data.SRA_STATUS)#", filterable: stringFilterAttributes
                    },
                    {
                        field: "PMS_STATUS", title: "PIM'S & Sweeps", width: "160px", headerAttributes: { "class": "sub-col  nodeinstalls  section-border" },
                        attributes: { "class": "contert-alpha  section-border" }, template: "#= checkNull(data.PMS_STATUS)#", filterable: stringFilterAttributes
                    }]
                }
        ];


        $scope.refreshGrid = function () {
            $scope.gridOptions.dataSource.read();
        }

        $scope.$on("CRUD_OPERATIONS_SUCCESS", function (event, args) {
            $scope.refreshGrid();
        });
        $scope.$on("CLOSE_WITHOUT_CHANGE", function (event, args) {
            hilightEnteredRow();
        });
        $scope.ResetFilter = function () {
            $scope.clearFilters();
            hylanCache.RemoveKey(hylanCache.Keys.LATEST_PROJECTS, Globals.Screens.TASK_MATRIX.ID);
            hylanCache.RemoveKey(hylanCache.Keys.JOB_FILE_NUMBER, Globals.Screens.TASK_MATRIX.ID);
            hylanCache.RemoveKey(hylanCache.Keys.JOB_STATUS, Globals.Screens.TASK_MATRIX.ID);
            hylanCache.RemoveKey(hylanCache.Keys.TASK_STATUS, Globals.Screens.TASK_MATRIX.ID);
            hylanCache.RemoveKey(hylanCache.Keys.TM_DATE, Globals.Screens.TASK_MATRIX.ID);
            $scope.selectedTMDate = FormatDate(new Date());
            $scope.ApplyCache();
            $scope.refreshGrid();
        }
        $scope.OpenModalWindow = function (jobID, projectID, hylanProjectID, jobNumberID, window) {
            screenId = Globals.Screens.TASK_MATRIX.ID;
            screenRecordId = jobID;
            $scope.isPopup = true;
            jobID = (jobID ? jobID : 0);
            var param = { USER_ID: $rootScope.currentUser.USER_ID, SCREEN_ID: Globals.Screens.TASK_MATRIX.ID, SCREEN_RECORD_ID: jobID, HYLAN_PROJECT_ID: hylanProjectID, JOB_NUMBER_ID: jobNumberID, PROJECT_ID: projectID };
            $scope.ngDialogData = param;
            $scope.openDialog(window, param);
        };

        $scope.setScreenAndRowID = function (rowID) {
            hylanCache.SetValue(hylanCache.Keys.NEWLYADDED_ROWID, rowID, $scope.Screens.TASK_MATRIX.ID);
        }
        var hilightEnteredRow = function () {
            var newlyAddedRecordID = hylanCache.GetValue(hylanCache.Keys.NEWLYADDED_ROWID, $scope.Screens.TASK_MATRIX.ID);
            if (newlyAddedRecordID) {
                $("#grid1 tr.k-state-selected").removeClass("k-state-selected");
                var grid = $scope.gridOptions.dataSource;
                   $.each(grid._data, function (index, value) {
                    var model = value;
                    if (model.JOB_ID == newlyAddedRecordID) {//some condition
                        $('[data-uid=' + model.uid + ']').addClass('k-state-selected');
                    }
                  
                });

                hylanCache.RemoveKey(hylanCache.Keys.NEWLYADDED_ROWID, $scope.Screens.TASK_MATRIX.ID);


            }
            hylanCache.RemoveKey(hylanCache.Keys.TASK_BACKBUTTON, $scope.Screens.TASK_MATRIX.ID);
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
                    $scope.PopulateJFNDropDown(objMulti.selectedList.slice());
                    $scope.refreshGrid();
                },
                onItemDeselect: function (item) {
                    setTooltipOnMultiSelect(objMulti.controlID, objMulti.selectedList, objMulti.displayProp);
                    hylanCache.SetValue(objMulti.key, objMulti.selectedList.slice());
                    $scope.PopulateJFNDropDown(objMulti.selectedList.slice());
                    $scope.refreshGrid();
                },
                onDeselectAll: function (items) {
                    setTooltipOnMultiSelect(objMulti.controlID, [], objMulti.displayProp);
                    hylanCache.SetValue(objMulti.key, []);
                    $scope.PopulateJFNDropDown([]);
                    $scope.refreshGrid();
                }
            };
        }

        projectsMultiSelect();
        //--------------------------End ProjectStatus MultiSelect----------------- 
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
                    hylanCache.SetValue(hylanCache.Keys.JOB_STATUS, $scope.selectedJobStatusList.slice(), Globals.Screens.TASK_MATRIX.ID);
                    $scope.refreshGrid();
                },
                onItemDeselect: function (item) {
                    setTooltipOnMultiSelect(objMulti.controlID, $scope.selectedJobStatusList, objMulti.displayProp);
                    hylanCache.SetValue(hylanCache.Keys.JOB_STATUS, $scope.selectedJobStatusList.slice(), Globals.Screens.TASK_MATRIX.ID);
                    $scope.refreshGrid();

                },
                onDeselectAll: function (items) {
                    setTooltipOnMultiSelect(objMulti.controlID, [], objMulti.displayProp);
                    hylanCache.SetValue(hylanCache.Keys.JOB_STATUS, [], Globals.Screens.TASK_MATRIX.ID);
                    $scope.refreshGrid();
                }
            };
        }
        jobStatusMultiSelect();



        var setJobStatusMultiSelectDefaultValues = function () {
            $scope.selectedJobStatusList = [];
            var selectedObjects = hylanCache.GetValue(hylanCache.Keys.JOB_STATUS, Globals.Screens.TASK_MATRIX.ID);
            if (selectedObjects) {

                //add values on control, values came from cache
                angular.forEach(selectedObjects, function (value) {
                    $scope.selectedJobStatusList.push(value);
                });
                setTooltipOnMultiSelect('divMultiSelJobStatus', $scope.selectedJobStatusList, 'LU_NAME');
            }
        };
        //--------------------------End Job Status MultiSelect-----------------   

        //--------------------------Start Task Status MultiSelect-----------------               
        $scope.taskStatusLU = [{ 'LOOK_UP_ID': 'Pending', 'LU_NAME': pendingTaskTitle },
       { 'LOOK_UP_ID': 'Not Needed', 'LU_NAME': notNeededTaskTitle },
       { 'LOOK_UP_ID': 'On Hold', 'LU_NAME': onHoldTaskTitle },
       { 'LOOK_UP_ID': 'Completed', 'LU_NAME': completedTaskTitle }];


        var taskStatusMultiSelect = function () {
            $scope.selectedTaskStatusList = [];
            var objMulti = { controlID: 'divMultiSelTaskStatus', idProp: 'LOOK_UP_ID', displayProp: 'LU_NAME' };

            $scope.taskStatusSettings = {
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

            $scope.TaskStatusEvents = {
                onItemSelect: function (item) {
                    setTooltipOnMultiSelect(objMulti.controlID, $scope.selectedTaskStatusList, objMulti.displayProp);
                    hylanCache.SetValue(hylanCache.Keys.TASK_STATUS, $scope.selectedTaskStatusList.slice(), Globals.Screens.TASK_MATRIX.ID);
                    $scope.refreshGrid();
                },
                onItemDeselect: function (item) {
                    setTooltipOnMultiSelect(objMulti.controlID, $scope.selectedTaskStatusList, objMulti.displayProp);
                    hylanCache.SetValue(hylanCache.Keys.TASK_STATUS, $scope.selectedTaskStatusList.slice(), Globals.Screens.TASK_MATRIX.ID);
                    $scope.refreshGrid();

                },
                onDeselectAll: function (items) {
                    setTooltipOnMultiSelect(objMulti.controlID, [], objMulti.displayProp);
                    hylanCache.SetValue(hylanCache.Keys.TASK_STATUS, [], Globals.Screens.TASK_MATRIX.ID);
                    $scope.refreshGrid();
                }
            };
        }
        taskStatusMultiSelect();



        var setTaskStatusMultiSelectDefaultValues = function () {
            $scope.selectedTaskStatusList = [];
            var selectedObjects = hylanCache.GetValue(hylanCache.Keys.TASK_STATUS, Globals.Screens.TASK_MATRIX.ID);
            if (selectedObjects) {

                //add values on control, values came from cache
                angular.forEach(selectedObjects, function (value) {
                    $scope.selectedTaskStatusList.push(value);
                });
                setTooltipOnMultiSelect('divMultiSelTaskStatus', $scope.selectedTaskStatusList, 'LU_NAME');
            }
        };
        //--------------------------End Task Status MultiSelect----------------- 
        //--------------------------Start JFN MultiSelect-----------------               
        $scope.JFN_DS = [];

        $scope.PopulateJFNDropDown = function (selProjects) {
            var selPrjIds = "";
            if (selProjects && selProjects.length > 0) {
                $.each(selProjects, function (index, project) {
                    selPrjIds += project.PROJECT_ID;
                    if ((index + 1) < selProjects.length) {
                        selPrjIds += ",";
                    }
                });
            }
            Globals.GetJobFileNumbers(selPrjIds).then(function (result) {
                $scope.JFN_DS = result.objResultList;
            });
        };

        var JFNMultiSelect = function () {
            $scope.selectedJFNList = [];
            var objMulti = { controlID: 'divMultiSelJFN', idProp: 'TEXT', displayProp: 'TEXT' };

            $scope.JFNSettings = {
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

            $scope.JFNEvents = {
                onItemSelect: function (item) {
                    setTooltipOnMultiSelect(objMulti.controlID, $scope.selectedJFNList, objMulti.displayProp);
                    hylanCache.SetValue(hylanCache.Keys.JOB_FILE_NUMBER, $scope.selectedJFNList.slice(), Globals.Screens.TASK_MATRIX.ID);
                    $scope.refreshGrid();
                },
                onItemDeselect: function (item) {
                    setTooltipOnMultiSelect(objMulti.controlID, $scope.selectedJFNList, objMulti.displayProp);
                    hylanCache.SetValue(hylanCache.Keys.JOB_FILE_NUMBER, $scope.selectedJFNList.slice(), Globals.Screens.TASK_MATRIX.ID);
                    $scope.refreshGrid();

                },
                onDeselectAll: function (items) {
                    setTooltipOnMultiSelect(objMulti.controlID, [], objMulti.displayProp);
                    hylanCache.SetValue(hylanCache.Keys.JOB_FILE_NUMBER, [], Globals.Screens.TASK_MATRIX.ID);
                    $scope.refreshGrid();
                }
            };
        }
        JFNMultiSelect();



        var setJFNMultiSelectDefaultValues = function () {
            $scope.selectedJFNList = [];
            var selectedObjects = hylanCache.GetValue(hylanCache.Keys.JOB_FILE_NUMBER, Globals.Screens.TASK_MATRIX.ID);
            if (selectedObjects) {

                //add values on control, values came from cache
                angular.forEach(selectedObjects, function (value) {
                    $scope.selectedJFNList.push(value);
                });
                setTooltipOnMultiSelect('divMultiSelJFN', $scope.selectedJFNList, 'TEXT');
            }
        };
        //--------------------------End JFN MultiSelect-----------------


        var setDefaultValuesOnMultiSelect = function (multiSelectObject) {
            var objMulti = multiSelectObject;  //need to set
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
                if (objMulti.controlID == 'divMultiSelProjects') {
                    $scope.PopulateJFNDropDown(projects);
                }
            }
            //else {
            //    if (AppSettings.ShowLatestProjectInFilter && objMulti.controlID == 'divMultiSelProjects') {
            //        if ($scope.projectsDS.length > 0) {
            //            //var latestProjects = [];
            //            objMulti.selectedList.push($scope.projectsDS[0]);
            //            hylanCache.SetValue(hylanCache.Keys.LATEST_PROJECTS, objMulti.selectedList.slice(), Globals.Screens.TASK_MATRIX.ID);
            //            setTooltipOnMultiSelect(objMulti.controlID, objMulti.selectedList, objMulti.displayProp);
            //        }
            //    }
            //}
        };
        $scope.ApplyCache = function () {  //being called from baseController
            setDefaultValuesOnMultiSelect($scope.MSProjects);
            setJFNMultiSelectDefaultValues();
            setJobStatusMultiSelectDefaultValues();
            setTaskStatusMultiSelectDefaultValues();

            var selectedDate = hylanCache.GetValue(hylanCache.Keys.TM_DATE, Globals.Screens.TASK_MATRIX.ID);
            if (selectedDate && selectedDate != "All")
                $scope.selectedTMDate = selectedDate;
        }
        $scope.ApplyCache();
        $scope.refreshGrid();

        $scope.dateChange = function () {
            var selDate = $scope.selectedTMDate;
            hylanCache.SetValue(hylanCache.Keys.TM_DATE, selDate, Globals.Screens.TASK_MATRIX.ID);
            $scope.refreshGrid();
        };
        $scope.CreateSummarySection = function () {
            $(".summary-table thead tr td.completed").html(completedTaskTitle);
            $(".summary-table thead tr td.pending").html(pendingTaskTitle);
            $(".summary-table thead tr td.notneeded").html(notNeededTaskTitle);
            $(".summary-table thead tr td.onhold").html(onHoldTaskTitle);

            var kendoGrid = $("#grid1").data("kendoGrid");
            if (kendoGrid) {
                var aggFields = TaskMatrixService.aggs;
                var gridData = kendoGrid.dataSource.data();
                $.each(aggFields, function (index, agg) {
                    $("#summaryTH ." + agg.field).html(agg.title);

                    var completedTasks = _.where(gridData, JSON.parse('{"' + agg.field + '":"' + completedTaskTitle + '"}'));
                    var pendingTasks = _.where(gridData, JSON.parse('{"' + agg.field + '":"' + pendingTaskTitle + '"}'));
                    var notNeededTasks = _.where(gridData, JSON.parse('{"' + agg.field + '":"' + notNeededTaskTitle + '"}'));
                    //var onHoldTasks = _.where(gridData, JSON.parse('{"' + agg.field + '":"' + onHoldTaskTitle + '"}'));
                    var emptyStatus = _.where(gridData, JSON.parse('{"' + agg.field + '":""}'));
                    var nullStatus = _.where(gridData, JSON.parse('{"' + agg.field + '":null}'));
                    var onHoldTasksCount = gridData.length - (completedTasks.length + pendingTasks.length +
                    notNeededTasks.length + emptyStatus.length + nullStatus.length);

                    $("#completedTR ." + agg.field).html(completedTasks.length);
                    $("#pendingTR ." + agg.field).html(pendingTasks.length);
                    $("#notNeededTR ." + agg.field).html(notNeededTasks.length);
                    $("#onHoldTR ." + agg.field).html(onHoldTasksCount);
                });
            }
        };
    }
]);






