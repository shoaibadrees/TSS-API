angular.module('HylanApp').controller("UserRoleDetailsController", ['$rootScope', '$scope', '$controller', '$state', '$stateParams', 'UserRolesService', 'Utility', 'NOTIFYTYPE',
    function ($rootScope, $scope, $controller, $state, $stateParams, UserRolesService, Utility, NOTIFYTYPE) {
        if ($stateParams.id === undefined || $stateParams.id === "") {
            $state.go('UserRoles');
        }
        $controller('BaseController', { $scope: $scope });
        if ($rootScope.isUserLoggedIn == false) return false;
        $scope.ROLE_ID = $stateParams.id;
        $scope.AllowToEdit = true;
        var editPerm = Globals.CheckEditPermission($scope.Screens.MANAGE_USER_ROLES_DETAILS.ID);
        if (editPerm == false)
            $scope.AllowToEdit = false;
        $scope.getRoleDetails = function () {
            $('input[type="radio"]').change(function () {
                $scope.permissionsChanged = true;
                Utility.HideNotification();
            });

            $('input[type="checkbox"]').change(function () {
                $scope.permissionsChanged = true;
                Utility.HideNotification();
            });

            UserRolesService.GetRoleDetails($scope.ROLE_ID).then(function (result) {
                try {
                    
                    $scope.ROLE = result.objResult;
                  //  $('#chkIsRestrictedRole').get(0).checked = $scope.ROLE.IS_RESTRICTED;
                    if ($scope.ROLE.IS_ADMIN)
                        $scope.AllowToEdit = false;
                    if ($scope.ROLE.PERMISSIONS.length > 0) {
                        angular.forEach($scope.ROLE.PERMISSIONS,function (value, index) {
                            var permission = value;
                            if (permission.PERMISSION_TYPE == "GENERAL_EDIT_ACCESS") {
                                var $row = $('tr[data-type="general_edit_access"][data-screen="' + permission.SCREEN_ID + '"]');
                                if ($row.length > 0)
                                    $row.find('input:radio[name="' + permission.SCREEN_ID + '"][data-access-type="' + permission.GENERAL_EDIT_ACCESS_TYPE + '"]').get(0).checked = true;
                            }
                            else if (permission.PERMISSION_TYPE == "VIEW_EDIT_ACCESS") {
                                var $row = $('tr[data-type="view_edit_access"][data-screen="' + permission.SCREEN_ID + '"]');
                                if ($row.length > 0) {
                                         $row.find('input[data-view-type="ALL"]').get(0).checked = permission.VIEW_ACCESS_GENERAL;
                                        if (!$row.find('input[data-view-type="ALL"]').get(0).checked) {
                                            $row.find('input[data-edit-type="ALL"]').attr("disabled", "disabled");
                                        }
                               
                                    $row.find('input[data-edit-type="ALL"]').get(0).checked = permission.EDIT_ACCESS;
                                }
                            }
                            else if (permission.PERMISSION_TYPE == "SPECIAL_FUNCTION") {
                                var $row = $('tr[data-type="special_function"][data-screen="' + permission.SCREEN_ID + '"][data-function="' + permission.PERMISSION_TYPE_ID + '"]');
                                if ($row.length > 0) {
                                    $row.find('input[data-access-type="ALL"]').get(0).checked = permission.VIEW_ACCESS_GENERAL;
                                }
                            }
                            else if (permission.PERMISSION_TYPE == "NOTIFICATION") {
                                var $row = $('tr[data-type="notification"][data-notification="' + permission.PERMISSION_TYPE_ID + '"]');
                                if ($row.length > 0) {
                                    
                                        $row.find('input[data-access-type="ALL"]').get(0).checked = permission.VIEW_ACCESS_GENERAL;
                                   
                                }
                            }
                            else if (permission.PERMISSION_TYPE == "dashboard") {
                              
                                var $row = $('tr[data-type="dashboard"][data-screen="' + permission.SCREEN_ID + '"]');
                                if ($row.length > 0) {
                                     $row.find('input[data-access-type="ALL"]').get(0).checked = permission.VIEW_ACCESS_GENERAL;
                                   
                                }
                            }

                        });
                    }

                    if ($scope.AllowToEdit == false) {
                        $('input[type="checkbox"],input[type="radio"]').attr("disabled", "disabled");
                    }
                    else {
                        $scope.AllowToEdit = true;
                    }
                } catch (e) {
                    Utility.Notify({ type: NOTIFYTYPE.ERROR, message: e.toString(), IsPopUp: false });
                }
            });
        };

        $scope.getRoleDetails();

        $scope.save = function () {
          
            if ($scope.permissionsChanged == undefined || $scope.permissionsChanged == false) {
                alert(Globals.NoChanges);
                return;
            }
            var role = $scope.ROLE;
            role.IS_RESTRICTED = 0;
            role.PERMISSIONS = [];
                 
            angular.forEach($('tr[data-type="view_edit_access"]'),function (value, index) {
                var permission = {};
                var $row = $(value);
                permission.ROLE_ID = $scope.ROLE_ID;
                permission.SCREEN_ID = $row.data("screen");
                permission.PERMISSION_TYPE = "VIEW_EDIT_ACCESS";
                permission.PERMISSION_TITLE = $.trim($row.find("td.title").text());
                permission.VIEW_ACCESS_GENERAL = $row.find('input[data-view-type="ALL"]').get(0).checked;
                permission.EDIT_ACCESS = $row.find('input[data-edit-type="ALL"]').get(0).checked;
                role.PERMISSIONS.push(permission);
            });

            angular.forEach($('tr[data-type="special_function"]'),function (value, index) {
                var permission = {};
                var $row = $(value);
                permission.ROLE_ID = $scope.ROLE_ID;
                permission.SCREEN_ID = $row.data("screen");
                permission.PERMISSION_TYPE_ID = $row.data("function");
                permission.PERMISSION_TYPE = "SPECIAL_FUNCTION";
                permission.PERMISSION_TITLE = $.trim($row.find("td.title").text());
                permission.VIEW_ACCESS_GENERAL = $row.find('input[data-access-type="ALL"]').get(0).checked;
                role.PERMISSIONS.push(permission);
            });

            angular.forEach($('tr[data-type="notification"]'),function (value, index) {
                var permission = {};
                var $row = $(value);
                permission.ROLE_ID = $scope.ROLE_ID;
                permission.SCREEN_ID = $row.data("screen");
                permission.PERMISSION_TYPE_ID = $row.data("notification");
                permission.PERMISSION_TYPE = "NOTIFICATION";
                permission.PERMISSION_TITLE = $.trim($row.find("td.title").text());
                permission.VIEW_ACCESS_GENERAL = $row.find('input[data-access-type="ALL"]').get(0).checked;
             
                role.PERMISSIONS.push(permission);
            });

            angular.forEach($('tr[data-type="dashboard"]'),function (value, index) {
                var permission = {};
                var $row = $(value);
                permission.ROLE_ID = $scope.ROLE_ID;
                permission.SCREEN_ID = $row.data("screen");
                permission.PERMISSION_TYPE_ID = $row.data("dashboard");
                permission.PERMISSION_TYPE = "dashboard";
                permission.PERMISSION_TITLE = $.trim($row.find("td.title").text());
                permission.VIEW_ACCESS_GENERAL = $row.find('input[data-access-type="ALL"]').get(0).checked;
                role.PERMISSIONS.push(permission);
            });

            UserRolesService.SaveRoleDetails(role).then(function (result) {
                Utility.Notify({ type: NOTIFYTYPE.SUCCESS, message: "Changes Saved." });
                $scope.getRoleDetails();
            }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
                var exception = XMLHttpRequest.responseText ? XMLHttpRequest.responseText : errorThrown;
                Utility.Notify({ type: NOTIFYTYPE.ERROR, message: exception });
            });

            $scope.permissionsChanged = false;
        };

        $scope.cancel = function () {
            if ($scope.permissionsChanged == true) {
                if (confirm(Globals.ChangesLostMessage) == true) {
                    $state.go('UserRoles');
                }
            }
            else {
                $state.go('UserRoles');
            }
        };


    }]
);
function ViewEditAccessChange() {
    if ($scope.ROLE.IS_ADMIN == false) {
        angular.forEach($('tr[data-type="view_edit_access"]'), function (value, index) {
            var $row = $(value);

            if ((!$row.find('input[data-view-type="ALL"]').get(0).checked)) {
                $row.find('input[data-edit-type="ALL"]').attr("disabled", "disabled");
                $row.find('input[data-edit-type="ALL"]').removeAttr("checked");
            }
            else {
                $row.find('input[data-edit-type="ALL"]').removeAttr("disabled");
            }


        });
    }
}