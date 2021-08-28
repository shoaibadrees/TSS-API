angular.module('HylanApp').controller("ResourceReportController", ['$rootScope', '$scope', '$controller', '$timeout', 'PreformattedReportsService', 'Utility', 'NOTIFYTYPE', '$interval',
    function ($rootScope, $scope, $controller, $timeout, PreformattedReportsService, Utility, NOTIFYTYPE, $interval) {
        $controller('BaseController', { $scope: $scope });
        if ($rootScope.isUserLoggedIn == false)
            return false;

        $scope.gridOptionsAlloc = {
            editable:false,
            scrollable: true,
            selectable: true,
            filterable: false,
            navigatable: true,
            resizable: false,
            sortable: {
                mode: "single",
                allowUnsort: false
            },
            dataSource: [],
            columns: [],
            
        };
        var numColWidth = "85px";
        $scope.gridOptionsAlloc.columns = [
        { field: "COMPANY_NAME", title: "COMPANY", width: "200px", headerAttributes: { "class": "sub-col rowHeaderHead2 rowspan2", "style": "border-left: 0px white;" }, attributes: { "class": "contert-alpha GridBorder", "style": "border-left: 0px white;" }, template: "#:COMPANY_NAME#" },
        { field: "RMAG_NAME", title: "RMAG", width: "200px", headerAttributes: { "class": "sub-col no-left-border rowspan2" }, attributes: { "class": "contert-alpha" }, template: "#:RMAG_NAME#" },
        { field: "IS_COMPANY", title: "COMPANY/NON-COMPANY", width: "100px", headerAttributes: { "class": "sub-col no-left-border rowspan2" }, attributes: { "class": "contert-alpha" }, template: "#:IS_COMPANY#" },
        { field: "COMPANY_CITY", title: "CITY", width: "150px", headerAttributes: { "class": "sub-col no-left-border rowspan2" }, attributes: { "class": "contert-alpha" }, template: "#:COMPANY_CITY#" },
        { field: "COMPANY_STATE", title: "STATE", width: "150px", headerAttributes: { "class": "sub-col no-left-border rowspan2" }, attributes: { "class": "contert-alpha" }, template: "#:COMPANY_STATE#" },
        { field: "RELEASE_ROLE", title: "RELEASE TO ROLL", width: "170px", headerAttributes: { "class": "sub-col no-left-border rowspan2" }, attributes: { "class": "contert-alpha" }, template: "#= ApplyTimeZone(RELEASE_ROLE, TIME_ZONE_NAME, APPLY_DL_SAVING)#" },
        { field: "MODIFIED_ON", title: "RESPONSE DATE/TIME", width: "170px", headerAttributes: { "class": "sub-col no-left-border rowspan2" }, attributes: { "class": "contert-alpha" }, template: "#= ApplyTimeZone(MODIFIED_ON, TIME_ZONE_NAME, APPLY_DL_SAVING) #" },

        { field: "DISTRIBUTION", title: "OFFERS", width: numColWidth, headerAttributes: { "class": "no-left-border " }, attributes: { "class": "contert-number" }, template: '#:kendo.toString(DISTRIBUTION,"n0")#', aggregates: ["sum"], footerTemplate: '#=sum == null ? 0 : kendo.toString(sum,"n0") #', footerAttributes: { "style": "text-align: right;" } },
        { field: "NON_NATIVE_DISTRIBUTION", title: "ACQ.", width: numColWidth, headerAttributes: { "class": "" }, attributes: { "class": "contert-number" }, template: '#:kendo.toString(NON_NATIVE_DISTRIBUTION,"n0")#', aggregates: ["sum"], footerTemplate: '#=sum == null ? 0 : kendo.toString(sum,"n0") #', footerAttributes: { "style": "text-align: right;" } },
        { field: "TRANSMISSION", title: "OFFERS", width: numColWidth, headerAttributes: { "class": "" }, attributes: { "class": "contert-number" }, template: '#:kendo.toString(TRANSMISSION,"n0")#', aggregates: ["sum"], footerTemplate: '#=sum == null ? 0 : kendo.toString(sum,"n0") #', footerAttributes: { "style": "text-align: right;" } },
        { field: "NON_NATIVE_TRANSMISSION", title: "ACQ.", width: numColWidth, headerAttributes: { "class": "" }, attributes: { "class": "contert-number" }, template: '#:kendo.toString(NON_NATIVE_TRANSMISSION,"n0")#', aggregates: ["sum"], footerTemplate: '#=sum == null ? 0 : kendo.toString(sum,"n0") #', footerAttributes: { "style": "text-align: right;" } },
        { field: "DAMAGE_ASSESSMENT", title: "OFFERS", width: numColWidth, headerAttributes: { "class": "" }, attributes: { "class": "contert-number" }, template: '#:kendo.toString(DAMAGE_ASSESSMENT,"n0")#', aggregates: ["sum"], footerTemplate: '#=sum == null ? 0 : kendo.toString(sum,"n0") #', footerAttributes: { "style": "text-align: right;" } },
        { field: "NON_NATIVE_DAMAGE_ASSESSMENT", title: "ACQ.", width: numColWidth, headerAttributes: { "class": "" }, attributes: { "class": "contert-number" }, template: '#:kendo.toString(NON_NATIVE_DAMAGE_ASSESSMENT,"n0")#', aggregates: ["sum"], footerTemplate: '#=sum == null ? 0 : kendo.toString(sum,"n0") #', footerAttributes: { "style": "text-align: right;" } },
        { field: "TREE", title: "OFFERS", width: numColWidth, headerAttributes: { "class": "" }, attributes: { "class": "contert-number" }, template: '#:kendo.toString(TREE,"n0")#', aggregates: ["sum"], footerTemplate: '#=sum == null ? 0 : kendo.toString(sum,"n0") #', footerAttributes: { "style": "text-align: right;" } },
        { field: "NON_NATIVE_TREE", title: "ACQ.", width: numColWidth, headerAttributes: { "class": "" }, attributes: { "class": "contert-number" }, template: '#:kendo.toString(NON_NATIVE_TREE,"n0")#', aggregates: ["sum"], footerTemplate: '#=sum == null ? 0 : kendo.toString(sum,"n0") #', footerAttributes: { "style": "text-align: right;" } },
        { field: "SUBSTATION", title: "OFFERS", width: numColWidth, headerAttributes: { "class": "" }, attributes: { "class": "contert-number" }, template: '#:kendo.toString(SUBSTATION,"n0")#', aggregates: ["sum"], footerTemplate: '#=sum == null ? 0 : kendo.toString(sum,"n0") #', footerAttributes: { "style": "text-align: right;" } },
        { field: "NON_NATIVE_SUBSTATION", title: "ACQ.", width: numColWidth, headerAttributes: { "class": "" }, attributes: { "class": "contert-number" }, template: '#:kendo.toString(NON_NATIVE_SUBSTATION,"n0")#', aggregates: ["sum"], footerTemplate: '#=sum == null ? 0 : kendo.toString(sum,"n0") #', footerAttributes: { "style": "text-align: right;" } },
        { field: "NET_UG", title: "OFFERS", width: numColWidth, headerAttributes: { "class": "" }, attributes: { "class": "contert-number" }, template: '#:kendo.toString(NET_UG,"n0")#', aggregates: ["sum"], footerTemplate: '#=sum == null ? 0 : kendo.toString(sum,"n0") #', footerAttributes: { "style": "text-align: right;" } },
        { field: "NON_NATIVE_NET_UG", title: "ACQ.", width: numColWidth, headerAttributes: { "class": "" }, attributes: { "class": "contert-number" }, template: '#:kendo.toString(NON_NATIVE_NET_UG,"n0")#', aggregates: ["sum"], footerTemplate: '#=sum == null ? 0 : kendo.toString(sum,"n0") #', footerAttributes: { "style": "text-align: right;" } }

        ];
        $scope.gridOptionsAlloc.height = ($("#chartSection").height()*0.80);

        $("#chartSection").css("overflow", "hidden");
        $scope.gridOptionsAlloc.autobind = false;
        $scope.gridOptionsAlloc.dataSource = PreformattedReportsService.datasourceAlloc;
        $scope.gridOptionsAlloc.dataSource.transport.selectedFilters = $scope.GetCriteria();

        $scope.gridOptionsAlloc.dataSource._pageSize = undefined;
        $scope.gridOptionsAlloc.toolbar = undefined;
        $scope.gridOptionsAlloc.pageable = false;

        $scope.gridOptionsAlloc.dataBound = function (args) {
            if ($('#gridAlloc .k-grid-header-wrap thead tr.multiColumnHeaderLevel1').length <= 0) {
                var th1 = '<th role="columnheader" data-field="" colspan="2" data-colspan="2" data-title="RESOURCE REQUESTS" class="no-left-border no-bottom-border subsection-border k-header ng-scope table-sbhead1 ReportHeader" style="border-bottom: solid 1px #49565e !important;font-size:8pt;">DISTRIBUTION</th>';
                var th2 = '<th role="columnheader" data-field="" colspan="2" data-colspan="2" data-title="RESOURCES ACQUIRED" class="no-left-border no-bottom-border subsection-border k-header ng-scope table-sbhead2 ReportHeader" style="border-bottom: solid 1px #49565e !important;font-size:8pt;">TRANSMISSION</th>';

                var th3 = '<th role="columnheader" data-field="" colspan="2" data-colspan="2" data-title="RESOURCE REQUESTS" class="no-left-border no-bottom-border subsection-border k-header ng-scope table-sbhead3 ReportHeader" style="border-bottom: solid 1px #49565e !important;font-size:8pt;">DAMAGE</th>';
                var th4 = '<th role="columnheader" data-field="" colspan="2" data-colspan="2" data-title="RESOURCE REQUESTS" class="no-left-border no-bottom-border subsection-border k-header ng-scope table-sbhead4 ReportHeader" style="border-bottom: solid 1px #49565e !important;font-size:8pt;">TREE</th>';

                var th5 = '<th role="columnheader" data-field="" colspan="2" data-colspan="2" data-title="RESOURCES ACQUIRED" class="no-left-border no-bottom-border subsection-border k-header ng-scope table-sbhead5 ReportHeader" style="border-bottom: solid 1px #49565e !important;font-size:8pt;">SUBSTATION</th>';
                var th6 = '<th role="columnheader" data-field="" colspan="2" data-colspan="2" data-title="RESOURCES ACQUIRED" class="no-left-border no-bottom-border subsection-border k-header ng-scope table-sbhead5 ReportHeader" style="border-bottom: solid 1px #49565e !important;font-size:8pt;">NET UG</th>';

                $('#gridAlloc .k-grid-header-wrap thead').prepend('<tr class="multiColumnHeaderLevel1" role="row"></tr>');
                $('#gridAlloc .k-grid-header-wrap thead .rowspan2').attr("rowspan", "2");
                var tempTH = $('#gridAlloc .k-grid-header-wrap thead .rowspan2');
                $('#gridAlloc .k-grid-header-wrap thead tr.multiColumnHeaderLevel1').append(tempTH);
                $('#gridAlloc .k-grid-header-wrap thead tr.multiColumnHeaderLevel1').append(th1);
                $('#gridAlloc .k-grid-header-wrap thead tr.multiColumnHeaderLevel1').append(th2);
                $('#gridAlloc .k-grid-header-wrap thead tr.multiColumnHeaderLevel1').append(th3);
                $('#gridAlloc .k-grid-header-wrap thead tr.multiColumnHeaderLevel1').append(th4);
                $('#gridAlloc .k-grid-header-wrap thead tr.multiColumnHeaderLevel1').append(th5);
                $('#gridAlloc .k-grid-header-wrap thead tr.multiColumnHeaderLevel1').append(th6);

                $('#gridAlloc .k-grid-header-wrap thead').prepend('<tr class="multiColumnHeaderLevel1" role="row"><th role="columnheader" data-field="" colspan="19" data-colspan="19" data-title="ALLOCATION DETAILS" class="no-left-border no-bottom-border subsection-border k-header ng-scope ReportHeader ReportHeader1" style="border-bottom: solid 1px #49565e !important;">ALLOCATION DETAILS</th></tr>');
            }
            $('#gridAlloc .k-grid-header-wrap thead[role="rowgroup"] tr.SummaryRow').remove();
            $('#gridAlloc .k-grid-header-wrap thead[role="rowgroup"]').append($('#gridAlloc tr.k-footer-template'));
            $('#gridAlloc tr.k-footer-template').removeClass('k-footer-template').addClass("SummaryRow").attr("role", "row");
            $('#gridAlloc div.k-grid-footer').css("display", "none");

            $('#gridAlloc .k-grid-header-wrap thead[role="rowgroup"] tr.SummaryRow > :nth-child(1)').append(function () {
                return $(this).attr("colspan", "2").css("text-align", "left").html('<label style="color:darkgray">Summary</label>').next().remove().contents();
            });

            var grid = $("#gridAlloc").data("kendoGrid");
            grid.setOptions({ height: ($("#chartSection").height() * 0.80) });
            $("#gridAlloc div.k-grid-content").height($("#gridAlloc").height() *0.75);
            
        };
        $scope.$on("RefreshAllocationGrid", function (event, data) {
            $scope.gridOptionsAlloc.dataSource.transport.selectedFilters = $scope.GetCriteria();
            $scope.gridOptionsAlloc.dataSource.read();
        });
    }
]);
function ApplyTimeZone(date, timeZoneName, applyDLSaving) {
    var dateTimeWithTimeZone = "";
    if (date != null && date != '') {
        date = date.replace(" ", "T");
        dateTimeWithTimeZone = kendo.toString(TimeZoneSpecificDate(new Date(moment(date, moment.ISO_8601)), timeZoneName, applyDLSaving), 'MM/dd/yyyy HH:mm') + GetTimeZonePostFix(timeZoneName);
    }
    return dateTimeWithTimeZone;
}