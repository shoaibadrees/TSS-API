var listPageSize = 10;
var FilterOperatores = {
    equalTo: "eq",
    notEqualTo: "neq",
    isNull: "isnull",
    notNull: "isnotnull",
    lessThan: "lt",
    lessThanEqual: "lte",
    greaterThan: "gt",
    greaterThanEqual: "gte",
    startsWith: "startswith",
    endsWith: "endswith",
    contains: "contains",
    isEmpty: "isempty",
    notEmpty: "isnotempty"
};

var previousView = '';

var pageConfig = null;
var nmartPage = null;

var CachedKeys = {
    CURRENT_USER: "currentUser",
    SELECTED_EVENT: "selectedEvent",
    SELECTED_ENTITY_OBJECT: "selectedEntityObject",
    EMPTY_ENTITY_OBJECT: "emptyEntityObject",
    USER_COMPANIES_LIST: "userCompaniesList"
};

function ValidationResult() {
    var objVR = { result: true, summary: '', msgDefault: 'Highlighted fields are required.', msg: [] };

    objVR.addMessage = function (msg) {
        if (msg)
            this.msg.push(msg);
    };
    objVR.getMessage = function () {
        var msg = '';
        for (i = 0; i < this.msg.length; i++)
            msg += msg.indexOf(this.msg[i]) == -1 ? this.msg[i] + ' <br/>' : '';
        return msg;
    };
    return objVR;
};
function DTO() {
    return {
        sender: "self",
        id: null,
        param: {}
    };
}
function getCachedItem(key) {
    var value = sessionStorage.getItem(key) ? JSON.parse(sessionStorage.getItem(key)) : null;
    return value;
}

function setCachedItem(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value));
}

function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}
function toggle(a, b) {
    return _.indexOf(a, b) == -1 ? _.union(a, [b]) : _.without(a, b);
}
function getTimeZoneSpecificDate(data, fieldName) {
    //-- converted string to moment to get date object without timezone addition/subs. 
    var result = '';
    if (data[fieldName]) {
        var dtPat = 'MM/dd/yyyy HH:mm';
        switch (fieldName) {
            case 'START_DATE': result = kendo.toString(TimeZoneSpecificDate(moment(data.START_DATE).toDate(), data.TIME_ZONE.LU_NAME, data.DST_APPLIED_START_DATE), dtPat); break;
            case 'CLOSED_ON': result = kendo.toString(TimeZoneSpecificDate(moment(data.CLOSED_ON).toDate(), data.TIME_ZONE.LU_NAME, data.DST_APPLIED_START_DATE), dtPat); break;
            case 'CALCULATION_RUN': result = kendo.toString(TimeZoneSpecificDate(moment(data.CALCULATION_RUN).toDate(), data.EVENT_TIME_ZONE_NAME, data.DST_APPLIED_CALCULATION_RUN), dtPat); break;
            case 'LATEST_TARGET_ARRIVAL': result = kendo.toString(TimeZoneSpecificDate(moment(data.LATEST_TARGET_ARRIVAL).toDate(), data.EVENT_TIME_ZONE_NAME, data.DST_APPLIED_LATEST_TARGET_ARRIVAL), dtPat); break;
            case 'MODIFIED_ON': result = kendo.toString(TimeZoneSpecificDate(moment(data.MODIFIED_ON).toDate(), data.EVENT_TIME_ZONE_NAME, data.DST_APPLIED_MODIFIED_ON), dtPat); break;
            case 'RELEASE_DATE': result = kendo.toString(TimeZoneSpecificDate(moment(data.RELEASE_DATE).toDate(), data.EVENT_TIME_ZONE_NAME, data.DST_APPLIED_RELEASE_DATE), dtPat); break;
            case 'RELEASE_ROLE': result = kendo.toString(TimeZoneSpecificDate(moment(data.RELEASE_ROLE).toDate(), data.EVENT_TIME_ZONE_NAME, data.DST_APPLIED_RELEASE_ROLE), dtPat); break;
            case 'CREATED_ON': result = kendo.toString(TimeZoneSpecificDate(moment(data.CREATED_ON).toDate(), data.TIME_ZONE.LU_NAME, data.DST_APPLIED_CREATED_ON), dtPat); break;
        }
    }
    return result;
}

function getTimeZoneSpecificCalculationRun(value) {
    var tzDate = '';
    var ddlCalcRun = $("#ddlCalculationRun").data("kendoDropDownList");
    if (ddlCalcRun) {
        var ds = ddlCalcRun.dataSource.data();
        var selCalRun = _.find(ds, function (calrun) { return calrun.CALCULATION_RUN.indexOf(value) > -1; });
        if (selCalRun)
            tzDate = selCalRun.TIME_ZONE_CALCULATION_RUN;
    }
    return tzDate;
}

