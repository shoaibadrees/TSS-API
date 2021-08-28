angular.module('HylanApp').factory('UserRolesService', ['DataContext', function (DataContext) {
    var resource = "Roles";
    var schema = {
        model: {
            id: "ROLE_ID",
            fields: {
                ROW_HEADER: { editable: false },
                ROLE_ID: {},
                ROLE_NAME: {
                    title: "Role Name", validation: {
                        maxlength: function (input) {
                            if (input.val().length > 100) {
                                input.attr("data-maxlength-msg", "Max length is 100!");
                                return false;
                            }
                            return true;
                        }
                    }
                },
                DESCRIPTION: {
                    title: "Description", validation: {
                        descriptionmaxlength: function (input) {
                            if (typeof input.val().length != 'undefined'){
                                if (input.val().length > 500) {
                                    input.attr("data-descriptionmaxlength-msg", "Max length is 500!");
                                    return false;
                                }
                            }
                            return true;
                        }
                    }
                },
                STATUS: {
                    title: "Status", editable: false, defaultValue: 'Y'
                },
                CREATED_ON: {},
                CREATED_BY: {},
                MODIFIED_ON: {},
                MODIFIED_BY: {},
                LOCK_COUNTER: {}
            }
        }
    };

    var defaultSort = {
        field: "ROLE_NAME",
        dir: "asc"
    };

    var datasource = DataContext.CreateDataSource(resource, schema, null, null, null, defaultSort);

    var GetRoleDetails = function (ROLE_ID) {
        
        var api = "Roles/LoadRoleDetails";
        var param = { id: ROLE_ID };
        return Globals.Get(api, param, false);
    };

    var SaveRoleDetails = function (ROLE) {
        
        var api = "Roles/UpdateRoleWithPermissions";
        var param = JSON.stringify(ROLE);
        return Globals.Post(api, param, false);
    };

    return {
        dataSource: datasource,
        defaultSort: defaultSort,
        GetRoleDetails: GetRoleDetails,
        SaveRoleDetails: SaveRoleDetails
    };
}]);