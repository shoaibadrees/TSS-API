angular.module('HylanApp').controller("PermitDashoardController", ['$rootScope', '$scope', '$controller', '$timeout', 'PermitDashboardService', 'ngDialog', 'Utility', 'NOTIFYTYPE', '$interval', '$filter', 'hylanCache',
function ($rootScope, $scope, $controller, $timeout, PermitDashboardService, ngDialog, Utility, NOTIFYTYPE, $interval, $filter, hylanCache) {
    $controller('BaseController', {
        $scope: $scope
    });
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

    //$scope.ApiResource = "Tasks";

    $scope.AllowToEdit = true;
    $scope.ApiResource = "Permits";
    var editPerm = Globals.CheckEditPermission($scope.Screens.PERMIT_DASHBOARD.ID);
    if (editPerm == false) {
        $scope.AllowToEdit = false;
    }



    $scope.selectedProjectID = "-1";
    Globals.GetProjects().then(function (result) {
        //$scope.projectsDS = result.objResultList;

        var unknownPrj = { PROJECT_ID: -1, HYLAN_PROJECT_ID: "Unknown" };
        if (result.objResultList && result.objResultList.length == 0)
            result.objResultList = [];

        $scope.projectsDS = $filter('orderBy')(result.objResultList, 'HYLAN_PROJECT_ID');
        $scope.projectsDS.splice(0, 0, unknownPrj);

    });
    var AllowToEdit = true;
    var editPerm = Globals.CheckEditPermission($scope.Screens.TASK_MATRIX.ID);
    if (editPerm == false)
        AllowToEdit = false;
    $scope.defaultSort = PermitDashboardService.defaultSort;
    var hylenProjectIDTemplate
    var hylenProjectIDTemplate
    if (Globals.IsScreenVisible($scope.Screens.MANAGE_PERMITS.ID)) {
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
                return dataItem.HYLAN_PROJECT_ID;
            } else {
                return "Unknown";
            }
        }

    }

    var dotTrackingNoTemplate = "<a href='javascript:;' ng-click='setScreenAndRowID(#:PERMIT_ID#); OpenPermitCRUDWindow(#:PERMIT_ID#," + $scope.AllowToEdit + "," + $scope.Screens.PERMIT_DASHBOARD.ID + " )' >#: PermitLinkText == null ? '' : PermitLinkText#</a>";
    //var hylenProjectIDTemplate = "<a href='javascript:;' ng-click='OpenProjectCRUDWindow(#:PROJECT_ID#)' >#: HYLAN_PROJECT_ID == null ? '' : HYLAN_PROJECT_ID#</a>";
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
                return dataItem.HYLAN_PROJECT_ID;
            } else {
                return "Unknown";
            }
        }

    }

    var jobFileNumberTemplate
    if (Globals.IsScreenVisible($scope.Screens.MANAGE_PERMITS.ID)) {
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
                return jobFileNo;
            } else {
                return "Unknown";
            }
        }
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
        args.sender.view = "PermitsDashboard";
        $scope.$emit("ChildGridLoaded", args.sender);


        $("#grid1 .k-grid-footer-locked tr.k-footer-template").addClass("SummaryRow");
        $('#grid1 .k-grid-footer-locked tr.SummaryRow > td:nth-child(4)').append(function () {
            return $(this).attr("colspan", "2").css("text-align", "left").html('<label style="color:darkgray">SUMMARY</label>').next().remove().contents();
        });
        hilightEnteredRow();
        //$scope.CreateSummarySection();
    };

    $scope.gridOptions.editable = false;
    $scope.gridOptions.toolbar = [];

    //$scope.gridOptions.filterable = {
    //    extra: false
    //    //,
    //    //messages: {
    //    //    isTrue: "True", isFalse: "False"
    //    //}
    //};

    Globals.GetCompanies(false).then(function (result) {
        $scope.ClientsDS = result.objResultList;
    });

    Globals.GetUsers(false, AppSettings.Hylan_PM_RoleName).then(function (result) {
        DSAdminUsers = result.objResultList;
    });



    var countTemplate = "#=(count == undefined || count == null) ? 0 : kendo.toString(count,'n0')#";

    var GetRowsCount = function (colName, val, condition) {
        condition = (condition || "eq")
        var data = $scope.gridOptions.dataSource.view();
        var filteredRow = $.grep(data, function (row) {
            if (condition == "eq")
                return row[colName] == val;
            else if (condition == "neq")
                return row[colName] != val;
        });
        return filteredRow.length;
    }
    var tempPendingCount = function (e) {
        return GetRowsCount('PENDING_STATUS', 'Yes');
    }
    var tempActiveStatusCount = function (e) {
        return GetRowsCount('ACTIVE_STATUS', 'Yes');
    }
    var tempExpiredCount = function (e) {
        return GetRowsCount('EXPIRED_STATUS', 'Yes');
    }
    var tempExpiring5DaysCount = function (e) {
        return GetRowsCount('EXPIRING_5DAYS_STATUS', 'Yes');
    }
    var tempOnHoldCount = function (e) {
        return GetRowsCount('ON_HOLD_STATUS', 'Yes');
    }
    var tempReqExtCount = function (e) {
        return GetRowsCount('REQUEST_EXTENSION_STATUS', 'Yes');
    }
    var tempRenewalCount = function (e) {
        return GetRowsCount('REQUEST_RENEWAL_STATUS', 'Yes');
    }
    var tempRejectedCount = function (e) {
        return GetRowsCount('REJECTED_STATUS', 'Yes');
    }
    var tempDaysCount = function (e) {
        return GetRowsCount('STIPULATION_DAY1', 'Yes');
    }
    var tempNightsCount = function (e) {
        return GetRowsCount('STIPULATION_NIGHT1', 'Yes');
    }
    var tempWeekendCount = function (e) {
        return GetRowsCount('STIPULATION_WEEKEND1', 'Yes');
    }
    var tempProtectedStreetCount = function (e) {
        return GetRowsCount('IS_PROTECTED_STREET1', 'Yes');
    }

    var tempSubmittedDtCount = function (e) {
        return GetRowsCount('SUBMITTED_DATE', null, 'neq');
    }
    var tempIssuedDtCount = function (e) {
        return GetRowsCount('ISSUED_DATE', null, 'neq');
    }
    var tempValidDtCount = function (e) {
        return GetRowsCount('VALID_DATE', null, 'neq');
    }
    var tempExpiresDtCount = function (e) {
        return GetRowsCount('EXPIRES_DATE', null, 'neq');
    }

    var tempRejectedDtCount = function (e) {
        return GetRowsCount('REJECTED_DATE', null, 'neq');
    }

    var tempDotTrackingNoCount = function (e) {
        return $scope.gridOptions.dataSource.view().length;
    }
 
   

    $scope.searchColumns = [

       { field: "HYLAN_PROJECT_ID" }, { field: "JOB_FILE_NUMBER" }, { field: "DOT_TRACKING_NUMBER" }, { field: "CLIENT" },
       { field: "POLE_LOCATION" }, { field: "PERMIT_NUMBER_TEXT" }, { field: "SEGMENT" }, { field: "IS_PROTECTED_STREET1" },
       { field: "SUBMITTED_DATE" }, { field: "ISSUED_DATE" }, { field: "VALID_DATE" }, { field: "EXPIRES_DATE" }, { field: "REJECTED_DATE" },
       { field: "PENDING_STATUS" }, { field: "ACTIVE_STATUS" }, { field: "EXPIRED_STATUS" }, { field: "EXPIRING_5DAYS_STATUS" }, { field: "ON_HOLD_STATUS" },
       { field: "REQUEST_EXTENSION_STATUS" }, { field: "REQUEST_RENEWAL_STATUS" }, { field: "REJECTED_STATUS" },
       { field: "STIPULATION_DAY1" }, { field: "STIPULATION_NIGHT1" }, { field: "STIPULATION_WEEKEND1" }, { field: "STIPULATIONS_OTHER" }
    ];

    $scope.gridOptions.columns = [
                                {
                                    title: "General", locked: true, headerAttributes: { "class": "section-border" },
                                    columns: [{
                                        field: "ROW_HEADER", width: "20px", title: "   .", sortable: false, locked: true, headerAttributes: { "class": "sub-col darkYellow-col rowHeaderHeadYellow", "style": "border-right: 0px !important;" }, attributes: { "class": "contert-alpha GridBorder rowHeaderCell" }, filterable: false
                                    },
                                            //{ field: "PERMIT_ID", title: "View/Edit", width: "100px", locked: true, headerAttributes: { "class": "sub-col darkYellow-col rowHeaderHead2" }, attributes: { "class": "GridBorder" }, template: permitTemplate, filterable: false },
                                            {field: "PERMIT_ID", type: "number", title: "Project ID11", width: "80px", hidden: true, locked: true, headerAttributes: {"class": "sub-col darkYellow-col rowHeaderHead2"}, attributes: {"class": "GridBorder"}, template: "#: PERMIT_ID == null ? '' : PERMIT_ID#", filterable: stringFilterAttributes
                                            },
                                            {
                                                field: "PROJECT_ID", title: "Project ID11", width: "80px", hidden: true, locked: true, headerAttributes: {
                                                    "class": "sub-col darkYellow-col rowHeaderHead2"
                                                }, attributes: {
                                                    "class": "GridBorder"
                                                }, template: "#: PROJECT_ID == null ? '' : PROJECT_ID#", filterable: stringFilterAttributes
                                            },
                                            {
                                                field: "HYLAN_PROJECT_ID", title: "Project ID", width: "150px", locked: true, headerAttributes: {
                                                    "class": "sub-col darkYellow-col rowHeaderHead2"
                                                }, attributes: {
                                                    "class": "GridBorder"
                                                }, template: hylenProjectIDTemplate, filterable: stringFilterAttributes
                                                
                                            }, //, aggregates: ["count"], footerTemplate: sumTemplate
                                            {
                                                field: "JOB_FILE_NUMBER", title: "Job File<br/>Number", width: "90px", locked: true, headerAttributes: {
                                                    "class": "sub-col darkYellow-col rowHeaderHead2"
                                                }, attributes: {
                                                    "class": "GridBorder"
                                                }, template: jobFileNumberTemplate, filterable: stringFilterAttributes
                                                
                                            },
                                                {
                                                    field: "PermitLinkText", title: "DOT<br/>TRACKING #", width: "210px", locked: true, headerAttributes: {
                                                        "class": "sub-col darkYellow-col rowHeaderHead2"
                                                    }, attributes: {
                                                        "class": "GridBorder"
                                                    }, template: dotTrackingNoTemplate, filterable: stringFilterAttributes, footerTemplate: tempDotTrackingNoCount
                                                }

                                            ,
                                            { field: "CLIENT", title: "CLIENT", width: "130px", headerAttributes: { "class": "sub-col darkYellow-col rowHeaderHead2 section-border" }, attributes: { "class": "contert-alpha GridBorder  section-border" }, template: "#: CLIENT == null ? '' : CLIENT#", filterable: stringFilterAttributes, footerAttributes: { "class": "section-border" } }
                                    ]
                                },

                                {
                                    title: "Permit Area", headerAttributes: {
                                        "class": "section-border"
                                    },
                                    columns: [
                                                {
                                                    field: "POLE_LOCATION", title: "Pole<br/>Location", width: "120px", headerAttributes: {
                                                        "class": "sub-col continuity"
                                                    }, attributes: {
                                                        "class": "contert-alpha GridBorder"
                                                    }, template: "#: POLE_LOCATION == null ? '' : POLE_LOCATION#", filterable: stringFilterAttributes
                                                },
                                                {
                                                    field: "PERMIT_NUMBER_TEXT", title: "PERMIT #", width: "100px", headerAttributes: {
                                                        "class": "sub-col continuity"
                                                    }, attributes: {
                                                        "class": "contert-alpha GridBorder"
                                                    }, template: "#: PERMIT_NUMBER_TEXT == null ? '' : PERMIT_NUMBER_TEXT#", filterable: stringFilterAttributes
                                                },
                                                {
                                                    field: "SEGMENT", title: "SEGMENT/<br/>BLOCK", width: "100px", headerAttributes: {
                                                        "class": "sub-col  continuity"
                                                    }, attributes: {
                                                        "class": "contert-alpha GridBorder"
                                                    }, template: "#: SEGMENT == null ? '' : SEGMENT#", filterable: stringFilterAttributes
                                                },
                                    { field: "IS_PROTECTED_STREET1", title: "PROTECTED<br/>STREET", width: "110px", headerAttributes: { "class": "sub-col  continuity  section-border" }, attributes: { "class": "contert-alpha GridBorder  section-border" }, template: "#= YesNoTemplate(IS_PROTECTED_STREET1)#", filterable: { cell: { template: YesNoFilterTemplate, showOperators: false } }, footerTemplate: tempProtectedStreetCount, footerAttributes: { "class": "section-border" } }
                                    ]
                                },
                                {
                                    title: "Dates", headerAttributes: {
                                        "class": "section-border"
                                    },
                                    columns: [
                                                {
                                                    field: "SUBMITTED_DATE", title: "SUBMITTED", width: "170px", headerAttributes: {
                                                        "class": "sub-col foundationpole"
                                                    }, attributes: {
                                                        "class": "contert-number GridBorder"
                                                    }, format: "{0: MM/dd/yyyy}", filterable: {
                                                        cell: {
                                                            operator: "eq", showOperators: true
                                                        }
                                                    }, footerTemplate: tempSubmittedDtCount
                                                },
                                                {
                                                    field: "ISSUED_DATE", title: "ISSUED", width: "170px", headerAttributes: {
                                                        "class": "sub-col foundationpole"
                                                    }, attributes: {
                                                        "class": "contert-number GridBorder"
                                                    }, format: "{0: MM/dd/yyyy}", filterable: {
                                                        cell: {
                                                            operator: "eq", showOperators: true
                                                        }
                                                    }, footerTemplate: tempIssuedDtCount
                                                },
                                                {
                                                    field: "VALID_DATE", title: "VALID", width: "170px", headerAttributes: {
                                                        "class": "sub-col foundationpole"
                                                    }, attributes: {
                                                        "class": "contert-number GridBorder"
                                                    }, format: "{0: MM/dd/yyyy}", filterable: {
                                                        cell: {
                                                            operator: "eq", showOperators: true
                                                        }
                                                    }, footerTemplate: tempValidDtCount
                                                },
                                                {
                                                    field: "EXPIRES_DATE", title: "EXPIRES", width: "170px", headerAttributes: {
                                                        "class": "sub-col foundationpole"
                                                    }, attributes: {
                                                        "class": "contert-number GridBorder"
                                                    }, format: "{0: MM/dd/yyyy}", filterable: {
                                                        cell: {
                                                            operator: "eq", showOperators: true
                                                        }
                                                    }, footerTemplate: tempExpiresDtCount
                                                },
                                                { field: "REJECTED_DATE", title: "REJECTED", width: "170px", headerAttributes: { "class": "sub-col foundationpole section-border" }, attributes: { "class": "contert-number GridBorder section-border" }, format: "{0: MM/dd/yyyy}", filterable: { cell: { operator: "eq", showOperators: true } }, footerAttributes: { "class": "section-border" }, footerTemplate: tempRejectedDtCount }
                                    ]
                                },
                                {
                                    title: "Permit Status", headerAttributes: {
                                        "class": "section-border"
                                    },
                                    columns: [
                                                {
                                                    field: "PENDING_STATUS", title: "PENDING", width: "90px", headerAttributes: { "class": "sub-col underground" }, attributes: { "class": "contert-alpha center-middle" }, template: "#= YesNoTemplate(PENDING_STATUS)#", footerTemplate: tempPendingCount
                                                    ,filterable: { cell: {template: YesNoFilterTemplate,showOperators: false}}
                                                },
                                                {
                                                    field: "ACTIVE_STATUS", title: "ACTIVE", width: "90px", headerAttributes: { "class": "sub-col underground" }, attributes: { "class": "contert-alpha center-middle" }, template: "#= YesNoTemplate(ACTIVE_STATUS)#", footerTemplate: tempActiveStatusCount
                                                    , filterable: { cell: { template: YesNoFilterTemplate, showOperators: false } }
                                                },
                                                {
                                                    field: "EXPIRED_STATUS", title: "EXPIRED", width: "90px", headerAttributes: { "class": "sub-col underground" }, attributes: { "class": "contert-alpha center-middle" }, template: "#= YesNoTemplate(EXPIRED_STATUS)#", footerTemplate: tempExpiredCount
                                                    , filterable: { cell: { template: YesNoFilterTemplate, showOperators: false } }
                                                },
                                                {
                                                    field: "EXPIRING_5DAYS_STATUS", title: "EXPIRING<br/>5 DAYS", width: "90px", headerAttributes: { "class": "sub-col underground" }, attributes: { "class": "contert-alpha center-middle" }, template: "#= YesNoTemplate(EXPIRING_5DAYS_STATUS)#", footerTemplate: tempExpiring5DaysCount
                                                    , filterable: { cell: { template: YesNoFilterTemplate, showOperators: false } }
                                                },
                                                {
                                                    field: "ON_HOLD_STATUS", title: "ON HOLD", width: "90px", headerAttributes: { "class": "sub-col underground" }, attributes: { "class": "contert-alpha center-middle" }, template: "#= YesNoTemplate(ON_HOLD_STATUS)#", footerTemplate: tempOnHoldCount
                                                    , filterable: { cell: { template: YesNoFilterTemplate, showOperators: false } }
                                                },
                                                {
                                                    field: "REQUEST_EXTENSION_STATUS", title: "REQUEST<br/>EXTENSION", width: "110px", headerAttributes: { "class": "sub-col underground" }, attributes: { "class": "contert-alpha center-middle" }, template: "#= YesNoTemplate(REQUEST_EXTENSION_STATUS)#", footerTemplate: tempReqExtCount
                                                    , filterable: { cell: { template: YesNoFilterTemplate, showOperators: false } }
                                                },
                                                {
                                                    field: "REQUEST_RENEWAL_STATUS", title: "REQUEST RENEWAL", width: "100px", headerAttributes: { "class": "sub-col underground" }, attributes: { "class": "contert-alpha center-middle" }, template: "#= YesNoTemplate(REQUEST_RENEWAL_STATUS)#", footerTemplate: tempRenewalCount
                                                    , filterable: { cell: { template: YesNoFilterTemplate, showOperators: false } }
                                                },
                                                {
                                                    field: "REJECTED_STATUS", title: "REJECTED", width: "100px", headerAttributes: { "class": "sub-col underground section-border" }, attributes: { "class": "contert-alpha center-middle section-border" }, template: "#= YesNoTemplate(REJECTED_STATUS)#", footerTemplate: tempRejectedCount, footerAttributes: { "class": "section-border" }
                                                        , filterable: { cell: { template: YesNoFilterTemplate, showOperators: false } }
                                                }
                                                

                                    ]
                                },
                                {
                                    title: "Stipulations", headerAttributes: {
                                        "class": "section-border"
                                    },
                                    columns: [
                                                {
                                                    field: "STIPULATION_DAY1", title: "DAY", width: "80px", headerAttributes: { "class": "sub-col fiber" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#= YesNoTemplate(STIPULATION_DAY1)#", filterable: { cell: { template: YesNoFilterTemplate, showOperators: false } }, footerTemplate: tempDaysCount
                                                },
                                                {
                                                    field: "STIPULATION_NIGHT1", title: "NIGHT", width: "80px", headerAttributes: { "class": "sub-col fiber" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#= YesNoTemplate(STIPULATION_NIGHT1)#",filterable: { cell: {template: YesNoFilterTemplate,showOperators: false}}, footerTemplate: tempNightsCount
                                                },
                                                {
                                                    field: "STIPULATION_WEEKEND1", title: "WEEKEND", width: "100px", headerAttributes: { "class": "sub-col fiber" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#= YesNoTemplate(STIPULATION_WEEKEND1)#", filterable: { cell: { template: YesNoFilterTemplate, showOperators: false } }, footerTemplate: tempWeekendCount
                                                },
                                                { field: "STIPULATIONS_OTHER", title: "OTHER", width: "120px", headerAttributes: { "class": "sub-col fiber" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#: STIPULATIONS_OTHER == null ? '' : STIPULATIONS_OTHER#", filterable: stringFilterAttributes, footerAttributes: { "class": "section-border" } }
                                    ]
                                }
    ];

    $scope.gridOptions.dataSource = PermitDashboardService.dataSource;
    $scope.gridOptions.dataBound = onDataBound;


    //$scope.gridOptions.filterable = true;
    $scope.gridOptions.filterable = {
        mode: "row"
    }

    $scope.RefreshGrid = function () {
        $scope.gridOptions.dataSource.read();
    }

    $scope.$on("CRUD_OPERATIONS_SUCCESS", function (event, args) {
        $scope.RefreshGrid();
    });
    $scope.$on("CLOSE_WITHOUT_CHANGE", function (event, args) {
        hilightEnteredRow();
    });
    $scope.ResetFilter = function () {
        $scope.clearFilters();
        hylanCache.RemoveKey(hylanCache.Keys.LATEST_PROJECTS, Globals.Screens.PERMIT_DASHBOARD.ID);
        //hylanCache.RemoveKey($scope.MSProjects.key);
        //hylanCache.RemoveKey($scope.MSClients.key);
        hylanCache.RemoveKey(hylanCache.Keys.START_DATE, Globals.Screens.PERMIT_DASHBOARD.ID);
        hylanCache.RemoveKey(hylanCache.Keys.END_DATE, Globals.Screens.PERMIT_DASHBOARD.ID);
       // $scope.submitedStartDt = null;
        $scope.submitedEndDt = null;
        //$scope.selectedTMDate = "All";

        //hylanCache.RemoveKey($scope.MSClients.key);
        //hylanCache.RemoveKey($scope.MSProjectStatus.key);
        $scope.ApplyCache();
        $scope.RefreshGrid();
    }
    $scope.OpenModalWindow = function (jobID, projectID, hylanProjectID, jobNumberID, window) {
        screenId = Globals.Screens.TASK_MATRIX.ID;
        screenRecordId = jobID;
        $scope.isPopup = true;
        jobID = (jobID ? jobID : 0);
        var param = {
            USER_ID: $rootScope.currentUser.USER_ID, SCREEN_ID: Globals.Screens.TASK_MATRIX.ID, SCREEN_RECORD_ID: jobID, HYLAN_PROJECT_ID: hylanProjectID, JOB_NUMBER_ID: jobNumberID, PROJECT_ID: projectID
        };
        $scope.ngDialogData = param;
        $scope.openDialog(window, param);
    };

    $scope.setScreenAndRowID = function (rowID) {
        hylanCache.SetValue(hylanCache.Keys.NEWLYADDED_ROWID, rowID, $scope.Screens.PERMIT_DASHBOARD.ID);
    }
    var hilightEnteredRow = function () {
        var newlyAddedRecordID = hylanCache.GetValue(hylanCache.Keys.NEWLYADDED_ROWID, $scope.Screens.PERMIT_DASHBOARD.ID);
        if (newlyAddedRecordID) {
            $("#grid1 tr.k-state-selected").removeClass("k-state-selected");
            var grid = $scope.gridOptions.dataSource;
             $.each(grid._data, function (index, value) {
                var model = value;
                if (model.PERMIT_ID == newlyAddedRecordID) {//some condition
                    $('[data-uid=' + model.uid + ']').addClass('k-state-selected');
                }
          
            });

            hylanCache.RemoveKey(hylanCache.Keys.NEWLYADDED_ROWID, $scope.Screens.PERMIT_DASHBOARD.ID);


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

    var RefreshProjectsMS = function () {
        PermitDashboardService.GetAllProjects().then(function (result) {;
            $scope.MSProjects.options = result.objResultList;
            //clear the selected list
            hylanCache.RemoveKey($scope.MSProjects.key);
            $scope.MSProjects.selectedList = [];
        });
    }
    projectsMultiSelect();
    //--------------------------End ProjectStatus MultiSelect----------------- 

    //--------------------------Start Clients MultiSelect-----------------  
    var clientsMultiSelect = function () {

        var objMulti = {
            controlID: 'divMSClients', options: $scope.ClientsDS, selectedList: [],
            idProp: 'COMPANY_ID', displayProp: 'COMPANY_NAME', key: hylanCache.Keys.CLIENTS 
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
                RefreshProjectsMS();
                $scope.RefreshGrid();
            },
            onItemDeselect: function (item) {
                setTooltipOnMultiSelect(objMulti.controlID, objMulti.selectedList, objMulti.displayProp);
                hylanCache.SetValue(objMulti.key, objMulti.selectedList.slice());
                RefreshProjectsMS();
                $scope.RefreshGrid();
            },
            onDeselectAll: function (items) {

                setTooltipOnMultiSelect(objMulti.controlID, [], objMulti.displayProp);
                hylanCache.SetValue(objMulti.key, []);
                RefreshProjectsMS();
                $scope.RefreshGrid();
            }
        };
    };

    clientsMultiSelect();


    //--------------------------End Clients MultiSelect----------------- 


    var setDefaultValuesOnMultiSelect = function (multiSelectObject) {
        var objMulti = multiSelectObject;  //need to set
        objMulti.selectedList = [];
        var MSControlValues = hylanCache.GetValue(objMulti.key);
        if (MSControlValues) {
            //add values in control ,values came from cache
            angular.forEach(MSControlValues, function (value) {
                objMulti.selectedList.push(value);
            });
            setTooltipOnMultiSelect(objMulti.controlID, objMulti.selectedList, objMulti.displayProp);
        }
    };


    $scope.startDateChange = function () {
        var selDate = $scope.submitedStartDt;
        hylanCache.SetValue(hylanCache.Keys.START_DATE, selDate, Globals.Screens.PERMIT_DASHBOARD.ID);
        $scope.RefreshGrid();
    }

    $scope.endDateChange = function () {
        var selDate = $scope.submitedEndDt;
        hylanCache.SetValue(hylanCache.Keys.END_DATE, selDate, Globals.Screens.PERMIT_DASHBOARD.ID);
        $scope.RefreshGrid();
    }

    $scope.ApplyCache = function () {  //being called from baseController
        
        setDefaultValuesOnMultiSelect($scope.MSClients);

        PermitDashboardService.GetAllProjects().then(function (result) {;
            $scope.MSProjects.options = result.objResultList;
            setDefaultValuesOnMultiSelect($scope.MSProjects);
        });

        var stDt = hylanCache.GetValue(hylanCache.Keys.START_DATE, Globals.Screens.PERMIT_DASHBOARD.ID);
        if (stDt != undefined ) {
            $scope.submitedStartDt = stDt;
        }
        else {
            $scope.submitedStartDt = FormatDate(new Date());
            hylanCache.SetValue(hylanCache.Keys.START_DATE, $scope.submitedStartDt, Globals.Screens.PERMIT_DASHBOARD.ID);
        }
        var endDate = hylanCache.GetValue(hylanCache.Keys.END_DATE, Globals.Screens.PERMIT_DASHBOARD.ID);
        if (endDate != undefined) {
            $scope.submitedEndDt = endDate;
        }

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

        PermitDashboardService.deleteJobs(selDataItems).then(function (result) {
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





//var tempProtectedStreetCount = function () {
//    var data = $('#grid1').data('kendoGrid').dataSource.view();
//            //var data = $scope.gridOptions.dataSource.view();
//            var filteredRow = $.grep(data, function (row) {
//                return row.IS_PROTECTED_STREET1 == 'Yes';
//            });
//            return filteredRow.length;
//        }