function CreateAccordions() {
    if ($(".km-listgroup").accordion("instance"))
        $(".km-listgroup").accordion("destroy");

    var icons = {
        header: "ui-icon-expand",
        activeHeader: "ui-icon-collapse"
    };
    $(".km-listgroup").accordion({
        active: false,
        icons: icons,
        collapsible: true,
        header: "div.km-group-title"
    }
            );
}

function ApplyFilter(dataSource, filterColumns, valueToMatch, listViewId, templateId) {
    if (dataSource != null) {
        $.each(filterColumns, function (index, item) {
            item.value = valueToMatch;
            if (item.field == "CALCULATION_RUN" && !IsValidDate(valueToMatch)) {
                filterColumns.splice(index, 1);
            }
        });
        if (IsValidDate(valueToMatch)) {
            filterColumns.push({
                field: "CALCULATION_RUN",
                operator: function (item) {
                    if (!item)
                        return false;
                    var dtValue = new Date(valueToMatch);
                    dtValue = new Date(dtValue.getFullYear(), dtValue.getMonth(), dtValue.getDate(), 23, 59, 59);
                    if (moment(item).isSame(dtValue) || moment(item).isBefore(dtValue))
                        return true;
                    return false;
                }
            });
        }

        dataSource.filter({
            logic: "or",
            filters: filterColumns
        });
        $("#" + listViewId).kendoMobileListView({
            dataSource: dataSource,
            template: kendo.template((pageConfig ? pageConfig.templates.LIST : $("#" + templateId).text())),
        });
    }
}


function IsValidDate(value) {
    var isValid = false;
    isValid = moment(value, "MM/DD/YYYY", true).isValid();
    if (!isValid)
        isValid = moment(value, "M/D/YYYY", true).isValid();
    return isValid;
}

var newViewID = '';
function onBeforeShowView(e) {
    popupNotification.hide();
    newViewID = e.view.id;
}

function onBeforeHideView(e) {
    destroyView(e);
}

function destroyView(e) {
    if (e.view.id != newViewID) {
        var page = jQuery("#" + e.view.element[0].id);
        var pageSearchFilter = jQuery("#searchFilterView");
        var pageUpdateView = jQuery("#updateView");
        var filterOps = jQuery("#filterOps");

        if (page.attr('data-cache') == 'false') {
            page.remove();
            pageSearchFilter.remove();
            pageUpdateView.remove();
            filterOps.remove();
        };
    }
};


function DisplayPulledCounts(total, pulledRecords) {
    if (pulledRecords == null || pulledRecords == undefined)
        pulledRecords = $(".List-View").length;
    $('#pullCount').text('(' + pulledRecords + ' of ' + total + ')');
}

function GroupItemClick(e) {
    lastSelectedGroup = $(e.item[0]).data("field");
    if (e.item[0].id != "liListView") {
        $("#lblSelectedGroup").html(e.item[0].innerText);
    }
    else {
        lastSelectedGroup = undefined;
    }
    GroupChange($(e.item[0]).data("field"));
    SetSelectedGroupItem(e.item[0]);
    var popover = e.sender.element.closest('[data-role=popover]').data('kendoMobilePopOver');
    popover.close();
}

function GroupChange(id) {
    if (id == "liListView") {
        groupBy = undefined;
        $("#btnFilter").removeClass("ActiveButton");
        $("#search").show();
        $("#divSelectedGroup").hide();
    }
    else {
        $("#btnFilter").addClass("ActiveButton");
        $("#search").hide();
        $("#divSelectedGroup").show();
        groupBy = id;
    }
    var groupedDS = GetOfflineDS(groupBy);
    if (groupBy == "CALCULATION_RUN")
        $("#listView").kendoMobileListView({
            dataSource: groupedDS,
            template: kendo.template((pageConfig ? pageConfig.templates.LIST : $("#listViewTemplate").text())),
            headerTemplate: kendo.template(pageConfig.templates.GROUP_HEADER)
        });
    else
        $("#listView").kendoMobileListView({
            dataSource: groupedDS,
            template: kendo.template((pageConfig ? pageConfig.templates.LIST : $("#listViewTemplate").text()))
        });
    // CreateAccordions();
}

function activateSearchFilter() {

    if (lastSearchedData && lastSearchedData != null) {
        var toFind = $("#search").val();
        var filteredDS = GetOfflineDS();
        ApplyFilter(filteredDS, (pageConfig ? pageConfig.filterColumns : filterColumns), toFind, 'listView', 'listViewTemplate');
    }
}

