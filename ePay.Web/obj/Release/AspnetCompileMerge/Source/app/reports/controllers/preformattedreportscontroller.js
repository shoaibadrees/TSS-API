var resourceAllocatedColumns = ["DISTRIBUTION", "DISTRIBUTION_PCT", "TRANSMISSION", "TRANSMISSION_PCT", "DAMAGE_ASSESSMENT", "DAMAGE_ASSESSMENT_PCT", "TREE", "TREE_PCT", "SUBSTATION", "SUBSTATION_PCT", "NET_UG", "NET_UG_PCT"];
var resourcesColumns = ["NON_NATIVE_DISTRIBUTION", "NON_NATIVE_TRANSMISSION", "NON_NATIVE_DAMAGE_ASSESSMENT", "NON_NATIVE_TREE", "NON_NATIVE_SUBSTATION", "NON_NATIVE_NET_UG"];
angular.module('HylanApp').controller("PreformattedReportsController", ['$rootScope', '$scope', '$controller', '$timeout', 'PreformattedReportsService', 'Utility', 'NOTIFYTYPE', '$interval',
    function ($rootScope, $scope, $controller, $timeout, PreformattedReportsService, Utility, NOTIFYTYPE, $interval) {
        $scope.ApiResource = "OutageNumberReport";
        $controller('BaseController', { $scope: $scope });
        if ($rootScope.isUserLoggedIn == false)
            return false;
        $scope.selectedEventId = -1;

        $scope.SnapShotDS = [];
        $scope.currentReport = "NUMBERS";
        $scope.RmagsDS = [];
        $scope.CompaniesDS = [];
        $scope.GetSnapShotDates = function () {
            $scope.SnapShotDS = [];
            PreformattedReportsService.GetSnapshotDatesByType($scope.selectedEventId, -1).then(function (result) {
                $scope.SnapShotDS = [];
                $scope.SnapShotDS.push({ SNAPSHOT_DATE: '-1', SNAPSHOT_DATE_WITH_TIMEZONE: '' });
                for (var i = 0; i < result.objResultList.length; i++) {
                    var objSnapShot = { SNAPSHOT_DATE: '', SNAPSHOT_DATE_WITH_TIMEZONE: '' };
                    objSnapShot.SNAPSHOT_DATE = result.objResultList[i].SNAPSHOT_DATE;
                    objSnapShot.SNAPSHOT_DATE_WITH_TIMEZONE = result.objResultList[i].SNAPSHOT_DATE.replace(" ", "T");
                    if (Globals.ActiveEvent && Globals.ActiveEvent.TIME_ZONE) {
                        objSnapShot.SNAPSHOT_DATE_WITH_TIMEZONE = kendo.toString(TimeZoneSpecificDate(
                            new Date(moment(objSnapShot.SNAPSHOT_DATE_WITH_TIMEZONE, moment.ISO_8601)), Globals.ActiveEvent.TIME_ZONE,
                            result.objResultList[i].APPLY_DL_SAVING), 'MM/dd/yyyy HH:mm') + GetTimeZonePostFix(Globals.ActiveEvent.TIME_ZONE);

                        objSnapShot.SNAPSHOT_DATE_WITH_TIMEZONE = result.objResultList[i].SS_MATCHING_TYPE_NAME + "_" + objSnapShot.SNAPSHOT_DATE_WITH_TIMEZONE;
                    }
                    $scope.SnapShotDS.push(objSnapShot);
                }
                $timeout(function () { });
            }, onError);
        };
        $scope.loadPrimaryData = function () {
            Globals.GetAllEventsofLoggedUser(false, $scope.screenId).then(function (result) {
                result.objResultList = ChangeEventName(result.objResultList);
                $scope.Events = result.objResultList;
                if ($scope.Events.length > 0) {
                    // $scope.selectedEventId = $scope.Events[0].EVENT_ID;
                    if (Cookies.get("selectedEvent") === undefined) {
                        Cookies.set('selectedEvent', $scope.Events[0].EVENT_ID, { path: '' });
                        $scope.selectedEventId = Cookies.get("selectedEvent");
                    }
                    else {
                        $scope.selectedEventId = Cookies.get("selectedEvent");

                    }
                    selectedEventItem = $.grep($scope.Events, function (elem, index) {
                        return elem.EVENT_ID == $scope.selectedEventId;
                    });
                    $scope.EVENT_TIME_ZONE = selectedEventItem[0].TIME_ZONE;
                    Globals.ActiveEvent = { EVENT_ID: $scope.selectedEventId, TIME_ZONE: $scope.EVENT_TIME_ZONE.LU_NAME };
                }
                $scope.GetSnapShotDates();
                Globals.GetRMAGS(false).then(function (result) {
                    $scope.RmagsDS = result.objResultList;
                    if ($scope.RmagsDS && $scope.RmagsDS.length == 0)
                        $scope.RmagsDS = [];
                    $scope.RmagsDS.splice(0, 0, { RMAG_NAME: 'All', RMAG_ID: -1 });
                    $timeout(function () { });
                }).fail(onError);
                $timeout(function () { });
            }, onError);
        };
        $scope.HideNotification = function () {
            Utility.HideNotification();
        };
        $scope.loadPrimaryData();
        $scope.rmagFilterChange = function (rmagIds) {
            if (rmagIds == "-1") {
                Globals.GetCompanies(false).then(function (result) {
                    $scope.CompaniesDS = result.objResultList;
                    if ($scope.CompaniesDS && $scope.CompaniesDS.length == 0)
                        $scope.CompaniesDS = [];
                    $scope.CompaniesDS.splice(0, 0, { COMPANY_NAME: 'All', COMPANY_ID: -1 });
                    $timeout(function () { });
                }).fail(onError);
            }
            else {
                Globals.GetCompaniesByRmags(rmagIds).then(function (result) {
                    $scope.CompaniesDS = result.objResultList;
                    if ($scope.CompaniesDS && $scope.CompaniesDS.length == 0)
                        $scope.CompaniesDS = [];
                    $scope.CompaniesDS.splice(0, 0, { COMPANY_NAME: 'All', COMPANY_ID: -1 });
                    $timeout(function () { });
                });
            }
            $scope.GenerateReport();
        }

        $scope.EventChange = function () {
            $scope.GetSnapShotDates();
            $scope.GenerateReport();
            Cookies.set('selectedEvent', $scope.selectedEventId, { path: '' });
        };
        $scope.filters = {
            "COMPANY_NAME": { name: "COMPANY_NAME", operator: "contains", value: "", elementType: "text" },
            "RMAG_NAME": { name: "RMAG_NAME", operator: "contains", value: "", elementType: "text" }
        };

        $scope.defaultSort = PreformattedReportsService.defaultSort;

        //-- if searchcolumn type = number then operator will be equal
        $scope.searchColumns = [
            { field: "COMPANY_NAME" },
            { field: "RMAG_NAME" }
        ];
        var strColWidth = '9%';
        var numColWidth = '7%';
        maxlen = 6;
        if (/iPad/.test(Globals.UserAgent) || /Android/.test(Globals.UserAgent)) {
            strColWidth = '150px';
            numColWidth = '85px';
        }
        $scope.gridOptions.columns = [
            { field: "COMPANY_NAME", title: "COMPANY", width: strColWidth, headerAttributes: { "class": "sub-col rowHeaderHead2 rowspan2", "style": "border-left: 0px white;" }, attributes: { "class": "contert-alpha GridBorder", "style": "border-left: 0px white;" }, template: "#:COMPANY_NAME#" },
            { field: "RMAG_NAME", title: "RMAG", width: strColWidth, headerAttributes: { "class": "sub-col no-left-border rowspan2" }, attributes: { "class": "contert-alpha" }, template: "#:RMAG_NAME#" },
            { field: "CUSTOMERS_SERVED", title: "TOTAL CUSTOMER", width: strColWidth, headerAttributes: { "class": "sub-col no-left-border " }, attributes: { "class": "contert-number" }, template: "#:kendo.toString(CUSTOMERS_SERVED,'n0')#", aggregates: ["sum"], footerTemplate: '#=sum == null ? 0 : kendo.toString(sum,"n0") #', footerAttributes: { "style": "text-align: right;" } },
            { field: "CUSTOMERS_OUT", title: "CUSTOMER OUT", width: strColWidth, headerAttributes: { "class": "sub-col no-left-border " }, attributes: { "class": "contert-number" }, template: "#:kendo.toString(CUSTOMERS_OUT,'n0')#", aggregates: ["sum"], footerTemplate: '#=sum == null ? 0 : kendo.toString(sum,"n0") #', footerAttributes: { "style": "text-align: right;" } },
            { field: "CASES", title: "CASES", width: strColWidth, headerAttributes: { "class": "sub-col no-left-border " }, attributes: { "class": "contert-number" }, template: "#:kendo.toString(CASES,'n0')#", aggregates: ["sum"], footerTemplate: '#=sum == null ? 0 : kendo.toString(sum,"n0") #', footerAttributes: { "style": "text-align: right;" } },
            { field: "CUSTOMERS_OUT_PCT", title: "%CUSTOMER OUT", width: strColWidth, headerAttributes: { "class": "sub-col no-left-border " }, attributes: { "class": "contert-number" }, template: " #:kendo.toString(CUSTOMERS_OUT_PCT,'n2')#%", aggregates: ["sum"], footerTemplate: '#=calculatePct("CUSTOMERS_OUT","CUSTOMERS_SERVED") #%', footerAttributes: { "style": "text-align: right;" } },

            { field: "DISTRIBUTION", hidden: true, title: "DIST.", width: numColWidth, headerAttributes: { "class": "table-sbhead1 no-left-border " }, attributes: { "class": "contert-number" }, template: '<label class="AllocLabel AllocLabelLeft">#:kendo.toString(DISTRIBUTION,"n0")#</label><label class="AllocLabel AllocLabelRight">#:DISTRIBUTION_PCT#%</label>', aggregates: ["sum"], footerTemplate: '<label class="AllocLabel AllocLabelLeft">#=sum == null ? 0 : kendo.toString(sum,"n0") #</label><label class="AllocLabel AllocLabelRight">#= (sum == null || sum ==0) ? 0 : 100 #%</label>', footerAttributes: { "style": "text-align: right;" } },
            { field: "TRANSMISSION", hidden: true, title: "TRANS.", width: numColWidth, headerAttributes: { "class": "table-sbhead2" }, attributes: { "class": "contert-number" }, template: '<label class="AllocLabel AllocLabelLeft">#:kendo.toString(TRANSMISSION,"n0")#</label><label class="AllocLabel AllocLabelRight">#:TRANSMISSION_PCT#%</label>', aggregates: ["sum"], footerTemplate: '<label class="AllocLabel AllocLabelLeft">#=sum == null ? 0 : kendo.toString(sum,"n0") #</label><label class="AllocLabel AllocLabelRight">#= (sum == null || sum ==0) ? 0 : 100 #%</label>', footerAttributes: { "style": "text-align: right;" } },
            { field: "DAMAGE_ASSESSMENT", hidden: true, title: "DAMAGE", width: numColWidth, headerAttributes: { "class": "table-sbhead3" }, attributes: { "class": "contert-number" }, template: '<label class="AllocLabel AllocLabelLeft">#:kendo.toString(DAMAGE_ASSESSMENT,"n0")#</label><label class="AllocLabel AllocLabelRight">#:DAMAGE_ASSESSMENT_PCT#%</label>', aggregates: ["sum"], footerTemplate: '<label class="AllocLabel AllocLabelLeft">#=sum == null ? 0 : kendo.toString(sum,"n0") #</label><label class="AllocLabel AllocLabelRight">#= (sum == null || sum ==0) ? 0 : 100 #%</label>', footerAttributes: { "style": "text-align: right;" } },
            { field: "TREE", hidden: true, title: "TREE", width: numColWidth, headerAttributes: { "class": "table-sbhead4" }, attributes: { "class": "contert-number" }, template: '<label class="AllocLabel AllocLabelLeft">#:kendo.toString(TREE,"n0")#</label><label class="AllocLabel AllocLabelRight">#:TREE_PCT#%</label>', aggregates: ["sum"], footerTemplate: '<label class="AllocLabel AllocLabelLeft">#=sum == null ? 0 : kendo.toString(sum,"n0") #</label><label class="AllocLabel AllocLabelRight">#= (sum == null || sum ==0) ? 0 : 100 #%</label>', footerAttributes: { "style": "text-align: right;" } },
            { field: "SUBSTATION", hidden: true, title: "SUBST.", width: numColWidth, headerAttributes: { "class": "table-sbhead5" }, attributes: { "class": "contert-number" }, template: '<label class="AllocLabel AllocLabelLeft">#:kendo.toString(SUBSTATION,"n0")#</label><label class="AllocLabel AllocLabelRight">#:SUBSTATION_PCT#%</label>', aggregates: ["sum"], footerTemplate: '<label class="AllocLabel AllocLabelLeft">#=sum == null ? 0 : kendo.toString(sum,"n0") #</label><label class="AllocLabel AllocLabelRight">#= (sum == null || sum ==0) ? 0 : 100 #%</label>', footerAttributes: { "style": "text-align: right;" } },
            { field: "NET_UG", hidden: true, title: "NET UG", width: numColWidth, headerAttributes: { "class": "table-sbhead5" }, attributes: { "class": "contert-number" }, template: '<label class="AllocLabel AllocLabelLeft">#:kendo.toString(NET_UG,"n0")#</label><label class="AllocLabel AllocLabelRight">#:NET_UG_PCT#%</label>', aggregates: ["sum"], footerTemplate: '<label class="AllocLabel AllocLabelLeft">#=sum == null ? 0 : kendo.toString(sum,"n0") #</label><label class="AllocLabel AllocLabelRight">#= (sum == null || sum ==0) ? 0 : 100 #%</label>', footerAttributes: { "style": "text-align: right;" } },

            { field: "NON_NATIVE_DISTRIBUTION", hidden: true, title: "DIST.", width: numColWidth, headerAttributes: { "class": "table-sbhead1 no-left-border " }, attributes: { "class": "contert-number" }, template: '#:kendo.toString(NON_NATIVE_DISTRIBUTION,"n0")#', aggregates: ["sum"], footerTemplate: '#=sum == null ? 0 : kendo.toString(sum,"n0") #', footerAttributes: { "style": "text-align: right;" } },
            { field: "NON_NATIVE_TRANSMISSION", hidden: true, title: "TRANS.", width: numColWidth, headerAttributes: { "class": "table-sbhead2" }, attributes: { "class": "contert-number" }, template: '#:kendo.toString(NON_NATIVE_TRANSMISSION,"n0")#', aggregates: ["sum"], footerTemplate: '#=sum == null ? 0 : kendo.toString(sum,"n0") #', footerAttributes: { "style": "text-align: right;" } },
            { field: "NON_NATIVE_DAMAGE_ASSESSMENT", hidden: true, title: "DAMAGE", width: numColWidth, headerAttributes: { "class": "table-sbhead3" }, attributes: { "class": "contert-number" }, template: '#:kendo.toString(NON_NATIVE_DAMAGE_ASSESSMENT,"n0")#', aggregates: ["sum"], footerTemplate: '#=sum == null ? 0 : kendo.toString(sum,"n0") #', footerAttributes: { "style": "text-align: right;" } },
            { field: "NON_NATIVE_TREE", hidden: true, title: "TREE", width: numColWidth, headerAttributes: { "class": "table-sbhead4" }, attributes: { "class": "contert-number" }, template: '#:kendo.toString(NON_NATIVE_TREE,"n0")#', aggregates: ["sum"], footerTemplate: '#=sum == null ? 0 : kendo.toString(sum,"n0") #', footerAttributes: { "style": "text-align: right;" } },
            { field: "NON_NATIVE_SUBSTATION", hidden: true, title: "SUBST.", width: numColWidth, headerAttributes: { "class": "table-sbhead5" }, attributes: { "class": "contert-number" }, template: '#:kendo.toString(NON_NATIVE_SUBSTATION,"n0")#', aggregates: ["sum"], footerTemplate: '#=sum == null ? 0 : kendo.toString(sum,"n0") #', footerAttributes: { "style": "text-align: right;" } },
            { field: "NON_NATIVE_NET_UG", hidden: true, title: "NET UG", width: numColWidth, headerAttributes: { "class": "table-sbhead5" }, attributes: { "class": "contert-number" }, template: '#:kendo.toString(NON_NATIVE_NET_UG,"n0")#', aggregates: ["sum"], footerTemplate: '#=sum == null ? 0 : kendo.toString(sum,"n0") #', footerAttributes: { "style": "text-align: right;" } }

        ];
        $scope.GetCriteria = function () {
            var selectedFilters = {
                EVENT_ID: $scope.selectedEventId,
                RMAG_ID: ($scope.RmagsDS.RMAG_ID && $scope.RmagsDS.RMAG_ID != null && $scope.RmagsDS.RMAG_ID != '') ? $scope.RmagsDS.RMAG_ID : -1,
                COMPANY_ID: ($scope.CompaniesDS.COMPANY_ID && $scope.CompaniesDS.COMPANY_ID != null && $scope.CompaniesDS.COMPANY_ID != '') ? $scope.CompaniesDS.COMPANY_ID : -1,
                snapshotDateTime: ($scope.SnapShotDS.SNAPSHOT_DATE && $scope.SnapShotDS.SNAPSHOT_DATE != null && $scope.SnapShotDS.SNAPSHOT_DATE != -1) ? $scope.SnapShotDS.SNAPSHOT_DATE : null,
                reportType: $scope.currentReport,
                snapshotType: -1
            };
            if (selectedFilters.snapshotDateTime != null) {
                var selectedDT = _.find($scope.SnapShotDS, function (obj) { return obj.SNAPSHOT_DATE == selectedFilters.snapshotDateTime; });
                if (selectedDT) {
                    if (selectedDT.SNAPSHOT_DATE_WITH_TIMEZONE.indexOf("Begin Matching") >= 0)
                        selectedFilters.snapshotType = 69;
                    else if (selectedDT.SNAPSHOT_DATE_WITH_TIMEZONE.indexOf("Matching Complete") >= 0)
                        selectedFilters.snapshotType = 70;
                }
            }
            return selectedFilters;
        };
        $scope.gridOptions.autobind = false;
        $scope.gridOptions.dataSource = PreformattedReportsService.dataSource;
        $scope.gridOptions.dataSource.transport.selectedFilters = $scope.GetCriteria();

        $scope.gridOptions.dataSource._pageSize = undefined;
        $scope.gridOptions.toolbar = undefined;
        $scope.gridOptions.pageable = false;



        $scope.AdjustHeights = function () {
            var winHeight = $(window).height();
            var threshold = 130 / winHeight;
            var availableHeight = winHeight - (winHeight * threshold)
            $scope.gridOptions.height = (availableHeight * 0.40);
            $("#chartSection").height(availableHeight * 0.60);
        };
        $scope.AdjustHeights();

        $scope.gridOptions.dataBinding = function (e) {
            if ($('#grid1 .k-grid-header-wrap thead tr.multiColumnHeaderLevel1').length > 0) {
                var tempTH = $('#grid1 .k-grid-header-wrap thead tr.multiColumnHeaderLevel1 .rowspan2');
                $('#grid1 .k-grid-header-wrap thead tr:nth-child(2)').prepend(tempTH);
            }
            $('#grid1 .k-grid-header-wrap thead tr.multiColumnHeaderLevel1').remove();
            $('#grid1 .k-grid-header-wrap thead .rowspan2').removeAttr("rowspan", "2");
            $scope.ToggleAllocationColumns();
        };

        $scope.gridOptions.dataBound = function (args) {
            $scope.$emit("ChildGridLoaded", args.sender);
            $scope.currentReport = $('input[type="radio"]:checked').val();
            var grid = $("#grid1").data("kendoGrid");
            if ($scope.currentReport == "NUMBERS") {
                if ($('#grid1 .k-grid-header-wrap thead tr.multiColumnHeaderLevel1').length <= 0) {
                    $('#grid1 .k-grid-header-wrap thead').prepend('<tr class="multiColumnHeaderLevel1" role="row"><th role="columnheader" data-field="" colspan="6" data-colspan="6" data-title="CUSTOMER OUTAGE NUMBERS" class="no-left-border no-bottom-border subsection-border k-header ng-scope ReportHeader ReportHeader1" style="border-bottom: solid 1px #49565e !important;">CUSTOMER OUTAGE NUMBERS</th></tr>');
                }
            }
            else if ($scope.currentReport == "CASES") {
                $("label.AllocLabelRight").show();
                if ($('#grid1 .k-grid-header-wrap thead tr.multiColumnHeaderLevel1').length <= 0) {
                    var th1 = '<th role="columnheader" data-field="" colspan="6" data-colspan="6" data-title="OUTAGE CASES CONSOLIDATED REPORT" class="no-left-border no-bottom-border subsection-border k-header ng-scope ReportHeader ReportHeader1" style="border-bottom: solid 1px #49565e !important;">OUTAGE CASES CONSOLIDATED REPORT</th>';
                    var th2 = '<th role="columnheader" data-field="" colspan="6" data-colspan="6" data-title="%RESOURCES ALLOCATED FROM TOTAL RESOURCES MADE AVAILABLE" class="no-left-border no-bottom-border subsection-border k-header ng-scope ReportHeader ReportHeader2" style="border-bottom: solid 1px #49565e !important;">%RESOURCES ALLOCATED FROM TOTAL RESOURCES AVAILABLE</th>';
                    $('#grid1 .k-grid-header-wrap thead').prepend('<tr class="multiColumnHeaderLevel1" role="row">' + th1 + th2 + '</tr>');
                }
            }
            else if ($scope.currentReport == "RESOURCES") {
                $("label.AllocLabelRight").hide();
                $("label.AllocLabelLeft").css("text-align", "right");
                $("label.AllocLabelLeft").css("width", "100%");

                if ($('#grid1 .k-grid-header-wrap thead tr.multiColumnHeaderLevel1').length <= 0) {
                    var th1 = '<th role="columnheader" data-field="" colspan="6" data-colspan="6" data-title="RESOURCE REQUESTS" class="no-left-border no-bottom-border subsection-border k-header ng-scope ReportHeader ReportHeader2" style="border-bottom: solid 1px #49565e !important;">RESOURCE REQUESTS</th>';
                    var th2 = '<th role="columnheader" data-field="" colspan="6" data-colspan="6" data-title="RESOURCES ACQUIRED" class="no-left-border no-bottom-border subsection-border k-header ng-scope ReportHeader ReportHeader2" style="border-bottom: solid 1px #49565e !important;">RESOURCES ACQUIRED</th>';
                    $('#grid1 .k-grid-header-wrap thead').prepend('<tr class="multiColumnHeaderLevel1" role="row"></tr>');
                    $('#grid1 .k-grid-header-wrap thead .rowspan2').attr("rowspan", "2");
                    var tempTH = $('#grid1 .k-grid-header-wrap thead .rowspan2');
                    $('#grid1 .k-grid-header-wrap thead tr.multiColumnHeaderLevel1').append(tempTH);
                    $('#grid1 .k-grid-header-wrap thead tr.multiColumnHeaderLevel1').append(th1);
                    $('#grid1 .k-grid-header-wrap thead tr.multiColumnHeaderLevel1').append(th2);
                }

                var distSum = FindSum(args.sender._data, "DISTRIBUTION");
                var transSum = FindSum(args.sender._data, "TRANSMISSION");
                var dmgSum = FindSum(args.sender._data, "DAMAGE_ASSESSMENT");
                var treeSum = FindSum(args.sender._data, "TREE");
                var subSum = FindSum(args.sender._data, "SUBSTATION");
                var netSum = FindSum(args.sender._data, "NET_UG");

                var distSumAq = FindSum(args.sender._data, "NON_NATIVE_DISTRIBUTION");
                var transSumAq = FindSum(args.sender._data, "NON_NATIVE_TRANSMISSION");
                var dmgSumAq = FindSum(args.sender._data, "NON_NATIVE_DAMAGE_ASSESSMENT");
                var treeSumAq = FindSum(args.sender._data, "NON_NATIVE_TREE");
                var subSumAq = FindSum(args.sender._data, "NON_NATIVE_SUBSTATION");
                var netSumAq = FindSum(args.sender._data, "NON_NATIVE_NET_UG");

                var distSumPct = (distSum != 0 && distSumAq != 0) ? (distSumAq / distSum) * 100 : 0;
                var transSumPct = (transSum != 0 && transSumAq != 0) ? (transSumAq / transSum) * 100 : 0;
                var dmgSumPct = (dmgSum != 0 && dmgSumAq != 0) ? (dmgSumAq / dmgSum) * 100 : 0;
                var treeSumPct = (treeSum != 0 && treeSumAq != 0) ? (treeSumAq / treeSum) * 100 : 0;
                var subSumPct = (subSum != 0 && subSumAq != 0) ? (subSumAq / subSum) * 100 : 0;
                var netSumPct = (netSum != 0 && netSumAq != 0) ? (netSumAq / netSum) * 100 : 0;

                var tr1 = '<tr><td style="text-align:left;padding-left:10px;font-weight:bold;">TOTAL RESOURCE REQUEST</td>' +
                          '<td>' + kendo.toString(distSum, "n0") + '</td>' + '<td>' + kendo.toString(transSum, "n0") + '</td>' +
                          '<td>' + kendo.toString(dmgSum, "n0") + '</td>' + '<td>' + kendo.toString(treeSum, "n0") + '</td>' +
                          '<td>' + kendo.toString(subSum, "n0") + '</td>' + '<td>' + kendo.toString(netSum, "n0") + '</td></tr>';

                var tr2 = '<tr><td style="text-align:left;padding-left:10px;font-weight:bold;">% RESOURCE REQUESTED VS. OBTAINED</td>' +
                          '<td>' + kendo.toString(distSumPct, "n2") + '%</td>' + '<td>' + kendo.toString(transSumPct, "n2") + '%</td>' +
                          '<td>' + kendo.toString(dmgSumPct, "n2") + '%</td>' + '<td>' + kendo.toString(treeSumPct, "n2") + '%</td>' +
                          '<td>' + kendo.toString(subSumPct, "n2") + '%</td>' + '<td>' + kendo.toString(netSumPct, "n2") + '%</td></tr>';

                $("#resourceSummary").html(tr1 + tr2);

            }

            $('#grid1 .k-grid-header-wrap thead[role="rowgroup"] tr.SummaryRow').remove();
            $('#grid1 .k-grid-header-wrap thead[role="rowgroup"]').append($('#grid1 tr.k-footer-template'));
            $('#grid1 tr.k-footer-template').removeClass('k-footer-template').addClass("SummaryRow").attr("role", "row");
            $('#grid1 div.k-grid-footer').css("display", "none");

            $('#grid1 .k-grid-header-wrap thead[role="rowgroup"] tr.SummaryRow > :nth-child(1)').append(function () {
                return $(this).attr("colspan", "2").css("text-align", "left").html('<label style="color:darkgray">Summary</label>').next().remove().contents();
            });

            if (args.sender._data.length > 6) {
                var blocks = Math.ceil(args.sender._data.length / 6);
                var chartHeight = $("#chartSection").height() * blocks;
                $("#totalChart").height(chartHeight);
                $("#pctChart").height(chartHeight);
                $("#caseChart").height(chartHeight);
            }
            createChart(args.sender._data);
            if ($scope.currentReport == "RESOURCES") {
                $scope.$broadcast("RefreshAllocationGrid", null);
            }

            setTooltipOnDropdownItems($("#ddlSnapshots").data("kendoDropDownList"));
            setTooltipOnDropdownItems($("#ddlRMAGS").data("kendoDropDownList"));
            setTooltipOnDropdownItems($("#ddlCompanies").data("kendoDropDownList"));
        };

        $scope.GenerateReport = function (args) {
            var eventitem;
            eventitem = $.grep($scope.Events, function (elem, index) {
                return elem.EVENT_ID == $scope.selectedEventId;
            });
            if (eventitem && eventitem.length > 0) {
                Globals.ActiveEvent = { EVENT_ID: $scope.selectedEventId, TIME_ZONE: eventitem[0].TIME_ZONE.LU_NAME };
                $scope.gridOptions.dataSource.transport.selectedFilters = $scope.GetCriteria();
                $scope.gridOptions.dataSource.read();
            }
        };

        $scope.ResetFilter = function () {
            $scope.SnapShotDS.SNAPSHOT_DATE = -1;
            $scope.RmagsDS.RMAG_ID = -1;
            $scope.CompaniesDS.COMPANY_ID = -1;
            Globals.GetCompanies(false).then(function (result) {
                $scope.CompaniesDS = result.objResultList;
                if ($scope.CompaniesDS && $scope.CompaniesDS.length == 0)
                    $scope.CompaniesDS = [];
                $scope.CompaniesDS.splice(0, 0, { COMPANY_NAME: 'All', COMPANY_ID: -1 });
                $scope.CompaniesDS.COMPANY_ID = -1;
                $timeout(function () { });
            }).fail(onError);
            $scope.GenerateReport();
        };
        $scope.ChangeReportType = function (rptType) {
            if (rptType && rptType != '')
                $scope.currentReport = rptType;
            if (rptType == 'NUMBERS')
                $scope.ApiResource = "OutageNumberReport";
            else if (rptType == 'CASES')
                $scope.ApiResource = "OutageCasesReport";
            else if (rptType == 'RESOURCES')
                $scope.ApiResource = "ResourceReport";

            $scope.GenerateReport();
        };
        $scope.ToggleAllocationColumns = function () {
            var hideResAllocColumns = true;
            var hideResColumns = true;
            if ($scope.currentReport == "CASES" || $scope.currentReport == "RESOURCES") {
                hideResAllocColumns = false;
                if ($scope.currentReport == "RESOURCES") {
                    hideResColumns = false;
                }
            }
            var grid = $("#grid1").data("kendoGrid");
            if (grid && grid.columns) {
                $.each(grid.columns, function (index, column) {
                    if (_.contains(resourceAllocatedColumns, column.field) || _.contains(resourcesColumns, column.field)) {
                        if (hideResAllocColumns)
                            grid.hideColumn(index);
                        else {
                            grid.showColumn(index);
                        }
                    }
                    if (_.contains(resourcesColumns, column.field)) {
                        if (hideResColumns)
                            grid.hideColumn(index);
                        else {
                            grid.showColumn(index);
                        }
                    }
                    if ($scope.currentReport == "RESOURCES") {
                        if (column.field == "CUSTOMERS_SERVED" || column.field == "CUSTOMERS_OUT" || column.field == "CASES" || column.field == "CUSTOMERS_OUT_PCT")
                            grid.hideColumn(index);
                    }
                    else {
                        if (column.field == "CUSTOMERS_SERVED" || column.field == "CUSTOMERS_OUT" || column.field == "CASES" || column.field == "CUSTOMERS_OUT_PCT")
                            grid.showColumn(index);
                    }
                });
            }
        };

        function onError(XMLHttpRequest, textStatus, errorThrown) {
            var exception = XMLHttpRequest.responseText ? XMLHttpRequest.responseText : errorThrown;
            Utility.Notify({ type: NOTIFYTYPE.ERROR, message: exception });
        }
    }
]);
function CreateChartInstance(gridData, id, type, title, theme, series, maxValue, field, toolTipTemplate) {
    var ChartDS = new kendo.data.DataSource({
        data: gridData,
        page: 0,
        schema: {
            model: {
                id: "COMPANY_NAME",
                fields: {
                    COMPANY_NAME: { title: "COMPANY", editable: false },
                    RMAG_NAME: { title: "RMAG", editable: false },
                    CUSTOMERS_SERVED: { title: "CUSTOMERS SERVED", editable: false },
                    CUSTOMERS_OUT: { title: "CUSTOMERS OUT", editable: false },
                    CASES: { title: "CASES", editable: false },
                    CUSTOMERS_OUT_PCT: { title: "% CUST. OUT", editable: false }
                }
            }
        }
    });
    $("#" + id).kendoChart({
        title: {
            text: title,
            align: "left"
        },
        // renderAs: "canvas",
        theme: theme,
        dataSource: ChartDS,
        seriesDefaults: {
            type: type,
            labels: {
                visible: true,
                background: "transparent",
                template: toolTipTemplate
            }
        },
        series: series,
        legend: {
            position: "top",
        },
        valueAxis: {
            max: maxValue,
            line: {
                visible: false
            },
            minorGridLines: {
                visible: false
            }
        },
        categoryAxis: {
            field: field,
            majorGridLines: {
                visible: true
            },
            line: {
                visible: true
            }
        },
        tooltip: {
            visible: true,
            format: "{0}",
            template: toolTipTemplate
        },
        transitions: false,
        dataBound: onChartDataBound
    });
}
function createChart(gridData) {

    var companyWithMaxCustomers = _.max(gridData, function (company) { return company.CUSTOMERS_SERVED; });
    var maxLimit = 250000;
    if (companyWithMaxCustomers && companyWithMaxCustomers.CUSTOMERS_SERVED) {
        maxLimit = companyWithMaxCustomers.CUSTOMERS_SERVED;
        maxLimit += 1000000;
    }

    CreateChartInstance(gridData, "totalChart", "bar", "TOTAL CUSTOMERS OUT BY COMPANY", "BlueOpal",
        [{ field: "CUSTOMERS_SERVED", name: "TOTAL CUST." }, { field: "CUSTOMERS_OUT", name: "CUSTOMERS OUT" }], maxLimit, "COMPANY_NAME", "#= kendo.toString(value, 'n0')#");

    CreateChartInstance(gridData, "pctChart", "bar", "% CUSTOMERS OUT BY COMPANY", "Metro",
        [{ field: "CUSTOMERS_OUT_PCT", name: "% CUST. OUT" }], 100, "COMPANY_NAME", "#= value #%");

    CreateChartInstance(gridData, "caseChart", "bar", "NUMBER OF OUTAGE CASES BY CLIENTS REQUESTING RESOURCES", "Metro",
       [{ field: "CASES", name: "CASES" }, { field: "CUSTOMERS_OUT", name: "CUSTOMERS OUT" }], maxLimit, "COMPANY_NAME", "#= kendo.toString(value, 'n0') #");

}
function FindSum(array, property) {
    var sum = 0;
    try {
        for (var i = 0; i < array.length; i++) {
            if (array[i].hasOwnProperty(property)) {
                var val = parseInt(array[i][property], 10);
                if (val > 0)
                    sum += val;
            }
        }
    } catch (e)
    { }
    return sum;
}
function calculatePct(dividendField, divisorField) {
    var pct = 0;
    var grid = $("#grid1").data("kendoGrid");
    if (grid) {
        var ds = grid.dataSource;
        var aggregates = ds.aggregates();
        var dividend = 0;
        var divisor = 0;
        if (dividendField == "CUSTOMERS_OUT" && divisorField == "CUSTOMERS_SERVED") {
            dividend = (aggregates.CUSTOMERS_OUT && aggregates.CUSTOMERS_OUT.sum != null) ? aggregates.CUSTOMERS_OUT.sum : 0;
            divisor = (aggregates.CUSTOMERS_SERVED && aggregates.CUSTOMERS_SERVED.sum != null) ? aggregates.CUSTOMERS_SERVED.sum : 0;
        }
        if (dividend != 0 && divisor != 0)
            pct = (dividend / divisor) * 100;
    }
    return kendo.toString(pct, 'n2');
}

var postimeout = null;
function onChartDataBound() {
    clearTimeout(postimeout);
    postimeout = setTimeout(function () {
        $("#totalChart svg").attr("width", ($("#totalChart svg").width() + 30) + "px");
        $("#pctChart svg").attr("width", ($("#pctChart svg").width() + 30) + "px");
    }, 1000);
}
