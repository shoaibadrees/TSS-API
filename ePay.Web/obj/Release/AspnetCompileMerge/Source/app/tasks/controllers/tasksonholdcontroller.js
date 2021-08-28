var DSAdminUsers = [];
var allTaskNames = [];
angular.module('HylanApp').controller("TaskOnHoldController", ['$rootScope', '$scope', '$controller', 'TaskOnHoldService', '$timeout', '$filter', 'hylanCache',
    function ($rootScope, $scope, $controller, TaskOnHoldService, $timeout, $filter, hylanCache) {

        $controller('BaseController', { $scope: $scope });
        if ($rootScope.isUserLoggedIn == false)
            return false;

        //fixing for hand held devices
        var strColWidth = '9%';
        var numColWidth = '7%';
        maxlen = 6;
        if (/iPad/.test(Globals.UserAgent) || /Android/.test(Globals.UserAgent)) {
            strColWidth = '150px';
            numColWidth = '85px';
        }
        $scope.selectedTMDate = FormatDate(new Date());
        $scope.ApiResource = "Tasks";
        $scope.CurrentView = "TaskOnHold";
        var AllowToEdit = true;
        var editPerm = Globals.CheckEditPermission($scope.Screens.TASK_ON_HOLD.ID);
        if (editPerm == false) {
            AllowToEdit = false;
        }
        $scope.selectedProjectID = "-1";
        Globals.GetProjects().then(function (result) {
            //$scope.projectsDS = result.objResultList;
            $scope.projectsDS = $filter('orderBy')(result.objResultList, 'HYLAN_PROJECT_ID');
        });

        $scope.defaultSort = TaskOnHoldService.defaultSort;
        $scope.searchColumns = [
               { field: "HYLAN_PROJECT_ID" },
               { field: "JOB_FILE_NUMBER" },
               { field: "TOTAL_TASKS" },
               { field: "CLIENT_NAME", type: "boolean" },
               { field: "NEEDED_TASKS_COUNT", type: "date" },
               { field: "TASK_NAME" },
               { field: "ON_HOLD_REASON_OTHER" }
        ];
        var sumTemplate = "#=(sum == undefined || sum == null) ? 0 : kendo.toString(sum,'n0')#";
        var hylenProjectIDTemplate
        if (Globals.IsScreenVisible($scope.Screens.MANAGE_PROJECTS.ID)) {
            hylenProjectIDTemplate = "<a href='javascript:;' ng-click='setScreenAndRowID(#:JOB_ID#,#:PROJECT_ID#,\"#:TASK_NAME#\"); OpenProjectCRUDWindow(#:PROJECT_ID#)' >#= checkNull(data.HYLAN_PROJECT_ID)#</a>";
        }
        else {
            hylenProjectIDTemplate = "#= checkNull(data.HYLAN_PROJECT_ID)#";
        }
        var jobFileNumberTemplate
        if (Globals.IsScreenVisible($scope.Screens.MANAGE_JOBS.ID)) {
            jobFileNumberTemplate = "<a href='javascript:;' ng-click='setScreenAndRowID(#:JOB_ID#,#:PROJECT_ID#,\"#:TASK_NAME#\"); OpenJobCRUDWindow(#:JOB_ID#," + AllowToEdit + ")' >#: JOB_FILE_NUMBER == null ? '' : JOB_FILE_NUMBER#</a>";
        }
        else {
            jobFileNumberTemplate = "#: JOB_FILE_NUMBER == null ? '' : JOB_FILE_NUMBER#";
        }
        var taskTemplate
        if (Globals.IsScreenVisible($scope.Screens.MANAGE_TASKS.ID)) {
            taskTemplate = "<a href='javascript:;' ui-sref='Tasks({JOB: {JOB_ID:#:JOB_ID#, HYLAN_PROJECT_ID:\"#:HYLAN_PROJECT_ID#\",JOB_FILE_NUMBER:\"#:JOB_FILE_NUMBER#\", BACK_STATE:\"OnHoldDashboard\",PROJECT_ID:#:PROJECT_ID#,TASK_NAME:\"#:TASK_NAME#\"}})' >(#:NEEDED_TASKS_COUNT#)</a>";
        }
        else {
            taskTemplate = "#:NEEDED_TASKS_COUNT#";
        }

        var onDataBound = function (args) {
            args.sender.view = "TaskOnHold";
            $scope.handleDataBound(true);
            $scope.$emit("ChildGridLoaded", args.sender);

            $("#grid1 .k-grid-footer tr.k-footer-template").addClass("SummaryRow");
            var cellIndex = 1;
            if ($('.rowHeaderHeadYellow').is(":visible") == false) {
                cellIndex = 0;
            }
            $('#grid1 .k-grid-footer tr.SummaryRow > td:visible').eq(cellIndex).append(function () {
                return $(this).attr("colspan", "2").css("text-align", "left").html('<label style="color:darkgray">SUMMARY</label>').next().remove().contents();
            });
            $("div.tick-icon").closest("td").addClass("tick-icon");
            $("div.tick-icon").remove();
            var TaskBackButton = hylanCache.GetValue(hylanCache.Keys.TASK_BACKBUTTON, $scope.Screens.TASK_ON_HOLD.ID);

            if (TaskBackButton && $scope.loadCount > 0 || TaskBackButton == undefined)
                hilightEnteredRow();
        };

        $scope.gridOptions.editable = false;
        $scope.gridOptions.toolbar = [];
        //$scope.gridOptions.filterable = {
        //    extra: true,
        //    messages: { isTrue: "True", isFalse: "False" }
        //};
        $scope.gridOptions.filterable = {
            mode: "row"
        }

        Globals.GetUsers(false, AppSettings.Hylan_PM_RoleName).then(function (result) {
            DSAdminUsers = result.objResultList;
        });

        $scope.gridOptions.dataSource = TaskOnHoldService.dataSource;
        $scope.gridOptions.dataBound = onDataBound;
        $scope.gridOptions.columns = [
                { field: "ROW_HEADER", filterable: false, width: "20px", title: "   .", sortable: false, locked: true, headerAttributes: { "class": "sub-col darkYellow-col rowHeaderHeadYellow", "style": "border-right: 0px !important;" }, attributes: { "class": "contert-alpha GridBorder rowHeaderCell" } },
                { field: "PROJECT_ID", title: "Project ID11", width: "80px", hidden: true, locked: true, headerAttributes: { "class": "sub-col darkYellow-col rowHeaderHead2" }, attributes: { "class": "GridBorder" }, template: "#= checkNull(data.PROJECT_ID)#" },
                { field: "HYLAN_PROJECT_ID", title: "Project ID", filterable: stringFilterAttributes, width: "160px", locked: true, headerAttributes: { "class": "sub-col darkYellow-col" }, attributes: { "class": "" }, template: hylenProjectIDTemplate },
                { field: "JOB_FILE_NUMBER", title: "Job File#", filterable: stringFilterAttributes, width: "120px", locked: true, headerAttributes: { "class": "sub-col darkYellow-col", "style": "border-left: 0px white;" }, attributes: { "class": "" }, template: jobFileNumberTemplate },
                { field: "CLIENT_NAME", title: "Client", filterable: stringFilterAttributes, width: "120px", locked: true, headerAttributes: { "class": "sub-col darkYellow-col", "style": "border-left: 0px white;" }, attributes: { "class": "contert-alpha" }, template: "#= checkNull(data.CLIENT_NAME)#" },
                { field: "NEEDED_TASKS_COUNT", title: "TASKS", filterable: false, width: "80px", locked: true, headerAttributes: { "class": "sub-col darkYellow-col", "style": "border-left: 0px white;" }, attributes: { "class": "" }, template: taskTemplate },
                { field: "TASK_NAME", title: "Task Name", filterable: stringFilterAttributes, width: "130px", locked: true, headerAttributes: { "class": "sub-col darkYellow-col  section-border" }, attributes: { "class": "contert-alpha section-border" }, template: "#= GetTaskName(data.TASK_NAME)#" },
                { field: "ON_HOLD_REASON_OTHER", title: "Other Reason", filterable: stringFilterAttributes, width: "170px", headerAttributes: { "class": "sub-col lightYellow-col" }, attributes: { "class": "contert-alpha" }, template: "#= checkNull(data.ON_HOLD_REASON_OTHER)#" }
        ];
        $.each(TaskOnHoldService.onHoldReasonFields, function (index, reason) {
            if (reason.title != "Not On-Hold" && reason.title != "Other") {
                var colWidth = 100;
                colWidth = (reason.title.length * 8);
                colWidth += 50;
                if (colWidth < 100)
                    colWidth = 100;
                var reasonColumn = {
                    field: reason.field, title: reason.title, width: colWidth + "px", headerAttributes: { "class": "sub-col lightYellow-col" },
                    attributes: { "class": "contert-alpha center-middle" },
                    template: "#= imageIconTemplate(data, '" + reason.field + "')#", aggregates: ["sum"], footerTemplate: sumTemplate, footerAttributes: { "class": "" }, filterable: { cell: { template: ZeroOneFilterTemplate, showOperators: false } }
                }
                $scope.gridOptions.columns.splice($scope.gridOptions.columns.length - 1, 0, reasonColumn);
            }
        });
        // Always keeping 'Other' as second last column just behind 'Other Reason'
        var otherColumn = {
            field: "OTHER", title: "Other", width: "100px", headerAttributes: { "class": "sub-col lightYellow-col" },
            attributes: { "class": "contert-alpha center-middle" },
            template: "#= imageIconTemplate(data, 'OTHER')#", aggregates: ["sum"], footerTemplate: sumTemplate, footerAttributes: { "class": "" },
            filterable: { cell: { template: ZeroOneFilterTemplate, showOperators: false } }
        }
        $scope.gridOptions.columns.splice($scope.gridOptions.columns.length - 1, 0, otherColumn);


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
            hylanCache.RemoveKey(hylanCache.Keys.LATEST_PROJECTS, Globals.Screens.TASK_ON_HOLD.ID);
            hylanCache.RemoveKey(hylanCache.Keys.JOB_FILE_NUMBER, Globals.Screens.TASK_ON_HOLD.ID);
            hylanCache.RemoveKey(hylanCache.Keys.JOB_STATUS, Globals.Screens.TASK_ON_HOLD.ID);
            hylanCache.RemoveKey(hylanCache.Keys.TASK_NAME, Globals.Screens.TASK_ON_HOLD.ID);
            hylanCache.RemoveKey(hylanCache.Keys.TM_DATE, Globals.Screens.TASK_ON_HOLD.ID);
            $scope.selectedTMDate = FormatDate(new Date());
            $scope.ApplyCache();
            $scope.refreshGrid();
        }
        $scope.OpenModalWindow = function (jobID, projectID, hylanProjectID, jobNumberID, window) {
            screenId = Globals.Screens.TASK_ON_HOLD.ID;
            screenRecordId = jobID;
            $scope.isPopup = true;
            jobID = (jobID ? jobID : 0);
            var param = { USER_ID: $rootScope.currentUser.USER_ID, SCREEN_ID: Globals.Screens.TASK_ON_HOLD.ID, SCREEN_RECORD_ID: jobID, HYLAN_PROJECT_ID: hylanProjectID, JOB_NUMBER_ID: jobNumberID, PROJECT_ID: projectID };
            $scope.ngDialogData = param;
            $scope.openDialog(window, param);
        };

        $scope.setScreenAndRowID = function (JobID, ProjectID, TaskName) {
            var rowID = JobID + "," + ProjectID + "," + TaskName;
            hylanCache.SetValue(hylanCache.Keys.NEWLYADDED_ROWID, rowID, $scope.Screens.TASK_ON_HOLD.ID);
        }
        var hilightEnteredRow = function () {
            var newlyAddedRecordID = hylanCache.GetValue(hylanCache.Keys.NEWLYADDED_ROWID, $scope.Screens.TASK_ON_HOLD.ID);
            if (newlyAddedRecordID) {
                $("#grid1 tr.k-state-selected").removeClass("k-state-selected");
                var array = newlyAddedRecordID.split(',');
                var jobid = array[0];
                var projectid = array[1];
                var taskname = array[2];
                var grid = $scope.gridOptions.dataSource;
                $.each(grid._data, function (index, value) {
                    var model = value;
                    if (model.JOB_ID == jobid && model.PROJECT_ID == projectid && model.TASK_NAME == taskname) {//some condition
                        $('[data-uid=' + model.uid + ']').addClass('k-state-selected');
                    }

                });

                hylanCache.RemoveKey(hylanCache.Keys.NEWLYADDED_ROWID, $scope.Screens.TASK_ON_HOLD.ID);

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
                    hylanCache.SetValue(hylanCache.Keys.JOB_STATUS, $scope.selectedJobStatusList.slice(), Globals.Screens.TASK_ON_HOLD.ID);
                    $scope.refreshGrid();
                },
                onItemDeselect: function (item) {
                    setTooltipOnMultiSelect(objMulti.controlID, $scope.selectedJobStatusList, objMulti.displayProp);
                    hylanCache.SetValue(hylanCache.Keys.JOB_STATUS, $scope.selectedJobStatusList.slice(), Globals.Screens.TASK_ON_HOLD.ID);
                    $scope.refreshGrid();

                },
                onDeselectAll: function (items) {
                    setTooltipOnMultiSelect(objMulti.controlID, [], objMulti.displayProp);
                    hylanCache.SetValue(hylanCache.Keys.JOB_STATUS, [], Globals.Screens.TASK_ON_HOLD.ID);
                    $scope.refreshGrid();
                }
            };
        }
        jobStatusMultiSelect();



        var setJobStatusMultiSelectDefaultValues = function () {
            $scope.selectedJobStatusList = [];
            var selectedObjects = hylanCache.GetValue(hylanCache.Keys.JOB_STATUS, Globals.Screens.TASK_ON_HOLD.ID);
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
        $scope.taskNameLU = [
               { 'LOOK_UP_ID': 'APP_STATUS', 'LU_NAME': "AC Power To Pole" },
               { 'LOOK_UP_ID': 'FBD_STATUS', 'LU_NAME': "Fiber Dig" },
               { 'LOOK_UP_ID': 'FBP_STATUS', 'LU_NAME': "Fiber Pull" },
               { 'LOOK_UP_ID': 'FBS_STATUS', 'LU_NAME': "Fiber Splicing" },
               { 'LOOK_UP_ID': 'FDW_STATUS', 'LU_NAME': "Foundation Work" },
               { 'LOOK_UP_ID': 'PMS_STATUS', 'LU_NAME': "PIM'S & Sweeps" },
               { 'LOOK_UP_ID': 'PLW_STATUS', 'LU_NAME': "Pole Work" },
               { 'LOOK_UP_ID': 'SRA_STATUS', 'LU_NAME': "Shroud/Antenna" },
               { 'LOOK_UP_ID': 'PWD_STATUS', 'LU_NAME': "Power Dig" },
               { 'LOOK_UP_ID': 'UGM_STATUS', 'LU_NAME': "Underground Misc." }
        ];
        allTaskNames = $scope.taskNameLU;
        var taskNameMultiSelect = function () {
            $scope.selectedTaskNameList = [];
            var objMulti = { controlID: 'divMultiSelTaskName', idProp: 'LOOK_UP_ID', displayProp: 'LU_NAME' };

            $scope.taskNameSettings = {
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

            $scope.TaskNameEvents = {
                onItemSelect: function (item) {
                    setTooltipOnMultiSelect(objMulti.controlID, $scope.selectedTaskNameList, objMulti.displayProp);
                    hylanCache.SetValue(hylanCache.Keys.TASK_NAME, $scope.selectedTaskNameList.slice(), Globals.Screens.TASK_ON_HOLD.ID);
                    $scope.refreshGrid();
                },
                onItemDeselect: function (item) {
                    setTooltipOnMultiSelect(objMulti.controlID, $scope.selectedTaskNameList, objMulti.displayProp);
                    hylanCache.SetValue(hylanCache.Keys.TASK_NAME, $scope.selectedTaskNameList.slice(), Globals.Screens.TASK_ON_HOLD.ID);
                    $scope.refreshGrid();

                },
                onDeselectAll: function (items) {
                    setTooltipOnMultiSelect(objMulti.controlID, [], objMulti.displayProp);
                    hylanCache.SetValue(hylanCache.Keys.TASK_NAME, [], Globals.Screens.TASK_ON_HOLD.ID);
                    $scope.refreshGrid();
                }
            };
        }
        taskNameMultiSelect();



        var setTaskNameMultiSelectDefaultValues = function () {
            $scope.selectedTaskNameList = [];
            var selectedObjects = hylanCache.GetValue(hylanCache.Keys.TASK_NAME, Globals.Screens.TASK_ON_HOLD.ID);
            if (selectedObjects) {

                //add values on control, values came from cache
                angular.forEach(selectedObjects, function (value) {
                    $scope.selectedTaskNameList.push(value);
                });
                setTooltipOnMultiSelect('divMultiSelTaskName', $scope.selectedTaskNameList, 'LU_NAME');
            }
        };
        //--------------------------End Task Name MultiSelect----------------- 
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
                    hylanCache.SetValue(hylanCache.Keys.JOB_FILE_NUMBER, $scope.selectedJFNList.slice(), Globals.Screens.TASK_ON_HOLD.ID);
                    $scope.refreshGrid();
                },
                onItemDeselect: function (item) {
                    setTooltipOnMultiSelect(objMulti.controlID, $scope.selectedJFNList, objMulti.displayProp);
                    hylanCache.SetValue(hylanCache.Keys.JOB_FILE_NUMBER, $scope.selectedJFNList.slice(), Globals.Screens.TASK_ON_HOLD.ID);
                    $scope.refreshGrid();

                },
                onDeselectAll: function (items) {
                    setTooltipOnMultiSelect(objMulti.controlID, [], objMulti.displayProp);
                    hylanCache.SetValue(hylanCache.Keys.JOB_FILE_NUMBER, [], Globals.Screens.TASK_ON_HOLD.ID);
                    $scope.refreshGrid();
                }
            };
        }
        JFNMultiSelect();



        var setJFNMultiSelectDefaultValues = function () {
            $scope.selectedJFNList = [];
            var selectedObjects = hylanCache.GetValue(hylanCache.Keys.JOB_FILE_NUMBER, Globals.Screens.TASK_ON_HOLD.ID);
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
                if ($scope.MSProjects.controlID == 'divMultiSelProjects') {
                    $scope.PopulateJFNDropDown(projects);
                }
            }
            //else {
            //    if (AppSettings.ShowLatestProjectInFilter && objMulti.controlID == 'divMultiSelProjects') {
            //        if ($scope.projectsDS.length > 0) {
            //            //var latestProjects = [];
            //            objMulti.selectedList.push($scope.projectsDS[0]);
            //            hylanCache.SetValue(hylanCache.Keys.LATEST_PROJECTS, objMulti.selectedList.slice(), Globals.Screens.TASK_ON_HOLD.ID);
            //            setTooltipOnMultiSelect(objMulti.controlID, objMulti.selectedList, objMulti.displayProp);
            //        }
            //    }
            //}
        };
        $scope.ApplyCache = function () {  //being called from baseController
            setDefaultValuesOnMultiSelect($scope.MSProjects);
            setJFNMultiSelectDefaultValues();
            setJobStatusMultiSelectDefaultValues();
            setTaskNameMultiSelectDefaultValues();

            var selectedDate = hylanCache.GetValue(hylanCache.Keys.TM_DATE, Globals.Screens.TASK_ON_HOLD.ID);
            if (selectedDate && selectedDate != "All")
                $scope.selectedTMDate = selectedDate;
        }
        $scope.ApplyCache();

        $scope.dateChange = function () {
            var selDate = $scope.selectedTMDate;
            hylanCache.SetValue(hylanCache.Keys.TM_DATE, selDate, Globals.Screens.TASK_ON_HOLD.ID);
            $scope.refreshGrid();
        };
    }
]);
function GetTaskName(taskId) {
    return GetTaskNameById(taskId, allTaskNames);
}

function imageIconTemplate(data, fieldName) {
    var html = "";
    try {
        var value = data[fieldName];
        if (value && value != null && value != "" && value >= 0) {
            html = '<div class="tick-icon"></div>';
        }

    } catch (e) {

    }
    return html;
}






