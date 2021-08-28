angular.module('HylanApp').controller('BaseController', ['$rootScope', '$scope', '$state', '$http', '$timeout', 'Utility', 'AppConfig', 'NOTIFYTYPE', 'ngDialog', '$location', '$log', 'SessionTimeoutService', 'NotificationService', '$filter',
    function ($rootScope, $scope, $state, $http, $timeout, Utility, AppConfig, NOTIFYTYPE, ngDialog, $location, $log, SessionTimeoutService, NotificationService, $filter) {
        Globals.$CurrentState = $state;
        if ($rootScope.Screens === undefined || $rootScope.Screens == null) {
            $rootScope.Screens = Globals.Screens;
        }

        if ($rootScope.currentUser === undefined || $rootScope.currentUser == null) {
            if (Cookies.get('currentUser') === undefined) {
                $rootScope.currentUser = null;
                $rootScope.isUserLoggedIn = false;
                $location.path("#/Login");
                return false;
            }
            else {
                $rootScope.currentUser = JSON.parse(Cookies.get('currentUser'));
                Globals.CurrentUser = $rootScope.currentUser;
                $rootScope.isUserLoggedIn = true;
            }
            $rootScope.ROLE = null;
            Globals.ROLE = null;
            $rootScope.UserCompanies = null;
            Globals.UserCompanies = null;
        }
        else {
            Globals.CurrentUser = $rootScope.currentUser;
            $rootScope.isUserLoggedIn = true;
        }
        if ($rootScope.currentUser !== undefined && $rootScope.currentUser != null) {
            if ($rootScope.ROLE === undefined || $rootScope.Role == null) {
                var api = "Roles/LoadRoleDetails?id=" + Globals.CurrentUser.ROLE.ROLE_ID;
                Globals.Get(api, null, false).then(function (result) {
                    $rootScope.ROLE = result.objResult;
                    Globals.ROLE = result.objResult;
                });
            }
        }

        //Show PDF & Print, if set to hidden
        $('.GlobalButtons li:nth-child(2)').show();
        $('.GlobalButtons li:nth-child(3)').show();

        if ($state.current != null && $state.current.views != null) {
            if ($state.current.views.BodyContent && $state.current.views.BodyContent != null &&
                ($state.current.views.BodyContent.templateUrl == '/app/maps/views/maps-index.html' ||
                        $state.current.views.BodyContent.templateUrl == '/app/account/views/default.html' ||
                        $state.current.views.BodyContent.templateUrl == '/app/users/views/userroles-index.html' ||
                        $state.current.views.BodyContent.templateUrl == '/app/users/views/userrole-details.html')
                ) {
                $rootScope.showGlobalButtons = false;
            }
            else {
                $rootScope.showGlobalButtons = true;
            }
            $scope.screenId = $state.current.screenId;
            $scope.generalEditAccess = "GLOBAL";
            var genEditPerm = Globals.GetSpecificPermission($scope.screenId, "GENERAL_EDIT_ACCESS", 0);
            if (genEditPerm) {
                $scope.generalEditAccess = genEditPerm.GENERAL_EDIT_ACCESS_TYPE;
            }
        }

        $scope.GetBasicToolbar = function () {
            var toolbar = [];
            var cancel = { name: "custom_cancel", template: '<a class="k-button k-button-icontext k-grid-custom_cancel-changes" ng-click="CancelChanges()"><span class="k-icon k-i-cancel"></span>Undo</a>' };
            var add = { name: "custom_add", template: '<a class="k-button k-button-icontext k-grid-custom_add" ng-click="AddNewRow()"><span class="k-icon k-i-add"></span>' + $scope.AddButtonText + '</a>' };
            var save = "save";
            toolbar.push(cancel);
            toolbar.push(add);
            toolbar.push(save);
            return toolbar;
        };
        $scope.gridOptions = {
            height: $(document).height() - 145,
            scrollable: true,
            selectable: true,
            filterable: false,
            filterMenuInit: function (e) {
                if (e.sender.dataSource.options.schema.model.fields[e.field].type == "number") {
                    $(e.container.find("input:eq(1)")).kendoNumericTextBox({
                        min: 0,
                        spinners: false
                    });
                    $(e.container.find("input:eq(3)")).kendoNumericTextBox({
                        min: 0,
                        spinners: false
                    });
                }
            },
            navigatable: true,
            editable: {
                confirmation: false
            },
            resizable: false,
            selectable: "multiple",
            messages: {
                commands: {
                    create: $scope.AddButtonText,
                    save: "Save",
                    cancel: "Undo"
                }
            },
            toolbar: $scope.GetBasicToolbar(),
            sortable: {
                mode: "single",
                allowUnsort: false
            },
            dataSource: [],
            columns: [],
            pageable: {
                refresh: true,
                pageSizes: AppConfig.GridPageSizes,
                buttonCount: AppConfig.GridPageButtonCount
            },
            excel: {
                fileName: "Export.xlsx",
                filterable: false,
                allPages: AppConfig.ExportAllPages
            },
            excelExport: function (e) {
                var hylanPMColInd = 0;
                switch (e.sender.$angular_scope.CurrentView) {
                    case "TaskRoster":
                        hylanPMColInd = findColumnIndexForExcel(e.sender, "HYLAN_PM");
                        break;
                }
                var cellBorder = { color: "#000000", size: 1 };
                var screenTitle = "";
                var frozenBg = "#fe9c15";
                if ($rootScope.title && $rootScope.title != null) {
                    screenTitle = $rootScope.title.replace(" - Hylan", "");
                }
                var sheet = e.workbook.sheets[0];
                var excelRowInd = 0;
                sheet.rows.splice(excelRowInd, 0, { cells: [{ value: "Screen", bold: true }, { value: screenTitle }] });
                excelRowInd++;
                sheet.rows.splice(excelRowInd, 0, { cells: [{ value: "Export Run Date/Time", bold: true }, { value: FormatDate(new Date(), null, true) }] });
                excelRowInd++;
                sheet.rows.splice(excelRowInd, 0, { cells: [{ value: "Exported By", bold: true }, { value: ($rootScope.currentUser.LAST_NAME + ", " + $rootScope.currentUser.FIRST_NAME) }] });
                excelRowInd++; 

                if (e.sender.$angular_scope.CurrentView == "DailiesCRUD") {
                    var projectID = $('#ddlProjectId option:selected').text();
                    var JobFileNo = $("#ddlJobFileNumber option:selected").text();
                    var DailyType = $('#ddlDailyType option:selected').text();
                    sheet.rows.splice(excelRowInd, 0, { cells: [{ value: "Project ID", bold: true }, { value: (projectID) }] });
                    excelRowInd++;
                    
                    sheet.rows.splice(excelRowInd, 0, { cells: [{ value: "Job File #", bold: true }, { value: (JobFileNo) }] });
                    excelRowInd++;

                    sheet.rows.splice(excelRowInd, 0, { cells: [{ value: "Daily Type", bold: true }, { value: (DailyType) }] });
                    excelRowInd++;
                }
               
                sheet.rows.splice(excelRowInd, 0, { cells: [{ value: "" }] });
                excelRowInd++;
                var headerRows = _.where(sheet.rows, { type: "header" });
                if (e.sender.$angular_scope.CurrentView == "TaskMatrix") {
                    var summaryTableHeader = [];
                    $("#summaryTH td").each(function (thInd, th) {
                        summaryTableHeader.push({
                            value: $(th).text().toUpperCase(), bold: true, background: ((thInd == 0) ? "#000000" : "#f1f1f1"),
                            color: ((thInd == 0) ? "#ffffff" : "#000000"),
                            borderTop: cellBorder, borderRight: cellBorder, borderBottom: cellBorder, borderLeft: cellBorder
                        });
                    });
                    sheet.rows.splice(excelRowInd, 0, { cells: summaryTableHeader });
                    excelRowInd++;

                    $(".summary-table tbody tr").each(function (trInd, tr) {
                        var summaryTableCells = [];
                        $(tr).find("td").each(function (tdInd, td) {
                            summaryTableCells.push({
                                value: $(td).text().toUpperCase(), borderTop: cellBorder,
                                borderRight: cellBorder, borderBottom: cellBorder, borderLeft: cellBorder,
                                background: ((trInd % 2 == 0) ? "#F7FBFB" : "#FDFFF7")
                            });
                        });
                        sheet.rows.splice(excelRowInd, 0, { cells: summaryTableCells });
                        excelRowInd++;
                    });
                    sheet.rows.splice(excelRowInd, 0, { cells: [{ value: "" }] });
                    excelRowInd++;
                    sheet.rows.splice(excelRowInd, 0, { cells: [{ value: "" }] });
                    excelRowInd++;
                }
                sheet.freezePane.rowSplit = excelRowInd + headerRows.length;
                $(headerRows).each(function (rowInd, row) {
                    var headerBg = (headerRows.length > 1 && rowInd == 0) ? "#ffffff" : "#FFF1B9";
                    $(row.cells).each(function (cellInd, cell) {
                        if ((headerRows.length == 1 || (headerRows.length > 1 && rowInd == 1)) && cellInd < sheet.freezePane.colSplit) //-- sub header only
                            cell.background = frozenBg;
                        else
                            cell.background = headerBg;
                        cell.color = "#000000";
                        cell.bold = true;
                        cell.value = cell.value.replace("<br/>", " ").toUpperCase();
                        cell.borderTop = cellBorder;
                        cell.borderRight = cellBorder;
                        cell.borderBottom = cellBorder;
                        cell.borderLeft = cellBorder;

                    });
                    excelRowInd++;
                });
                if (e.sender.$angular_scope.CurrentView == "DailiesCRUD") {
                    $(sheet.columns).each(function (colInd, col) {
                        col.autoWidth = true;
                    });
                }

                if (sheet.rows.length > 0) {
                    var footerRow = sheet.rows[sheet.rows.length - 1];
                    if (footerRow.type == "footer") { // Move footer/summary from bottom to top if any
                        footerRow.cells[0].value = "SUMMARY";
                        footerRow.cells[0].bold = true;
                        sheet.rows.splice(sheet.rows.length - 1, 1);
                        sheet.rows.splice(excelRowInd, 0, footerRow);
                        //excelRowInd++;
                        sheet.freezePane.rowSplit++;
                    }
                    $(sheet.rows).each(function (rowInd, row) {
                        if (rowInd >= excelRowInd) {
                            var colTaskNameInd = 4
                            if (e.sender.$angular_scope.CurrentView == "TaskOnHold") {
                                if (row.type != "header" && row.type != "footer") {
                                    sheet.rows[rowInd].cells[colTaskNameInd].value = GetTaskNameById(sheet.rows[rowInd].cells[colTaskNameInd].value, e.sender.$angular_scope.taskNameLU);
                                }
                            }
                            $(row.cells).each(function (cellInd, cell) {
                                if (row.type == "footer") {
                                    cell.background = "#F0FFF0";
                                }
                                else {
                                    if (rowInd % 2 == 0) {
                                        cell.background = "#f1f1f1";
                                    }
                                }
                                cell.borderTop = cellBorder;
                                cell.borderRight = cellBorder;
                                cell.borderBottom = cellBorder;
                                cell.borderLeft = cellBorder;
                                if (cell.value != null && cell.value != "") {
                                    if (Date.parse(cell.value) >= 0 && cell.value.toTimeString != undefined && cell.value.toTimeString().indexOf("00:00:00") == -1) {
                                        cell.value = FormatDate(cell.value.toString(), null, true);
                                    }
                                    if (cell.value.toString().toLowerCase() == "true")
                                        cell.value = "Yes";
                                    else if (cell.value.toString().toLowerCase() == "false")
                                        cell.value = "No";
                                }
                                else if (cell.value === false)
                                    cell.value = "No";
                                switch (e.sender.$angular_scope.CurrentView) {
                                    case "TaskOnHold":
                                        if (row.type != "header" && row.type != "footer") {
                                            if (cellInd > colTaskNameInd && cellInd < (row.cells.length - 1)) {
                                                cell.value = (cell.value > 0) ? "Yes" : "No";
                                            }
                                        }
                                        break;
                                    case "Attachments":
                                        if (cellInd == 1 && cell.value == "-1")  //-- JOB FILE NUMBER
                                            cell.value = "Unknown";
                                        break;
                                    case "TaskRoster":
                                        if (cellInd == hylanPMColInd) 
                                            cell.value = getHylanPMName(cell.value);
                                        break;
                                    case "ManageDailies":
                                    case "ManageProjects":
                                    case "ManageJobs":
                                        if (e.sender.$angular_scope.CurrentView == "ManageDailies" && cellInd == 21
                                            || e.sender.$angular_scope.CurrentView == "ManageProjects" && cellInd == 15
                                            || e.sender.$angular_scope.CurrentView == "ManageJobs" && cellInd == 42
                                            )
                                            cell.value = $filter("currency")(cell.value);
                                            cell.hAlign = "right";
                                        break;
                                }
                            })
                        }
                    });
                }
                if (/iPad/.test(Globals.UserAgent) || (/Android/.test(Globals.UserAgent))) {
                    var xcelFileName = (screenTitle && screenTitle != "") ? screenTitle : "Export";
                    var workbook = new kendo.ooxml.Workbook({ sheets: [sheet] });
                    kendo.saveAs({
                        dataURI: workbook.toDataURL(),
                        fileName: xcelFileName + ".xlsx",
                        proxyURL: Globals.ApiUrl + "/Export/Proxy",
                        proxyTarget: '_blank'
                    });
                    e.preventDefault();
                }
            },
            pdf: {
                allPages: true,
                margin: { top: "2cm", left: "2cm", right: "2cm", bottom: "2cm" },
                ////landscape: true, automatically handled by kendo
                repeatHeaders: true,
                proxyTarget: "_blank",
                proxyURL: Globals.ApiUrl + "/Export/Proxy"
            }

        };

        var findColumnIndexForExcel = function (kgrid, targetColName) {
            var colInd = -1;
            for (var i = 0; i < kgrid.options.columns.length; i++) {
                var groupColumn = kgrid.options.columns[i];
                for (var k = 0; k < groupColumn.columns.length; k++) {
                    if (!groupColumn.columns[k].hidden)
                        colInd += 1;
                    if(groupColumn.columns[k].field === targetColName)
                        return colInd;                    
                }
            }
            return colInd;
        };

        if (/iPad/.test(Globals.UserAgent) || (/Android/.test(Globals.UserAgent))) {
            $scope.gridOptions.selectable = false;
        }

        $rootScope.title = $state.$current.title;
        $rootScope.isScreenVisible = function (screenId) {

            return Globals.IsScreenVisible(screenId);
        };

        $rootScope.lastServerDateTime = null;
        $scope.filters = {};
        $scope.defaultFilter = {};
        $scope.searchColumns = [];
        $scope.searchValue = '';
        $scope.loadCount = 0;

        var childGrid;

        $scope.openDialog = function (entity, param) {
            if ($scope.handleFilterChange() == true && entity && entity != "") {
                var dialogTemplate = Globals.BaseUrl;
                var dialogController = "";
                switch (entity) {
                    case "USER-PROFILE":
                        dialogTemplate += 'app/users/views/user-profile.html';
                        dialogController = "UserProfileController";
                        break;
                    case "PROJECT-CRUD":
                        dialogTemplate += 'app/projects/views/projectcrudview.html';
                        dialogController = "ProjectCRUDController";
                        break;
                    case "JOB-CRUD":
                        dialogTemplate += 'app/jobs/views/jobcrudview.html';
                        dialogController = "JobCRUDController";
                        break;
                    case "NOTES":
                        dialogTemplate += 'app/Notes/views/Notesview.html';
                        dialogController = "NotesController";
                        break;
                    case "ATTACHMENTS":
                        dialogTemplate += 'app/attachments/views/attachmentcrudview.html';
                        dialogController = "AttachmentsCrudController as vm";
                        break;
                    case "MESSAGES-INDEX":
                        dialogTemplate += 'app/schedulers/views/messages-index.html';
                        dialogController = "MessagesController";
                        break;
                    case "DAILY-CRUD":
                        dialogTemplate += 'app/dailies/views/dailiescrudview.html';
                        dialogController = "DailiesCRUDController";
                        break;
                    case "PERMIT-CRUD":
                        dialogTemplate += 'app/permits/views/permitcrudview.html';
                        dialogController = "PermitCRUDController";
                        break;
                }
                if (param == undefined || param == null)
                    param = {};

                param.USER_ID = $rootScope.currentUser.USER_ID;
                $scope.ngDialogData = param;
                ngDialog.open({
                    template: dialogTemplate,
                    controller: dialogController,
                    showClose: false,
                    data: param,
                    closeByDocument: false,
                    closeByEscape: false,
                    scope: $scope,
                    cache: false
                });
            }
            else {
                HideMainMenu();
            }
        };
        $scope.closeDialog = function () {
            var closeNow = true;
            if (isChildDataChanged) {
                if (confirm(Globals.ChangesLostMessage)) {
                    closeNow = true;
                    if ($scope.CurrentView == "DailiesCRUD")
                    {
                        $scope.CurrentView = "";
                    }
                    if ($scope.userProfile) {
                        $scope.userProfile = null;
                    }
                    else if ($scope.Message) {
                        $scope.Message = null;
                    }
                    else {
                        if ($("#grid2").data("kendoGrid") && $("#grid2").data("kendoGrid").dataSource)
                            $("#grid2").data("kendoGrid").dataSource.cancelChanges();
                    }
                    isPopupFirstLoad = true;
                    isChildDataChanged = false;
                    Globals.isNewRowAdded = false;
                } else
                    closeNow = false;
            }
            if (closeNow == true) {
                if ($scope.DialogChangesSaved == true) {
                    $scope.$emit("CRUD_OPERATIONS_SUCCESS", true);
                }
                else {
                    $scope.$emit("CLOSE_WITHOUT_CHANGE", true);
                }
                ngDialog.close();
            }
            else
                return false;
        };

        var resizeGrid = function (gridID, gridHeight) {
            
            if (($("#numfield").is(":focus") == false && $("input[type='text']").is(":focus") == false && $("input[type='password']").is(":focus") == false && $("input[type='number']").is(":focus") == false)
                    && (/Android/.test(Globals.UserAgent) || /iPad/.test(Globals.UserAgent))) {
                setTimeout(function () {

                    var grid = $(gridID),
                        gridToolbar = $(gridID + " .k-grid-toolbar"),
                        gridHeader = $(gridID + " .k-grid-header"),
                        gridLockedContent = $(gridID + " .k-grid-content-locked"),
                        gridContent = $(gridID + " .k-grid-content"),
                        gridPagger = $(gridID + " .k-grid-pager"),
                        docHeight = $(window).height(),
                        mainHead = $(".main-head").outerHeight(),
                        filterSec = $(".event-select").outerHeight();

                    var newHeight = 0;
                    if (gridHeight)
                        newHeight = gridHeight;
                    else
                        newHeight = docHeight - (mainHead + filterSec);
                    var contentHeight = newHeight - ((gridToolbar.outerHeight() || 0) + (gridHeader.outerHeight() || 0) + (gridPagger.outerHeight() || 0));
                    if (gridContent.scrollWidth > gridContent.width()) //-- gridcontent has horizental scroll
                        contentHeight = contentHeight - 17;
                    newHeight = newHeight - 5; //-- differential
                    contentHeight = contentHeight - 5;  //-- differential
                    if (grid.length > 0)
                        grid.height(newHeight);
                    if (gridContent.length > 0)
                        gridContent.height(contentHeight);
                    if (gridLockedContent.length > 0)
                        gridLockedContent.height(contentHeight);
                }, 1000);
            }
        };



        $scope.CancelChanges = function () {
            if ($scope.grid.dataSource.hasChanges() && confirm(Globals.ChangesLostMessage) == true) {
                $scope.grid.dataSource.cancelChanges();
                Globals.isNewRowAdded = false;
                Utility.HideNotification();
                isChildDataChanged = false;
                $(".k-grid-header .k-link").off('click');
            }
        };

        $scope.AddNewRow = function () {
            if (Globals.isNewRowAdded == false) {
                $scope.previousDSFilter = $scope.grid.dataSource.filter();
                $scope.grid.addRow();

                $scope.grid.dataSource.sort($scope.defaultSort);
                if ($scope.filters && $scope.defaultFilter) {
                    $scope.clearFilters(true);
                    var oldVal = $scope.filters[$scope.defaultFilter.name].value;
                    $scope.filters[$scope.defaultFilter.name].value = "0";
                    $scope.applyFilter($scope.defaultFilter.name, oldVal, true);
                }
                Globals.isNewRowAdded = true;
                $(".k-grid-header .k-link").on('click', function (e) {
                    return false;
                });
                //Scroll to top left and select first editable cell of first row (new row)
                var grid;
                grid = $('#grid1').data("kendoGrid");
                grid.clearSelection();
                grid.content.scrollTop(0);
                grid.content.scrollLeft(0);
                grid.select($('#responsive-tables div[class*="k-grid-content"] tr:first-child').get(0));
                if ($scope.ApiResource == 'Companies' || $scope.ApiResource == 'Users' || $scope.ApiResource == 'UsersRoles')
                    $('#responsive-tables div[class*="k-grid-content"] tr:first-child td:first+td').trigger('click');
            }
        };

        $scope.handleDataBound = function (forceReload) {
            $timeout(function () {

                if ($scope.loadCount == 0) {
                    if ($scope.grid.dataSource.hasChanges() || forceReload) {
                        $scope.grid.dataSource.filter({});                      
                            $scope.grid.dataSource.read();

                    }
                    $(".k-pager-refresh").removeClass("k-pager-refresh").addClass("k-pager-refresh-nmart");
                    $scope.loadCount = 1;
                    Globals.changedModels = [];
                    isDublicateCompany = false;
                }
                if ($scope.loadCount == 1) {
                    var filterName = ($scope.defaultFilter && $scope.defaultFilter.name) || 'STATUS';
                    if (filterName &&
                        $scope.filters && $scope.filters[filterName])
                        $scope.applyFilter($scope.filters[filterName].name);
                    $scope.loadCount = 2;
                }


            });
        };

        setLastServerDateTime = function (lblSelector) {
            //-- grid last updated datetime
            var elemPagger = '';
            if (lblSelector)
                elemPagger = $(lblSelector);
            else
                elemPagger = $(".k-pager-wrap.k-grid-pager.k-widget");

            var txt = '';
            if ($rootScope.lastServerDateTime) {
                var localDT = new Date($rootScope.lastServerDateTime + ' UTC');
                txt = kendo.toString(localDT, 'MM/dd/yyyy HH:mm:ss');
            }
            else
                txt = "CACHED";
            if (elemPagger.length > 0) {
                $(elemPagger).find(".last-updated").remove();
                $(elemPagger).append("<span class='last-updated'>Last updated: " + txt + "</span>");
            }
        };

        $rootScope.$on('dbCommandCompleted', function (event, args) {

            var scope = Globals.GetCurrentScope();
            if (scope) {
                if (Globals.changedModels.length > 0) {
                    Globals.changedModels = [];
                    Globals.changedModelIds = [];
                    scope.grid.dataSource.cancelChanges();
                    scope.grid.dataSource.read();
                }
                if (Globals.isNewRowAdded == true) {
                    Globals.isNewRowAdded = false;
                    if (scope.filters) {
                        Utility.VerifyEventGridData(scope.grid);
                        scope.grid.dataSource.filter(scope.previousDSFilter);
                        if (scope.previousDSFilter && typeof scope.previousDSFilter != 'undefined') {
                            for (var i = 0; i < scope.previousDSFilter.filters.length; i++) {
                                for (var prop in scope.filters) {
                                    dsFilter = scope.previousDSFilter.filters[i];
                                    if (scope.filters[prop].name == dsFilter.field ||
                                        scope.filters[prop].field == dsFilter.field ||
                                        scope.filters[prop].foreignkey == dsFilter.field) {
                                        scope.filters[prop].value = dsFilter.value;
                                    }
                                }
                            }
                        }
                    }
                    scope.previousDSFilter = null;
                    $(".k-grid-header .k-link").off('click');

                }
            }

        });


        $scope.logout = function () {
           
            if ($scope.handleFilterChange() == true && Cookies.get('currentUser') !== undefined && $rootScope.currentUser != null) {
                //////send loggeduser notification
                ////var loggeduser = $.connection.loggedUserHub;
                ////// Start the connection.
                ////$.connection.hub.start({ waitForPageLoad: false }).done(function () {
                ////    loggeduser.server.send();
                ////});
                var url = (Globals.BaseUrl == "/" ? "" : Globals.BaseUrl) + '/Logout';
                $.ajax({
                    type: "GET",
                    url: url,
                    data: { username: $rootScope.currentUser.USER_NAME },
                    cache: false,
                    async: false,
                    headers: {
                        // "Authorization": "UserID" + $rootScope.currentUser.USER_ID
                    },
                    success: function (data) {
                        if (data === "True") {
                            $rootScope.ROLE = null;
                            Globals.ROLE = null;
                            $rootScope.UserCompanies = null;
                            Globals.UserCompanies = null;
                            Globals.CurrentUser = null;
                            Cookies.remove('currentUser', { path: '' });
                            Cookies.remove('selectedEvent', { path: '' });
                            $rootScope.currentUser = null;
                            $rootScope.isUserLoggedIn = false;
                            SessionTimeoutService.stopTimer();
                            ////$.connection.hub.stop();
                            isSideBarBound = false;
                            sessionStorage.clear();
                            $location.path("#/Login");
                        }
                        else {
                            Utility.Notify({
                                type: NOTIFYTYPE.ERROR,
                                message: 'Error'
                            });
                        }
                    },
                    error: onError
                });
            }
            else {
                HideMainMenu();
            }
        };

        $scope.destroyRecord = function (e) {
            var grid = $scope.grid;
            var selectedRows = grid.select();
            if (selectedRows.length > 0) {
                Globals.changedModels = [];
                var AllocatedArray = [];
                $.each(selectedRows, function (index, value) {
                    var dataItem = grid.dataItem(value);
                    if (dataItem.isNew() == false && $.inArray(dataItem.id, Globals.changedModels) == -1) {
                        if (typeof dataItem.STATUS_LU == 'undefined') {
                            if (dataItem.STATUS && dataItem.STATUS.LOOK_UP_ID == 2) {
                                AllocatedArray.push(dataItem.id);
                            }
                            else {
                                Globals.changedModels.push(dataItem.id);
                            }
                        } else {
                            if (dataItem.STATUS_LU.LOOK_UP_ID == 2) {
                                AllocatedArray.push(dataItem.id);
                            }
                            else {
                                Globals.changedModels.push(dataItem.id);
                            }

                        }
                    }
                });
                if (Globals.changedModels.length > 0) {
                    var doDestroy = false;
                    var message = Globals.BasicDeleteConfirmation
                    //var message = ($scope.screenId == Globals.Screens.REQUESTS.ID || $scope.screenId == Globals.Screens.RESPONSES.ID) ? Globals.DeleteConfirmation : Globals.BasicDeleteConfirmation;
                    //if (grid.dataSource.hasChanges() == false) {

                    //  doDestroy = confirm(message);
                    //}
                    //else {
                    doDestroy = $scope.handleFilterChange(message);
                    // }
                    if (doDestroy == true) {
                        $(Globals.changedModels).each(function (index, value) {
                            grid.dataSource.remove(grid.dataSource.get(value));
                        });
                        grid.dataSource.sync();
                        Utility.Notify({ type: NOTIFYTYPE.SUCCESS, message: '', IsPopUp: false });
                    }
                }
                //else if (AllocatedArray.length > 0) {
                //  if (grid.dataSource.hasChanges() == false) {
                //    Utility.Notify({ type: NOTIFYTYPE.WARNING, message: Globals.AllocationAlert });
                //  }
                //}
            }
        };

        $scope.applyFilter = function (field, oldVal, isAddNewRow, eventType) {
            var filter = $scope.filters[field];

            if (field === 'HYLAN_PROJECT_ID') {
                $rootScope.globalFilters = { HYLAN_PROJECT_ID: filter };
            }

            if ((isAddNewRow && isAddNewRow == true) || $scope.handleFilterChange() == true) {
                var value = (eventType == null || eventType == 0) ? filter.value : eventType == 22 ? 'NRE' : 'RMAG';
                var opr = filter.operator;
                if (filter.foreignkey)
                    field = filter.foreignkey;
                if (filter.logic)
                    Utility.ApplyFilters(filter.field, value, opr, $scope.grid, filter.logic, filter.fieldValueOperation);
                else
                    Utility.ApplyFilters(field, value, opr, $scope.grid, filter.logic, filter.fieldValueOperation);
            }
            else {
                filter.value = oldVal || filter.elementType == "select" ? "0" : "";
            }
        };

        $scope.handleFilterChange = function (message, caller) {
            var grid = $scope.grid || childGrid;
            if (grid) {
                if (grid.id && grid.id == "txtQuery") return true; //For Adhoc Report
                if (Globals.isNewRowAdded == true || grid.dataSource.hasChanges()) {
                    confirmationMessage = message || Globals.ChangesLostMessage;
                    if (confirm(confirmationMessage)) {
                        if (caller && caller === 'refresh') {
                            grid.dataSource.read();
                            $(".k-grid-header .k-link").off('click');
                        }
                        else {
                            grid.cancelChanges();
                        }
                        Globals.isNewRowAdded = false;
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    return true;
                }
            }
            else {
                return true;
            }
        };

        $scope.applySearch = function () {
            if ($scope.handleFilterChange() === true) {
                Utility.ApplySearch($scope.searchColumns, $scope.searchValue, $scope.grid);
            }
        };

        $scope.clearFilters = function (isAddNewRow, page) {
            if ((isAddNewRow && isAddNewRow == true) || $scope.handleFilterChange() == true) {
                Globals.isFilterReset = true;
                isReset = true;
                for (var prop in $scope.filters) {
                    var elementType = $scope.filters[prop].elementType;
                    if ($scope.defaultFilter &&
                                $scope.defaultFilter.name &&
                                $scope.defaultFilter.name == $scope.filters[prop].name) {
                        $scope.filters[prop].value = $scope.defaultFilter.value;
                    }
                    else {
                        $scope.filters[prop].value = elementType == "text" ? "" : "0";
                    }
                }
                $scope.searchValue = "";
                if (page != null)
                    Utility.ClearFilters($scope.grid, $scope.defaultFilter, page);
                else
                    Utility.ClearFilters($scope.grid, $scope.defaultFilter);
            }
            setTimeout(function () {
                $("#ddlCompanyFilter option[value='? string:0 ?']").remove();
            }, 500);

        };
        $scope.PreExportSetting = function () {
            if (childGrid) {
                if ($scope.handleFilterChange() == true) {
                    childGrid.hideColumn("ROW_HEADER");
                    //if (childGrid.$angular_scope.ApiResource == "Users") {
                    //    //Globals.IsExportingData = true;

                    //    childGrid.showColumn("USER_COMPANIES_NAMES");

                    //    var gridDS = $('#grid1').data('kendoGrid').dataSource;
                    //    if (gridDS._sort.length > 0) {
                    //        if (gridDS._sort[0].field == "USER_COMPANY_ID") {
                    //            //$('#grid1').data('kendoGrid').dataSource.sort({ field: 'USER_COMPANIES_NAMES', dir: gridDS._sort[0].dir });


                    //            if (gridDS._sort[0].dir == "asc") {
                    //                //$("[data-field='USER_COMPANIES_NAMES']").find('a span.k-icon').remove();
                    //                $("[data-field='USER_COMPANIES_NAMES']").find('a').append("<span class='k-icon k-i-sort-asc-sm'></span>");
                    //            }
                    //            else {
                    //                //$("[data-field='USER_COMPANIES_NAMES']").find('a span.k-icon').remove();
                    //                $("[data-field='USER_COMPANIES_NAMES']").find('a').append("<span class='k-icon k-i-sort-desc-sm'></span>");
                    //            }
                    //        }
                    //    }

                    //    childGrid.hideColumn("USER_COMPANY_ID");

                    //} else 

                    //------- Follwoing revers column order in export to excel
                    ////if (childGrid.$angular_scope.ApiResource == "Attachments") {
                    ////    Globals.IsExportingData = true;
                    ////    childGrid.unlockColumn("ROW_HEADER");
                    ////    childGrid.unlockColumn("HYLAN_PROJECT_ID");
                    ////    childGrid.unlockColumn("JOB_FILE_NUMBER");
                    ////    childGrid.unlockColumn("PERMIT_NUMBER");
                    ////    childGrid.unlockColumn("FILE_NAME");
                    ////}
                    ////else 
                    if (childGrid.$angular_scope.ApiResource == "Dailies" || childGrid.$angular_scope.ApiResource == "Permits") {
                        childGrid.hideColumn("VIEW_EDIT");

                    }
                    $("th a span.k-i-filter").hide();
                    $('.k-filter-row').hide();

                    var screenTitle = "";
                    if ($rootScope.title && $rootScope.title != null) {
                        screenTitle = $rootScope.title.replace(" - Hylan", "");
                    }
                    var rptHeaderHtml = "<table border='0' class='pdf-report-header'><tr><td>Screen</td><td>" + screenTitle + "</td></tr>";
                    rptHeaderHtml += "<tr><td>Export Run Date/Time</td><td>" + FormatDate(new Date(), null, true) + "</td></tr>";
                    rptHeaderHtml += "<tr><td>Exported By</td><td>" + ($rootScope.currentUser.LAST_NAME + ", " + $rootScope.currentUser.FIRST_NAME) + "</td></tr></table>";

                    var divHtml = "<div id='pdfRptHeader'>" + rptHeaderHtml + "</div>";
                    $("#" + $(childGrid.element).attr("id")).prepend(divHtml);
                }
            }
        };
        $scope.PostExportSetting = function () {
            if (childGrid) {
                if ($scope.handleFilterChange() == true) {
                    childGrid.showColumn("ROW_HEADER");
                    //------- Follwoing revers column order in export to excel
                    ////if (childGrid.$angular_scope.ApiResource == "Attachments") {
                    ////    Globals.IsExportingData = false;
                    ////    childGrid.lockColumn("ROW_HEADER");
                    ////    childGrid.lockColumn("HYLAN_PROJECT_ID");
                    ////    childGrid.lockColumn("JOB_FILE_NUMBER");
                    ////    childGrid.lockColumn("PERMIT_NUMBER");
                    ////    childGrid.lockColumn("FILE_NAME");
                    ////}
                    ////else 
                    if (childGrid.$angular_scope.ApiResource == "Dailies" || childGrid.$angular_scope.ApiResource == "Permits") {
                        childGrid.showColumn("VIEW_EDIT");
                    }
                    $("th a span.k-i-filter").show();
                    $('.k-filter-row').show();
                    $("#" + $(childGrid.element).attr("id")).find("#pdfRptHeader").remove();

                    var kendoGridObj = $("#" + $(childGrid.element).attr("id")).data("kendoGrid");

                    kendoGridObj.dataSource.read();

                }
            }
        };

        $scope.exportToExcel = function () {
            if (childGrid) {
                if ($scope.handleFilterChange() == true) {
                    for (var i = 0; i <= childGrid.columns.length - 1; i++) {
                        if (angular.isDefined(childGrid.columns[i]))
                            childGrid.columns[i].title = childGrid.columns[i].title.replace("<sup><img src='../../../Content/images/red_asterisk.png' /></sup>", '*').replace("<sup><img src='Content/images/red_asterisk.png' /></sup>", '*').replace("<span style='text-transform: lowercase'>s</span>", 's');
                    }
                    $scope.PreExportSetting();
                    var fileName = childGrid.$angular_scope.ApiResource;
                    if ($rootScope.title && $rootScope.title != null) {
                        fileName = $rootScope.title.replace(" - Hylan", "");
                    }
                    childGrid.options.excel.fileName = fileName + ".xlsx";
                    childGrid.saveAsExcel();

                    $scope.PostExportSetting();
                }
            }
            else {
                Utility.Notify({
                    type: NOTIFYTYPE.WARNING,
                    message: "Grid is not loaded yet"
                });
            }
        };

        $scope.exportToPdf = function () {
            if (childGrid) {
                if ($scope.handleFilterChange() == true) {
                    $scope.PreExportSetting();


                    var fileName = childGrid.$angular_scope.ApiResource;
                    if ($rootScope.title && $rootScope.title != null) {
                        fileName = $rootScope.title.replace(" - Hylan", "");
                    }
                    childGrid.options.pdf.fileName = fileName + ".pdf";
                    childGrid.saveAsPDF().then($scope.PostExportSetting).fail($scope.PostExportSetting);
                }
            }
            else {
                Utility.Notify({
                    type: NOTIFYTYPE.WARNING,
                    message: "Grid is not loaded yet"
                });
            }
        };
        $scope.printGrid = function () {
            if (childGrid) {
                var lockedColumns = [];
                for (var i = 0; i < childGrid.columns.length; i++) {
                    if (angular.isDefined(childGrid.columns[i].locked) && childGrid.columns[i].locked) {
                        lockedColumns.push(childGrid.columns[i].field);
                    }
                }

                for (var i = lockedColumns.length - 1; i >= 0; i--) {
                    if (lockedColumns[i] !== "ROW_HEADER" && lockedColumns[i] !== "VIEW_EDIT") {
                        childGrid.unlockColumn(lockedColumns[i]);
                    }
                    if (lockedColumns[i] === "ROW_HEADER" || lockedColumns[i] === "VIEW_EDIT") {
                        childGrid.hideColumn(lockedColumns[i]);
                    }
                }
                if ($scope.handleFilterChange() == true) {
                    Utility.PrintGrid(lockedColumns, childGrid, childGrid.$angular_scope.ApiResource, childGrid.$angular_scope.Grid);
                }
            }
            else {
                Utility.Notify({
                    type: NOTIFYTYPE.WARNING,
                    message: "Grid is not loaded yet"
                });
            }
        };

        $scope.$on('$stateChangeStart', function ($event, toState, toParams, fromState, fromParams) {
            if ($scope.grid && $scope.grid.dataSource && $scope.grid.dataSource.hasChanges() == true) {
                if (!Globals.isActiveEventClosed) {
                    if (confirm(Globals.ChangesLostMessage) == false) {
                        $event.preventDefault();
                        HideMainMenu();
                    }
                    else {
                        $scope.grid.dataSource.cancelChanges();
                    }
                }
                else {
                    $scope.grid.dataSource.cancelChanges();
                }
            }

            if (toState.name == "Default" && ngDialog)
                ngDialog.close();
        });

        $scope.SideBarLoaded = function () {
            $('.side-bar').css('width', '57px').css('display', 'block');
        }

        $scope.MainMenuLoaded = function () {
            ////$('#panel1').css('height', $(window).height() / 2);
            $('#panel2').css('height', $(window).height());

            ////$('#bdNotification').height($('#panel1').height() - 125);
            $('#bdLoggedUsers').height($('#panel2').height() - 125);


            // Change the selector if needed
            var $table = $('table.scrollNotification'),
                $bodyCells = $table.find('tbody tr:first').children(),
                colWidth;

            // Adjust the width of thead cells when window resizes
            $(window).on('resize', function (e) {
                // Get the tbody columns width array
                colWidth = $bodyCells.map(function () {
                    return $(this).width();
                }).get();

                // Set the width of thead columns
                $table.find('thead tr').children().each(function (i, v) {
                    $(v).width(colWidth[i]);
                });
                ////console.log('resize');

                if ($("#map_canvas").length > 0) {
                    var winHeight = $(window).height();
                    var threshold = 130 / winHeight;
                    $("#mapDiv").height(winHeight);
                    $("#map_canvas").height(winHeight - (winHeight * threshold));
                }

                if ($('#permissionsContainer').length > 0) {
                    $('#permissionsContainer').css("height", $(window).height() - 100);
                }

                if ($("#chartSection").length > 0) {
                    var winHeight = $(window).height(),
                    mainHead = $(".main-head").outerHeight(),
                    filterSec = $(".event-select").outerHeight();

                    var availableHeight = winHeight - (mainHead + filterSec + 15);
                    $("#chartSection").height(availableHeight * 0.60);
                    var chart = $("#totalChart").data("kendoChart");
                    if (chart)
                        chart.redraw();
                    chart = $("#pctChart").data("kendoChart");
                    if (chart)
                        chart.redraw();
                    chart = $("#caseChart").data("kendoChart");
                    if (chart)
                        chart.redraw();
                    
                    resizeGrid("#responsive-tables #grid1", availableHeight * 0.40);
                    resizeGrid("#chartSection #gridAlloc", $("#chartSection").height() * 0.80);
                }
                else if ($("#splitter #leftsection").length > 0) {
                    if (typeof (resizeSplitter) == "function")
                        resizeSplitter();

                    var docHeight = $("#splitter #leftsection").outerHeight(),
                    splitterFilterSec = $("#splitter #leftsection .event-select").outerHeight(),
                    splitterTableTitle = $("#splitter #leftsection .tabletitle").outerHeight();
                   
                    var newHeight = docHeight - ((splitterFilterSec || 0) + (splitterTableTitle || 0));
                    resizeGrid("#splitter #leftsection #responsive-tables #grid1", newHeight);
                    resizeGrid("#splitter #rightsection #responsive-tables2 #responseGrid", newHeight);
                }
                else {
                    
                    resizeGrid("#responsive-tables #grid1");
                }


                if (($("#divRMAGDialog").length > 0) || ($("#divMatchlogDialog").length > 0) || ($("#divMergeEventDialog").length > 0)) {
                    if ($(".ngdialog-content").length > 0)
                        $(".ngdialog-content").addClass("ngdialog-content-android");
                    resizeGrid("#responsive-tables-popup #grid2", $(".ngdialog-content").height() - 50);
                }

                ////$('#panel1').css('height', $(window).height() / 2);
                $('#panel2').css('height', $(window).height());

                ////$('#bdNotification').height($('#panel1').height() - 125);
                $('#bdLoggedUsers').height($('#panel2').height() - 125);

                $('.alert-box').css("width", $(window).width() - 57);

            }).trigger('resize'); // Trigger resize handler

            ////$(function () {
            ////    // Declare a proxy to reference the hub.
            ////    var notification = $.connection.notificationHub;
            ////    // Create a function that the hub can call to broadcast messages.
            ////    notification.client.broadcastMessage = function () {
            ////        if (isnotificaitonpanelopen) {
            ////            GetNotificationsByEventAndType(1, 'outside');
            ////            $("#spanNewNotification").show("slow");
            ////            setTimeout(function () {
            ////                $("#spanNewNotification").hide("slow");
            ////            }, 5000);
            ////        }
            ////    };

            ////    var loggeduser = $.connection.loggedUserHub;
            ////    loggeduser.client.broadcastMessage = function () {
            ////        //alert('login');
            ////        if (isnotificaitonpanelopen) {
            ////            getloggedInUsers();
            ////        }
            ////    };

            ////    // var loggeduser = $.connection.loggedUserHub;
            ////    // Start the connection.
            ////    //if ($.connection.hub && $.connection.hub.state === $.signalR.connectionState.disconnected) {
            ////    $.connection.hub.transportConnectTimeout = 3000;
            ////    ////$.connection.hub.logging = true;
            ////    $.connection.hub
            ////        .start({ waitForPageLoad: false })
            ////        .done(function () {
            ////            loggeduser.server.send();
            ////        })
            ////        .fail(function (error) {
            ////            $log.log('LoggedUserHub: connection failed with details:' + error);
            ////        });
            ////    //}
            ////    // }
            ////});

            var isSideMenuInTransition = false;
            if (!isSideBarBound) {
                isSideBarBound = true;
                $("#lnksidebar").on("click", function () {
                    $(".alert-box .close, .alert-boxpopup .close").click();
                    if (isSideMenuInTransition == false) {
                        isSideMenuInTransition = true;
                        isnotificaitonpanelopen = false;
                        if ($('#BodyContentContainer').css("left") == "370px") {
                            $('#BodyContentContainer').css("left", "0px");
                            $('.toggle-left-content-wrap')
                                .css("-ms-filter", "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)")
                                .css("filter", "alpha(opacity=0)")
                                .css("-moz-opacity", 0)
                                .css("-khtml-opacity", 0)
                                .css("opacity", 0);
                            $(".container-fluid").css("position", "");
                            $('#BodyContentContainer').css("position", "");
                            $('.notification ul li:first-child').removeClass('left-arrow');
                            isSideMenuInTransition = false;
                        }
                        else {
                            $("#spanNewNotification").hide();
                            $(".container-fluid").css("position", "fixed");
                            $('#BodyContentContainer').css("position", "fixed");
                            $('#BodyContentContainer').css("left", "370px");
                            $('.toggle-left-content-wrap')
                                .css("-ms-filter", "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)")
                                .css("filter", "alpha(opacity=100)")
                                .css("-moz-opacity", 1)
                                .css("-khtml-opacity", 1)
                                .css("opacity", 1);
                            $('.notification ul li:first-child').addClass('left-arrow');
                            isSideMenuInTransition = false;
                            //-- hack - load data after some secs bz it blocks UI due to sync calls
                            $("#divkendoprogress").show();
                            setTimeout(function () {

                                FillNotificationType();
                                FillEvents();
                                GetNotificationsByEventAndType(1, 'outside');
                                isnotificaitonpanelopen = true;
                                getloggedInUsers();
                                FillRmags();
                                FillCompanies();
                                //$("#divkendoprogress").hide();
                            }, 4000);
                        }
                    }
                });
            }
        }

        $scope.$on('$stateChangeSuccess', function ($event, toState, toParams, fromState, fromParams) {           
            $scope.loadCount = 0;
            Utility.HideNotification();
            HideMainMenu();
            Globals.isNewRowAdded = false;
            Globals.changedModels = [];
        });
        $scope.$on("ChildGridLoaded-NoStyling", function (event, args) {
            childGrid = args;
        });
        $scope.$on("ChildGridLoaded", function (event, args) {
            childGrid = args;
            var mainHeadHeight = 0;
            var filtersHeight = 0;
            var gridToolbarHeight = 0;

            if ($(".k-grid").length > 0) {
                filtersHeight = $(".event-select").height();
                mainHeadHeight = $(".main-head").height();
                gridToolbarHeight = $(".k-grid-toolbar").height();
                var gridHeight = $(document).height() - (mainHeadHeight + filtersHeight + gridToolbarHeight);
                if (gridToolbarHeight == 0 && args.view != "TaskMatrix") { // Adjustment for the grids with hidden toolbars
                    gridHeight -= 30;
                }
                if (args.view == "TaskMatrix") {
                    gridHeight = $(window).height() - (mainHeadHeight + filtersHeight);
                    gridHeight -= 30;
                }
                $(".k-grid").height(gridHeight + 7);
            }
            if ($('#responsive-tables .k-grid-footer').length > 0) {
                if ($('#responsive-tables .k-grid-header').next().hasClass('k-grid-footer') == false) {
                    $('#responsive-tables .k-grid-footer').insertAfter('#responsive-tables .k-grid-header');
                }
                $('#responsive-tables .k-grid-pager').css('width', '100%').css('position', 'absolute').css('bottom', '2px');
            }
            setLastServerDateTime();
        });
        function onError(XMLHttpRequest, textStatus, errorThrown) {
            var exception = XMLHttpRequest.responseText ? XMLHttpRequest.responseText : errorThrown;
            Utility.Notify({ type: NOTIFYTYPE.ERROR, message: exception, IsPopUp: $scope.ngDialogData });


            if (exception && exception.toString().indexOf('could not be updated since it has been edited by another user') > 0)
                $(".k-pager-refresh-nmart").trigger("click");
        }

        $scope.$on('SessionExpiring', function () {
            $scope.logout();
        });

        $scope.makeIdleSessionRequest = function () {
            SessionTimeoutService.resetTimer();
        };

        if (!SessionTimeoutService.isServiceStarted())
            SessionTimeoutService.startTimer();

        $scope.editcalled = false;
        $scope.proxyDialog = ngDialog;
        $scope.closeProxyDialog = function () {
            $scope.proxyDialog.close();
            var grid = $("#grid1").data("kendoGrid");
            if (grid) {
                grid.closeCell();
                var selRow = grid.select();
                if (selRow.length > 0) {
                    var selDataItem = grid.dataItem(selRow[1]);
                    $scope.multiSelectContainer.innerText = selDataItem[$scope.multiSelectDisplayDataItem];
                }
            }
        };

        $scope.AddNewProject = function () {
            $scope.openDialog('PROJECT-CRUD', { ID: 0 });
        };
        $scope.AddNewJob = function () {
            $scope.openDialog('JOB-CRUD', { ID: 0 });
        };
        $scope.OpenProjectCRUDWindow = function (projectID) {
            $scope.isPopup = true;
            projectID = (projectID ? projectID : 0);
            var param = { ID: projectID };
            $scope.openDialog("PROJECT-CRUD", param);
        };

        $scope.OpenJobCRUDWindow = function (jobID, AllowToEdit) {
            $scope.isPopup = true;
            var param = { JOB_ID: jobID };
            $scope.ngDialogData = param;
            if (AllowToEdit == false && jobID != 0) {
                $scope.openDialog("JOB-CRUD", param);
            }
            else if (AllowToEdit == true) {
                $scope.openDialog("JOB-CRUD", param);
            }
        };
        $scope.OpenAttachmentCRUDWindow = function (permitID, jobId, projectId, hylanProjectId, jobFileNumber, type) {
            $scope.isPopup = true;
            var param = { PERMIT_ID: permitID, JOB_ID: jobId, PROJECT_ID: projectId, HYLAN_PROJECT_ID: hylanProjectId, JOB_FILE_NUMBER: jobFileNumber, ENTITY_TYPE: type, SCREEN_ID: Globals.Screens.MANAGE_PERMITS.ID, SCREEN_RECORD_ID: permitID };
            $scope.ngDialogData = param;
            $scope.openDialog("ATTACHMENTS", param);
        };
        $scope.OpenDailyCRUDWindow = function (dailyID, dailyType) {
            $scope.isPopup = true;
            var param = { DAILY_ID: dailyID, DAILY_TYPE: dailyType };
            $scope.ngDialogData = param;
            $scope.openDialog("DAILY-CRUD", param);
        };
        $scope.OpenPermitCRUDWindow = function (permitID, AllowToEdit, screenid) {
            $scope.isPopup = true;
            var param = { PERMIT_ID: permitID, SCREEN_ID: screenid };
            $scope.ngDialogData = param;
            if ((AllowToEdit == false && permitID != 0) || AllowToEdit == true) {
                $scope.openDialog("PERMIT-CRUD", param);
            }
        };
       
    }]);

var isChildDataChanged = false;
var isDublicateCompany = false;
var isSideBarBound = false;
var options = { interrupt: 'mousedown keydown' };
$(document).find('body')
    .on(options.interrupt, function () {
        if (document.getElementById("divBaseController")) {
            var scope = angular.element(document.getElementById("divBaseController")).scope();
            if (scope) {
                scope.makeIdleSessionRequest();
            }
        }
    })
    .on('touchmove', function (e) {
        if ($("input[type=text]").is(":focus"))
            $("input[type=text]").blur();
    });

function GetTaskNameById(taskId, allTaskNames) {
    if (taskId && taskId != '') {
        var selectedTask = _.find(allTaskNames, function (task) { return task.LOOK_UP_ID == taskId; });
        if (selectedTask)
            return selectedTask.LU_NAME;
    }
    return "";
}