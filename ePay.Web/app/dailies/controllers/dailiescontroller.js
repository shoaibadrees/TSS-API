angular.module('HylanApp').controller("DailiesController", ['$rootScope', '$scope', '$controller', '$timeout', 'DailiesService', 'ngDialog', 'Utility', 'NOTIFYTYPE', '$interval', '$filter', 'hylanCache',
    function ($rootScope, $scope, $controller, $timeout, DailiesService, ngDialog, Utility, NOTIFYTYPE, $interval, $filter, hylanCache) {
        $scope.AddButtonText = "Add Daily";
        $scope.ApiResource = "Dailies";
        $controller('BaseController', { $scope: $scope });
        $scope.multiSelectControl = {};
        $scope.multiSelectProjIdControl = {};

           //used for export 
        function Sheet() {
           this.title = "";
           this.columns = [];
           this.rows = [];
        } //insdie columns need to defind column attributes only ,
        function Row() {
           this.cells = [];
        };
        //inside rows one can define cells only 
        var evenColor = "#f1f1f1";
        var headerColor = "#FFF1B9";
        var summaryColor = "#f1e7a9"

        var Cell = function(val, backgroundColor, vAlign, hAlign, bold, showBorder) {

           this.bold = bold != null && bold != '' ? bold : false; //black
           this.value = val;
           this.color = "#000000";;
           this.background = backgroundColor != null && backgroundColor != "" ? backgroundColor : "#ffffff";
           this.vAlign = vAlign != null && vAlign != "" ? vAlign : "top";
           this.hAlign = hAlign != null && hAlign != "" ? hAlign : "left";
           var cellBorder = {
              color: "#000000", size: 1
           };

           showBorder = showBorder == null || showBorder === '' ? true : showBorder;
           if (showBorder) {
              this.borderTop = cellBorder;
              this.borderRight = cellBorder;
              this.borderBottom = cellBorder;
              this.borderLeft = cellBorder;

           }

           this.colSpan = 0;

           this.setEven = function() {
              this.background = "#f1f1f1"; this.bold = false;
           }

           this.setHeader = function() {
              this.background = "#FFF1B9"; this.bold = true;
           }

        }

        function getLocationSheet(dailyList,DailyTypesNames, DailyDate) {
            var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];            
            var dayInt = new Date(kendo.parseDate(DailyDate, "MM/dd/yyyy")).getDay();
            var day = "";
            if (dayInt > - 1 && dayInt < 7) {
               day = days[dayInt];
            }

           var sheet1 = new Sheet();
           sheet1.title = "Locations";
           sheet1.columns = [{ width: 150 }, { width: 80 }, { width: 80 }, { width: 200 }, { width: 80 },
                              { width: 120 }, { width: 80 }, { width: 150 }, { width: 250 }, { width: 150 },
           ];

           var reportTitleRow = new Row();
           var titleCells = [];
           var titleCell = new Cell("HYLAN DAILY WORK LOCATIONS", headerColor,"center","center")
           titleCell.colSpan = 10;
           reportTitleRow.cells.push(titleCell); //= [{ value: "HYLAN DAILY WORK LOCATIONS", colSpan: 10 }];;
           sheet1.rows.push(reportTitleRow);

           var emptyRow = new Row();
           emptyRow.cells = [];
           sheet1.rows.push(emptyRow);

           var criteriaRow = new Row(); 
           var creiteriaCells = [new Cell("Day", evenColor), new Cell(day), new Cell(DailyDate), new Cell("Daily Types ", evenColor), new Cell(DailyTypesNames)];
           criteriaRow.cells = creiteriaCells;
           criteriaRow.cells[4].colSpan = 6;
           sheet1.rows.push(criteriaRow);
           //emptyRow.cells =[];

           sheet1.rows.push(emptyRow);

           var headerRow = new Row();
           var cells = [new Cell("DOLLAR AMOUNT", headerColor), new Cell("HYLAN JOB NUMBER", headerColor), new Cell("LOCATION", headerColor), new Cell("*DAY(S)", headerColor),
                        new Cell("*STATUS", headerColor), new Cell("SHIFT", headerColor), new Cell("FOREMAN", headerColor), new Cell("JOB DETAILS", headerColor), new Cell("*CLIENT", headerColor)];
           headerRow.cells = cells;
           headerRow.cells[1].colSpan = 2;
           sheet1.rows.push(headerRow);

           var rowIndex = 1;
           var totalAmount = 0;
           for (var i = 0; i < dailyList.length; i++, rowIndex++) {
              var dataRow = new Row();
              var dollarAmt = kendo.toString(dailyList[i].TRACK_REVENUE, "c");

              if (rowIndex % 2 == 0) {
                 var cells = [new Cell(dollarAmt, evenColor, "", "right")
                                 , new Cell(dailyList[i].HYLAN_JOB_NUMBER, evenColor,"","right")
                                 , new Cell(dailyList[i].JOB_FILE_NUMBER, evenColor)//, backgroundColor, vAlign, hAlign, bold, showBorder
                                 , new Cell(dailyList[i].STREET_ADDRESS, evenColor)
                                 , new Cell(dailyList[i].DAILY_DAYS, evenColor)
                                 , new Cell(dailyList[i].DAILY_STATUS_NAME, evenColor)
                                 , new Cell(dailyList[i].DAILY_SHIFT_NAME, evenColor)
                                 , new Cell(dailyList[i].FOREMAN, evenColor)
                                 , new Cell("", evenColor)
                                 , new Cell(dailyList[i].CLIENT_NAME, evenColor)];
                 dataRow.cells = cells;
              }
              else {
                 var cells = [new Cell(dollarAmt, "", "", "right")
                                 , new Cell(dailyList[i].HYLAN_JOB_NUMBER,"", "", "right")
                                 , new Cell(dailyList[i].JOB_FILE_NUMBER)
                                 , new Cell(dailyList[i].STREET_ADDRESS)
                                 , new Cell(dailyList[i].DAILY_DAYS)
                                 , new Cell(dailyList[i].DAILY_STATUS_NAME)
                                 , new Cell(dailyList[i].DAILY_SHIFT_NAME)
                                 , new Cell(dailyList[i].FOREMAN)
                                 , new Cell("")
                                 , new Cell(dailyList[i].CLIENT_NAME)];
                 dataRow.cells = cells;
              }
             
              sheet1.rows.push(dataRow);
              totalAmount += dailyList[i].TRACK_REVENUE;
           }

           var dollarTotal = kendo.toString(totalAmount, "c");

          var totalRow = new Row();
          var totalCells = [new Cell(dollarTotal, headerColor, "", "right"), new Cell("Total", headerColor)];
          totalRow.cells = totalCells;
          sheet1.rows.push(totalRow);


           return sheet1;
        }

        function insertSummaryForHoursReport(summaryTitle,sheet1, jobSummary)
        {
            var jobsSummaryRow = new Row();
            var jobSummaryCells = [new Cell("") //summaryColor
                            , new Cell("")//, backgroundColor, vAlign, hAlign, bold, showBorder
                            , new Cell("")
                            , new Cell("")
                            , new Cell("")
                            , new Cell(summaryTitle, summaryColor) //cell index = 5                                   
                            , new Cell(jobSummary.ST_HOURS, summaryColor, "", "right")
                            , new Cell(jobSummary.OT_HOURS, summaryColor, "", "right")
                            , new Cell(jobSummary.HOURS_DIFF, summaryColor, "", "right")
                            , new Cell(jobSummary.TOTAL_HOURS, summaryColor, "", "right")
                            , new Cell("", evenColor)];
            jobsSummaryRow.cells = jobSummaryCells;
            jobsSummaryRow.cells[5].colSpan = 2;
            sheet1.rows.push(jobsSummaryRow);
            //resetting values 
            jobSummary.ST_HOURS = 0;
            jobSummary.OT_HOURS = 0;
            jobSummary.HOURS_DIFF = 0;
            jobSummary.TOTAL_HOURS = 0;            
        }
        
        function getHoursSheet(dailyList, DailyTypesNames, fromDailyDate, toDailyDate) {
            var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            var sheet1 = new Sheet();
            sheet1.title = "Hours";
            sheet1.columns = [{ width: 100 }, { width: 90 }, { width: 90 }, { width: 200 }, { width: 90 },
                               { width: 120 }, { width: 120 }, { width: 90 }, { width: 90 }, { width: 90 },
                               { width: 90 }, { width: 150 }
            ];

            var reportTitleRow = new Row();
            var titleCells = [];
            var titleCell = new Cell("JOB-DAILY DETAILED HOUR REPORT", headerColor, "center", "center")
            titleCell.colSpan = 12;
            reportTitleRow.cells.push(titleCell); //= [{ value: "HYLAN DAILY WORK LOCATIONS", colSpan: 10 }];;
            sheet1.rows.push(reportTitleRow);

            //---------
            var reportDateRow = new Row();
            var reportDate = new Date();

            var reportDayInt = new Date().getDay();
            var reportDay = "";
            if (reportDayInt > -1 && reportDayInt < 7) {
                reportDay = days[reportDayInt];
            }
            reportDateRow.cells = [new Cell("Report Date", evenColor), new Cell(reportDay), new Cell(FormatDate(reportDate, null, true))];
            reportDateRow.cells[2].colSpan = 2;
            sheet1.rows.push(reportDateRow);
            //-------------
            var criteriaTitleRow = new Row();
            criteriaTitleRow.cells = [new Cell("Criteria")];
            sheet1.rows.push(criteriaTitleRow);
            //---------
            var criteriaRow = new Row();
            var creiteriaCells = [new Cell("From Date", evenColor), new Cell(fromDailyDate), new Cell('-To-', evenColor,"", "center"), new Cell(toDailyDate), new Cell("Daily Types ", evenColor), new Cell(DailyTypesNames)];
            criteriaRow.cells = creiteriaCells;
            criteriaRow.cells[5].colSpan = 7;
            sheet1.rows.push(criteriaRow);
            //emptyRow.cells =[];

            var emptyRow1 = new Row();
            emptyRow1.cells = [];
            sheet1.rows.push(emptyRow1);

            var headerRow = new Row();
            var cells = [new Cell("HYLAN PROJECT", headerColor), new Cell("JOB", headerColor), new Cell("DAILY DATE", headerColor), new Cell("DAILY TYPE", headerColor), new Cell("DAILY STATUS", headerColor)
                , new Cell("NAME", headerColor), new Cell("JOB TYPE", headerColor), new Cell("ST. HOURS", headerColor), new Cell("OT. HOURS", headerColor), new Cell("DIFF. HOURS", headerColor), new Cell("TOTAL HOURS", headerColor), new Cell("*CLIENT", headerColor)];
            headerRow.cells = cells;
            //headerRow.cells[1].colSpan = 2;
            sheet1.rows.push(headerRow);

            
            var rowIndex = 1;

            var dailySummary = { ST_HOURS : 0,OT_HOURS:0, HOURS_DIFF : 0, TOTAL_HOURS: 0,isSummaryRowInserted : false, RowNo:0};
          
            var jobSummary = { ST_HOURS: 0, OT_HOURS: 0, HOURS_DIFF: 0, TOTAL_HOURS: 0, isSummaryRowInserted: false, RowNo: 0 };

            for (var i = 0; i < dailyList.length; i++, rowIndex++) {
                var dataRow = new Row();
                var HYLAN_JOB_NUMBER = dailyList[i].HYLAN_JOB_NUMBER;
                var JOB_FILE_NUMBER = dailyList[i].JOB_FILE_NUMBER;
                var DAILY_DATE = dailyList[i].DAILY_DATE;
                var DAILY_TYPE_NAME = dailyList[i].DAILY_TYPE_NAME;
                var DAILY_STATUS_NAME = dailyList[i].DAILY_STATUS_NAME;
                var CLIENT_NAME = dailyList[i].CLIENT_NAME;

                if (i > 0 && dailyList[i].DAILY_ID == dailyList[i - 1].DAILY_ID) {
                    
                    DAILY_DATE = "";
                    DAILY_TYPE_NAME = "";
                    DAILY_STATUS_NAME = "";
                }
                if (i > 0 && dailyList[i].JOB_ID == dailyList[i - 1].JOB_ID) {
                    JOB_FILE_NUMBER = "";
                }
                if (i > 0 && dailyList[i].PROJECT_ID == dailyList[i - 1].PROJECT_ID) {
                    HYLAN_JOB_NUMBER = "";
                    CLIENT_NAME = "";
                }

                if (rowIndex % 2 == 0) {
                    var cells = [new Cell(HYLAN_JOB_NUMBER, evenColor, "", "right")
                                    , new Cell(JOB_FILE_NUMBER, evenColor)//, backgroundColor, vAlign, hAlign, bold, showBorder
                                    , new Cell(DAILY_DATE, evenColor)
                                    , new Cell(DAILY_TYPE_NAME, evenColor)
                                    , new Cell(DAILY_STATUS_NAME, evenColor)
                                    , new Cell(dailyList[i].NAME, evenColor)
                                    , new Cell(dailyList[i].JOB_TYPE, evenColor)                           
                                    , new Cell(dailyList[i].ST_HOURS, evenColor, "", "right")
                                    , new Cell(dailyList[i].OT_HOURS, evenColor, "", "right")
                                    , new Cell(dailyList[i].HOURS_DIFF, evenColor, "", "right")
                                    , new Cell(dailyList[i].TOTAL_HOURS, evenColor, "", "right")
                                    , new Cell(CLIENT_NAME, evenColor)];
                    dataRow.cells = cells;
                }
                else {             
                    var cells = [new Cell(HYLAN_JOB_NUMBER, "", "", "right")
                                    , new Cell(JOB_FILE_NUMBER)//, backgroundColor, vAlign, hAlign, bold, showBorder
                                    , new Cell(DAILY_DATE)
                                    , new Cell(DAILY_TYPE_NAME)
                                    , new Cell(DAILY_STATUS_NAME)
                                    , new Cell(dailyList[i].NAME)
                                    , new Cell(dailyList[i].JOB_TYPE)
                                    , new Cell(dailyList[i].ST_HOURS, "", "", "right")
                                    , new Cell(dailyList[i].OT_HOURS, "", "", "right")
                                    , new Cell(dailyList[i].HOURS_DIFF, "", "", "right")
                                    , new Cell(dailyList[i].TOTAL_HOURS, "", "", "right")
                                    , new Cell(CLIENT_NAME)];
                    dataRow.cells = cells;
                }

                sheet1.rows.push(dataRow);

                dailySummary.ST_HOURS += dailyList[i].ST_HOURS;
                dailySummary.OT_HOURS += dailyList[i].OT_HOURS;
                dailySummary.HOURS_DIFF += dailyList[i].HOURS_DIFF;
                dailySummary.TOTAL_HOURS += dailyList[i].TOTAL_HOURS;
                dailySummary.RowNo++;

                jobSummary.ST_HOURS += dailyList[i].ST_HOURS;
                jobSummary.OT_HOURS += dailyList[i].OT_HOURS;
                jobSummary.HOURS_DIFF += dailyList[i].HOURS_DIFF;
                jobSummary.TOTAL_HOURS += dailyList[i].TOTAL_HOURS;
                jobSummary.RowNo++;

                if (dailySummary.RowNo >= dailyList[i].DAILYS_ROW_COUNT) {
                    insertSummaryForHoursReport("DAILY TOTAL", sheet1, dailySummary);
                    dailySummary.RowNo = 0;
                }
                if (jobSummary.RowNo >= dailyList[i].JOBS_ROWS_COUNT) {
                    //insert job summary
                    insertSummaryForHoursReport("JOB TOTAL", sheet1, jobSummary);
                    jobSummary.RowNo = 0;
                }
            }
            return sheet1;
        }       

         $scope.exportLocationReport = function(e) {
           //var dailyTypeText1 = $("#ddlDailyType option:selected").text();

            var selectedDailyTypeList = hylanCache.GetValue(hylanCache.Keys.DAILY_TYPE, Globals.Screens.MANAGE_DAILIES.ID);
            var selectedDailyDate = hylanCache.GetValue(hylanCache.Keys.START_DATE, Globals.Screens.MANAGE_DAILIES.ID);
            var DailyTypesNames = "";
            var DailyDate = "";
            if (selectedDailyTypeList && selectedDailyTypeList.length > 0) DailyTypesNames = getIDFromList(selectedDailyTypeList, 'LU_NAME');
            if (selectedDailyDate && selectedDailyDate != "All" && selectedDailyDate != "") DailyDate = selectedDailyDate;

            if (DailyDate == "") {
               alert("Location Report can't be exported without 'Start Work Date'")
               return;
            }

           var dailyList;
           DailiesService.GetLocationReport().then(function(result) {
              dailyList = result.objResultList;
           }).fail(onError);

           var excelSheets = [];
           var locationSheet = getLocationSheet(dailyList, DailyTypesNames, DailyDate);

           excelSheets.push(locationSheet);
           var workbook1 = new kendo.ooxml.Workbook({
              sheets: excelSheets
           });

           var dailyFileName = "Location_" + DailyDate +".xlsx"

           kendo.saveAs({
              dataURI: workbook1.toDataURL(),
              fileName: dailyFileName
           });
        };
       
         $scope.dailyHourReport = function () {
             var selectedDailyTypeList = hylanCache.GetValue(hylanCache.Keys.DAILY_TYPE, Globals.Screens.MANAGE_DAILIES.ID);
             var selectedDailyDate = hylanCache.GetValue(hylanCache.Keys.START_DATE, Globals.Screens.MANAGE_DAILIES.ID);
             var selectedEndDailyDate = hylanCache.GetValue(hylanCache.Keys.END_DATE, Globals.Screens.MANAGE_DAILIES.ID);

             var DailyTypesNames = "";
             var fromDailyDate = "";
             var toDailyDate = "";
             if (selectedDailyTypeList && selectedDailyTypeList.length > 0) DailyTypesNames = getIDFromList(selectedDailyTypeList, 'LU_NAME');
             if (selectedDailyDate && selectedDailyDate != "All" && selectedDailyDate != "") fromDailyDate = selectedDailyDate;
             if (selectedEndDailyDate && selectedEndDailyDate != "All" && selectedEndDailyDate != "") toDailyDate = selectedEndDailyDate;

             if (fromDailyDate == "" && toDailyDate == "") {
                 alert("Hours Report can't be exported without 'Start/End Work Date'")
                 return;
             }

             if (fromDailyDate != "" && toDailyDate == "") {
                 toDailyDate = fromDailyDate;  
             }
             if (toDailyDate != "" && fromDailyDate == "") {
                 fromDailyDate = toDailyDate;
             }

             var dailyList;
             DailiesService.GetHoursReport().then(function (result) {
                 dailyList = result.objResultList;
             }).fail(onError);

             var excelSheets = [];
             var hoursSheet = getHoursSheet(dailyList, DailyTypesNames, fromDailyDate, toDailyDate);

             excelSheets.push(hoursSheet);
             var workbook1 = new kendo.ooxml.Workbook({
                 sheets: excelSheets
             });

             var dailyFileName = "Hours_" + fromDailyDate + ".xlsx"

             kendo.saveAs({
                 dataURI: workbook1.toDataURL(),
                 fileName: dailyFileName
             });
         }

        if ($rootScope.isUserLoggedIn == false)
            return false;

        $scope.ApiResource = "Dailies";
        $scope.CurrentView = "ManageDailies";

        var onDataBound = function (args) {
            $scope.handleDataBound(true);
            $scope.$emit("ChildGridLoaded", args.sender);
            hilightEnteredRow();
        };

        $scope.AllowToEdit = true;

        var editPerm = Globals.CheckEditPermission($scope.Screens.MANAGE_DAILIES.ID);
        if (editPerm == false)
            $scope.AllowToEdit = false;
        Globals.GetProjects().then(function (result) {
            $scope.projectsDS = $filter('orderBy')(result.objResultList, 'HYLAN_PROJECT_ID');
            var unknownPrj = { PROJECT_ID: -1, HYLAN_PROJECT_ID: "Unknown" };
            if ($scope.projectsDS && $scope.projectsDS.length == 0)
                $scope.projectsDS = [];
            $scope.projectsDS.splice(0, 0, unknownPrj);
        });

        //filters
        //$scope.filters = {
        //    "DAILY_STATUS_NAME": { name: "DAILY_STATUS_NAME", field: "DAILY_STATUS_NAME", operator: "eq", value: "0", elementType: "text" },
        //    "DAILY_SHIFT_NAME": { name: "DAILY_SHIFT_NAME", operator: "eq", value: "0", elementType: "text" }
        //};
        //default sortings
        //$scope.defaultFilter = { name: "DAILY_STATUS_NAME", operator: "eq", value: "Complete", field: "DAILY_STATUS_NAME", elementType: "text" };
        $scope.defaultSort = DailiesService.defaultSort;

        //-- if searchcolumn type = number then operator will be equal
        $scope.searchColumns = [
            { field: "HYLAN_PROJECT_ID" },
            { field: "JOB_FILE_NUMBER" },
            { field: "CLIENT_NAME" },
            { field: "NODE_ID1" },
            { field: "NODE_ID2" },
            { field: "NODE_ID3" },
            { field: "HUB" },
            { field: "CLIENT_PM" },
            { field: "HYLAN_PM_NAME" },
            { field: "STREET_ADDRESS" },
            { field: "CITY" },
            { field: "STATE" },
            { field: "ZIP" },
            { field: "LAT" },
            { field: "LONG" },
            { field: "POLE_LOCATION" },
            { field: "DAILY_TYPE_NAME" },
            { field: "DAY_OF_WEEK" },
            { field: "DAILY_DAYS" },
            { field: "DAILY_STATUS_NAME" },
            { field: "DAILY_SHIFT_NAME" },
            { field: "WORK_ORDER_NUMBER" },
            { field: "DAILY_TYPE_NOTES" },
            { field: "QUICK_NOTES" },
            { field: "MODIFIED_BY_NAME" },
            { field: "DAILY_DATE" },
            { field: "MODIFIED_ON" },
            { field: "MODIFIED_ON1" },
            { field: "TRACK_REVENUE", type: "number" },
            { field: "ATTACHMENTS_COUNT", type: 'number' }
        ];

        //prepare the toolbar for filter and to add, deleted record

        

        $scope.GetCustomToolbar = function() {
            var toolbar = [];

            var btnHoursReport = { name: "Hours Report", template: '<a class="k-button k-button-icontext" id="btnExportLocation" ng-click="dailyHourReport()" onmouseover="onMouseOver_HourlyReport()" onmouseleave="onMouseLeave_HourlyReport()"  ><span class="k-icon k-i-file-excel"></span>Hours Report</a>' };
            toolbar.push(btnHoursReport);

            var btnLocation = { name: "Export Location", template: '<a class="k-button k-button-icontext" id="btnExportLocation" ng-click="exportLocationReport()" onmouseover="btnExportLocation_onmouseover()" onmouseleave="btnExportLocation_mouseleave()" ><span class="k-icon k-i-file-excel"></span>Export Location</a>' };
            toolbar.push(btnLocation);

            var DeleteJobPerm = Globals.GetSpecificPermission(Globals.Screens.MANAGE_DAILIES.ID, "SPECIAL_FUNCTION", Globals.Screens.MANAGE_DAILIES.SPECIAL_FUNCTION.DELETE_DAILY);
            if (DeleteJobPerm != undefined && DeleteJobPerm != null) {
                if (DeleteJobPerm.VIEW_ACCESS_GENERAL) {
                    var deleteBtn = {
                        name: "custom_destroy", template: '<a class="k-button k-button-icontext k-grid-destroyRecord" id="toolbar-custom_destroy" ng-click="destroyRecords();"><span class="k-icon k-i-delete"></span>Delete</a>'
                    }
                    toolbar.push(deleteBtn);
                }
            }
            var addBtn = { name: "Add Daily", template: '<a class="k-button k-button-icontext k-grid-save-changes" ng-click="OpenDailyCRUDWindow(0,0)"><span class="k-icon k-i-add"></span>' + $scope.AddButtonText + '</a>' };
            toolbar.push(addBtn);
            return toolbar;
            //if ($scope.gridOptions.toolbar)
            // $scope.gridOptions.toolbar.unshift({ name: "custom_destroy", template: '<a class="k-button k-button-icontext k-grid-destroyRecord" id="toolbar-custom_destroy" ng-click="destroyRecord();"><span class="k-icon k-delete"></span>Delete</a>' });
        };


        $scope.ResetFilter = function() {
            $scope.clearFilters();
            hylanCache.RemoveKey(hylanCache.Keys.LATEST_PROJECTS, Globals.Screens.MANAGE_DAILIES.ID);
            hylanCache.RemoveKey($scope.MSDailyTypes.key);
            hylanCache.RemoveKey($scope.MSDailyStatus.key);
            hylanCache.RemoveKey($scope.MSDailyShift.key);
            hylanCache.RemoveKey($scope.MSDailyShift.key);
            hylanCache.RemoveKey(hylanCache.Keys.START_DATE, Globals.Screens.MANAGE_DAILIES.ID);
            hylanCache.RemoveKey(hylanCache.Keys.END_DATE, Globals.Screens.MANAGE_DAILIES.ID);
            hylanCache.RemoveKey(hylanCache.Keys.IS_DEFAULT_FOR_DATES, Globals.Screens.MANAGE_DAILIES.ID);
            
            $scope.ApplyCache();
            $scope.RefreshGrid();
            if ($scope.multiSelectControl.resetQuerySearchBox != undefined) {
                $scope.multiSelectControl.resetQuerySearchBox();
        }

            if ($scope.multiSelectProjIdControl.resetQuerySearchBox != undefined) {
                $scope.multiSelectProjIdControl.resetQuerySearchBox();
        }
        }

        function setDefaultValuesOnDates() {


            var IsDeaultValuesForDates = hylanCache.GetValue(hylanCache.Keys.IS_DEFAULT_FOR_DATES, Globals.Screens.MANAGE_DAILIES.ID);

            if (IsDeaultValuesForDates == undefined || IsDeaultValuesForDates == "Y") {
                //set default values
                //default value is last 30 days
                var curDate = new Date();
                var newDate = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate() - 30);
                $scope.DailyStartDate = moment(newDate).format('MM/DD/YYYY');
                $scope.DailyEndDate = moment(curDate).format('MM/DD/YYYY');

                hylanCache.SetValue(hylanCache.Keys.IS_DEFAULT_FOR_DATES, "Y", Globals.Screens.MANAGE_DAILIES.ID);
                hylanCache.SetValue(hylanCache.Keys.START_DATE, $scope.DailyStartDate, Globals.Screens.MANAGE_DAILIES.ID);
                hylanCache.SetValue(hylanCache.Keys.END_DATE, $scope.DailyEndDate, Globals.Screens.MANAGE_DAILIES.ID);
            }
            else
            {
                var DailyStartDate = hylanCache.GetValue(hylanCache.Keys.START_DATE, Globals.Screens.MANAGE_DAILIES.ID);
                if (DailyStartDate) {
                    $scope.DailyStartDate = DailyStartDate;
                }
                var DailyEndDate = hylanCache.GetValue(hylanCache.Keys.END_DATE, Globals.Screens.MANAGE_DAILIES.ID);
                if (DailyEndDate) {
                    $scope.DailyEndDate = DailyEndDate;
                }
            }
           
            //var curDate = new Date();
            //var newDate = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate() - 30);

            //var DailyStartDate = hylanCache.GetValue(hylanCache.Keys.START_DATE, Globals.Screens.MANAGE_DAILIES.ID);

            //if (DailyStartDate && DailyStartDate != "Default") {
            //    $scope.DailyStartDate = DailyStartDate;
            //}

            //if (DailyStartDate && DailyStartDate != "All") {
            //    $scope.DailyStartDate = DailyStartDate;
            //} else {
            //    $scope.DailyStartDate = moment(newDate).format('MM/DD/YYYY');
            //}

            //var DailyEndDate = hylanCache.GetValue(hylanCache.Keys.END_DATE, Globals.Screens.MANAGE_DAILIES.ID);
            //if (DailyEndDate && DailyEndDate != "All") {
            //    $scope.DailyEndDate = DailyEndDate;
            //}
            //else {
            //    $scope.DailyEndDate = moment(curDate).format('MM/DD/YYYY');
            //}

        }

           //binding tool bar
        if ($scope.AllowToEdit) {
            $scope.gridOptions.toolbar = $scope.GetCustomToolbar();
        }
        else {
            $scope.gridOptions.toolbar = "";
            var winHeight = $(window).height(),
         mainHead = $(".main-head").outerHeight();
            var availableHeight = winHeight -(mainHead);
            Globals.resizeGrid("#responsive-tables #grid1", availableHeight * 0.90);
        }
        $scope.gridOptions.editable = false;
        DailiesService.dataSource._filter =[];

           //binding grid datasource
        $scope.gridOptions.dataSource = DailiesService.dataSource;
        $scope.gridOptions.dataBound = onDataBound;

           //fixing for hand held devices
        var strColWidth = '9%';
        var numColWidth = '7%';
        maxlen = 6;
        if (/iPad/.test(Globals.UserAgent) || /Android/.test(Globals.UserAgent)) {
            strColWidth = '150px';
            numColWidth = '85px';
        }

           //creating link that will display inside the grid
        var dailyAttachmentsTemplate
           //  if (Globals.IsScreenVisible($scope.Screens.PERMIT_ATTACHMENTS.ID)) {
        dailyAttachmentsTemplate = "<a href='javascript:;' ng-click='setScreenAndRowID(#:DAILY_ID#); OpenAttachmentCRUDWindowdDaily(#:DAILY_ID#, #:JOB_ID#, #:PROJECT_ID#, \"#:HYLAN_PROJECT_ID#\", \"#:JOB_FILE_NUMBER#\", \"ATTACHMENTS\")' >(#:ATTACHMENTS_COUNT#)</a>";
           //  }
           //else {
           //  dailyAttachmentsTemplate = "#: ATTACHMENTS_COUNT == null ? '' : ATTACHMENTS_COUNT#";
           //}
        var hylenProjectIDTemplate;
        if (Globals.IsScreenVisible($scope.Screens.MANAGE_PROJECTS.ID)) {
            hylenProjectIDTemplate = "<a href='javascript:;' ng-click='setScreenAndRowID(#:DAILY_ID#); OpenProjectCRUDWindow(#:PROJECT_ID#)' >#: HYLAN_PROJECT_ID == null ? '' : HYLAN_PROJECT_ID#</a>";
        }
        else {
            hylenProjectIDTemplate = "#: HYLAN_PROJECT_ID == null ? '' : HYLAN_PROJECT_ID#";
        }
        var jobFileNumberTemplate
        if (Globals.IsScreenVisible($scope.Screens.MANAGE_JOBS.ID)) {
            jobFileNumberTemplate = "<a href='javascript:;' ng-click='setScreenAndRowID(#:DAILY_ID#); OpenJobCRUDWindow(#:JOB_ID#," +$scope.AllowToEdit + ")' >#: JOB_FILE_NUMBER == null ? '' : JOB_FILE_NUMBER#</a>";
        }
        else {
            jobFileNumberTemplate = "#: JOB_FILE_NUMBER == null ? '' : JOB_FILE_NUMBER#";
        }
        var dailyTemplate = "<a href='javascript:;' ng-click='setScreenAndRowID(#:DAILY_ID#); OpenDailyCRUDWindow(#:DAILY_ID#,#:DAILY_TYPE# )' >View/Edit</a>";

        $scope.gridOptions.columns =[
                   { field: "ROW_HEADER", width: "20px", title: "   .", sortable: false, locked: true, headerAttributes: { "class": "sub-col darkYellow-col rowHeaderHeadYellow", "style": "border-right: 0px !important;" }, attributes: { "class": "contert-alpha GridBorder rowHeaderCell" }, filterable: false
        },
                   { field: "JOB_ID", type: "number", title: "Project ID11", width: "80px", hidden: true, locked: true, headerAttributes: { "class": "sub-col darkYellow-col rowHeaderHead2" }, attributes: { "class": "GridBorder" }, template: "#: JOB_ID == null ? '' : JOB_ID#"
        },
                   { field: "PROJECT_ID", title: "Project ID11", width: "80px", hidden: true, locked: true, headerAttributes: { "class": "sub-col darkYellow-col rowHeaderHead2" }, attributes: { "class": "GridBorder" }, template: "#: PROJECT_ID == null ? '' : PROJECT_ID#"
        },
                //{ field: "DAILY_ID", title: "DAILY_ID ", width: "80px", locked: true, headerAttributes: { "class": "sub-col darkYellow-col rowHeaderHead2" }, attributes: { "class": "GridBorder" }, template: "#: DAILY_ID == null ? '' : DAILY_ID#" },
                   { field: "VIEW_EDIT", title: "View/Edit", width: "120px", sortable: false, locked: true, headerAttributes: { "class": "sub-col darkYellow-col rowHeaderHead2" }, attributes: { "class": "GridBorder" }, template: dailyTemplate, filterable: false
        },
                {
                      field: "HYLAN_PROJECT_ID", title: "<sup><img src='../../../Content/images/red_asterisk.png' /></sup>Project ID", width: "150px", locked: true, headerAttributes: { "class": "sub-col darkYellow-col rowHeaderHead2"
                }, attributes: { "class": "GridBorder"
                },
                      template: function(dataItem) {
                        if (dataItem.PROJECT_ID == null || dataItem.PROJECT_ID == -1) {
                            dataItem.HYLAN_PROJECT_ID = "Unknown";
                            return dataItem.HYLAN_PROJECT_ID;
                      }
                        return "<a href='javascript:;' ng-click='setScreenAndRowID(" +dataItem.DAILY_ID + "); OpenProjectCRUDWindow(" +dataItem.PROJECT_ID + ")' >" +dataItem.HYLAN_PROJECT_ID + "</a>";
                }
                   , filterable: stringFilterAttributes
        },
                {
                      field: "JOB_FILE_NUMBER", title: "<br/><sup><img src='../../../Content/images/red_asterisk.png' /></sup>Job File #", width: "120px", locked: true, headerAttributes: { "class": "sub-col darkYellow-col rowHeaderHead2 section-border"
                }, attributes: { "class": "GridBorder section-border"
                },
                      template: function(dataItem) {
                        if (dataItem.JOB_ID == null || dataItem.JOB_ID == -1) {
                            dataItem.JOB_FILE_NUMBER = "Unknown";
                            return dataItem.JOB_FILE_NUMBER;
                      }
                        return "<a href='javascript:;' ng-click='setScreenAndRowID(" +dataItem.DAILY_ID + "); OpenJobCRUDWindow(" +dataItem.JOB_ID + "," +$scope.AllowToEdit + ")' >" +dataItem.JOB_FILE_NUMBER + "</a>";
                }
                   , filterable: stringFilterAttributes
        },
                   { field: "DAILY_TYPE", hidden: true, title: "Daily Type", width: "200px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#: DAILY_TYPE == null ? '' : DAILY_TYPE#"
        },
                   { field: "DAILY_TYPE_NAME", title: "<sup><img src='../../../Content/images/red_asterisk.png' /></sup>Daily Type", width: "180px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#: DAILY_TYPE_NAME == null ? '' : DAILY_TYPE_NAME#", filterable: stringFilterAttributes
        },
                   { field: "DAILY_DATE", title: "<sup><img src='../../../Content/images/red_asterisk.png' /></sup>Work Date", width: "170px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-number GridBorder" }, template: "#: DAILY_DATE == null ? '' : FormatDate(DAILY_DATE,false,false)#", filterable: { cell: { operator: "eq", showOperators: true } }
        },
                   { field: "DAY_OF_WEEK", title: "Day of Week", width: "120px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#: DAY_OF_WEEK == null ? '' : DAY_OF_WEEK#", filterable: stringFilterAttributes
        },
                   { field: "DAILY_DAYS", title: "<sup><img src='../../../Content/images/red_asterisk.png' /></sup>Day(s)", width: "80px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-number GridBorder" }, template: "#: DAILY_DAYS == null ? '' : DAILY_DAYS#", filterable: numberFilterAttributes
        },
                   { field: "STATUS", hidden: true, title: "Status", width: "120px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#: STATUS == null ? '' : STATUS#"
        },
                   { field: "DAILY_STATUS_NAME", title: "<sup><img src='../../../Content/images/red_asterisk.png' /></sup>Status", width: "100px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#: DAILY_STATUS_NAME == null ? '' : DAILY_STATUS_NAME#", filterable: stringFilterAttributes
        },
                   { field: "SHIFT", hidden: true, title: "<sup><img src='../../../Content/images/red_asterisk.png' /></sup>Shift", width: "90px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#: SHIFT == null ? '' : SHIFT#"
        },
                   { field: "DAILY_SHIFT_NAME", title: "Shift", width: "120px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#: DAILY_SHIFT_NAME == null ? '' : DAILY_SHIFT_NAME#", filterable: stringFilterAttributes
        },
                   { field: "WORK_ORDER_NUMBER", title: "Work Order #", width: "140px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#: WORK_ORDER_NUMBER == null ? '' : WORK_ORDER_NUMBER#", filterable: stringFilterAttributes
        },

                   { field: "CLIENT_NAME", title: "<sup><img src='../../../Content/images/red_asterisk.png' /></sup>Client", width: "100px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#: CLIENT_NAME == null ? '' : CLIENT_NAME#", filterable: stringFilterAttributes
        },
                   { field: "NODE_ID1", title: "Node ID 1", width: "100px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#: NODE_ID1 == null ? '' : NODE_ID1#", filterable: stringFilterAttributes
        },
                   { field: "NODE_ID2", title: "Node ID 2", width: "100px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#: NODE_ID2 == null ? '' : NODE_ID2#", filterable: stringFilterAttributes
        },
                   { field: "ATTACHMENTS_COUNT", title: "ATTACHMENTS", width: "120px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "GridBorder" }, template: dailyAttachmentsTemplate, filterable: false
        },
                   { field: "QUICK_NOTES", title: "Quick Notes", width: "200px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#= checkTextLength('Quick',checkNull(data.DAILY_TYPE_NAME), FormatDate(data.DAILY_DATE), checkNull(data.QUICK_NOTES))#", filterable: stringFilterAttributes
        },
                   { field: "DAILY_TYPE_NOTES", title: "Notes", width: "200px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#= checkTextLength('',checkNull(data.DAILY_TYPE_NAME), FormatDate(data.DAILY_DATE), checkNull(data.DAILY_TYPE_NOTES))#", filterable: stringFilterAttributes
        },

                   { field: "NODE_ID3", title: "Node ID 3", width: "100px", hidden: true, headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#: NODE_ID3 == null ? '' : NODE_ID3#", filterable: stringFilterAttributes
        },
                   { field: "HUB", title: "HUB", width: "100px", hidden: true, headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#: HUB == null ? '' : HUB#", filterable: stringFilterAttributes
        },
                   { field: "HYLAN_PM_NAME", title: "Hylan PM", width: "100px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#: HYLAN_PM_NAME == null ? '' : HYLAN_PM_NAME#", filterable: stringFilterAttributes
        },
                   { field: "STREET_ADDRESS", title: "<sup><img src='../../../Content/images/red_asterisk.png' /></sup>Street Address", width: "150px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#: STREET_ADDRESS == null ? '' : STREET_ADDRESS#", filterable: stringFilterAttributes
        },
                   { field: "CITY", title: "<sup><img src='../../../Content/images/red_asterisk.png' /></sup>City", width: "80px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#: CITY == null ? '' : CITY#", filterable: stringFilterAttributes
        },
                   { field: "STATE", title: "<sup><img src='../../../Content/images/red_asterisk.png' /></sup>State", width: "80px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-alpha" }, template: "#: STATE == null ? '' : STATE#", filterable: stringFilterAttributes
        },
                   { field: "ZIP", title: "Zip", width: "80px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-number GridBorder" }, template: "#: ZIP == null ? '' : ZIP#", filterable: stringFilterAttributes
        },
                   { field: "LAT", title: "Latitude", width: "100px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-number GridBorder" }, template: "#: LAT == null ? '' : LAT#", filterable: stringFilterAttributes
        },
                   { field: "LONG", title: "Longitude", width: "110px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-number GridBorder" }, template: "#: LONG == null ? '' : LONG#", filterable: stringFilterAttributes
        },
                   { field: "POLE_LOCATION", title: "Pole Location", width: "140px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#: POLE_LOCATION == null ? '' : POLE_LOCATION#", filterable: stringFilterAttributes
        },
                   { field: "TRACK_REVENUE", title: "Track Revenue", type: "number", width: "110px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-number GridBorder" }, format: "{0:c}", filterable: numberFilterAttributes
        },

                   { field: "CREATED_BY_NAME", title: "Created by", width: "150px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#: CREATED_BY_NAME == null ? '' : CREATED_BY_NAME#", filterable: stringFilterAttributes
        },
                   { field: "CREATED_BY", title: "CREATED_BY", width: "150px", hidden: true, headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "GridBorder" }, template: "#: CREATED_BY == null ? '' : CREATED_BY#"
        },
                   { field: "CREATED_ON", title: "CREATED_ON", width: "150px", hidden: true, headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "GridBorder" }, template: "#: CREATED_ON == null ? '' : moment(CREATED_ON).format('MM/DD/YYYY')#"
        },
                   { field: "MODIFIED_BY", title: "Updated By", width: "150px", hidden: true, headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "GridBorder" }, template: "#: MODIFIED_BY == null ? '' : MODIFIED_BY#"
        },
                   { field: "MODIFIED_BY_NAME", title: "Updated By", width: "130px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#: MODIFIED_BY_NAME == null ? '' : MODIFIED_BY_NAME#", filterable: stringFilterAttributes
        },
                {
                      field: "MODIFIED_ON1", title: "Updated On", width: "130px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-number GridBorder" }, template: "#: MODIFIED_ON1 == null ? '' : MODIFIED_ON1#", filterable: stringFilterAttributes
                   //, sortable: {
                   //   compare: function (a, b) {
                   //      return a.MODIFIED_ON == b.MODIFIED_ON;
                   //   }
                   //}
        },
                   { field: "LOCK_COUNTER", title: "LOCK_COUNTER", width: "150px", hidden: true, headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-number GridBorder" }, template: "#: LOCK_COUNTER == null ? '' : LOCK_COUNTER#" }
        ];

        $scope.gridOptions.filterable = true;
        $scope.gridOptions.filterable = {
              mode: "row"
        }

        $scope.$on("CRUD_OPERATIONS_SUCCESS", function(event, args) {
            $scope.RefreshGrid();
        });
        $scope.$on("CLOSE_WITHOUT_CHANGE", function(event, args) {
            hilightEnteredRow();
        });
        $scope.RefreshGrid = function() {
            $scope.gridOptions.dataSource.read();
        }

        $scope.setScreenAndRowID = function(rowID) {
            hylanCache.SetValue(hylanCache.Keys.NEWLYADDED_ROWID, rowID, $scope.Screens.MANAGE_DAILIES.ID);
        }
        var hilightEnteredRow = function() {
            var newlyAddedRecordID = hylanCache.GetValue(hylanCache.Keys.NEWLYADDED_ROWID, $scope.Screens.MANAGE_DAILIES.ID);
            if (newlyAddedRecordID) {
                $("#grid1 tr.k-state-selected").removeClass("k-state-selected");
                var grid = $scope.gridOptions.dataSource;
                $.each(grid._data, function(index, value) {
                    var model = value;
                    if (model.DAILY_ID == newlyAddedRecordID) {//some condition
                        $('[data-uid=' +model.uid + ']').addClass('k-state-selected');
                }

            });

                hylanCache.RemoveKey(hylanCache.Keys.NEWLYADDED_ROWID, $scope.Screens.MANAGE_DAILIES.ID);

        }

        }
        $scope.OpenAttachmentCRUDWindowdDaily = function(DailyID, jobId, projectId, hylanProjectId, jobFileNumber, type) {
            $scope.isPopup = true;
            hylanProjectId = hylanProjectId == "null" ? "Unknown" : hylanProjectId;
            jobFileNumber = jobFileNumber == "null" ? "Unknown" : jobFileNumber;
            var param = { DAILY_ID: DailyID, JOB_ID: jobId, PROJECT_ID: projectId, HYLAN_PROJECT_ID: hylanProjectId, JOB_FILE_NUMBER: jobFileNumber, ENTITY_TYPE: type, SCREEN_ID: Globals.Screens.MANAGE_DAILIES.ID, SCREEN_RECORD_ID: DailyID
        };
            $scope.ngDialogData = param;
            $scope.openDialog("ATTACHMENTS", param);
        };
           //--------------------------Start Projects MultiSelect-----------------  
        var projectsMultiSelect = function() {

            var objMulti = {
                  controlID: 'divMultiSelProjects', options: $scope.projectsDS, selectedList: [],
                  idProp: 'PROJECT_ID', displayProp: 'HYLAN_PROJECT_ID', key: hylanCache.Keys.PROJECTS
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
                  onItemSelect: function(item) {
                    setTooltipOnMultiSelect(objMulti.controlID, objMulti.selectedList, objMulti.displayProp);
                    hylanCache.SetValue(objMulti.key, objMulti.selectedList.slice());
                    $scope.RefreshGrid();
            },
                  onItemDeselect: function(item) {
                    setTooltipOnMultiSelect(objMulti.controlID, objMulti.selectedList, objMulti.displayProp);
                    hylanCache.SetValue(objMulti.key, objMulti.selectedList.slice());
                    $scope.RefreshGrid();
            },
                  onDeselectAll: function(items) {

                    setTooltipOnMultiSelect(objMulti.controlID, [], objMulti.displayProp);
                    hylanCache.SetValue(objMulti.key, []);
                    $scope.RefreshGrid();
            }
        };
        }

        projectsMultiSelect();
           //--------------------------End Projects MultiSelect----------------- 

           //--------------------------Start DailyType MultiSelect-----------------               
        Globals.GetLookUp(Globals.LookUpTypes.DAILY_TYPE, false, function(result) {
            $scope.dailyTypeDS = result;
        });

        var dailyTypesMultiSelect = function() {
           var objMulti = {
              controlID: 'divMultiSelDailyTypes', options: $scope.dailyTypeDS, selectedList: [],
              idProp: 'LOOK_UP_ID', displayProp: 'LU_NAME', key: hylanCache.Keys.DAILY_TYPE + Globals.Screens.MANAGE_DAILIES.ID
           };
            $scope.MSDailyTypes = objMulti;
            $scope.MSDailyTypes.settings = {
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

            $scope.MSDailyTypes.events = {
                  onItemSelect: function(item) {
                    setTooltipOnMultiSelect(objMulti.controlID, objMulti.selectedList, objMulti.displayProp);
                    hylanCache.SetValue(objMulti.key, objMulti.selectedList.slice());
                    $scope.RefreshGrid();
            },
                  onItemDeselect: function(item) {
                    setTooltipOnMultiSelect(objMulti.controlID, objMulti.selectedList, objMulti.displayProp);
                    hylanCache.SetValue(objMulti.key, objMulti.selectedList.slice());
                    $scope.RefreshGrid();
            },
                  onDeselectAll: function(items) {

                    setTooltipOnMultiSelect(objMulti.controlID, [], objMulti.displayProp);
                    hylanCache.SetValue(objMulti.key, []);
                    $scope.RefreshGrid();
            }
        };
        }

        dailyTypesMultiSelect();
           //--------------------------End DailyType MultiSelect-----------------    

           //--------------------------Start DailyStatus MultiSelect-----------------  
        Globals.GetLookUp(Globals.LookUpTypes.DAILY_STATUS, false, function(result) {
            $scope.dailyStatusDS = result;
        });
        var dailyStatusMultiSelect = function() {

            var objMulti = {
                  controlID: 'divMultiSelDailyStatus', options: $scope.dailyStatusDS, selectedList: [],
                  idProp: 'LOOK_UP_ID', displayProp: 'LU_NAME', key: hylanCache.Keys.DAILY_STATUS +Globals.Screens.MANAGE_DAILIES.ID
        };
            $scope.MSDailyStatus = objMulti;
            $scope.MSDailyStatus.settings = {
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



            $scope.MSDailyStatus.events = {
                  onItemSelect: function(item) {
                    setTooltipOnMultiSelect(objMulti.controlID, objMulti.selectedList, objMulti.displayProp);
                    hylanCache.SetValue(objMulti.key, objMulti.selectedList.slice());
                    $scope.RefreshGrid();
            },
                  onItemDeselect: function(item) {
                    setTooltipOnMultiSelect(objMulti.controlID, objMulti.selectedList, objMulti.displayProp);
                    hylanCache.SetValue(objMulti.key, objMulti.selectedList.slice());
                    $scope.RefreshGrid();
            },
                  onDeselectAll: function(items) {

                    setTooltipOnMultiSelect(objMulti.controlID, [], objMulti.displayProp);
                    hylanCache.SetValue(objMulti.key, []);
                    $scope.RefreshGrid();
            }
        };
        }

        dailyStatusMultiSelect();
           //--------------------------End DailyStatus MultiSelect----------------- 
           //--------------------------Start DailyShift MultiSelect-----------------  
        Globals.GetLookUp(Globals.LookUpTypes.DAILY_SHIFT, false, function(result) {
            $scope.dailyShiftDS = result;
        });

        var dailyShiftMultiSelect = function() {

            var objMulti = {
                  controlID: 'divMultiSelDailyShift', options: $scope.dailyShiftDS, selectedList: [],
                  idProp: 'LOOK_UP_ID', displayProp: 'LU_NAME', key: hylanCache.Keys.DAILY_SHIFT +Globals.Screens.MANAGE_DAILIES.ID
        };
            $scope.MSDailyShift = objMulti;
            $scope.MSDailyShift.settings = {
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



            $scope.MSDailyShift.events = {
                  onItemSelect: function(item) {
                    setTooltipOnMultiSelect(objMulti.controlID, objMulti.selectedList, objMulti.displayProp);
                    hylanCache.SetValue(objMulti.key, objMulti.selectedList.slice());
                    $scope.RefreshGrid();
            },
                  onItemDeselect: function(item) {
                    setTooltipOnMultiSelect(objMulti.controlID, objMulti.selectedList, objMulti.displayProp);
                    hylanCache.SetValue(objMulti.key, objMulti.selectedList.slice());
                    $scope.RefreshGrid();
            },
                  onDeselectAll: function(items) {

                    setTooltipOnMultiSelect(objMulti.controlID, [], objMulti.displayProp);
                    hylanCache.SetValue(objMulti.key, []);
                    $scope.RefreshGrid();
            }
        };
        }

        dailyShiftMultiSelect();
           //--------------------------End DailyShift MultiSelect----------------- 

        var setDefaultValuesOnMultiSelect = function(multiSelectObject) {
            var objMulti = multiSelectObject;  //need to set
            objMulti.selectedList =[];
            var projects = hylanCache.GetValue(objMulti.key);
            if (projects) {
               //add values in control ,values came from cache
                angular.forEach(projects, function(value) {
                    objMulti.selectedList.push(value);
            });
                setTooltipOnMultiSelect(objMulti.controlID, objMulti.selectedList, objMulti.displayProp);
            }
            else {
                if (AppSettings.ShowLatestProjectInFilter && objMulti.controlID == 'divMultiSelProjects') {
                    if ($scope.projectsDS.length > 0) {
                        objMulti.selectedList.push($scope.projectsDS[0]);
                        hylanCache.SetValue(hylanCache.Keys.LATEST_PROJECTS, objMulti.selectedList.slice(), Globals.Screens.MANAGE_DAILIES.ID);
                        setTooltipOnMultiSelect(objMulti.controlID, objMulti.selectedList, objMulti.displayProp);
                }
            }
        }
        };

        $scope.ApplyCache = function() {  //being called from baseController
            setDefaultValuesOnMultiSelect($scope.MSProjects);
            setDefaultValuesOnMultiSelect($scope.MSDailyTypes);
            setDefaultValuesOnMultiSelect($scope.MSDailyStatus);
            setDefaultValuesOnMultiSelect($scope.MSDailyShift);

            setDefaultValuesOnDates();
        }

        $scope.ApplyCache();

        $scope.destroyRecords = function(e) {
            Utility.HideNotification();
            Globals.changedModelIds =[];
            var grid = $scope.grid;
            var selectedRows = grid.select();
            var selDataItems =[];

            $.each(selectedRows, function(index, value) {
                var dataItem = grid.dataItem(value);
                if ($.inArray(dataItem.id, Globals.changedModelIds) == -1) {
                    Globals.changedModelIds.push(dataItem.id);
                    selDataItems.push(grid.dataItem(value));

            }
        });

            console.log("toBeDeletedIDs: " +Globals.changedModelIds);
            console.log("selDataItems: " +JSON.stringify(selDataItems));

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

            DailiesService.deleteDailies(selDataItems).then(function(result) {
                onSuccess(result);
            }).fail(onError);
        };

           function onSuccess(result) {
            Globals.changedModelIds =[];
            $scope.RefreshGrid();
            Utility.Notify({ type: NOTIFYTYPE.SUCCESS, message: "Changes Saved.", IsPopUp: false
           });

        }

           function onError(XMLHttpRequest, textStatus, errorThrown) {
            var changedModelIds = Globals.changedModelIds;
            $rootScope.$broadcast('dbCommandCompleted', { source: 'update'
           });

            $('.k-grid-save-changes').removeClass('disabled');
            IsPopUp = false;
            var exception = XMLHttpRequest.responseText ? XMLHttpRequest.responseText : errorThrown;

            var exceptionfieldindex = exception.indexOf('$');
            var exceptionMsg = exception.substring(0, exceptionfieldindex);
            var exceptionfieldids = exception.substring(exceptionfieldindex +2, exception.length).split(',');

              //ids other than exception remove it from grid
            $(changedModelIds).each(function(index, value) {
                if ($.inArray(value.toString(), exceptionfieldids) == -1) {
                    var grid = $scope.grid;
                    grid.dataSource.remove(grid.dataSource.get(value));
            }
           });

              //highligh the remaining ids
            if (changedModelIds.length > 0) {
                $(changedModelIds).each(function(index, value) {
                    var hasidError = false;
                    var item;

                    item = $.grep($("#grid1").data("kendoGrid")._data, function(item) { return (item.id == value);
                });

                    if (item.length != 0) {
                        for (var i = 0; i <= exceptionfieldids.length; i++) {
                            if (item[0].id == exceptionfieldids[i]) {
                                hasidError = true;
                                break;
                        }
                    }
                }

                    if (hasidError) {
                        $("#grid1 .k-grid-content-locked").find("tr[data-uid='" +item[0].uid + "']").removeClass('k-state-selected');
                        $("#grid1 .k-grid-content").find("tr[data-uid='" +item[0].uid + "']").removeClass('k-state-selected');
                        $("#grid1 .k-grid-content-locked").find("tr[data-uid='" +item[0].uid + "']").css("background-color", "#FDCCCC");
                        $("#grid1 .k-grid-content").find("tr[data-uid='" +item[0].uid + "']").css("background-color", "#FDCCCC");
                        hasidError = false;
                }
            });

                Globals.changedModelIds =[];
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
            Utility.Notify({ type: NOTIFYTYPE.ERROR, message: exceptionMsg, IsPopUp: IsPopUp
           });
        }

        $scope.dateChange = function() {
            //var selDate = $scope.DailyStartDate;
           hylanCache.SetValue(hylanCache.Keys.IS_DEFAULT_FOR_DATES, "N", Globals.Screens.MANAGE_DAILIES.ID);
           hylanCache.SetValue(hylanCache.Keys.START_DATE, $scope.DailyStartDate, Globals.Screens.MANAGE_DAILIES.ID);
           hylanCache.SetValue(hylanCache.Keys.END_DATE, $scope.DailyEndDate, Globals.Screens.MANAGE_DAILIES.ID);
            $scope.RefreshGrid();
        };
    }
]);