var isnotificaitonpanelopen = false;
var firsttime = true;
var sortorderCOMPANY = "asc";
function ShowHideMainMenu() {
    $(".alert-box .close, .alert-boxpopup .close").click();
    if (false == $('#MainMenu').is(':visible')) {
        if ($('#BodyContentContainer').css("left") == "370px") {
            $('#lnksidebar').trigger('click');
        }
        $('#MainMenu').show();
        $('.notification ul li:last-child').addClass('left-right');
    }
    else {
        $('#MainMenu').hide();
        $('.notification ul li:last-child').removeClass('left-right');
    }
}

function HideMainMenu() {
    $('#MainMenu').hide();
    $('.notification ul li:last-child').removeClass('left-right');
}
function selectCompany() {
    if (IsPreStagingClick == true) {
        ShowHideCompany('show');
        ShowHideRMag('hide');
        ShowHideEmpty('hide');
    }
}

function selectRmag() {
    if (IsPreStagingClick == true) {
        ShowHideCompany('hide');
        ShowHideRMag('show');
        ShowHideEmpty('hide');
    }
}

function ShowHideCompany(Status) {
    if (Status == 'hide') {
        $('#Company').hide();
        $('#Company2').hide();
        $('#Company3').hide();
        $('#Company4').hide();
        $('#Company5').hide();
        $('#Company6').hide();
    }
    else {
        $('#Company').show();
        $('#Company2').show();
        $('#Company3').show();
        $('#Company4').show();
        $('#Company5').show();
        $('#Company6').show();
    }

}

function ShowHideRMag(Status) {
    if (Status == 'hide') {
        $('#Rmag1').hide();
        $('#Rmag2').hide();
    }
    else {
        $('#Rmag1').show();
        $('#Rmag2').show();
    }

}

function ShowHideEmpty(Status) {
    if (Status == 'hide') {
        $('#Empty1').hide();
        $('#Empty2').hide();
        $('#EmptySummary').hide();
    }
    else {
        $('#Empty1').show();
        $('#Empty2').show();
        $('#EmptySummary').show();
    }

}

function selectCalculation() {
    if ($("#Calculation option:selected").val() != "") {
        selectRmag();
    } else {
        ShowHideCompany('hide');
        ShowHideRMag('hide');
        ShowHideEmpty('show');
    }
}

function showRecord() {

    IsPreStagingClick = true;
    if ($("input[type='radio']:checked").val() == "1") {
        selectRmag();
        $('#Summary').show();

    } else {
        selectCompany();
    }
    ShowHideEmpty('hide');
    $('#EmptySummary').hide();


}

function Matchbegin() {
    if (confirm("Are you Sure?")) {
        $("#matchB").attr('href') = "matching.html";
        return true;
    } else {
        $("#matchB").attr('href') = "";
        return false;
    }
}

