var _RolesDS;
var _CompaniesDS;
//var _RMAGDS;
var genEditAccessType = "GLOBAL";
var screenId = null;
angular.module('HylanApp').controller("UsersController", ['$rootScope', '$scope', '$controller', '$timeout', 'UsersService', 'Utility', 'NOTIFYTYPE', '$interval',
    function ($rootScope, $scope, $controller, $timeout, UsersService, Utility, NOTIFYTYPE, $interval) {
        $scope.ApiResource = "Users";
        $scope.AddButtonText = "Add User";
        var CELLINDEXES = { USERNAME: 1, FIRSTNAME: 2, LASTNAME: 3, USERROLE: 4, COMPANY: 0, EMAILADDRESS: 2, MOBILETEXTINGPHONE: 4 };
        $controller('BaseController', { $scope: $scope });
        if ($rootScope.isUserLoggedIn == false) return false;
        genEditAccessType = $scope.generalEditAccess;
        screenId = $scope.screenId;
        Globals.GetUserRoles(false).then(function (result) {
            var roles;
            roles = $.grep(result.objResultList, function (elem, index) {
                return elem.STATUS == 'Y';
            });
            _RolesDS = roles;
            var resetrictedRolePerm = Globals.GetSpecificPermission(Globals.Screens.MANAGE_USERS.ID, "SPECIAL_FUNCTION", Globals.Screens.MANAGE_USERS.SPECIAL_FUNCTION.RESTRICTED_ROLES_ID);
            if (resetrictedRolePerm) {
                _RolesDS = _.filter(_RolesDS, function (role) {
                    return role.IS_RESTRICTED == false || (role.IS_RESTRICTED == true && resetrictedRolePerm.VIEW_ACCESS_GENERAL == true);
                });
            }
            $scope.RolesDS = _RolesDS;
        }).fail(onError);
        $scope.AllowToEdit = true;
        var editPerm = Globals.CheckEditPermission($scope.Screens.MANAGE_USERS.ID);
        if (editPerm == false) {
            $scope.AllowToEdit = false;
            $scope.gridOptions.editable = false;
            $scope.gridOptions.toolbar = Globals.RemoveToolbar();
            
        }
        //if ($scope.AllowToEdit == false) {

        //}
        //Globals.GetRMAGS(false).then(function (result) {
        //    _RMAGDS = result.objResultList;
        //    var ddlRMAGS = $("#ddlRMAG");
        //    $.each(_RMAGDS, function () {
        //        ddlRMAGS.append($("<option title='" + this.RMAG_NAME + "'/>").val(this.RMAG_ID).text(this.RMAG_NAME));
        //    });
        //    // $("#ddlRMAG option[value='? undefined:undefined ?']").remove();
        //    ddlRMAGS.val("0");
        //}).fail(onError);

        Globals.GetCompanies(false).then(function (result) {
            _CompaniesDS = result.objResultList;
        }).fail(onError);

        //supported operators are: "eq" (equal to), "neq" (not equal to), "lt" (less than), "lte" (less than or equal to), "gt" (greater than), 
        //"gte" (greater than or equal to), "startswith", "endswith", "contains"
        $scope.filters = {
            "USER_NAME": { name: "USER_NAME", operator: "contains", value: "", elementType: "text" },
            "LAST_NAME": { name: "LAST_NAME", operator: "contains", value: "", elementType: "text" },
            "ROLE": { name: "ROLE", operator: "eq", value: "0", foreignkey: "ROLE.ROLE_NAME", elementType: "select" },
            "USER_COMPANIES_NAMES": { name: "USER_COMPANIES_NAMES", operator: "contains", value: "", elementType: "text" },
            "STATUS": { name: "STATUS", operator: "eq", value: "Y", elementType: "select" }
        };

        $scope.defaultFilter = { name: "STATUS", operator: "eq", value: "Y", field: "STATUS", elementType: "select" };

        $scope.defaultSort = UsersService.defaultSort;

        //-- if searchcolumn type = number then operator will be equal
        $scope.searchColumns = [
            { field: "USER_NAME" },
            { field: "FIRST_NAME" },
            { field: "LAST_NAME" },
            { field: "ROLE.ROLE_NAME" },
            { field: "USER_COMPANIES_NAMES" },
            { field: "EMAIL_ADDRESS" },
            { field: "OFFICE_PHONE" },
            { field: "MOBILE_PHONE" },
            { field: "STATUS" }
        ];
        var statusColumnTemplate = "#= (STATUS == 'Y' || ROLE.ROLE_NAME != '') ? 'Active' : 'In-Active' # ";
        //if ($scope.gridOptions.editable == true) {
            statusColumnTemplate = " <input type='checkbox' #=STATUS == 'Y' ? 'checked=checked' : ''# onclick='CheckGlobalEditAccessBeforeClick(this);' class='chkbx'></input>";
        //}
        $scope.gridOptions.columns = [
            { field: "ROW_HEADER", width: "20px", title: "   .", sortable: false, locked: true, headerAttributes: { "class": "sub-col darkYellow-col rowHeaderHeadYellow", "style": "border-right: 0px !important;" }, attributes: { "class": "contert-alpha  rowHeaderCell" } },
            { field: "USER_NAME", title: "<sup><img src='Content/images/red_asterisk.png' /></sup>User Name", locked: true, width: "120px", headerAttributes: { "class": "sub-col darkYellow-col rowHeaderHead2", "style": "border-left: 0px white;1px solid #c6c6c6 !important;" }, attributes: { "class": "contert-alpha ", "style": "border-left: 0px white;" }, template: "#=Globals.dirtyField(data,'USER_NAME')# #:USER_NAME#" },
            { field: "FIRST_NAME", title: "<sup><img src='Content/images/red_asterisk.png' /></sup>First Name", width: "120px", locked: true, headerAttributes: { "class": "sub-col no-left-border darkYellow-col", "style": "white;1px solid #c6c6c6 !important;" }, attributes: { "class": "contert-alpha" }, template: "#=Globals.dirtyField(data,'FIRST_NAME')# #:FIRST_NAME#" },
            { field: "LAST_NAME", title: "<sup><img src='Content/images/red_asterisk.png' /></sup>Last Name", width: "120px", locked: true, headerAttributes: { "class": "sub-col no-left-border darkYellow-col", "style": "white;1px solid #c6c6c6 !important;" }, attributes: { "class": "contert-alpha" }, template: "#=Globals.dirtyField(data,'LAST_NAME')# #:LAST_NAME#" },
            { field: "ROLE.ROLE_NAME", title: "<sup><img src='Content/images/red_asterisk.png' /></sup>User Role", width: "150px", locked: true, headerAttributes: { "class": "sub-col no-left-border darkYellow-col section-border", "style": "white;1px solid #c6c6c6 !important;" }, attributes: { "class": "contert-alpha section-border" }, editor: UserRolesEditor, template: "#=Globals.dirtyField(data,'ROLE_NAME')# #:ROLE.ROLE_NAME#" },
            { field: "USER_COMPANY_ID", title: "<sup><img src='Content/images/red_asterisk.png' /></sup>Company", width: "200px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col", "style": "white;1px solid #c6c6c6 !important;" }, attributes: { "class": "contert-alpha" }, editor: UserCompaniesEditor, template: "#=Globals.dirtyField(data,'USER_COMPANIES')# #:USER_COMPANIES_NAMES#", sortable: {
                compare: function (a, b) {
                    return a.USER_COMPANIES_NAMES.localeCompare(b.USER_COMPANIES_NAMES);
                }
            } },
            { field: "USER_COMPANIES_NAMES", hidden: true, title: "<sup><img src='Content/images/red_asterisk.png' /></sup>Company", width: "200px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col", "style": "white;1px solid #c6c6c6 !important;" }, attributes: { "class": "contert-alpha" }, template: " #:USER_COMPANIES_NAMES#" },
            { field: "EMAIL_ADDRESS", title: "<sup><img src='Content/images/red_asterisk.png' /></sup>Email Address", width: "200px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col", "style": "white;1px solid #c6c6c6 !important;" }, attributes: { "class": "contert-alpha" }, template: "#=Globals.dirtyField(data,'EMAIL_ADDRESS')# #:EMAIL_ADDRESS#" },
            { field: "OFFICE_PHONE", title: "Office Phone #", width: "160px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col", "style": "white;1px solid #c6c6c6 !important;" }, attributes: { "class": "contert-number" }, editor: Globals.PhoneMaskingEditor, template: "#=Globals.dirtyField(data,'OFFICE_PHONE')# #:OFFICE_PHONE#" },
            { field: "MOBILE_PHONE", title: "<sup><img src='Content/images/red_asterisk.png' /></sup>Cell #", width: "160px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col", "style": "white;1px solid #c6c6c6 !important;" }, attributes: { "class": "contert-number" }, editor: Globals.PhoneMaskingEditor, template: "#=Globals.dirtyField(data,'MOBILE_PHONE')# #:MOBILE_PHONE#" },
            { field: "STATUS", title: "Status", width: "85px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col", "style": "white;1px solid #c6c6c6 !important;" }, template: statusColumnTemplate }
        ];

        $scope.gridOptions.dataSource = UsersService.dataSource;
        //$scope.gridOptions.dataSource.transport.selectedRmagID = $("#ddlRMAG").val();
        //   if ($scope.gridOptions.editable == true) {
            
            var resetPswdPerm = Globals.GetSpecificPermission(Globals.Screens.MANAGE_USERS.ID, "SPECIAL_FUNCTION", Globals.Screens.MANAGE_USERS.SPECIAL_FUNCTION.RESET_PSWD_ID);
            if (resetPswdPerm) {
                if (resetPswdPerm.VIEW_ACCESS_GENERAL == true) {
                    $scope.gridOptions.toolbar.unshift({ name: "reset_password", template: '<a class="k-button" id="toolbar-reset_password" ng-click="ResetPassword();">Reset Password</a>' });

                }
            }
            else {
                $scope.gridOptions.toolbar.unshift({ name: "reset_password", template: '<a class="k-button" id="toolbar-reset_password" ng-click="ResetPassword();">Reset Password</a>' });
            }

     //  }


        $scope.gridOptions.height = $(window).height() - 170;
        $scope.gridOptions.dataBinding = function (e) {
            //if (Globals.IsExportingData == false) {
            //  e.sender.hideColumn("USER_COMPANIES_NAMES");
            //}
            //var gridData = e.sender.dataSource.data();
            //for (i = 0; i < gridData.length; i++) {
            //    gridData[i].USER_COMPANIES_NAMES = $.map(_CompaniesDS, function (obj) {
            //        for (j = 0; j < gridData[i].USER_COMPANIES.length; j++) {
            //            if (obj.COMPANY_ID == gridData[i].USER_COMPANIES[j])
            //                return obj.COMPANY_NAME;
            //        }
            //    }).join(', ');
            //}
        };
        $scope.gridOptions.dataBound = function (args) {
            $scope.$emit("ChildGridLoaded", args.sender);
            $scope.handleDataBound(true);
            //$("#ddlRMAG option[value='? undefined:undefined ?']").remove();
            //$("#ddlRMAG option[value='? string:0 ?']").remove();
            if ($scope.gridOptions.editable == false) {
                $("#grid1 .k-grid-header").addClass("k-grid-header2");
            }          
        };
        $scope.gridOptions.saveChanges = function (e) {
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

                        if (model.USER_NAME == "") {
                            message += "<br>Please enter User Name.";
                            isValid = false;
                            invalidCell = $(dirtyRows[0]).find("td:eq(" + CELLINDEXES.USERNAME + ")");
                        }

                        if (model.FIRST_NAME == "") {
                            message += "<br>Please enter First Name.";
                            isValid = false;
                            invalidCell = invalidCell || $(dirtyRows[0]).find("td:eq(" + CELLINDEXES.FIRSTNAME + ")");
                        }

                        if (model.LAST_NAME == "") {
                            message += "<br>Please enter Last Name.";
                            isValid = false;
                            invalidCell = invalidCell || $(dirtyRows[0]).find("td:eq(" + CELLINDEXES.LASTNAME + ")");
                        }

                        if (model.ROLE && (model.ROLE.ROLE_ID == "0" || model.ROLE.ROLE_ID == "-1" || model.ROLE.ROLE_ID == "")) {
                            message += "<br>Please select a User Role.";
                            isValid = false;
                            invalidCell = invalidCell || $(dirtyRows[0]).find("td:eq(" + CELLINDEXES.USERROLE + ")");
                        }

                        if (model.USER_COMPANIES == undefined || model.USER_COMPANIES == '' || model.USER_COMPANIES.length == 0) {
                            message += "<br>Please select Company.";
                            isValid = false;
                            invalidCell = invalidCell || $(dirtyRows[1]).find("td:eq(" + CELLINDEXES.COMPANY + ")");
                        }

                        if (model.EMAIL_ADDRESS == "") {
                            message += "<br>Please enter Email Address.";
                            isValid = false;
                            invalidCell = invalidCell || $(dirtyRows[1]).find("td:eq(" + CELLINDEXES.EMAILADDRESS + ")");
                        }

                        if (model.MOBILE_PHONE == "") {
                            message += "<br>Please enter Cell #.";
                            isValid = false;
                            invalidCell = invalidCell || $(dirtyRows[1]).find("td:eq(" + CELLINDEXES.MOBILETEXTINGPHONE + ")");
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
                        $rootScope.UserCompanies = null;
                    }
                });
            }
        };
        $scope.gridOptions.edit = function (e) {
            Utility.HideNotification();
            if (Globals.HasGenEditAccess($scope.generalEditAccess, e, $scope.screenId) == false) {
                this.closeCell();
                return;
            }
            if ($.inArray(e.model.uid, Globals.changedModels) == -1) {
                Globals.changedModels.push(e.model.uid);
                Globals.changedModelIds.push(e.model.id);
            }
        };

        $scope.loadUserGridData = function () {
            $scope.grid.dataSource.read();
        };

        $scope.ResetPassword = function ResetPassword() {
            var grid = $scope.grid;

            if ($scope.grid.dataSource.hasChanges()) {
              if (confirm(Globals.ChangesLostMessage) == true) {
                $scope.grid.dataSource.cancelChanges();
                Globals.isNewRowAdded = false;
                Utility.HideNotification();
                isChildDataChanged = false;
                $(".k-grid-header .k-link").off('click');
              }
              else { return; }
            }

            var selectedRows = grid.select();
            if (selectedRows.length > 0) {
                Globals.changedModels = [];
                var usersNames = [];
                var usersEmails = [];
                $.each(selectedRows, function (index, value) {
                    var dataItem = grid.dataItem(value);
                    if (dataItem.isNew() == false && $.inArray(dataItem.id, Globals.changedModels) == -1) {
                        Globals.changedModels.push(dataItem.id);
                        usersNames.push(dataItem.USER_NAME);
                        usersEmails.push(dataItem.EMAIL_ADDRESS);
                    }
                });

                if (Globals.changedModels.length > 0) {
                    var doReset = false;
                    if (grid.dataSource.hasChanges() == false) {
                        doReset = confirm(Globals.ResetPasswordConfirmation);
                    }
                    else {
                        doReset = $scope.handleFilterChange(Globals.ResetPasswordConfirmation);
                    }
                    if (doReset == true) {

                        // UsersService.ResetPassword(Globals.changedModels.join(','), $rootScope.currentUser.USER_ID).then(onSuccess).fail(onError);
                        UsersService.ResetPassword(Globals.changedModels.join(','), $rootScope.currentUser.USER_ID, usersNames.join(','), usersEmails.join(',')).then(function (result) {
                            onSuccess(result);
                        }).fail(onError);
                    }
                }
            }
            else {
                alert("Please select the user record(s) to reset password.");
            }
        };

        function onSuccess(result) {

            Utility.Notify({ type: NOTIFYTYPE.SUCCESS, message: "Changes Saved.", IsPopUp: $scope.ngDialogData });

        }

        function onError(XMLHttpRequest, textStatus, errorThrown) {          
          var exception = XMLHttpRequest.responseText ? XMLHttpRequest.responseText : errorThrown;       
          if (XMLHttpRequest.responseJSON && XMLHttpRequest.responseJSON.Message && (XMLHttpRequest.responseJSON.Message.indexOf(Globals.EmailMessageNotSent) != -1 || XMLHttpRequest.responseJSON.Message.indexOf(Globals.PasswordResetError) != -1))
          {
            Utility.Notify({ type: NOTIFYTYPE.ERROR, message: XMLHttpRequest.responseJSON.Message, IsPopUp: $scope.ngDialogData });
          }          
          else {
            Utility.Notify({ type: NOTIFYTYPE.ERROR, message: exception, IsPopUp: $scope.ngDialogData });
          }           
        }

        $scope.stopInterval = function () {
            $interval.cancel(stop);
            stop = undefined;
        };

        $scope.ResetFilter = function () {

            //Globals.GetRMAGS(false).then(function (result) {
            //    _RMAGDS = result.objResultList;
            //    var ddlRMAGS = $("#ddlRMAG");
            //    if ($(ddlRMAGS).length > 0)
            //        $(ddlRMAGS).empty();
            //    ddlRMAGS.append($("<option />").val(0).text("All"));
            //    $.each(_RMAGDS, function () {
            //        ddlRMAGS.append($("<option />").val(this.RMAG_ID).text(this.RMAG_NAME));
            //    });
            //    //$("#ddlRMAG option[value='? undefined:undefined ?']").remove();
            //    ddlRMAGS.val("0");
            //    $scope.selectedRmagID = "0";

            //    // 
            //}).fail(onError);
            $scope.clearFilters();
            $scope.loadUserGridData();
        }
        if ($scope.AllowToEdit == false) {
            $scope.gridOptions.toolbar = Globals.RemoveToolbar();
        }
    }
]);
// not being used
function UserCompaniesMultiSelectEditor(container, options) {
    var onItemSelect = function (item) {
        if ($.inArray(item.COMPANY_ID, options.model.USER_COMPANIES) <= -1) {
            ////var dataItem = $("#grid1").data("kendoGrid").dataItem($('#grid1_active_cell').closest("tr"));
            var dataItem = $("#grid1").data("kendoGrid").dataItem($("#grid1").data("kendoGrid").select()[1]);
            if (dataItem.USER_COMPANIES == undefined || dataItem.USER_COMPANIES == null || dataItem.USER_COMPANIES == "") {
                dataItem.USER_COMPANIES = [];
            }
            dataItem.USER_COMPANIES.push(item.COMPANY_ID);
            dataItem.USER_COMPANIES_NAMES = $.map(scope.objUserCompanies, function (obj) {
                return obj.COMPANY_NAME;
            }).join(', ');
            dataItem.get().dirty = true;
        }
    };

    var onItemDeselect = function (item) {
        ////var dataItem = $("#grid1").data("kendoGrid").dataItem($('#grid1_active_cell').closest("tr"));
        var dataItem = $("#grid1").data("kendoGrid").dataItem($("#grid1").data("kendoGrid").select()[1]);
        dataItem.USER_COMPANIES = _.without(dataItem.USER_COMPANIES, item.COMPANY_ID);
        dataItem.USER_COMPANIES_NAMES = $.map(scope.objUserCompanies, function (obj) {
            return obj.COMPANY_NAME;
        }).join(', ');
        dataItem.get().dirty = true;
    };

    var translationTexts = { dynamicButtonTextSuffix: 'Company(s) Selected' };

    CreateMultiSelectEditor(_CompaniesDS, translationTexts, 'COMPANY_ID', 'COMPANY_NAME', onItemSelect, onItemDeselect);

    var scope = Globals.GetCurrentScope();
    scope.objUserCompanies = [];
    if (options.model.USER_COMPANIES && options.model.USER_COMPANIES.length > 0) {
      $.each(options.model.USER_COMPANIES, function (index, val) {
            scope.objUserCompanies.push($.grep(_CompaniesDS, function (item) { return item.COMPANY_ID == val; })[0]);
        });
    }
    if (/iPad/.test(Globals.UserAgent)) {
        scope.eidtorSelectedModel = scope.objUserCompanies;
        scope.multiSelectContainer = container[0];
        scope.multiSelectDisplayDataItem = "USER_COMPANIES_NAMES";
        OpenMultiSelectinPopup("Select Company", scope);
        container[0].innerText = options.model.USER_COMPANIES_NAMES;
    }
    else
        $('<div ng-dropdown-multiselect="" options="editorOptions" selected-model="objUserCompanies" translation-texts="editorTranslationTexts" extra-settings="editorSettings" events="editorEvents" checkboxes="true" style="position: absolute;"></div>').appendTo(container);
}

