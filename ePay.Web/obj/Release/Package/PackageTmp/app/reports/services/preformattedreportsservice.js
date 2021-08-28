angular.module('HylanApp').factory('PreformattedReportsService', ['DataContext', 'Utility', 'NOTIFYTYPE', 'AppConfig',
     function (DataContext, Utility, NOTIFYTYPE, AppConfig) {
         var resource = "Report";
    var schema = {
        model: {
            id: "COMPANY_NAME",
            fields: {
                COMPANY_NAME: { title: "COMPANY", editable: false },
                RMAG_NAME: { title: "RMAG", editable: false },
                CUSTOMERS_SERVED: { title: "TOTAL CUST.", editable: false },
                CUSTOMERS_OUT: { title: "CUSTOMERS OUT", editable: false },
                CASES: { title: "CASES", editable: false },
                CUSTOMERS_OUT_PCT: { title: "% CUST. OUT", editable: false },

                DISTRIBUTION: { title: "DISTRIBUTION", editable: false },
                DISTRIBUTION_PCT: { title: "%", editable: false },
                TRANSMISSION: { title: "TRANSMISSION", editable: false },
                TRANSMISSION_PCT: { title: "%", editable: false },
                DAMAGE_ASSESSMENT: { title: "DAMAGE", editable: false },
                DAMAGE_ASSESSMENT_PCT: { title: "%", editable: false },
                TREE: { title: "TREE", editable: false },
                TREE_PCT: { title: "%", editable: false },
                SUBSTATION: { title: "SUBSTATION", editable: false },
                SUBSTATION_PCT: { title: "%", editable: false },
                NET_UG: { title: "NET UG", editable: false },
                NET_UG_PCT: { title: "%", editable: false },

                NON_NATIVE_DISTRIBUTION: { title: "DISTRIBUTION", editable: false },
                NON_NATIVE_TRANSMISSION: { title: "TRANSMISSION", editable: false },
                NON_NATIVE_DAMAGE_ASSESSMENT: { title: "DAMAGE ASSESSMENT", editable: false },
                NON_NATIVE_TREE: { title: "TREE", editable: false },
                NON_NATIVE_SUBSTATION: { title: "SUBSTATION", editable: false },
                NON_NATIVE_NET_UG: { title: "NET UG", editable: false }
            }
        }
    };
    

    var defaultSort = {
        field: "COMPANY_NAME",
        dir: "asc"
    };
    var aggs = [
        { field: "CUSTOMERS_SERVED", aggregate: "sum" },
        { field: "CUSTOMERS_OUT", aggregate: "sum" },
        { field: "CASES", aggregate: "sum" },
        { field: "CUSTOMERS_OUT_PCT", aggregate: "sum" },

        { field: "DISTRIBUTION", aggregate: "sum" },
        { field: "DISTRIBUTION_PCT", aggregate: "sum" },
        { field: "TRANSMISSION", aggregate: "sum" },
        { field: "TRANSMISSION_PCT", aggregate: "sum" },
        { field: "DAMAGE_ASSESSMENT", aggregate: "sum" },
        { field: "DAMAGE_ASSESSMENT_PCT", aggregate: "sum" },
        { field: "TREE", aggregate: "sum" },
        { field: "TREE_PCT", aggregate: "sum" },
        { field: "SUBSTATION", aggregate: "sum" },
        { field: "SUBSTATION_PCT", aggregate: "sum" },
        { field: "NET_UG", aggregate: "sum" },
        { field: "NET_UG_PCT", aggregate: "sum" },
        
        { field: "NON_NATIVE_DISTRIBUTION", aggregate: "sum" },
        { field: "NON_NATIVE_TRANSMISSION", aggregate: "sum" },
        { field: "NON_NATIVE_DAMAGE_ASSESSMENT", aggregate: "sum" },
        { field: "NON_NATIVE_TREE", aggregate: "sum" },
        { field: "NON_NATIVE_SUBSTATION", aggregate: "sum" },
        { field: "NON_NATIVE_NET_UG", aggregate: "sum" }
    ];
    
    var datasourceAlloc = DataContext.CreateDataSource(resource, schemaAlloc, aggsAlloc, null, null, defaultSort);
    datasourceAlloc.transport.read = GenerateOutageNumbersReport;

    var GenerateOutageNumbersReport = function (options) {
        $.ajax({
            url: AppConfig.ApiUrl + "/" + resource + "/GenerateOutageNumbersReport",
            dataType: "json",
            data: this.selectedFilters,
            cache: false,
            headers: {
                "Authorization": "UserID" + $rootScope.currentUser.USER_ID
            },
            success: function (result) {
                options.success(result.objResultList);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                var exception = XMLHttpRequest.responseText ? XMLHttpRequest.responseText : errorThrown;
                Utility.Notify({ type: NOTIFYTYPE.ERROR, message: exception });
            }
        });
    };
    var GetSnapshotDatesByType = function (eventId, typeId) {
        var api = resource + "/GetSnapshotDatesByType";
        return Globals.Get(api, {EVENT_ID:eventId, snapshotType: typeId }, true);
    };
    var datasource = DataContext.CreateDataSource(resource, schema, aggs, null, null, defaultSort);
    datasource.transport.read = GenerateOutageNumbersReport;

    /******************************* ALLOCATION SECTION ************************************************/
    var schemaAlloc = {
        model: {
            id: "COMPANY_NAME",
            fields: {
                COMPANY_NAME: { title: "COMPANY", editable: false },
                RMAG_NAME: { title: "RMAG", editable: false },
                IS_COMPANY: { title: "COMPANY/NON-COMPANY", editable: false },
                COMPANY_CITY: { title: "CITY", editable: false },
                COMPANY_STATE: { title: "STATE", editable: false },
                RELEASE_ROLE: { title: "RELEASE TO ROLE", editable: false },
                MODIFIED_ON: { title: "OFFER DATE/TIME", editable: false },
                TIME_ZONE_NAME: { title: "TIME_ZONE_NAME", editable: false },
                APPLY_DL_SAVING: { title: "APPLY_DL_SAVING", editable: false },

                DISTRIBUTION: { title: "DISTRIBUTION", editable: false },
                TRANSMISSION: { title: "TRANSMISSION", editable: false },
                DAMAGE_ASSESSMENT: { title: "DAMAGE ASSESSMENT", editable: false },
                TREE: { title: "TREE", editable: false },
                SUBSTATION: { title: "SUBSTATION", editable: false },
                NET_UG: { title: "NET UG", editable: false },

                NON_NATIVE_DISTRIBUTION: { title: "DISTRIBUTION", editable: false },
                NON_NATIVE_TRANSMISSION: { title: "TRANSMISSION", editable: false },
                NON_NATIVE_DAMAGE_ASSESSMENT: { title: "DAMAGE ASSESSMENT", editable: false },
                NON_NATIVE_TREE: { title: "TREE", editable: false },
                NON_NATIVE_SUBSTATION: { title: "SUBSTATION", editable: false },
                NON_NATIVE_NET_UG: { title: "NET UG", editable: false }
            }
        }
    };
    var aggsAlloc = [
        { field: "DISTRIBUTION", aggregate: "sum" },
        { field: "TRANSMISSION", aggregate: "sum" },
        { field: "DAMAGE_ASSESSMENT", aggregate: "sum" },
        { field: "TREE", aggregate: "sum" },
        { field: "SUBSTATION", aggregate: "sum" },
        { field: "NET_UG", aggregate: "sum" },

        { field: "NON_NATIVE_DISTRIBUTION", aggregate: "sum" },
        { field: "NON_NATIVE_TRANSMISSION", aggregate: "sum" },
        { field: "NON_NATIVE_DAMAGE_ASSESSMENT", aggregate: "sum" },
        { field: "NON_NATIVE_TREE", aggregate: "sum" },
        { field: "NON_NATIVE_SUBSTATION", aggregate: "sum" },
        { field: "NON_NATIVE_NET_UG", aggregate: "sum" }
    ];
    var GenerateResourceReport = function (options) {
        if (this.selectedFilters.reportType == "RESOURCES") {
            $.ajax({
                url: AppConfig.ApiUrl + "/" + resource + "/GenerateResourceReport",
                dataType: "json",
                data: this.selectedFilters,
                cache: false,
                headers: {
                    "Authorization": "UserID" + $rootScope.currentUser.USER_ID
                },
                success: function (result) {
                    options.success(result.objResultList);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    var exception = XMLHttpRequest.responseText ? XMLHttpRequest.responseText : errorThrown;
                    Utility.Notify({ type: NOTIFYTYPE.ERROR, message: exception });
                }
            });
        }
    };
    var datasourceAlloc = DataContext.CreateDataSource(resource, schemaAlloc, aggsAlloc, null, null, defaultSort);
    datasourceAlloc.transport.read = GenerateResourceReport;
    return {
        GetSnapshotDatesByType: GetSnapshotDatesByType,
        dataSource: datasource,
        datasourceAlloc: datasourceAlloc,
        defaultSort: defaultSort
    };
}]);