$(document).on("click", function (event) {
    var $target = $(event.target);
    var ngDialog = $('.ngdialog');
    if (ngDialog.length > 0) {
        if (!ngDialog.is($target) && ngDialog.has($target).length === 0) {
            event.stopImmediatePropagation();
        }
    }
    else {
        var MainMenu = $('#MainMenu');

        if ($target.hasClass("push-icon") == false && $target.hasClass("close") == false && !MainMenu.is($target) && MainMenu.has($target).length === 0) {
            HideMainMenu();
        }

        if ($target.hasClass("k-icon k-i-reload") ) {

            var scope = Globals.GetCurrentScope();
            if (scope) {
                if (Globals.isNewRowAdded == true || scope.grid.dataSource.hasChanges()) {
                    scope.handleFilterChange(null, 'refresh');
                }
                else {
                    scope.grid.dataSource.read();
                }
            }
        }
        if ($target.length > 0) {
            if ($target[0].parentElement != null) {
                if ($target[0].parentElement.attributes.length > 1) {                    
                    ///   Screen Manage Users company sorting
                    //if ($target[0].parentElement.getAttribute("data-field") == "USER_COMPANIES") {
                    //    if ($target[0].className == 'k-link') {                      
                    //        if (sortorderCOMPANY == "asc") {
                    //            $('#grid1').data('kendoGrid').dataSource.sort({ field: 'USER_COMPANIES_NAMES', dir: 'asc' });
                    //            $target.append("<span class='k-icon k-i-sort-asc-sm'></span>");
                    //            sortorderCOMPANY = "desc";
                    //        }
                    //        else {
                    //            $('#grid1').data('kendoGrid').dataSource.sort({ field: 'USER_COMPANIES_NAMES', dir: 'desc' });
                    //            $target.append("<span class='k-icon k-i-sort-desc-sm'></span>");
                    //            sortorderCOMPANY = "asc";
                    //        }
                    //    }

                    //}                   
                }
            }
            if ($('#grid1').length > 0) {
                if (typeof ($('#grid1').data('kendoGrid')) != 'undefined' && $('#grid1').data('kendoGrid') != null &&
                        $('#grid1').data('kendoGrid').dataSource && $('#grid1').data('kendoGrid').dataSource._sort.length > 0) {                 
                    //if ($('#grid1').data('kendoGrid').dataSource._sort[0].field == "USER_COMPANIES_NAMES") {
                    //    if ($('#grid1').data('kendoGrid').dataSource._sort[0].dir == "asc") {
                    //        $("[data-field='USER_COMPANIES']").find('a span.k-icon').remove();
                    //        $("[data-field='USER_COMPANIES']").find('a').append("<span class='k-icon k-i-sort-asc-sm'></span>");
                    //    }
                    //    else {
                    //        $("[data-field='USER_COMPANIES']").find('a span.k-icon').remove();
                    //        $("[data-field='USER_COMPANIES']").find('a').append("<span class='k-icon k-i-sort-desc-sm'></span>");
                    //    }
                    //} 
                    //    else if ($('#grid1').data('kendoGrid').dataSource._sort[0].field == "USER_COMPANIES") {
                    //        //$scope.arrowSorting = true;
                    //        //if (Globals.IsExportingData = false && $target[0].className == 'k-link') {                       
                    //        if (sortorderCOMPANY == "asc") {
                    //                $('#grid1').data('kendoGrid').dataSource.sort({ field: 'USER_COMPANIES_NAMES', dir: 'asc' });
                    //                $("[data-field='USER_COMPANIES']").find('a span.k-icon').remove();
                    //                $("[data-field='USER_COMPANIES']").find('a').append("<span class='k-icon k-i-sort-asc-sm'></span>");
                    //                sortorderCOMPANY = "desc";
                    //        }
                    //        else {
                    //                $('#grid1').data('kendoGrid').dataSource.sort({ field: 'USER_COMPANIES_NAMES', dir: 'desc' });
                    //                $("[data-field='USER_COMPANIES']").find('a span.k-icon').remove();
                    //                $("[data-field='USER_COMPANIES']").find('a').append("<span class='k-icon k-i-sort-desc-sm'></span>");
                    //                sortorderCOMPANY = "asc";
                    //            }
                    //        //$scope.arrowSorting = false;
                    //}
                }
            }

        }
    }
});



function GetTimezoneOffset(timezone) {
    if (timezone == 'Eastern')
        return '-05:00';
    else if (timezone == 'Central')
        return '-06:00';
    else if (timezone == 'Pacific')
        return '-08:00';
    else if (timezone == 'Mountain')
        return '-07:00';
}

function CalculateOffsetForTimezone(source, distination) {
    var offset = GetTimezoneOffset(distination) - GetTimezoneOffset(source);
    return offset;
}

