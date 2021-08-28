var nMartPageConfig = new function () {

    this.pageType = '';
    this.filterColumns = [];
    this.groupColumns = [];
    this.templates = [];
    this.schema = [];
    this.screenID = '';
    this.genEditAccessType = "GLOBAL";
    this.steps = [];
    this.totalSteps = 0;  //-- 0 based index value

    this.build = function (type) {
        switch (type) {
            case 'Response':
                this.screenID = Globals.Screens.RESPONSES.ID;
                this.totalSteps = 2;
                this.filterColumns = [{ field: "COMPANY.COMPANY_NAME", operator: FilterOperatores.contains },
                    { field: "COMPANY.RMAG.RMAG_NAME", operator: FilterOperatores.contains },
                    { field: "RESPONSE_TYPE.LU_NAME", operator: FilterOperatores.equalTo },
                    { field: "DISTRIBUTION", operator: FilterOperatores.equalTo }];

                this.groupColumns = [
                    { field: "COMPANY.COMPANY_NAME", label: "Company" },
                    { field: "COMPANY.RMAG.RMAG_NAME", label: "RMAG" },
                    { field: "STATUS.LU_NAME", label: "Status" },
                    { field: "CALCULATION_RUN", label: "Calculation Run" },
                    { field: "RESPONSE_TYPE.LU_NAME", label: "Response/Hold" },
                    { field: "liListView", label: "None" }];

                this.templates = {
                    LIST: Templates.List.response_list,
                    DETAIL: Templates.List.response_detail,
                    GROUP_HEADER: Templates.List.group_header,
                    GROUP_ITEMS: Templates.List.group_items,
                    SEARCH: Templates.List.response_search,
                    STEP1: Templates.List.response_step1,
                    STEP2: Templates.List.response_step2,
                    STEP3: Templates.List.response_step3,
                    FOOTER_NAVIGATION: Templates.List.footer_navigation
                };

                this.schema = {
                    entity: "Responses",
                    defaultSortColumn: "COMPANY.COMPANY_NAME",
                    modelIDColumn: "RESPONSE_ID",
                    httResources: {
                        create: "InsertCustom",
                        update: "Update",
                        delete: "Delete"
                    }
                };

                this.steps = [
                    { stepTitle: "Step 1", stepIndex: 1 },
                    { stepTitle: "Step 2", stepIndex: 2 },
                    { stepTitle: "Step 3", stepIndex: 3 }];

                break;

            case 'Request':
                this.screenID = Globals.Screens.REQUESTS.ID;
                this.filterColumns = [{ field: "COMPANY.COMPANY_NAME", operator: FilterOperatores.contains },
                    { field: "COMPANY.RMAG.RMAG_NAME", operator: FilterOperatores.contains },
                    { field: "DISTRIBUTION", operator: FilterOperatores.equalTo }];

                this.groupColumns = [
                    { field: "COMPANY.COMPANY_NAME", label: "Company" },
                    { field: "COMPANY.RMAG.RMAG_NAME", label: "RMAG" },
                    { field: "STATUS_LU.LU_NAME", label: "Status" },
                    { field: "CALCULATION_RUN", label: "Calculation Run" },
                    { field: "liListView", label: "None" }];

                this.templates = {
                    LIST: Templates.List.request_list,
                    DETAIL: Templates.List.request_detail,
                    GROUP_HEADER: Templates.List.group_header,
                    GROUP_ITEMS: Templates.List.group_items,
                    SEARCH: Templates.List.response_search,
                    STEP1: Templates.List.request_step1,
                    STEP2: Templates.List.request_step2,
                    STEP3: Templates.List.request_step3,
                    STEP4: Templates.List.request_step4,
                    FOOTER_NAVIGATION: Templates.List.footer_navigation
                };

                this.schema = {
                    entity: "Requests",
                    defaultSortColumn: "COMPANY.COMPANY_NAME",
                    modelIDColumn: "REQUEST_ID",
                    httResources: {
                        create: "InsertCustom",
                        update: "Update",
                        delete: "Delete"
                    }
                };

                this.steps = [
                    { stepTitle: "Step 1", stepIndex: 1 },
                    { stepTitle: "Step 2", stepIndex: 2 },
                    { stepTitle: "Step 3", stepIndex: 3 },
                    { stepTitle: "Step 4", stepIndex: 4 }];
                break;
        }

        this.pageType = type;
        var genEditPerm = Globals.GetSpecificPermission(this.screenID, "GENERAL_EDIT_ACCESS", 0);
        if (genEditPerm)
            this.genEditAccessType = genEditPerm.GENERAL_EDIT_ACCESS_TYPE;

        return this;
    };
};