function UserCompaniesEditor(container, options) {
    $('<input id="ddlUserCompaniesEditor" data-text-field="COMPANY_NAME" data-value-field="COMPANY_NAME"  />')
        .appendTo(container)
        .kendoDropDownList({
            autoBind: true,
            dataSource: _CompaniesDS,
            dataTextField: "COMPANY_NAME",
            dataValueField: "COMPANY_ID",
            dataBound: function (e) {
                var selCompany = $("#grid1").data("kendoGrid").dataItem(this.element.closest("tr")).USER_COMPANIES;
                this.select(function (dataItem) {
                    return dataItem.COMPANY_ID === selCompany[0];
                });
                setTooltipOnDropdownItems(this);
            },
            change: function (lookupRow) {
                //insert value in the grid's row
                var item = this.dataItem().toJSON();
                var dataItem = $("#grid1").data("kendoGrid").dataItem($("#grid1").data("kendoGrid").select()[1]);
                dataItem.USER_COMPANIES = []; //clear the array every time so that company count does not go to greater than one
                dataItem.USER_COMPANIES.push(item.COMPANY_ID);
                dataItem.USER_COMPANY_ID = item.COMPANY_ID;
                dataItem.set("USER_COMPANIES_NAMES", this.dataItem().toJSON().COMPANY_NAME);
                dataItem.get().dirty = true;
            },
            optionLabel: " Select "
        });
}
function UserRolesEditor(container, options) {
    $('<input id="ddlRolesEditor" data-text-field="ROLE_NAME" data-value-field="ROLE_ID"  />')
        .appendTo(container)
        .kendoDropDownList({
            autoBind: true,
            dataSource: _RolesDS,
            dataTextField: "ROLE_NAME",
            dataValueField: "ROLE_ID",
            dataBound: function (e) {
                var selRole = $("#grid1").data("kendoGrid").dataItem(this.element.closest("tr")).ROLE;
                this.select(function (dataItem) {
                    return dataItem.ROLE_ID === selRole.ROLE_ID;
                });
                setTooltipOnDropdownItems(this);
            },
            change: function () {
                var dataItem = $("#grid1").data("kendoGrid").dataItem(this.element.closest("tr"));
                dataItem.set("ROLE", this.dataItem().toJSON());
                dataItem.get().dirty = true;
            },
            optionLabel: " Select "
        });
}


//function GetRMAGCompanies() {
//    var rmagIds = $("#ddlRMAG").val();
//    Globals.GetCompaniesByRmags(rmagIds).then(function (result) {
//        _CompaniesDS = result.objResultList;
//    });
//}

$(document).ready(function () {
    $(".k-grid-header").css("border-top", "1px solid #c6c6c6 !important");
});
function CheckGlobalEditAccessBeforeClick(elem) {
    var grid = $("#grid1").data("kendoGrid");
    var dataItem = grid.dataItem($(elem).closest("tr"));
    if (Globals.HasGenEditAccess(genEditAccessType, dataItem, screenId) == false) {
        event.preventDefault();
        return false;
    }
    Globals.SetStatusValue(elem);
}