//-- to avoid more bugs and conflicts on 'EVENTS' screen datetime will be handled in old way
function TimeZoneSpecificDate_Old(date, timezone, hasDST, adjlocal) {
    if (timezone != null && timezone != '' && date != '') {
        date = new Date(date);
        var timezoneoffset = GetTimezoneOffset(timezone);
        var localoffset = -(date.getTimezoneOffset() / 60);
        var adjustedDatetime;
        if (adjlocal != null) {
            if (adjlocal)
                adjustedDatetime = new Date(new Date(date)).setHours((new Date(date)).getHours() - localoffset);
            else
                adjustedDatetime = date;
        } else
            adjustedDatetime = date;
        if (hasDST == true) {
            return moment((new Date(new Date(adjustedDatetime)).setHours((new Date(adjustedDatetime)).getHours() + 1))).utcOffset(timezoneoffset).format('MM/DD/YYYY HH:mm');
        } else {
            return moment(new Date(adjustedDatetime)).utcOffset(timezoneoffset).format('MM/DD/YYYY HH:mm');
        }

    } else {
        if (date != '')
            return new Date(date);
        else
            return new Date();
    }
}


function TimeZoneSpecificDate(date, timezone, hasDST, adjlocal) {
    // date should be saved in UTC, on calendar it should be in client's Timezone
    //-- date = it shud be in utc format string
    var timezoneoffset = GetTimezoneOffset(timezone);
    timezoneoffset = timezoneoffset ? timezoneoffset : "";
    if (timezone != null && timezone != '' && date != '' && date != "Invalid date") {
        var localoffset = (new Date().getTimezoneOffset() / 60);
        var adjustedDatetime;
        if (adjlocal != null) {
            if (adjlocal)
                adjustedDatetime = new Date(new Date(date)).setHours((new Date(date)).getHours() - localoffset);
            else
                adjustedDatetime = date;
        } else
            adjustedDatetime = date;
        if (hasDST == true) {
            //-- when use moment.format() or date.setHours(), these altered datetime according to local browser's timezone
            var eventDT = moment.utc(moment(date)).utcOffset(timezoneoffset);
            eventDT.hours(eventDT.hours() + 1);
            return GetFormattedDateTime(eventDT._d);
        } else {
            var eventDT = moment.utc(moment(date)).utcOffset(timezoneoffset);
            if (moment.tz(eventDT, ("US/" + timezone)).isDST())  //-- in add case,to avoid 1 hour diff. bz DST rendered from server, 
                eventDT.hours(eventDT.hours() + 1);
            return GetFormattedDateTime(eventDT._d);
        }
    } else {
        if (date != '' && date != "Invalid date")
            return new Date(date);
        else
            return new Date();
    }
}

function ConvertToUTCFormat(date) {
    return date ? moment(date).utc().format("MM/DD/YYYY HH:mm:ss") : kendo.toString(date, 'MM/dd/yyyy  HH:mm:ss');
}

function ConvertFromUTCToLocal(date) {
    //-- apply format remove TZ info
    return moment.utc(moment(date).format("MM/DD/YYYY HH:mm")).toDate();
}

function CheckDateConvertedToLocal(date, isLocal) {
    return isLocal ? ConvertToUTCFormat(date) : kendo.toString(date, 'MM/dd/yyyy  HH:mm:ss');
}

function GetFormattedDateTime(date) {
    var formatted = (GetTwoDigitNumber(date.getMonth() + 1)) + "/"
                + GetTwoDigitNumber(date.getDate()) + "/"
                + date.getFullYear() + " "
                + GetTwoDigitNumber(date.getHours()) + ":"
                + GetTwoDigitNumber(date.getMinutes());
    return formatted;
}

function GetTwoDigitNumber(value) {
    return ("0" + value).slice(-2);
}

function GetTimeZonePostFix(timezone) {
    if (timezone == 'Eastern')
        return ' EST';
    else if (timezone == 'Central')
        return ' CEN';
    else if (timezone == 'Pacific')
        return ' PAC';
    else if (timezone == 'Mountain')
        return ' MNT';
    else
        return '';
}

function isDST(t) { //t is the date object to check, returns true if daylight saving time is in effect.
    var jan = new Date(t.getFullYear(), 0, 1);
    var jul = new Date(t.getFullYear(), 6, 1);
    return Math.min(jan.getTimezoneOffset(), jul.getTimezoneOffset()) == t.getTimezoneOffset();
}

function customNumberFormat(val) {
    if (val < 0)
        return '(' + kendo.toString(val, 'n0') + ')';
    else
        return kendo.toString(val, 'n0');
};