function checkNull(val, defaultval) {
    if (val)
        return val;
    return defaultval;
}

function checkDateNull(date, timezone) {
    if (date)
        return date + ' ' + timezone;
    return '';
}

function getFirstChar(val) {
    if (val)
        return val.substring(0, 1);
    return '';
}

function SetSelectedGroupItem(item) {
    var allItems = '';
    var selItem = '';
    if (item) {
        allItems = $(item).closest("ul").find("li");
        selItem = $(item);
    }
    else {
        allItems = $("#filterOps li");
        selItem = $(allItems).filter(":last")
    }
    allItems.removeClass("selected-item");
    selItem.addClass("selected-item");
}

function onNumericTextBoxFocus(elem) {
    elem.value = RemoveCommaInNumber(elem.value);
    MaxLengthExceeded(elem);
}

function onNumericTextBoxBlur(elem) {
    elem.value = elem.value.replace(/[^0-9]/g, '');
    elem.value = AddCommaInNumber(elem.value);
}

function onNumericTextBoxKeyUp(elem) {
    if (MaxLengthExceeded(elem)) {
        nmartPage.updateViewModelExplicitly(elem, nmartPage.viewModel);
        return false;
    }
    var regex = /^[0-9]$/;
    var str = $(elem).val();
    if (!regex.test(str.substr(str.length - 1))) {
        if (str.length > 0)
            $(elem).val(str.substr(0, (str.length - 1)));
        else
            $(elem).val();
    }
}

