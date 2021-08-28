angular.module('HylanApp').controller("UserRolesController", ['$rootScope', '$scope', '$controller', '$state', 'UserRolesService', 'Utility', 'NOTIFYTYPE',
    function ($rootScope, $scope, $controller, $state, UserRolesService, Utility, NOTIFYTYPE) {
        $scope.ApiResource = "UsersRoles";
        $scope.AddButtonText = "Add Role";
        var CELLINDEXES = { ROLENAME: 1};
        $controller('BaseController', { $scope: $scope });
        if ($rootScope.isUserLoggedIn == false) return false;
        var onDataBinding = function (e) {
        }
        $scope.AllowToEdit = true;
        $scope.gridOptions.editable = true;
        var editPerm = Globals.CheckEditPermission($scope.Screens.MANAGE_USER_ROLES.ID);
        if (editPerm == false){
            $scope.AllowToEdit = false;
            $scope.gridOptions.editable = false;
            $scope.gridOptions.toolbar = Globals.RemoveToolbar();
    }
        var onDataBound = function (args) {
            $scope.$emit("ChildGridLoaded", args.sender);
            $scope.handleDataBound();
            if ($scope.gridOptions.editable == false) {
                $("#grid1 .k-grid-header").addClass("k-grid-header2");
            }
        };

        $scope.gridOptions.height = $(document).height() - 55;
        $scope.gridOptions.dataSource = UserRolesService.dataSource;

        var handleSaveChanges = function (e) {
            if ($('.k-grid-save-changes').hasClass('disabled')) {
                e.preventDefault(true);
                return false;
            }
            $('.k-grid-save-changes').addClass('disabled');
            if ($scope.grid.dataSource.hasChanges() == false) {
                $('.k-grid-save-changes').removeClass('disabled');
                alert(Globals.NoChanges);
                return;
            }

            if (Globals.changedModels.length > 0) {              
              $(Globals.changedModels).each(function (index, value) {
                    var model = $scope.grid.dataSource.getByUid(value);
                    var dirtyRows = $("#responsive-tables").find("tr[data-uid='" + value + "']");
                    var invalidCell = null;

                    // Check the id property - this will indicate an insert row
                    if (model && (model.dirty || model.isNew())) {
                        var message = '';
                        var isValid = true;

                        if (model.ROLE_NAME == "") {
                            message += "<br>Please enter Role Name.";
                            isValid = false;
                            invalidCell = $(dirtyRows[0]).find("td:eq(" + CELLINDEXES.ROLENAME + ")");
                        }

                        if (isValid == false) {
                            $scope.grid.editCell(invalidCell);
                            $('.k-grid-save-changes').removeClass('disabled');
                            Utility.Notify({ type: NOTIFYTYPE.ERROR, message: message });
                            // Abort the save operation
                            e.preventDefault(true);
                            $scope.grid.clearSelection();
                            var row = $scope.grid.tbody.find('tr[data-uid="' + value + '"]');
                            $scope.grid.content.scrollTop(0); // we HAVE to reset the scroll first.
                            $scope.grid.content.scrollTop(row.offset().top - $scope.grid.content.offset().top);
                            $scope.grid.select(row);
                            return false;
                        }
                    }
                });
            }
        };

        var permLabel = "View";
        if ($scope.gridOptions.editable == true) {
            permLabel = "View/Edit";
            //#=STATUS == 'Y' ? 'checked=checked' : ''# 
        }
        function statusColumnTemplate(dataItem) {
            var disabled = '';
            if (dataItem.IS_ADMIN)
                disabled = "disabled = 'disabled'";
            var template = dataItem.STATUS == 'Y' ? 'Active' : 'In-Active';
            if ($scope.gridOptions.editable == true) {
                var chked = dataItem.STATUS == 'Y' ? 'checked="checked"' : '';
                template = "<input type='checkbox' onclick='Globals.SetStatusValue(this);' id='STATUS' " + chked + "  # class='chkbx' " + disabled + "></input>";
            }
            return template;
        }

        $scope.gridOptions.columns = [
            { field: "ROW_HEADER", width: "20px", title: "   .", sortable: false, headerAttributes: { "class": "sub-col darkYellow-col rowHeaderHeadYellow", "style": "border-right: 0px !important;" }, attributes: { "class": "contert-alpha  rowHeaderCell" } },
            { field: "ROLE_NAME", title: "<sup><img src='../../../Content/images/red_asterisk.png' /></sup>Role Name", width: "30%", headerAttributes: { "class": "sub-col darkYellow-col rowHeaderHead2", "style": "padding-left: 18px !important;" }, attributes: { "class": "contert-alpha", "style": "padding-left: 18px !important;" }, template: "#=Globals.dirtyField(data,'ROLE_NAME')# #:ROLE_NAME#" },
            { field: "DESCRIPTION", title: "Description", width: "40%", headerAttributes: { "class": "sub-col no-left-border darkYellow-col" }, attributes: { "class": "contert-alpha" }, template: "#=Globals.dirtyField(data,'DESCRIPTION')# #:DESCRIPTION#" },
            { title: "Permissions", width: "15%", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, command: { name: "view_rights", template: '<a ng-click="ViewRoleDetails(this)">' + permLabel + '</a>' } },
            { field: "STATUS", title: "Status", width: "15%", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, template: statusColumnTemplate }
        ];

        $scope.filters = null;
        $scope.defaultFilter = null;
        $scope.defaultSort = UserRolesService.defaultSort;

        $scope.gridOptions.dataBinding = onDataBinding;
        $scope.gridOptions.dataBound = onDataBound;
        $scope.gridOptions.saveChanges = handleSaveChanges;
        $scope.gridOptions.edit = function (e) {

            if (e.model.IS_ADMIN) {   //-- disable SUPER ADMIN Role
                this.closeCell();
                return;
            }

            if ($.inArray(e.model.uid, Globals.changedModels) == -1) {
                Globals.changedModels.push(e.model.uid);
                Globals.changedModelIds.push(e.model.id);
            }
            Utility.HideNotification();
        };

        $scope.ViewRoleDetails = function (elem) {
            if (event.preventDefault) { event.preventDefault() } else { event.returnValue = false; }
            var srcElement = event.currentTarget ? event.currentTarget : event.srcElement;
            var dataItem = $scope.grid.dataItem($(srcElement).closest("tr"));
            if (dataItem.isNew() == true) {
                Utility.Notify({ type: NOTIFYTYPE.ERROR, message: 'Please save User Role information before changing Rights.' });
                return false;
            }
            else if ($scope.handleFilterChange() == true) {
                $state.go('UserRoleDetails', { id: dataItem.ROLE_ID });
            }
        };

        $scope.gridOptions.dataSource.read();
    }
]);