function setTooltipOnDropdownItems(dropdown) {
    if (dropdown) {
        $(dropdown.items()).each(function (index, item) {
            ////var model = $(dropdown).data("kendoDropDownList").dataItem(index);
            var txt = $.trim($(item).text());
            if (txt.toLowerCase() != "select" && txt.toLowerCase() != "all")
                $(item).attr("title", txt);
        });
    }
}

///-- This function set tooltip on Multiselect control for RMAG & COMPANY entity
///-- if datasource is not null then COMPANY will be set
///-- else RMAG will be applied
///-- it is because the selectedItems does not have COMPANY_NAME, only have COMAPNY_ID
function setTooltipOnMultiSelect(containerid, dataSource, selectedItems) {
    var elementSelector = '#' + containerid + ' .multiselect-parent';

    var toltipIntvlr = setInterval(function () {
        if ($(elementSelector).length > 0) {
            $('body').tooltip({
                selector: '.multiselect-parent',
                placement: 'bottom'
            });

            var tip = '';
            $.each(selectedItems, function (index, val) {

                var selitem = null;
                if (dataSource) {
                    selitem = _.find(dataSource, function (elm) {
                        return elm.COMPANY_ID == val.COMPANY_ID;
                    });
                    if (selitem)
                        selitem = selitem.COMPANY_NAME;
                }
                else
                    selitem = val.RMAG_NAME;

                if (selitem) {
                    if (tip == '')
                        tip = selitem;
                    else
                        tip = tip + ', ' + selitem;
                }
            });
            $(elementSelector).attr('data-original-title', tip);

            clearInterval(toltipIntvlr);
        }
    }, 1000);
}


var setTooltipOnMultiSelect = function (multiselectControlName, selectedList, displyProp) {
      var tooltipText = "";
      if (selectedList && selectedList.length > 0) {
        for (var i = 0; i < selectedList.length; i++) {
          tooltipText = tooltipText + selectedList[i][displyProp];
          if (i < selectedList.length - 1) {
            tooltipText = tooltipText + ', ';
          }
        }
      }
      else {
        tooltipText ="All"
      }
      $('#' + multiselectControlName).attr('title', tooltipText);
}


var getIDFromList = function (selectedList, IdFieldName) {
    var IDs = "";
    if (selectedList && selectedList.length > 0) {
        for (var i = 0; i < selectedList.length; i++) {
            IDs = IDs + selectedList[i][IdFieldName];
            if (i < selectedList.length - 1) {
                IDs = IDs + ',';
            }
        }
    }
    else {
        IDs = "All"
    }
    return IDs;
}

function isObjectExist(idColumnName, searchingVal, list) {
    for (var i = 0; i < list.length; i++) {
        if (list[i][idColumnName] === searchingVal) {
            return true;
        }
    }
    return false;
}

function YesNoTemplate(value) {
    if (value != null && value == 'Yes')
        return '<div class="tick-icon"></div>';//"<input type='checkbox' disabled='disabled' checked='checked' class='chkbx' />";
    else
        return '';//"<input type='checkbox' disabled='disabled' class='chkbx' />";
}

function ZeroOneTemplate(value) {
    if (value != null && value == 1)
        return '<div class="tick-icon"></div>';//"<input type='checkbox' disabled='disabled' checked='checked' class='chkbx' />";
    else
        return '';//"<input type='checkbox' disabled='disabled' class='chkbx' />";
}

var YesNoFilterTemplate = function (args) {
    // create a DropDownList of unique values (colors)
    args.element.kendoDropDownList({
        dataSource: [{ id: 'Yes', text: 'Yes' }, { id: 'No', text: 'No' }],
        dataTextField: "text",
        dataValueField: "id",
        valuePrimitive: true,
        optionLabel: " "
    });
}

var YNFilterTemplate = function (args) {
   // create a DropDownList of unique values (colors)
   args.element.kendoDropDownList({
      dataSource: [{ id: 'Y', text: 'Yes' }, { id: 'N', text: 'No' }],
      dataTextField: "text",
      dataValueField: "id",
      valuePrimitive: true,
      optionLabel: " "
   });
}