function AddCommaInNumber(value) {
    var components = value.toString().split(".");
    components[0] = components[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return components.join(".");
}

function RemoveCommaInNumber(value) {
    var components = value.toString().split(".");
    components[0] = components[0].replace(/,/g, "");
    return components.join(".");
}

function MaxLengthExceeded(elem) {
    var inputLength = $(elem).val().length;
    var maxlimit = $(elem).data("maxlength");
    if (inputLength >= maxlimit) {
        $(elem).val($(elem).val().substr(0, maxlimit));
        return true;
    }
    return false;
}

function onError(e) {
    var msg = e.message || e.responseText || e.statusText;
    if (msg.indexOf("NetworkError") > -1 || msg.indexOf("error") > -1 || msg.indexOf("network-related or instance-specific error") > -1)
        msg = "Please check your internet connection.";
    if(!msg)
        msg = "An error has been occurred, please contact administrator.";
    popupNotification.show(msg, notifyType.ERROR);
}

function ToggleTopSection(state) {

    if (state == true) {
        $("#search, #navAppDrawer,#pullCount").show();
        $("#navBackButton").hide();
        $("#btnShowFilterView,#btnFilter, #btnAdd").css("visibility", "visible");
        $("#btnEdit").addClass("hide");
        $("#btnDelete").addClass("hide");
    }
    else {
        $("#search, #navAppDrawer,#pullCount").hide();
        $("#navBackButton").show();
        $("#btnShowFilterView,#btnFilter, #btnAdd").css("visibility", "hidden");
        $("#btnEdit").removeClass("hide");
        $("#btnDelete").removeClass("hide");
    }
}
function createCookie(name, value) {
    try {
        var minutesToAdd = (AppSettings.SessionTimeout / 1000) / 60;
        if (minutesToAdd && minutesToAdd != null && minutesToAdd != "" && minutesToAdd > 0) {
            var date = new Date();
            date.setMinutes(date.getMinutes() + minutesToAdd);
            var expires = "; expires=" + date.toUTCString();
            document.cookie = name + "=" + value + expires + ";";
            CheckSessionTimeout();
        }
    } catch (e) {
    }
}
function CheckSessionTimeout() {
    setTimeout(function () {
        var timeoutCookie = document.cookie;
        if (timeoutCookie == null || timeoutCookie == "") {
            alert("Due to inactivity, your session is timed out. All your unsaved work will be lost.");
            Globals.MobileLogout();
        }
        else
            CheckSessionTimeout();

    }, 60000);
}
function Validate() {
    var vr = new ValidationResult();
    $(".lv-detail-value input,.lv-detail-value select").each(function (index, input) {
        var valResult = true;
        var value = '';
        var text = null;
        if ($(input).data('required-field') == 'required' && $(input).attr('disabled') != 'disabled' && input.id != '' && input.id != null) {
            if ($(input).data('role') == 'dropdownlist') {
                value = $("#" + input.id).data("kendoDropDownList").value();
                text = $("#" + input.id).data("kendoDropDownList").text();
            }
            else
                value = $(input).val();
            if (value == null || value == "" || value == "0" || (text != null && text == ""))
                valResult = false;
        }
        if ($(input).data('role') == 'datetimepicker' && $("#" + input.id).val() != "") {
            value = $("#" + input.id).data("kendoDateTimePicker").value();
            if (value == null || value == "")
                valResult = false;
        }
        if ($(input).data('pattern')) {
            var pattern = new RegExp($(input).data('pattern'));
            var val = $(input).val();
            if (val)
                valResult = pattern.test(val.toLowerCase());
        }
        if (valResult == false) {
            vr.addMessage($(input).data('rule-message') || vr.msgDefault);
            vr.summary += "</br>" + $(input).attr("name");

            if ($("#" + input.id).closest(".lv-detail-value").length > 0) {
                $("#" + input.id).closest(".lv-detail-value").addClass("HighlightReqField");
            }
            else {
                $("#" + input.id).addClass("HighlightReqField");
            }
            $("#" + input.id).closest(".lv-detail-value").on("click", function (e) {
                $(this).removeClass("HighlightReqField");
                popupNotification.hide();
            });
        }
    });
    vr.result = (vr.summary == '');
    return vr;
}
function globalBackButtonClick() {
    app.navigate("#:back");
}

function HandleConcurrencyError(e, dirtyID, apiRoute, appRoute) {
    e.responseText = e.responseText.replace("Record(s) could", "Record can").substr(0, (e.responseText.indexOf("<br>") - 3));
    var parameters = { "id": dirtyID };
    Globals.Get(apiRoute, parameters, false).then(function (result) {
        if (result != null && result.objResult != null && !CheckRecordDeleted(dirtyID, result.objResult)) {
            UpdateLocalSearchedData(dirtyID, result.objResult);
        }
    }).fail(onError);
    app.navigate(appRoute);
}

function RemovePullToRefresh() {
    var spnPullToRefresh = $("div.km-content div.km-scroll-container span.km-scroller-pull");
    if (spnPullToRefresh.length > 0)
        spnPullToRefresh.remove();
}


function NavigateSteps(action) {
    var tabStrip = $("#tabstrip").getKendoTabStrip() || $("#tabstripResponse").getKendoTabStrip();
    var currentTabIndex = tabStrip.select().index();
    if (action == "next") {
        tabStrip.select(currentTabIndex + 1);
    }
    if (action == "pre") {
        tabStrip.select(currentTabIndex - 1);
    }
}
function SetFooterNavigationVisibility(currentTabIndex) {
    currentTabIndex++;
    var tabStrip = $("#tabstrip").getKendoTabStrip() || $("#tabstripResponse").getKendoTabStrip();
    var totalTabls = tabStrip.items().length;
    if (currentTabIndex < totalTabls) {
        $("#btnNextStep").show();
    }
    else {
        $("#btnNextStep").hide();
    }

    if (currentTabIndex > 1) {
        $("#btnPreviousStep").show();
    }
    else {
        $("#btnPreviousStep").hide();
    }
    
    var viewElement = $("#updateView").data("kendoMobileView");
    if (viewElement) {
        //var scrollerElement = viewElement.scroller;
        //if (scrollerElement) {
        //    scrollerElement.reset();
        //}
        ResetViewScroller(viewElement);
    }
}

function AdjustTabStripHeight(tabStripID) {
    var tabStripInvt = setInterval(function () {
        var tabStrip = $("#" + tabStripID);
        var activeTabContainer = tabStrip.children(".k-content.k-state-active");
        if (activeTabContainer && (activeTabContainer[0].style.height == "auto" || activeTabContainer[0].style.height == "")) { //-- some timeout script set this value                       
            if (window.orientation == 90 || window.orientation == -90) { ////if (window.matchMedia("(orientation: landscape)").matches)
                $(tabStrip).css("height", screen.width - 65 + "px");
                $(activeTabContainer).css("height", screen.width - 120 + "px").css("overflow", "auto");
            }
            else {
                $(tabStrip).css("height", screen.height - 65 + "px");
                $(activeTabContainer).css("height", screen.height - 120 + "px").css("overflow", "auto");
            }
            clearInterval(tabStripInvt);
            tabStripInvt = null;
        }
    }, 200);
}
function InitView(e) {
    if (e && e.view && e.view) {
        ResetViewScroller(e.view);
    }
}
function ResetViewScroller(view) {
    if (view && view.scroller && view.scroller.reset) {
        view.scroller.reset();
    }
}
function GetDefaultDateTimePickerValue() {
    // As per client's feedback defualt Time should be set to 06:00
    var defualtTime = new Date();
    defualtTime.setHours(6);
    defualtTime.setMinutes(0);
    return defualtTime;
}