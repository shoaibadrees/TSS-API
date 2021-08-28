var isSaveClick = false;
var isReset = false;
//var CompanyRmagsDS;

var genEditAccessType = "GLOBAL";
var screenId = null;
angular.module('HylanApp').controller("CompaniesController", ['$rootScope', '$scope', '$controller', '$timeout', 'CompaniesService', 'ngDialog', 'Utility', 'NOTIFYTYPE', '$interval',

    function ($rootScope, $scope, $controller, $timeout, CompaniesService, ngDialog, Utility, NOTIFYTYPE, $interval) {
        $scope.ApiResource = "Companies";
        $scope.AddButtonText = "Add Client";

        var CELLINDEXES = { COMPANY: 1,  COMPANYPHONE: 0, COMPANYCONTACTNAME: 1, COMPANYCONTACTEMAIL: 2 };
        // instantiate base controller
        $controller('BaseController', { $scope: $scope });
        if ($rootScope.isUserLoggedIn == false) return false;
        
       // $scope.ROLE_ID = $stateParams.id;
        $scope.AllowToEdit = true;
        var editPerm = Globals.CheckEditPermission($scope.Screens.MANAGE_CLIENTS.ID);
        if (editPerm == false) {
            $scope.AllowToEdit = false;
            $scope.gridOptions.editable = false;
            $('#grid1 .k-grid-custom_add').addClass('hide');
            $('#grid1 .k-grid-save-changes').addClass('hide');
            $scope.gridOptions.toolbar = Globals.RemoveToolbar();
        }
        var onDataBinding = function (e) {
                
           var gridData = e.sender.dataSource.data();

        }

        var onDataBound = function (args) {
            
            $scope.$emit("ChildGridLoaded", args.sender);
            $scope.handleDataBound(true);
            if ($scope.AllowToEdit == true) {
                $("#grid1 .k-grid-header").addClass("k-grid-header2");
            }
            else {
                $("#grid1 .k-grid-header").removeClass("k-grid-header2");
            }
            if ($scope.AllowToEdit == false) {
                $('#grid1 .k-grid-custom_add').addClass('hide');
                $('#grid1 .k-grid-save-changes').addClass('hide');
            }
        };

        $scope.$on('ngDialog.closed', function (e, $dialog) {
            if ($dialog.attr("name") != "ngdgMultiSelect") {
                $scope.gridOptions.dataSource.read();
            }
        });

       
        $scope.filters = {
            "COMPANY_NAME": { name: "COMPANY_NAME", operator: "contains", value: "", elementType: "text" },
            "PRIMARY_CONTACT_NAME": { name: "PRIMARY_CONTACT_NAME", operator: "contains", value: "", elementType: "text" },
            "STATUS": { name: "STATUS", operator: "eq", value: "Y", elementType: "select" }
        };

        $scope.defaultFilter = { name: "STATUS", operator: "eq", value: "Y", field: "STATUS", elementType: "select" };
        $scope.defaultSort = CompaniesService.defaultSort;

        //-- if searchcolumn type = number then operator will be equal
        $scope.searchColumns = [
            { field: "COMPANY_NAME" },
            { field: "COMPANY_PHONE_NUMBER" },
            { field: "PRIMARY_CONTACT_NAME" },
            { field: "PRIMARY_CONTACT_EMAIL" },
            { field: "COMPANY_STATE" },
            { field: "COMPANY_CITY" },
            { field: "COMPANY_ZIP" },
            { field: "COMPANY_ADDRESS" },
            { field: "BILLING_CONTACT_NAME" },
            { field: "BILLING_PHONE" },
            { field: "BILLING_CONTACT_EMAIL" },
            { field: "PROJECT_DIRECTOR_NAME" },
            { field: "PROJECT_DIRECTOR_PHONE" },
            { field: "PROJECT_DIRECTOR_EMAIL" },
            { field: "PROJECT_MANAGER_NAME" },
            { field: "PROJECT_MANAGER_PHONE" },
            { field: "PROJECT_MANAGER_EMAIL" },
            { field: "STATUS" }
        ];

        StatesDS = Globals.GetStates();
        $scope.States = StatesDS;

        $scope.gridOptions.dataSource = CompaniesService.dataSource;

        var onGridEdit = function (e) {
            Utility.HideNotification();
            
            if ($scope.AllowToEdit == false) {
                this.closeCell();
                return;
            }
            if ($.inArray(e.model.uid, Globals.changedModels) == -1) {
                Globals.changedModels.push(e.model.uid);
                Globals.changedModelIds.push(e.model.id);
                if (e.model.isNew()) {
                    $scope.grid.clearSelection();
                    $scope.grid.content.scrollTop(0); // we HAVE to reset the scroll first.
                    $scope.grid.content.scrollLeft(0);
                }
            }

        };

        var handleSaveChanges = function (e) {
            
            if ($('.k-grid-save-changes').hasClass('disabled')) {
                e.preventDefault(true);
                return false;
            }
            $('.k-grid-save-changes').addClass('disabled');
            var griddata = $scope.grid.dataItems();
            var valid = true;
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
                        var isControlValide = true;

                        if (model.COMPANY_NAME == "") {
                            message += "<br>Please enter Client Name.";
                            isControlValide = false;
                            invalidCell = $(dirtyRows[0]).find("td:eq(" + CELLINDEXES.COMPANY + ")");
                        }

                       
                        if (model.COMPANY_PHONE_NUMBER == "") {
                            message += "<br>Please enter Client Phone #.";
                            isControlValide = false;
                            if (!invalidCell)
                                HoldToolbarPos();
                            invalidCell = invalidCell || $(dirtyRows[1]).find("td:eq(" + CELLINDEXES.COMPANYPHONE + ")");
                        }

                        if (model.PRIMARY_CONTACT_NAME == "") {
                            message += "<br>Please enter Primary Contact Name.";
                            isControlValide = false;
                            if (!invalidCell)
                                HoldToolbarPos();
                            invalidCell = invalidCell || $(dirtyRows[1]).find("td:eq(" + CELLINDEXES.COMPANYCONTACTNAME + ")");
                        }

                        if (model.PRIMARY_CONTACT_EMAIL == "") {
                            message += "<br>Please enter Primary Contact Email.";
                            isControlValide = false;
                            if (!invalidCell)
                                HoldToolbarPos();
                            invalidCell = invalidCell || $(dirtyRows[1]).find("td:eq(" + CELLINDEXES.COMPANYCONTACTEMAIL + ")");
                        }

                        if (isControlValide == false) {
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

                    if (!valid) {
                        $('.k-grid-save-changes').removeClass('disabled');
                        // Abort the save operation
                        e.preventDefault(true);
                    }
                });
            }
        };
        var statusColumnTemplate = "#= STATUS == 'Y' ? 'Active' : 'In-Active' # ";
        if ($scope.AllowToEdit == true) {
           
            statusColumnTemplate = "<input type='checkbox' #= STATUS == 'Y' ? 'checked=checked' : '' #  onclick='CheckGlobalEditAccessBeforeClick(this);' class='chkbx' ></input>";
        }
        $scope.gridOptions.columns = [
         { field: "ROW_HEADER", width: "20px", title: "   .", sortable: false, locked: true, headerAttributes: { "class": "sub-col darkYellow-col rowHeaderHeadYellow", "style": "border-right: 0px !important;" }, attributes: { "class": "contert-alpha GridBorder rowHeaderCell" } ,filterable:false},
           { field: "COMPANY_NAME", title: "<sup><img src='Content/images/red_asterisk.png' /></sup>Client Name", width: "160px", locked: true, headerAttributes: { "class": "sub-col darkYellow-col rowHeaderHead2 section-border" }, attributes: { "class": "contert-alpha GridBorder section-border" }, template: "#= Globals.dirtyField(data,'COMPANY_NAME')# #:COMPANY_NAME#", filterable: stringFilterAttributes },
           { field: "COMPANY_PHONE_NUMBER", title: "<sup><img src='Content/images/red_asterisk.png' /></sup>Client Phone #", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, width: "170px", attributes: { "class": "contert-number GridBorder no-left-border" }, template: "#= Globals.dirtyField(data,'COMPANY_PHONE_NUMBER')# #:COMPANY_PHONE_NUMBER#", editor: Globals.PhoneMaskingEditor, filterable: stringFilterAttributes },
           { field: "PRIMARY_CONTACT_NAME", title: "<sup><img src='Content/images/red_asterisk.png' /></sup>Primary Contact Name", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, width: "200px", attributes: { "class": "contert-alpha GridBorder" }, template: "#= Globals.dirtyField(data,'PRIMARY_CONTACT_NAME')# #:PRIMARY_CONTACT_NAME#", filterable: stringFilterAttributes },
           { field: "PRIMARY_CONTACT_EMAIL", title: "<sup><img src='Content/images/red_asterisk.png' /></sup>Primary Contact Email", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, width: "200px", attributes: { "class": "contert-alpha GridBorder" }, template: "#= Globals.dirtyField(data,'PRIMARY_CONTACT_EMAIL')# #:PRIMARY_CONTACT_EMAIL#", filterable: stringFilterAttributes },
           { field: "COMPANY_ADDRESS", title: "Address", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, width: "200px", attributes: { "class": "contert-alpha GridBorder" }, template: "#= Globals.dirtyField(data,'COMPANY_ADDRESS')# #:COMPANY_ADDRESS#", filterable: stringFilterAttributes },
           { field: "COMPANY_CITY", title: "City", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, width: "100px", attributes: { "class": "contert-alpha GridBorder" }, template: "#= Globals.dirtyField(data,'COMPANY_CITY')# #:COMPANY_CITY#", filterable: stringFilterAttributes },
           { field: "COMPANY_STATE", title: "State", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, width: "90px", attributes: { "class": "contert-alpha GridBorder" }, editor: statesDropDownEditor, template: "#= Globals.dirtyField(data,'COMPANY_STATE')# #:COMPANY_STATE#", filterable: stringFilterAttributes },
           { field: "COMPANY_ZIP", title: "Zip", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, width: "100px", attributes: { "class": "contert-number GridBorder" }, template: "#= Globals.dirtyField(data,'COMPANY_ZIP')# #:COMPANY_ZIP#", filterable: stringFilterAttributes },

           { field: "BILLING_CONTACT_NAME", title: "Billing Contact Name", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, width: "200px", attributes: { "class": "contert-alpha GridBorder" }, template: "#= Globals.dirtyField(data,'BILLING_CONTACT_NAME')# #:BILLING_CONTACT_NAME#", filterable: stringFilterAttributes },
           { field: "BILLING_PHONE", title: "Billing Contact<br/>Phone #", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, width: "170px", attributes: { "class": "contert-number GridBorder" }, template: "#= Globals.dirtyField(data,'BILLING_PHONE')# #:BILLING_PHONE#", editor: Globals.PhoneMaskingEditor, filterable: stringFilterAttributes },
           { field: "BILLING_CONTACT_EMAIL", title: "Billing Contact Email", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, width: "200px", attributes: { "class": "contert-alpha GridBorder" }, template: "#= Globals.dirtyField(data,'BILLING_CONTACT_EMAIL')# #:BILLING_CONTACT_EMAIL#", filterable: stringFilterAttributes },

           { field: "PROJECT_DIRECTOR_NAME", title: "Project Director Name", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, width: "200px", attributes: { "class": "contert-alpha GridBorder" }, template: "#= Globals.dirtyField(data,'PROJECT_DIRECTOR_NAME')# #:PROJECT_DIRECTOR_NAME#", filterable: stringFilterAttributes },
           { field: "PROJECT_DIRECTOR_PHONE", title: "Project Director Phone #", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, width: "170px", attributes: { "class": "contert-number GridBorder" }, template: "#= Globals.dirtyField(data,'PROJECT_DIRECTOR_PHONE')# #:PROJECT_DIRECTOR_PHONE#", editor: Globals.PhoneMaskingEditor, filterable: stringFilterAttributes },
           { field: "PROJECT_DIRECTOR_EMAIL", title: "Project Director Email", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, width: "200px", attributes: { "class": "contert-alpha GridBorder" }, template: "#= Globals.dirtyField(data,'PROJECT_DIRECTOR_EMAIL')# #:PROJECT_DIRECTOR_EMAIL#", filterable: stringFilterAttributes },

           { field: "PROJECT_MANAGER_NAME", title: "Project Manager Name", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, width: "200px", attributes: { "class": "contert-alpha GridBorder" }, template: "#= Globals.dirtyField(data,'PROJECT_MANAGER_NAME')# #:PROJECT_MANAGER_NAME#", filterable: stringFilterAttributes },
           { field: "PROJECT_MANAGER_PHONE", title: "Project Manager Phone #", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, width: "170px", attributes: { "class": "contert-number GridBorder" }, template: "#= Globals.dirtyField(data,'PROJECT_MANAGER_PHONE')# #:PROJECT_MANAGER_PHONE#", editor: Globals.PhoneMaskingEditor, filterable: stringFilterAttributes },
           { field: "PROJECT_MANAGER_EMAIL", title: "Project Manager Email", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, width: "200px", attributes: { "class": "contert-alpha GridBorder" }, template: "#= Globals.dirtyField(data,'PROJECT_MANAGER_EMAIL')# #:PROJECT_MANAGER_EMAIL#", filterable: stringFilterAttributes },

           { field: "STATUS", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, title: "Status", width: "110px", attributes: { "class": "GridBorder" }, template: statusColumnTemplate, filterable: { cell: { template: ActiveInactiveFilterTemplate, showOperators: false } } }
        ];
        $scope.gridOptions.filterable = {
           mode: "row"
        }
        ///////
        
        
        /////////

        $scope.gridOptions.dataBinding = onDataBinding;
        $scope.gridOptions.dataBound = onDataBound;
        //$scope.gridOptions.resizable = true;
        $scope.gridOptions.edit = onGridEdit;
        $scope.gridOptions.saveChanges = handleSaveChanges;

        function onError(XMLHttpRequest, textStatus, errorThrown) {
            Utility.Notify({ type: NOTIFYTYPE.ERROR, message: errorThrown, IsPopUp: false });
        }
        $scope.PageName = 'Companies';
    }]);