var ActiveInactiveFilterTemplate = function (args) {
   // create a DropDownList of unique values (colors)
   args.element.kendoDropDownList({
      dataSource: [{ id: 'Y', text: 'Active' }, { id: 'N', text: 'Inactive' }],
      dataTextField: "text",
      dataValueField: "id",
      valuePrimitive: true,
      optionLabel: "All"
   });
}

var ZeroOneFilterTemplate = function (args) {
    // create a DropDownList of unique values (colors)
    args.element.kendoDropDownList({
        dataSource: [{ id: 1, text: 'Yes' }, { id: 0, text: 'No' }],
        dataTextField: "text",
        dataValueField: "id",
        valuePrimitive: true,
        optionLabel: " "
    });
}

var stringFilterAttributes = { cell: { operator: "contains", dataSource: {}, minLength: 5000, showOperators: false } };
var numberFilterAttributes = { cell: { operator: "eq", dataSource: {}, minLength: 5000, showOperators: false } };
//$(document).ready(function () {
//    //   setTimeout(function () {
//    var loggeduser = $.connection.loggedUserHub;
//    // Start the connection.
//    $.connection.hub.start().done(function () {
//        loggeduser.server.send();
//    });
//    //    }, 7000);


//});

function CreateMultiSelectEditor(dataSource, translationTexts, idProperty, displayProperty, _onItemSelect, _onItemDeselect) {
    var scope = Globals.GetCurrentScope();
    scope.editorOptions = dataSource;
    scope.editorTranslationTexts = translationTexts;
    scope.editorSettings = {
        externalIdProp: '',
        idProp: idProperty,
        displayProp: displayProperty,
        enableSearch: true,
        scrollable: true,
        showCheckAll: false,
        showUncheckAll: false,
        alwaysDisplay: true
    };
    scope.editorEvents = {
        onInitDone: function () {
            var scope = Globals.GetCurrentScope();
            if (scope.userProfile == null) {
                if ($('#grid1_active_cell').get(0)) {
                    $('.ng-isolate-scope').css('top', $('#grid1_active_cell').get(0).offsetTop);
                    SetMultiSelectEditorPosition();
                }
            }
        },
        onItemSelect: _onItemSelect,
        onItemDeselect: _onItemDeselect
    };
}

function SetMultiSelectEditorPosition() {
    var winHeight = $(window).height();
    if ($('.dropdown-toggle').offset()) {
        var editorOffsetTop = $('.dropdown-toggle').offset().top;
        var editorHeight = $('.dropdown-menu').height();

        if ((editorOffsetTop + event.clientY) > winHeight) {
            $('.dropdown-menu').css('top', '-' + (editorHeight + 5) + 'px');
        }
    }
    $('.dropdown-toggle').on('click', function () {
        if ($('.dropdown-menu').offset().top < $('.k-grid-content').offset().top) {
            $('.dropdown-menu').css('top', '-3px');
            $('.dropdown-menu').css('left', $('.dropdown-toggle').width() + 16);
        }
    });

}

function OpenMultiSelectinPopup(title, scope) {
    scope.popupTitle = title;
    scope.proxyDialog.open({
        template: '../app/events/views/multiselect.html',
        showClose: false,
        closeByDocument: false,
        closeByEscape: false,
        scope: scope,
        name: 'ngdgMultiSelect'
    });
}

function MakeEventName(eventObj) {
    if (eventObj != null) {
        var START_DATE = TimeZoneSpecificDate(eventObj.START_DATE, eventObj.TIME_ZONE.LU_NAME, eventObj.DST_APPLIED_START_DATE);
        return moment(START_DATE).format("YYYY_MMMMDD") + "_" +
            eventObj.EMERGENCY_TYPE.LU_NAME + "_" + 
            eventObj.EMERGENCY_NAME + "_" +
            eventObj.EVENT_TYPE.LU_NAME;
    }
    return "";
}
function ChangeEventName(events) {
    $.each(events, function (index, event) {
        events[index].EVENT_NAME = MakeEventName(event);
    });
    return events;
}