var nMartPage = function (pageConfig) {

    this.config = pageConfig;
    this.viewModel = null;
    this.loadingCount = 0;
    this.UserCompaniesList = null;
    this.defaultsApplied = false;
    var that = this;
    //var cachedUserCompanies = getCachedItem(CachedKeys.USER_COMPANIES_LIST);
    //if (cachedUserCompanies)
    //    this.UserCompaniesList = cachedUserCompanies;
    //else
    //    Globals.GetUserCompanies(Globals.CurrentUser.USER_ID, this.config.genEditAccessType).then(function (result) {
    //        that.UserCompaniesList = result.objResultList;
    //        setCachedItem(CachedKeys.USER_COMPANIES_LIST, result.objResultList);
    //    });


    this.showLoading = function (flag) {
        var divLoading = $(".km-loader.km-widget") || $("#divkendoprogress");
        if (flag)
            this.loadingCount += 1;
        else
            this.loadingCount -= 1;

        if (this.loadingCount === 0)
            divLoading.hide();
        else if (this.loadingCount > 0)
            divLoading.show();
    };

    this.createViewModel = function () {
        var dfd = new jQuery.Deferred();
        var viewModel = null;
        try {
            var StatusDS = $.grep(Globals.GetLookUp(Globals.LookUpTypes.REQUESTS_STATUS, false), function (item) {
                return item.LOOK_UP_ID != 2;
            });
            StatusDS.sort(function (a, b) {
                if (a.LOOK_UP_ID < b.LOOK_UP_ID)
                    return -1;
                if (a.LOOK_UP_ID > b.LOOK_UP_ID)
                    return 1;
                return 0;
            });

            switch (this.config.pageType) {
                case 'Response':
                    viewModel = kendo.observable({
                        responseDC: that.getCachedDC(this.config.pageType),
                        ResponseCompanies: that.UserCompaniesList.COMPANY,
                        ResponseTypes: Globals.GetLookUp(Globals.LookUpTypes.RESPONSE_TYPE, false),
                        HoldReasons: Globals.GetLookUp(Globals.LookUpTypes.HOLD_REASON, false),
                        CompanyModes: Globals.GetLookUp(Globals.LookUpTypes.RESPONSE_COMPANY_MODE, false),
                        ResponseStatuses: StatusDS,
                        States: Globals.GetStates(),
                        isNew: false,
                        isChanged: false,

                        getResponseCompaniesCascadeRMAGS: function (afterLoad) {
                            var cascadeDataSource = new kendo.data.DataSource();
                            var selCompID = $("#ddlResponseCompany").data("kendoDropDownList").value();
                            var activeEvent = getCachedItem(CachedKeys.SELECTED_EVENT);
                            if (selCompID) {
                                var compRMAGS = null;
                                if (selCompID != "") {
                                    compRMAGS = jQuery.grep(that.UserCompaniesList.COMPANY, function (elem, index) {
                                        return elem.COMPANY_ID == selCompID;
                                    });

                                    if (compRMAGS && compRMAGS.length > 0) {
                                        if (activeEvent.EVENT_TYPE.LU_NAME == 'RMAG')
                                            cascadeDataSource.data(compRMAGS[0].COMPANYRMAGS);
                                        else if (activeEvent.EVENT_TYPE.LU_NAME == 'NRE')
                                            cascadeDataSource.data([{ RMAG_ID: compRMAGS[0].HOME_RMAG, RMAG_NAME: compRMAGS[0].COMPANY_HOME_RMAG_NAME }]);
                                    }
                                }
                            }

                            if (afterLoad) {
                                var ddlRMAG = $("#ddlRMAG").data("kendoDropDownList");
                                ddlRMAG.setDataSource(cascadeDataSource);
                                if (activeEvent.EVENT_TYPE.LU_NAME == 'NRE')
                                    ddlRMAG.select(0);
                                ddlRMAG.trigger("change");  //-- select() doesn't update model
                            }
                            else
                                return cascadeDataSource;
                        },
                        onResponseCompanyChange: function (e) {
                            this.getResponseCompaniesCascadeRMAGS(true);
                            var dsResComps = e.sender.dataSource.data();
                            var selComp = jQuery.grep(dsResComps, function (elem, index) {
                                return elem.COMPANY_ID == e.sender._old;
                            });
                            if (selComp.length > 0) {
                                e.data.set("responseDC.COMPANY_NAME", selComp[0].COMPANY_NAME);
                                e.data.set("responseDC.COMPANY_CONTACT", selComp[0].PRIMARY_CONTACT_NAME);
                                e.data.set("responseDC.COMPANY_EMAIL", selComp[0].PRIMARY_CONTACT_EMAIL);
                                e.data.set("responseDC.COMPANY_CITY", selComp[0].COMPANY_CITY);
                                e.data.set("responseDC.COMPANY_STATE", selComp[0].COMPANY_STATE);
                                e.data.set("responseDC.COMPANY_CELLPHONE", selComp[0].COMPANY_PHONE_NUMBER);
                                e.data.set("responseDC.COMPANY.COMPANY_NAME", selComp[0].COMPANY_NAME);
                                ////if (Globals.ActiveEvent.EVENT_TYPE == 'NRE_EVENT') {
                                ////    selComp.RMAG.RMAG_ID = selComp.HOME_RMAG;
                                ////    selComp.RMAG.RMAG_NAME = selComp.COMPANY_HOME_RMAG_NAME;
                                ////    $("COMPANY.RMAG", selComp.RMAG);
                                ////    row.children[2].innerText = selComp.COMPANY_HOME_RMAG_NAME;
                                ////}
                            }
                        },

                        onResponseRMAGChange: function (e) {
                            e.data.set("responseDC.COMPANY.RMAG.RMAG_NAME", e.sender.text());
                        },

                        onStatusChange: function (e) {
                            e.data.set("responseDC.STATUS.LU_NAME", e.sender.text());
                        },

                        onResponseTypeChange: function (e) {
                            var vm = e.data;
                            var type = e.sender._old;
                            e.data.set("responseDC.RESPONSE_TYPE.LU_NAME", e.sender.text());
                            nMartPage.setResponseTypeCascadedFields(type, vm);
                        },

                        onCompanyNonCompanyChange: function (e) {
                            var vm = e.data;
                            var type = e.sender._old;
                            var selCompID = vm.get("responseDC.COMPANY.COMPANY_ID");
                            if (type == 16 || type == 0) { //-- Non-company
                                vm.set("responseDC.COMPANY_NAME", "");
                                vm.set("responseDC.COMPANY_CONTACT", "");
                                vm.set("responseDC.COMPANY_EMAIL", "");
                                vm.set("responseDC.COMPANY_CITY", "");
                                vm.set("responseDC.COMPANY_STATE", "");
                                vm.set("responseDC.COMPANY_CELLPHONE", "");
                            }
                            else if (type == 15) { //-- company
                                selComp = jQuery.grep(that.UserCompaniesList.COMPANY, function (elm, index) {
                                    return elm.COMPANY_ID == selCompID;
                                });
                                if (selComp && selComp.length > 0) {
                                    selComp = selComp[0];
                                    vm.set("responseDC.COMPANY_NAME", selComp.COMPANY_NAME);
                                    vm.set("responseDC.COMPANY_CONTACT", selComp.PRIMARY_CONTACT_NAME);
                                    vm.set("responseDC.COMPANY_EMAIL", selComp.PRIMARY_CONTACT_EMAIL);
                                    vm.set("responseDC.COMPANY_CITY", selComp.COMPANY_CITY);
                                    vm.set("responseDC.COMPANY_STATE", selComp.COMPANY_STATE);
                                    vm.set("responseDC.COMPANY_CELLPHONE", selComp.COMPANY_PHONE_NUMBER);
                                }
                            }
                        }
                    });

                    if (viewModel.responseDC.RESPONSE_ID == 0) {
                        viewModel.isNew = true;
                        viewModel.responseDC.STATUS.LOOK_UP_ID = 1; //-- SUBMITTED
                        viewModel.responseDC.STATUS.LU_NAME = "Submitted"; //-- SUBMITTED
                        viewModel.responseDC.RESPONSE_TYPE.LOOK_UP_ID = 12; //-- RESPONSE
                        viewModel.responseDC.IS_COMPANY.LOOK_UP_ID = 15; //-- COMPANY
                    }
                    break;
                case 'Request':
                    viewModel = kendo.observable({
                        requestDC: that.getCachedDC(this.config.pageType),
                        RequestCompanies: that.UserCompaniesList.COMPANY,
                        RequestStatuses: StatusDS,
                        States: Globals.GetStates(),
                        isNew: false,
                        isChanged: false,

                        getRequestCompaniesCascadeRMAGS: function (afterLoad) {
                            var cascadeDataSource = new kendo.data.DataSource();
                            var selCompID = $("#ddlRequestCompany").data("kendoDropDownList").value();
                            var activeEvent = getCachedItem(CachedKeys.SELECTED_EVENT);
                            if (selCompID) {
                                var compRMAGS = null;
                                if (selCompID != "") {
                                    compRMAGS = jQuery.grep(that.UserCompaniesList.COMPANY, function (elem, index) {
                                        return elem.COMPANY_ID == selCompID;
                                    });

                                    if (compRMAGS && compRMAGS.length > 0) {
                                        if (activeEvent.EVENT_TYPE.LU_NAME == 'RMAG')
                                            cascadeDataSource.data(compRMAGS[0].COMPANYRMAGS);
                                        else if (activeEvent.EVENT_TYPE.LU_NAME == 'NRE')
                                            cascadeDataSource.data([{ RMAG_ID: compRMAGS[0].HOME_RMAG, RMAG_NAME: compRMAGS[0].COMPANY_HOME_RMAG_NAME }]);
                                    }
                                }
                            }

                            if (afterLoad) {
                                var ddlRMAG = $("#ddlRMAG").data("kendoDropDownList");
                                ddlRMAG.setDataSource(cascadeDataSource);
                                if (activeEvent.EVENT_TYPE.LU_NAME == 'NRE')
                                    ddlRMAG.select(0);
                                ddlRMAG.trigger("change");  //-- select() doesn't update model
                            }
                            else
                                return cascadeDataSource;
                        },
                        onRequestCompanyChange: function (e) {
                            this.getRequestCompaniesCascadeRMAGS(true);
                            var dsResComps = e.sender.dataSource.data();
                            var selComp = jQuery.grep(dsResComps, function (elem, index) {
                                return elem.COMPANY_ID == e.sender._old;
                            });
                            if (selComp.length > 0) {
                                e.data.set("requestDC.COMPANY_NAME", selComp[0].COMPANY_NAME);
                                e.data.set("requestDC.COMPANY_CONTACT", selComp[0].PRIMARY_CONTACT_NAME);
                                e.data.set("requestDC.COMPANY_EMAIL", selComp[0].PRIMARY_CONTACT_EMAIL);
                                e.data.set("requestDC.COMPANY_CITY", selComp[0].COMPANY_CITY);
                                e.data.set("requestDC.COMPANY_STATE", selComp[0].COMPANY_STATE);
                                e.data.set("requestDC.COMPANY_CELLPHONE", selComp[0].COMPANY_PHONE_NUMBER);
                                e.data.set("requestDC.COMPANY.COMPANY_NAME", selComp[0].COMPANY_NAME);
                                ////if (Globals.ActiveEvent.EVENT_TYPE == 'NRE_EVENT') {
                                ////    selComp.RMAG.RMAG_ID = selComp.HOME_RMAG;
                                ////    selComp.RMAG.RMAG_NAME = selComp.COMPANY_HOME_RMAG_NAME;
                                ////    $("COMPANY.RMAG", selComp.RMAG);
                                ////    row.children[2].innerText = selComp.COMPANY_HOME_RMAG_NAME;
                                ////}
                            }
                        },

                        onRequestRMAGChange: function (e) {
                            e.data.set("requestDC.COMPANY.RMAG.RMAG_NAME", e.sender.text());
                        },
                        onStatusChange: function (e) {
                            this.requestDC.STATUS = this.requestDC.STATUS_LU.LOOK_UP_ID;
                            e.data.set("requestDC.STATUS_LU.LU_NAME", e.sender.text());
                        }
                    });
                    if (viewModel.requestDC.REQUEST_ID == 0) {
                        viewModel.isNew = true;
                        viewModel.requestDC.STATUS_LU.LOOK_UP_ID = 1; //-- SUBMITTED
                        viewModel.requestDC.STATUS_LU.LU_NAME = "Submitted"; //-- SUBMITTED
                        viewModel.requestDC.STATUS = viewModel.requestDC.STATUS_LU.LOOK_UP_ID;
                    }
                    break;
            }
            viewModel.bind("change", function (e) {
                this.isChanged = true;
            });
        }
        catch (e) {
            dfd.reject(e);
        }
        this.viewModel = viewModel;
        dfd.resolve(viewModel);
        return dfd.promise();
    };

    this.getCachedDC = function (type) {
        var dc = getCachedItem(CachedKeys.SELECTED_ENTITY_OBJECT);
        switch (type) {
            case 'Response':
                if (dc.RELEASE_DATE)
                    dc.RELEASE_DATE = ConvertFromUTCToLocal(dc.RELEASE_DATE);
                if (dc.RELEASE_ROLE)
                    dc.RELEASE_ROLE = ConvertFromUTCToLocal(dc.RELEASE_ROLE);
                break;
            case 'Request':
                if (dc.LATEST_TARGET_ARRIVAL)
                    dc.LATEST_TARGET_ARRIVAL = ConvertFromUTCToLocal(dc.LATEST_TARGET_ARRIVAL);
                break;
        }
        return dc;
    };


    this.updateViewModelExplicitly = function (elem, viewModel) {
        var data_bind = $(elem).data("bind");
        var DC = data_bind.substr(data_bind.indexOf(":") + 1, (data_bind.indexOf(".") - (data_bind.indexOf(":") + 1)));
        var DC_field = data_bind.substr(data_bind.indexOf(".") + 1);
        viewModel[DC][DC_field] = $(elem).val();
        viewModel.isChanged = true;
    };

    this.createControls = function () {
        var vmaskerInterval = setInterval(function () {
            var txtCompany_CellPhone = document.getElementById("txtCOMPANY_CELLPHONE");
            if (txtCompany_CellPhone) {
                VMasker(txtCompany_CellPhone).maskPattern('(999) 999-9999');
                clearInterval(vmaskerInterval);
            }
        }, 500);
        $("#txtCOMPANY_CELLPHONE").on("keyup", function (e) {
            nmartPage.viewModel.isChanged = true;
            nmartPage.updateViewModelExplicitly(this, nmartPage.viewModel);
        });
        /*-$("#txtCOMPANY_CELLPHONE").kendoMaskedTextBox({
            mask: "(999) 000-0000",
            change: function () {
                //var selRow = $("#grid1").data("kendoGrid").dataItem(this.element.closest("tr"));
                //selRow.get().dirty = true;
            }
        });*/
        $("#txtDescription, #txtNumericRESOURCE_TYPE_DESCRIPTION, #txtCOMPANY_NAME, #txtCOMPANY_CONTACT, #txtCOMPANY_EMAIL, #txtCOMPANY_CITY").on("keyup", function (e) {
            nmartPage.viewModel.isChanged = true;
            if (MaxLengthExceeded($(this))) {
                nmartPage.updateViewModelExplicitly(this, nmartPage.viewModel);
                e.preventDefault();
                return false;
            }
        });
        $("#txtDescription, #txtNumericRESOURCE_TYPE_DESCRIPTION, #txtCOMPANY_NAME, #txtCOMPANY_CONTACT, #txtCOMPANY_EMAIL, #txtCOMPANY_CITY").on("paste", function (e) {
            nmartPage.viewModel.isChanged = true;
            var that = $(this);
            var pasteInterval = setInterval(function () {
                if (that.val().length > 0) {
                    clearInterval(pasteInterval);
                    MaxLengthExceeded(that);
                    nmartPage.updateViewModelExplicitly(that, nmartPage.viewModel);
                }
            }, 300);

        });

        $("#dtExpectedRelease").kendoDateTimePicker({
            timeFormat: "HH:mm",
            format: "MM/dd/yyyy HH:mm",
            interval: 60,
            change: function () {
                var selValue = this.value();
                if ((new Date(selValue)).getHours() == 0 && (new Date(selValue)).getMinutes() == 0)
                    nmartPage.viewModel.set("responseDC.RELEASE_DATE", ConvertFromUTCToLocal(ConvertToUTCFormat(new Date(selValue).setHours(06))));
            }
        });
        $("#dtReleaseToRoll").kendoDateTimePicker({
            timeFormat: "HH:mm",
            format: "MM/dd/yyyy HH:mm",
            interval: 60,
            change: function () {
                var selValue = this.value();
                if ((new Date(selValue)).getHours() == 0 && (new Date(selValue)).getMinutes() == 0)
                    nmartPage.viewModel.set("responseDC.RELEASE_ROLE", ConvertFromUTCToLocal(ConvertToUTCFormat(new Date(selValue).setHours(06))));
            }
        });
        $("#dtLatestTargetArrival").kendoDateTimePicker({
            timeFormat: "HH:mm",
            format: "MM/dd/yyyy HH:mm",
            interval: 60,
            change: function () {
                var selValue = this.value();
                if ((new Date(selValue)).getHours() == 0 && (new Date(selValue)).getMinutes() == 0)
                    nmartPage.viewModel.set("requestDC.LATEST_TARGET_ARRIVAL", ConvertFromUTCToLocal(ConvertToUTCFormat(new Date(selValue).setHours(06))));
            }
        });

        $("[data-role='datetimepicker']").on('keydown', function () { nmartPage.viewModel.isChanged = true; });
        $(".lv-detail-value, input, select").on("click", function (e) {
            popupNotification.hide();
        });
    };
    this.setDefaults = function () {
        $("#divFooterNavigation").hide();
        switch (this.config.pageType) {
            case 'Response':
                    var responseType = $("#ddlResponseType").data("kendoDropDownList").value();
                    nMartPage.setResponseTypeCascadedFields(responseType, this.viewModel);
                    this.viewModel.isChanged = false;
                    $("#divFooterNavigation").show();
                break;
                case 'Request':
                    $("#divFooterNavigation").show();
                break;
        }
        this.defaultsApplied = true;
    };

    this.validate = Validate;

    this.save = function () {
        var isNew = false;
        var dc = null;
        var id = 0;
        switch (this.config.pageType) {
            case 'Response':
                dc = this.viewModel.get("responseDC");
                isNew = dc.RESPONSE_ID == 0 ? true : false;
                id = dc.RESPONSE_ID;
                break;
            case 'Request':
                dc = this.viewModel.get("requestDC");
                isNew = dc.REQUEST_ID == 0 ? true : false;
                id = dc.REQUEST_ID;
                break;
        }
        if (isNew)
            dc.CREATED_BY = Globals.CurrentUser.USER_ID;

        dc.MODIFIED_BY = Globals.CurrentUser.USER_ID;
        dc.COMPANY_ID = dc.COMPANY.COMPANY_ID;
        dc.RMAG_ID = dc.COMPANY.RMAG.RMAG_ID;
        dc.COMPANY_STATE = dc.COMPANY_STATE ? dc.COMPANY_STATE.ST_STATE : '';
        dc.TIMEZONE_MODIFIED_ON = moment.utc().format('MM/DD/YYYY HH:mm:ss.sss');
        dc.TIMEZONE_RELEASE_DATE = ConvertToUTCFormat(dc.RELEASE_DATE);
        dc.TIMEZONE_RELEASE_ROLE = ConvertToUTCFormat(dc.RELEASE_ROLE);
        dc.LATEST_TARGET_ARRIVAL = ConvertToUTCFormat(dc.LATEST_TARGET_ARRIVAL);

        dc.EVENT_ID = getCachedItem(CachedKeys.SELECTED_EVENT).EVENT_ID;
        this.checkActiveEventFromDB(dc.EVENT_ID);
        if (Globals.isActiveEventClosed == false) {
            var updatedData = [];
            var api = '';
            updatedData.push(dc);
            if (isNew)
                api = this.config.schema.entity + "/" + this.config.schema.httResources.create;
            else
                api = this.config.schema.entity + "/" + this.config.schema.httResources.update;

            this.showLoading(true);
            Globals.Post(api, JSON.stringify(updatedData), false).then(function (result) {
                if (lastSearchedData != null && dc) {
                    if (id == 0) {  //-- insert
                        //////dc[pageConfig.schema.modelIDColumn] = result;
                        //////lastSearchedData.unshift(dc);
                    }
                    else {  //-- update
                        var statusID = dc.STATUS_LU ? dc.STATUS_LU.LOOK_UP_ID : dc.STATUS.LOOK_UP_ID;
                        if (statusID != SearchParams.data.Status)
                            DeleteLocalSearchedData(id);
                        else
                            UpdateLocalSearchedData(id, dc);
                    }
                }
                nmartPage.showLoading(false);
                app.navigate('#responseView?type=' + nmartPage.config.pageType);
                popupNotification.show(Globals.SaveMessage, notifyType.SUCCESS);
            }).fail(function (e) {
                nmartPage.showLoading(false);
                var optionSuccess = true;
                if (e.responseText && e.responseText.indexOf("Record(s) could not be updated since it has been edited by another user") > -1) {
                    e.responseText = e.responseText.replace("Record(s) could", "Record can").substr(0, (e.responseText.indexOf("<br>") - 3));
                    var parameters = { "id": id };
                    Globals.Get((pageConfig.schema.entity + "/Get"), parameters, false).then(function (result) {
                        if (result != null && result.objResult != null) {
                            if (CheckRecordDeleted(id, result.objResult))
                                optionSuccess = false;
                            else {
                                UpdateLocalSearchedData(id, result.objResult);
                                app.navigate(('#responseView?type=' + nmartPage.config.pageType));
                            }
                        }
                    }).fail(onError);
                }
                if (optionSuccess)
                    onError(e);
            });
        }
    };

    this.checkActiveEventFromDB = function (eventID) {
        var param = { id: eventID };
        var api = "Events/Get";
        Globals.Get(api, param, false).then(function (result) {
            if (result.objResult) {
                if (result.objResult.STATUS.LOOK_UP_ID == "40") { //--CLOSED
                    Globals.isActiveEventClosed = true;
                    alert(Globals.ClosedEventMessage);
                    window.location.reload();
                }
                else
                    Globals.isActiveEventClosed = false;
            }
        });
    };

    this.delete = function (obj) {
        var id = 0;
        var updatedData = [];
        var apiUri = this.config.schema.entity + "/" + this.config.schema.httResources.delete;
        updatedData.push(obj);
        switch (this.config.pageType) {
            case 'Response':
                id = obj.RESPONSE_ID;
                break;
            case 'Request':
                id = obj.REQUEST_ID;
                break;
        }
        this.showLoading(true);
        Globals.Post(apiUri, JSON.stringify(updatedData), false).then(function (result) {
            DeleteLocalSearchedData(id);
            nmartPage.showLoading(false);
        }).fail(function (e) {
            nmartPage.showLoading(false);
            onError(e);
        });
    };

    this.checkDuplicateRequest = function (objDirty) {
        var dfdDuplicate = new jQuery.Deferred();
        var parameters = {
            "EVENT_ID": objDirty.EVENT_ID,
            "requestID": objDirty.REQUEST_ID,
            "companyName": objDirty.COMPANY.COMPANY_NAME,
            "status": objDirty.STATUS_LU.LOOK_UP_ID
        };
        var apiUrl = pageConfig.schema.entity + "/CheckDuplicate";
        this.showLoading(true);
        Globals.Get(apiUrl, parameters, true).then(function (data) {
            apiUrl = "";
            nmartPage.showLoading(false);
            dfdDuplicate.resolve(data);
        }).fail(function (e) {
            nmartPage.showLoading(false);
            dfdDuplicate.reject(e);
            onError(e);
        });
        return dfdDuplicate.promise();
    };
};
nMartPage.setResponseTypeCascadedFields = function (type, vm) {
    var ddlHoldReason = $("#ddlHoldReason").data("kendoDropDownList");
    var dtExpectedRelease = $("#dtExpectedRelease").data("kendoDateTimePicker");
    var dtReleaseToRoll = $("#dtReleaseToRoll").data("kendoDateTimePicker");
    if (type == 13) {  //-- HOLD
        vm.set("responseDC.RELEASE_ROLE", null);
        dtReleaseToRoll.enable(false);
        dtReleaseToRoll.element[0].value = "";
        $(dtReleaseToRoll.element[0]).closest(".lv-detail-value").removeClass("HighlightReqField");

        ddlHoldReason.enable(true);
        dtExpectedRelease.enable(true);
    }
    else {
        vm.set("responseDC.HOLD_REASON.LOOK_UP_ID", null);
        vm.set("responseDC.HOLD_REASON.LU_NAME", "");
        vm.set("responseDC.RELEASE_DATE", null);
        ddlHoldReason.enable(false);
        dtExpectedRelease.enable(false);
        dtExpectedRelease.element[0].value = "";
        $(dtExpectedRelease.element[0]).closest(".lv-detail-value").removeClass("HighlightReqField");

        dtReleaseToRoll.enable(true);
    }
};

var SearchParams = new function () {
    this.pageType = '';
    this.isResetPressed = false;
    this.data = { EventID: null, EventName: '', EventTimeZone: '', Status: 1, CalculationRun: '', COMPANY_NAME:'' };
    this.refresh = function (newObj, type) {
        switch (type) {
            case "event":
                if (newObj) {
                    this.data.EventID = newObj.EVENT_ID;
                    this.data.EventName = newObj.EVENT_NAME;
                    this.data.EventTimeZone = newObj.TIME_ZONE.LU_NAME;
                }
                break;
            case "search":
                if (newObj) {
                    this.data.EventID = newObj.EVENT_ID;
                    this.data.Status = newObj.status;
                    this.data.CalculationRun = newObj.Calculation_Run;
                    this.data.COMPANY_NAME = newObj.COMPANY_NAME;
                }
                break;
        }
    };
    this.purge = function () {
        this.data.EventID = null;
        this.data.EventName = '';
        this.data.EventTimeZone = '';
        this.data.Status = 1;
        this.data.CalculationRun = '';
        this.isResetPressed = false;
    };
};