function HoldToolbarPos() {
    if (window.matchMedia("(orientation: portrait)").matches) {
        $(".k-header.k-grid-toolbar").css("position", "relative").css("left", ($("#responsive-tables").width() - 290) + "px");
        $(".k-pager-wrap.k-grid-pager").css("position", "relative").css("left", ($("#responsive-tables").width() - 270) + "px");
    }
}
function customeditor(container, options) {
    Globals.customnumericfield(container, options, 'TOTAL_CUSTOMERS', options.model.TOTAL_CUSTOMERS);
}

function statesDropDownEditor(container, options) {
    $('<input data-text-field="ST_STATE" data-value-field="ST_STATE"  />')
        .appendTo(container)
        .kendoDropDownList({
            autoBind: true,
            dataTextField: "ST_STATE",
            dataValueField: "ST_STATE",
            dataSource: StatesDS,
            dataBound: function (e) {
                var selSTATE = $("#grid1").data("kendoGrid").dataItem(this.element.closest("tr")).COMPANY_STATE;
                if (selSTATE) {
                    this.select(function (dataItem) {
                        return dataItem.ST_STATE === selSTATE;
                    });
                }
                setTooltipOnDropdownItems(this);
            },
            change: function () {
                var selRMAG = this.dataItem().toJSON();
                var selRow = $("#grid1").data("kendoGrid").dataItem(this.element.closest("tr"));
                selRow.get().dirty = true;
                if (!selRMAG.ST_STATE)
                    selRMAG.ST_STATE = "";
                selRow.set("COMPANY_STATE", selRMAG.ST_STATE);
            },
            optionLabel: " Select "
        });
}

function dirtyField(data, fieldName) {
    if (typeof data.dirtyFields != 'undefined' && data.dirtyFields != null) {
        if (data.dirty && data.dirtyFields[fieldName]) {
            return "<span class='k-dirty'></span>"
        }
        else {
            return "";
        }
    }
}

function CheckGlobalEditAccessBeforeClick(elem) {
    
    var grid = $("#grid1").data("kendoGrid");
    var dataItem = grid.dataItem($(elem).closest("tr"));
    if ($scope.AllowToEdit == false) {
        event.preventDefault();
        return false;
    }
    Globals.SetStatusValue(elem);
}