function FormatDate(value, format, showMilitaryTime, showFullTime) {
    
    var formatted = "";
    if (!format)
      format = "MM/dd/yyyy";
    if (showMilitaryTime == true)
      format += " HH:mm";
    else if (showFullTime) {
      format += " HH:mm:ss.sss";
    }
    if (value) {
        var parsed = kendo.parseDate(value);
        formatted = kendo.toString(parsed, format);
    }
    return formatted;
}

function checkNull(val, defaultval) {
    return val || defaultval || '';
}

function ShowHideLoaderOverly(toShow) {
    if (toShow == true)
        $("#divAjaxLoader").removeClass("hide");
    else
        $("#divAjaxLoader").addClass("hide");
}
function initAjaxSpinner(divId) {
    var opts = {
        lines: 13 // The number of lines to draw
    , length: 18 // The length of each line
    , width: 4 // The line thickness
    , radius: 10 // The radius of the inner circle
    , scale: 1 // Scales overall size of the spinner
    , corners: 1 // Corner roundness (0..1)
    , color: '#000' // #rgb or #rrggbb or array of colors
    , opacity: 0.45 // Opacity of the lines
    , rotate: 0 // The rotation offset
    , direction: 1 // 1: clockwise, -1: counterclockwise
    , speed: 0.6 // Rounds per second
    , trail: 60 // Afterglow percentage
    , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
    , zIndex: 2e9 // The z-index (defaults to 2000000000)
    , className: 'spinner' // The CSS class to assign to the spinner
    , top: '50%' // Top position relative to parent
    , left: '50%' // Left position relative to parent
    , shadow: false // Whether to render a shadow
    , hwaccel: false // Whether to use hardware acceleration
    , position: 'absolute' // Element positioning
    };
    var target = document.getElementById(divId)
    var spinner = new Spinner(opts).spin(target);
    return spinner;
}


function checkTextLength(title, hpid, jobfn, text) {
    var val = text;
    if (val.length > 12) {
        val = text.substring(0, 12);
        text1 = encodeURI(text);
        val += '&nbsp;<span id="btnTest" data-tooltip-hpid="' + hpid + '" data-tooltip-jobfn="' + jobfn + '" data-tooltip-title="' + title + '" data-tooltip-content="' + text1 + '" onclick="showNotesTooltip(this);" class="icon-ellipsis">more</span>';
    }
    return val;
}

function showNotesTooltip(sender) {
    var toolTip = $(sender).data("kendoTooltip");
    if (!toolTip) {
        toolTip = $(sender).kendoTooltip({
            autoHide: false,
            ////filter: "td:nth-child(2)", //this filter selects the second column's cells
            position: "right",
            ////show: function (e) {
            ////    var content = e.target.data("field");
            ////    return '<div style="width: ' + (content.length * .6) + 'em; max-width: 34em">' + content + '</div>';
            ////},
            content: function (e) {
                return getTooltipHtml(e.target);
            },
            hide: function (e) {
                e.sender.destroy();
                ///e.target.addClass("icon-ellipsis-trans");
            }
        }).data("kendoTooltip");
        toolTip.show();
    }
    else {
        toolTip.options.content = getTooltipHtml(sender);
        toolTip.refresh(); toolTip.show();
    }
}

function getTooltipHtml(sender) {
    var data = $(sender).data();
    var title = isEmptyString(data.tooltipTitle) ? '' : ' - ' + data.tooltipTitle;
    var projectID = isEmptyString(data.tooltipHpid) ? '' : data.tooltipHpid;
    var jobFileNumber = isEmptyString(data.tooltipJobfn) ? '' : ' - ' + data.tooltipJobfn;
    var completeTitleText = projectID + jobFileNumber + title;
    var contents = decodeURI(data.tooltipContent);
    var html = '<div class="task-tooltip-content" style="width: ' + (contents * .6) + 'em; max-width: 34em" >';

    html += '<h5 >' + completeTitleText + ' - Notes</h5>';
    html += contents + ' </div>';
    return html;
}

function isEmptyString(str) {
    return (!str || 0 === str.length);
}