var beforeUnloadListner = window.attachEvent || window.addEventListener;
var beforeUnloadEvent = window.attachEvent ? 'onbeforeunload' : 'beforeunload';     /// make IE7, IE8 compatible
var unloadListner = window.attachEvent || window.addEventListener;
var unloadEvent = window.attachEvent ? 'onunload' : 'unload';
var unloadListner;
var unloadEvent;
Globals = function () { };
Globals.ApiUrl = 'http://localhost:4917/'; //Globals.ApiUrl = 'http://192.168.10.22:8083/api/';
//hylan api url
//Globals.ApiUrl = 'https://www.hylanproject.com/HylanAPI/';
//Globals.ApiUrl = 'http://122.129.75.39:8083/api/'; // For outside the office
Globals.BaseUrl = "/";
Globals.CurrentUser = {};
Globals.ROLE = {};
Globals.EventType = null;
Globals._lookUps = [];
Globals._states = [];
Globals.UserCompanies = null;
Globals.MapState = { center: null, zoom: null };
Globals.$CurrentState = null;
Globals.isActiveEventClosed = false;
Globals.UserAgent = navigator.userAgent;
Globals.LookUpTypes = {
  
  CALL_PURPOSE: "CALL_PURPOSE",
  NOTIFICATION_TYPE: "NOTIFICATION_TYPE",
  RELEASE_RECALL_REASON: "RELEASE_RECALL_REASON",
  PROJECT_STATUS: "PROJECT_STATUS",
  JOB_STATUS: "JOB_STATUS",
  DOITT_NTP_STATUS: "DOITT_NTP_STATUS",
  JOB_CATEGORY: "JOB_CATEGORY",
  TASK_HOLD_REASON: "TASK_HOLD_REASON",
  FOUNDATION_WORK_TYPE: "FOUNDATION_WORK_TYPE",
  POLE_WORK_TYPE: "POLE_WORK_TYPE",
  FIBER_TYPE: "FIBER_TYPE",
  FIBER_OPTIC_POSITION: "FIBER_OPTIC_POSITION",
  FIBER_DIG_TYPE: "FIBER_DIG_TYPE",
  FIBER_DIG_VAULT: "FIBER_DIG_VAULT",
  DAILY_TYPE: "DAILY_TYPE",
  DAILY_STATUS: "DAILY_STATUS",
  DAILY_SHIFT: "DAILY_SHIFT",
  MAN_POWER_JOB_TYPE: "MAN_POWER_JOB_TYPE",
  PERMIT_TYPE: "PERMIT_TYPE",
  WIFI_JOB_TYPE: "WIFI_JOB_TYPE",
  BYRNE_JOB_TYPE: "BYRNE_JOB_TYPE",
  MATERIAL_SUB_CATEGORY: "MATERIAL_SUB_CATEGORY",
  PERMIT_STATUS: "PERMIT_STATUS",
  PERMIT_REJECTION_REASON: "PERMIT_REJECTION_REASON",
  PERMIT_CATEGORY : "PERMIT_CATEGORY"
};

Globals.Screens = {

  MANAGE_CLIENTS: {ID: 1, TITLE: "MANAGE CLIENTS"},
  MANAGE_PROJECTS: { ID: 2, TITLE: "Manage Projects" },
  MANAGE_JOBS: {
      ID: 3, TITLE: "Manage Jobs",
      SPECIAL_FUNCTION: { DELETE_JOB: 1 }
  },
  MANAGE_TASKS: { ID: 4, TITLE: "Manage Tasks" },
  MANAGE_PERMITS: { ID: 5, TITLE: "Manage Permits" },
  MANAGE_DAILIES: { ID: 6, TITLE: "Manage Dailies", SPECIAL_FUNCTION: { DELETE_DAILY: 1 } },
  PERMIT_DASHBOARD: { ID: 7, TITLE: "Permit Dashboard" },
  JOB_MAP: { ID: 8, TITLE: "Job Map" },
  MANAGE_USERS: {
    ID: 9, TITLE: "MANAGE USERS",
    SPECIAL_FUNCTION: { RESTRICTED_ROLES_ID: 1, RESET_PSWD_ID: 2 }
  },
  MANAGE_USER_ROLES: { ID: 10, TITLE: "MANAGE USER ROLES" },
  SYSTEM_LOGS: { ID: 11, TITLE: "SYSTEM LOG" },
  MANAGE_ATTACHMENTS: { ID: 12, TITLE: "Manage Attachments" },
  PROJECT_ATTACHMENTS: { ID: 13, TITLE: "Project Attachments" },
  JOB_ATTACHMENTS: { ID: 14, TITLE: "Job Attachments" },
  PERMIT_ATTACHMENTS: { ID: 15, TITLE: "Permit Attachments" },
  TASK_ATTACHMENTS: { ID: 16, TITLE: "Tasks Attachments" },
  PROJECT_NOTES: { ID: 17, TITLE: "Project Notes" },
  JOB_NOTES: { ID: 18, TITLE: "Job Notes" },
  TASK_NOTES: { ID: 19, TITLE: "Tasks Notes" },
  MANAGE_USER_ROLES_DETAILS: { ID: 20, TITLE: "ROLE DETAILS" },
  TASK_MATRIX: { ID: 21, TITLE: "TASK MATRIX DASHBOARD" },
   TASK_ON_HOLD: { ID: 22, TITLE: "TASK ON-HOLD DASHBOARD" }
};

Globals.IsExportingData = false;
Globals.ActiveEvent = {};
Globals._isDataSeeded = false;
Globals.isNewRowAdded = false;
Globals.changedModels = [];
Globals.changedModelIds = [];
Globals.isFilterReset = false;
Globals.AdjCustomerOutVar = 0.6;
Globals.PreStagingCalculation = "";
Globals.ChangesLostMessage = "Any changes made on this screen will be lost.";
Globals.PermitRepeatMessage = "Are you sure you want to repeat this permit?";
Globals.NoRowSelectedToDeleteMessage = "Please select row(s) to delete by clicking on the row header."
Globals.DeleteConfirmation = "Records with status ‘Allocated’ will be ignored and any other unsaved changes will be lost. Do you want to proceed?";
Globals.BasicDeleteConfirmation = "Are you sure you want to delete the selected record(s)? Any other unsaved changes will be lost.";
Globals.ResetPasswordConfirmation = "Are you sure you want to reset password for selected user(s)? Any other unsaved changes will be lost.";
Globals.NoChanges = "There are no changes to be saved.";
Globals.PasswordAgeWarning = "It has been more than " + AppSettings.DaysToExpirePassword + " days since you have changed your password.";
Globals.IdleTimeoutMessage = "Due to inactivity your session will time out in 15 minutes. All your unsaved work will be lost. Click ok to continue working";
Globals.InvalidDateTimeMessage = "Please provide date/time in correct format (MM/dd/yyyy HH:mm).";
Globals.InvalidDateMessage = "Please provide date in correct format (MM/dd/yyyy).";
Globals.ExceptionFields = '';
Globals.SaveMessage = "Changes saved.";
Globals.UniqueProjectBidName = "Project/Bid Name already exists.";
Globals.UniqueJobFileNo = "Job File Number already exists against this Project.";
Globals.OnHoldReason = "Please provide On-Hold Reason.";
Globals.EmailMessageNotSent = "Your message could not be sent";
Globals.PasswordResetError = "Your password cannot be reset";
Globals.ConcurrencyMessageSingleRow = "Record(s) could not be updated since it has been edited by another user. Data has been refreshed.";
Globals.GetCurrentScope = function () {
  var scope = null;
  var elementPopup = angular.element('#responsive-tables-popup');
  var elementMain = angular.element('#responsive-tables');
  if (elementPopup.length && elementPopup.length > 0) {
    scope = elementPopup.scope();
  }
  else if (elementMain.length && elementMain.length > 0) {
    scope = elementMain.scope();
  }
  return scope;
}

Globals.isIE = function () {
  var myNav = navigator.userAgent.toLowerCase();
  return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
};

Globals.dirtyField = function (data, fieldName) {
  if (data.dirtyFields != null) {
    if (data.dirty && data.dirtyFields[fieldName]) {
      return "<span class='k-dirty'></span>"
    }
    else {
      return "";
    }
  } else {
    return "";
  }
}
Globals.RemoveToolbar = function () {
    var toolbar = [];
    return toolbar;
}

Globals.SetStatusValue = function (elem, gridId) {
  var grid = (gridId && gridId != "") ? $("#" + gridId).data("kendoGrid") : $("#grid1").data("kendoGrid");
  var dataItem = grid.dataItem($(elem).closest("tr"));
  dataItem.set("dirty", true);
  if (elem.checked == true) {
    dataItem.get().STATUS = "Y";
  }
  else {
    dataItem.get().STATUS = "N";
  }
  Globals.changedModels.push(dataItem.uid);
  Globals.changedModelIds.push(dataItem.id);
  if (gridId && gridId != "") {
    isChildDataChanged = true
  }
  $(".alert-box .close, .alert-boxpopup .close").click();
}

Globals.checkEmptyValue = function (elem) {
  if ($(elem).val() == "0")
    $(elem).val("");
};

Globals.customnumericfield_iPad = function (container, options, fieldtext, fieldvalue, fieldname, maxlen) {
  var regex = /^[0-9]$/;
  $('<input id="numfield" type="text" min="0" inputmode="numeric" pattern="[0-9]*" data-text-field=' + fieldtext + ' data-value-field=' + fieldtext + ' data-bind="value:' + options.field + '" maxlength="' + maxlen + '" onfocus="Globals.checkEmptyValue(this);" class="k-textbox" />')
     .appendTo(container);
  $("#numfield").on("keydown keyup", function () {
    var str = $("#numfield").val();
    if (!regex.test(str.substr(str.length - 1))) {
      if (str.length > 0)
        $(this).val(str.substr(0, (str.length - 1)));
      else
        $(this).val();
    }
  }).on("blur", function () {
    this.value = this.value.replace(/[^0-9]/g, '');
  });
  return $("#numfield");
};

Globals.customnumericfield_Android = function (container, options, fieldtext, fieldvalue, fieldname, maxlen, excludeMaxAttr) {
  var maxAttr = 'max="9999999999"';
  if (excludeMaxAttr)
    maxAttr = '';
  //-- input[type=number] -- show numeric keyboard but accepts all chars. in iPad-safari
  $('<input id="numfield" type="number" ' + maxAttr + ' min="0"  inputmode="numeric" pattern="[0-9]*" title="Only number between 0-9999999999" data-text-field=' + fieldtext + ' data-value-field=' + fieldtext + ' data-bind="value:' + options.field + '" maxlength="' + maxlen + '" onfocus="Globals.checkEmptyValue(this);" class="k-textbox" />')
     .appendTo(container);
  $("#numfield").on("blur", function () {
    this.value = this.value.replace(/[^0-9]/g, '');
  });

  return $("#numfield");


  /*//-- kendoMaskedTextBox -- display chars. in reverse order in samsung tab - chrome
  $('<input id="numfield" data-text-field=' + fieldtext + ' data-value-field=' + fieldtext + ' data-bind="value:' + options.field + '" maxlength="' + maxlen + '" onfocus="Globals.checkEmptyValue(this);" class="k-textbox" />')
     .appendTo(container)
      .kendoMaskedTextBox({
          autoBind: false,
          mask: "0000000000",
          clearPromptChar: true,
          promptChar: " ",
          unmaskOnPost: true,
          value: fieldvalue,
          change: function () {
              var selRow = $("#grid1").data("kendoGrid").dataItem(this.element.closest("tr"));
              selRow.get().dirty = true;
          }
      });
  Globals.MaskedEditorKeyHandler();*/

  /*-- kendoNumericTextBox -- accepts all chars. in both samsung tab and iPad
  $('<input id="numfield" data-text-field=' + fieldtext + ' data-value-field=' + fieldtext + ' data-bind="value:' + options.field + '" maxlength="' + maxlen + '" onfocus="Globals.checkEmptyValue(this);" class="k-textbox" />')
      .appendTo(container)
      .kendoNumericTextBox({
          autoBind: false,
          value: fieldvalue,
          spinners: false,
          format: "n0",
          decimals: 0,
          min: 0,
          change: function () {
              var selRow = $("#grid1").data("kendoGrid").dataItem(this.element.closest("tr"));
              selRow.get().dirty = true;
          }
      });
  // container.find(".k-numeric-wrap").addClass("expand-padding").find(".k-select").hide();
  container.find(".k-numeric-wrap").find(".k-input").css("text-align", "right");
  if (container.find(".k-input").val() == '0')
      container.find(".k-input").val() = '';
  Globals.NumericTextBoxKeyHandler();*/
};
Globals.customnumericfield = function (container, options, fieldtext, fieldvalue, fieldname) {
  fieldvalue = (fieldvalue == '0' || fieldvalue == 0) ? '' : fieldvalue;
  var maxlen = 10;
  if (fieldname == 'Zip')
    maxlen = 6;

  if (/iPad/.test(Globals.UserAgent)) {
    var numericTextBox = Globals.customnumericfield_iPad(container, options, fieldtext, fieldvalue, fieldname, maxlen);
    numericTextBox.val(fieldvalue).addClass('contert-number');
  }
  else if (/Android/.test(Globals.UserAgent)) {
    var numericTextBox = Globals.customnumericfield_Android(container, options, fieldtext, fieldvalue, fieldname, maxlen);
    numericTextBox.val(fieldvalue).addClass('contert-number');
  }
  else {
    //-- e.keycode, e.which, e.charcode all are 0 in samsung tab - chrome 
    $('<input id="numfield" data-text-field=' + fieldtext + ' data-value-field=' + fieldtext + ' data-bind="value:' + options.field + '" maxlength="' + maxlen + '" onfocus="Globals.checkEmptyValue(this);" class="k-textbox" />')
        .appendTo(container);

    var events = "keydown";
    $("#numfield").on(events, function (e) {
      //console.log(e.keyCode);
      var keyPressed;
      if (!e) var e = window.event;
      if (e.keyCode) keyPressed = e.keyCode;
      else if (e.which) keyPressed = e.which;
      // Allow: backspace, delete, tab, escape, enter
      // Allow: Ctrl+A, Command+A
      // Allow: Ctrl+C, Ctrl+V, Ctrl+X 
      // Allow: home, end, left, right, down, up
      if (jQuery.inArray(keyPressed, [46, 8, 9, 27, 13]) !== -1 ||
          (keyPressed == 65 && (e.ctrlKey === true || e.metaKey === true)) ||
          (e.ctrlKey === true || (keyPressed == 67 || keyPressed == 86 || keyPressed == 88)) ||
          (keyPressed >= 35 && keyPressed <= 40)) {
        return;
      }
      // Ensure that it is a number and stop the keypress
      if ((e.shiftKey || (keyPressed < 48 || keyPressed > 57)) && (keyPressed < 96 || keyPressed > 105)) {
        e.preventDefault();
      }
    }).on("blur", function () {
      this.value = this.value.replace(/[^0-9]/g, '');
    }).val(fieldvalue).addClass('contert-number');
  }
}

Globals.Get = function (resource, params, async) {
    $.support.cors = true;
    var userID = 0;
    if (Globals.CurrentUser)//important when going to login and user_id is unknown
        userID = Globals.CurrentUser.USER_ID ? Globals.CurrentUser.USER_ID : 0;  
  return $.ajax({
    url: Globals.ApiUrl + "/" + resource,
    type: "GET",
    dataType: "json",
   //contentType: "application/json; charset=utf-8",
    data: params,
    async: async,
    cache: false,
    headers: {
        "Authorization": "UserID" + userID
    }
  });
};



Globals.Post = function (resource, params, async) {
  return $.ajax({
    type: "POST",
    url: Globals.ApiUrl + "/" + resource,
    dataType: "json",
    contentType: "application/json; charset=utf-8",
    data: params,
    async: async,
    cache: false,
    headers: {
        "Authorization": "UserID" + Globals.CurrentUser.USER_ID
    }
  });
};
Globals.SecureGet = function (resource, params, async) {
  $.support.cors = true;
  return $.ajax({
    url: Globals.ApiUrl + "/" + resource,
    type: "GET",
    dataType: "json",
    //contentType: "application/json; charset=utf-8",
    data: params,
    async: async,
    cache: false,
    headers: {
      "Authorization": "Forms " + Globals.CurrentUser.USER_NAME + " " + Globals.CurrentUser.PASSWORD
    },
    username: Globals.CurrentUser.USER_NAME,
    password: Globals.CurrentUser.PASSWORD
  });
};
Globals.SecurePost = function (resource, params, async) {
  return $.ajax({
    type: "POST",
    url: Globals.ApiUrl + "/" + resource,
    dataType: "json",
    contentType: "application/json; charset=utf-8",
    data: params,
    async: async,
    cache: false,
    headers: {
      "Authorization": "Forms " + Globals.CurrentUser.USER_NAME + " " + Globals.CurrentUser.PASSWORD
    },
    username: Globals.CurrentUser.USER_NAME,
    password: Globals.CurrentUser.PASSWORD
  });
};

Globals.GetCompanies = function (async) {
  return Globals.Get("Companies/GetAllActiveCompanies", null, async);
}

Globals.GetUsers = function (async, role_name) {
  var path = "User/GetAll"
  if (role_name != null) {
    path = path + "/" + role_name + "";
  }
  return Globals.Get(path, null, async);
}

Globals.GetNOTIFICATIONTYPES = function () {
  return Globals.GetLookUp(Globals.LookUpTypes.NOTIFICATION_TYPE, false);
}

Globals.GetNotificationsByEventAndType = function (EventId, TypeId, NoOfPages) {
  var api = "Notifications/LoadAllByEventAndType?EventId=" + EventId + "&TypeId= " + TypeId + "&UserId= " + Globals.CurrentUser.USER_ID + "&NoOfPages= " + NoOfPages;
  return Globals.Get(api, null, false);
};


Globals.sendEmail = function (pagename, operation, data) {
  var api = "";
  if (AppSettings.StopGeneratingEventEmails)
    return true;
  if (pagename == 'Events') {
    return Globals.Post("Events/sendEventEmail?eventid=" + data + "&operation=" + operation, null, true);
  } else if (pagename == 'Allocation') {
    api = "Allocation/sendAllocationEmail";
    var param = JSON.stringify(data);
    return Globals.Post(api, param, true);
  }
  else if (pagename == 'Matching') {
    api = "Matching/sendMatchingEmail";
    var param = JSON.stringify(data);
    return Globals.Post(api, param, true);
  }
  else if (pagename == 'MatchLog') {
    api = "MatchLog/sendMatchLogEmail";
    var param = JSON.stringify(data);
    return Globals.Post(api, param, true);
  }
};



Globals.GetUserRoles = function (async) {
  return Globals.Get("Roles/GetAll", null, async);
}
Globals.GetAllEventsofLoggedUser = function (IncludeClosedE, curScreenId) {
  var param = {
    UserId: Globals.CurrentUser.USER_ID,
    IncludeClosedEvent: false,
    eventType: "-1"
  };
  if (IncludeClosedE && IncludeClosedE != null)
    param.IncludeClosedEvent = IncludeClosedE;

  param.eventType = Globals.GetAllowedEventTypes(curScreenId);

  var api = "Events/GetEventsOfLoggedUser"
  var response = Globals.Get(api, param, false);
  if (Globals.$CurrentState && response && response != null) {
    if (response.responseText && response.responseText != "" && response.responseText.indexOf("objResultList") > -1) {
      var result = JSON.parse(response.responseText).objResultList;
      if (result && result != null) {
        if (result.length == 0) {
          alert("You don't have any active event. Please add an event from Events > Manage Events screen or contact your Administrator.");
          Globals.RedirectToDefaultPage(Globals.$CurrentState);
        }
      }
    }
  }
  return response;
};
Globals.CheckActiveEvent = function (eventDS, selEventID, showMessage) {
  var selectedEventItem = $.grep(eventDS, function (elem, index) {
    return elem.EVENT_ID == selEventID;
  });

  if (selectedEventItem.length == 0 && eventDS.length > 0) {
    Cookies.set('selectedEvent', eventDS[0].EVENT_ID, { path: '' });
    selectedEventItem = [];
    selectedEventItem.push(eventDS[0]);
  }
  else if (eventDS.length == 0) {
    ////alert("You don't have any active event. Please add an event from Events > Manage Events screen or contact your Administrator.");
    Globals.RedirectToDefaultPage(Globals.$CurrentState);
  }

  return selectedEventItem;
};


Globals.RedirectToDefaultPage = function ($state) {
  $state.go('Default', { reload: true });
};

Globals.SetLoginStatus = function (username1, status, async) {
  var param = { username: username1, loginstatus: status };
  return Globals.Post("User/UpdateUserLoginStatus?username=" + username1 + "&loginstatus=" + status, null, async);
}

Globals.GetLoggedUsers = function () {
  return $.ajax({
    type: "GET",
    url: "/LoggedUsers",
    cache: false,
    headers: {
        "Authorization": "UserID" +Globals.CurrentUser.USER_ID
    }
  });
};



Globals.GetLookUp = function (type, async, callback) {
    
  if (callback) { //-- for DDLs
    if (type in Globals._lookUps)
      callback(Globals._lookUps[type]);
    else if (!(type in Globals._lookUps)) {
      Globals.Get("Lookup/GetByType", { lookuptype: type }, async).then(function (result) {
        Globals._lookUps[type] = result.objResultList;
        callback(Globals._lookUps[type]);
      });
    }
  }
  else {          //-- for kendo grid
    if (type in Globals._lookUps)
      return Globals._lookUps[type];
    else if (!(type in Globals._lookUps)) {
      Globals.Get("Lookup/GetByType", { lookuptype: type }, async).then(function (result) {
        Globals._lookUps[type] = result.objResultList;
        return Globals._lookUps[type];
      });
    }
  }
};
Globals.resizeGrid = function (gridID, gridHeight) {
    
    if (($("#numfield").is(":focus") == false && $("input[type='text']").is(":focus") == false && $("input[type='password']").is(":focus") == false && $("input[type='number']").is(":focus") == false)
            && !(/Android/.test(Globals.UserAgent) || /iPad/.test(Globals.UserAgent))) {
        setTimeout(function () {

            var grid = $(gridID),
                gridToolbar = $(gridID + " .k-grid-toolbar"),
                gridHeader = $(gridID + " .k-grid-header"),
                gridLockedContent = $(gridID + " .k-grid-content-locked"),
                gridContent = $(gridID + " .k-grid-content"),
                gridPagger = $(gridID + " .k-grid-pager"),
                docHeight = $(window).height(),
                mainHead = $(".main-head").outerHeight(),
                filterSec = $(".event-select").outerHeight();

            var newHeight = 0;
            if (gridHeight)
                newHeight = gridHeight;
            else
                newHeight = docHeight - (mainHead + filterSec);
            var contentHeight = newHeight - ((gridToolbar.outerHeight() || 0) + (gridHeader.outerHeight() || 0) + (gridPagger.outerHeight() || 0));
            if (gridContent.scrollWidth > gridContent.width()) //-- gridcontent has horizental scroll
                contentHeight = contentHeight - 17;
            newHeight = newHeight - 5; //-- differential
            contentHeight = contentHeight - 5;  //-- differential
            if (grid.length > 0)
                grid.height(newHeight);
            if (gridContent.length > 0)
                gridContent.height(contentHeight);
            if (gridLockedContent.length > 0)
                gridLockedContent.height(contentHeight);
        }, 1000);
    }
}
Globals.GetStates = function (callback) {
  if (callback) {  //-- for DDLs
    if (Globals._states.length && Globals._states.length > 0)
      callback(Globals._states);
    else {
      Globals.Get("States/GetAll", null, false).then(function (result) {
        Globals._states = result.objResultList;
        callback(Globals._states);
      });
    }
  }
  else {          //-- for kendo grid
    if (Globals._states.length && Globals._states.length > 0)
      return Globals._states;
    else {
      Globals.Get("States/GetAll", null, true).then(function (result) {
        Globals._states = result.objResultList;
        return Globals._states;
      });
    }
  }
};

Globals._seedLookUpData = function () {
  if (!Globals._isDataSeeded) {
 
    Globals.GetLookUp(Globals.LookUpTypes.NOTIFICATION_TYPE, false);
    Globals.GetLookUp(Globals.LookUpTypes.PROJECT_STATUS, false);
    Globals.GetLookUp(Globals.LookUpTypes.TASK_HOLD_REASON, false);
    Globals.GetLookUp(Globals.LookUpTypes.FOUNDATION_WORK_TYPE, false);
    Globals.GetLookUp(Globals.LookUpTypes.POLE_WORK_TYPE, false);
    Globals.GetLookUp(Globals.LookUpTypes.FIBER_TYPE, false);
    Globals.GetLookUp(Globals.LookUpTypes.FIBER_OPTIC_POSITION, false);
    Globals.GetLookUp(Globals.LookUpTypes.FIBER_DIG_TYPE, false);
    Globals.GetLookUp(Globals.LookUpTypes.FIBER_DIG_VAULT, false);
    Globals.GetLookUp(Globals.LookUpTypes.DAILY_TYPE, false);
    Globals.GetLookUp(Globals.LookUpTypes.DAILY_STATUS, false);
    Globals.GetLookUp(Globals.LookUpTypes.DAILY_SHIFT, false);
    Globals.GetLookUp(Globals.LookUpTypes.MAN_POWER_JOB_TYPE, false);
    Globals.GetLookUp(Globals.LookUpTypes.WIFI_JOB_TYPE, false);
    Globals.GetLookUp(Globals.LookUpTypes.BYRNE_JOB_TYPE, false);
    Globals.GetLookUp(Globals.LookUpTypes.MATERIAL_SUB_CATEGORY, false);
    Globals.GetStates();
    Globals._isDataSeeded = true;
  }
};


Globals.validateEmail = function (sEmail) {
  if (sEmail != null && sEmail != '') {
    sEmail = $.trim(sEmail);
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(sEmail)) {
      return true;
    }
  }
  return false;
};
Globals.ValidatePassword = function (password) {
  // check for password containing at least one capital letter, at least one digit and no spaces
  if (password && password != null && password != '') {
    var regExp = new RegExp("^(?=.*[0-9]+.*)(?=.*[A-Z]+.*)[0-9a-zA-Z]{2,50}$");
    if (regExp.test(password)) {
      return true;
    }
  }
  return false;
};

Globals.IsScreenVisible = function (screenId) {
    var result = false;
   
  if (Globals.ROLE != null) {
      if (Globals.ROLE.PERMISSIONS != null) {

          var permType = "VIEW_EDIT_ACCESS";
          if (screenId == 7 || screenId == 21 || screenId == 22)
              permType = "dashboard";
          var perm = _.findWhere(Globals.ROLE.PERMISSIONS, { PERMISSION_TYPE: permType, SCREEN_ID: screenId });
          if (perm) {
              result = perm.VIEW_ACCESS_GENERAL;
          }
      }
     
  }
  return result;
};

Globals.CheckEditPermission = function (curScreenId) {
  var allowToEdit = false;
  if (curScreenId && curScreenId != null && Globals.ROLE != null) {
    if (Globals.ROLE.PERMISSIONS != null) {
      var perm = _.findWhere(Globals.ROLE.PERMISSIONS, { PERMISSION_TYPE: "VIEW_EDIT_ACCESS", SCREEN_ID: curScreenId });
      if (perm) {
        if (perm.EDIT_ACCESS && perm.EDIT_ACCESS == true) {
          allowToEdit = true;
        }
      }
    }
  }
  return allowToEdit;
};
Globals.GetPermissions = function (permissionType) {
  var permissions = null;
  if (permissionType && permissionType != null && Globals.ROLE != null) {
    if (Globals.ROLE.PERMISSIONS != null) {
      permissions = _.filter(Globals.ROLE.PERMISSIONS, function (permission) { return permission.PERMISSION_TYPE == permissionType; });
    }
  }
  return permissions;
};
Globals.GetSpecificPermission = function (SCREEN_ID, PERMISSION_TYPE, PERMISSION_TYPE_ID) {
  var perm = undefined;
  if (Globals.ROLE && Globals.ROLE.PERMISSIONS) {
    perm = _.findWhere(Globals.ROLE.PERMISSIONS,
        {
          SCREEN_ID: SCREEN_ID,
          PERMISSION_TYPE: PERMISSION_TYPE,
          PERMISSION_TYPE_ID: PERMISSION_TYPE_ID
        });
  }
  return perm;
};


Globals.GetProjects = function () {
    var api = 'Project/GetAll'
    return Globals.Get(api, null, false)
};
Globals.GetProjectsByStatus = function (projectStatus) {
    var api = 'Project/GetAllByStatus?projectStatus=' + projectStatus;
    return Globals.Get(api, null, false)
};

Globals.GetPermitTypes = function () {
    var api = 'PermitTypes/GetAll';
    return Globals.Get(api, null, false)
};

Globals.GetPermitTypesWithCode = function () {
    var api = 'PermitTypes/GetAllWithCode';
    return Globals.Get(api, null, false)
};

Globals.GetJobFileNumbers = function (projectIDs) {
    var api = "Jobs/GetJobFileNumbers?projectIDs=" + projectIDs;
    return Globals.Get(api, null, false);
};

Globals.HasGenEditAccess = function (accessLevel, e, screenId) {
  var hasAccess = true;
  var model = (e.model) ? e.model : e;
  if (Globals.UserCompanies != null &&
                  Globals.UserCompanies.COMPANY != null &&
                  accessLevel && accessLevel != "GLOBAL") {
    if (accessLevel == "COMPANY" && model.COMPANY_ID && model.COMPANY_ID != "") {
      if (screenId == Globals.Screens.MANAGE_USERS.ID) {
        if (model.USER_COMPANIES && model.USER_COMPANIES.length > 0) {
          var curUserCompany = _.find(Globals.UserCompanies.COMPANY, function (company) { return _.contains(model.USER_COMPANIES, company.COMPANY_ID); });
          if (curUserCompany == undefined) {
            hasAccess = false;
          }
        }
      }
      else {
        var curUserCompany = _.find(Globals.UserCompanies.COMPANY, function (company) { return company.COMPANY_ID == model.COMPANY_ID; });
        if (curUserCompany == undefined) {
          hasAccess = false;
        }
      }
    }
  
  }
  return hasAccess;
};

Globals.PhoneMaskingEditor = function (container, options) {
  //-- KendoMaskedTextbox -> cursor does not move with char., and number appear in reverse direction on devices
  var val = options.model.COMPANY_PHONE_NUMBER ? options.model.COMPANY_PHONE_NUMBER : '';
  if (/iPad/.test(Globals.UserAgent) || (/Android/.test(Globals.UserAgent))) {
    $('<input id="txtPhoneMasker" type="text" data-text-field="' + options.field + '" data-value-field="' + options.field + '" data-bind="value:' + options.field + '"/>')
        .appendTo(container)
        .on("blur", function () {
          var grid = $("#grid1").data("kendoGrid");
          if (grid) {
            var selRow = grid.select();
            if (selRow.length > 0) {
              var selDataItem = grid.dataItem(selRow[1]);
              selDataItem.set(options.field, this.value);
              container.innerText = this.value;
            }
          }
        });
    VMasker(document.getElementById("txtPhoneMasker")).maskPattern('(999) 999-9999');
  }
  else {
    $('<input type="text" data-text-field="' + options.field + '" data-value-field="' + options.field + '" data-bind="value:' + options.field + '"/>')
            .appendTo(container)
            .kendoMaskedTextBox({
              autoBind: false,
              mask: "(999) 000-0000",
              value: val,
              change: function () {
                var selRow = $("#grid1").data("kendoGrid").dataItem(this.element.closest("tr"));
                selRow.get().dirty = true;
              }
            });

    Globals.MaskedEditorKeyHandler();
  }
};

Globals.MaskedEditorKeyHandler = function () {
  $("[data-role=maskedtextbox]").on("keydown", function (e) {
    if (e.keyCode === 9) { //-- tab key
      var control = $("[data-role=maskedtextbox]").data("kendoMaskedTextBox");
      if (control)
        control.trigger("change");
      else
        console.log('masked editor not found.')
    }
  });
};

Globals.NumericTextBoxKeyHandler = function () {

  //-- hack for IE8 - value lost while pressing tab key
  $("#numfield").on("keydown", function (e) {
    console.log('keydown called');
    if (e.keyCode === 9) { //-- tab key
      var control = $(this).data("kendoNumericTextBox");
      if (control) {
        control.value($(this).val());
        control.trigger("change");
      }
      else
        console.log('onkeydown - numeric text box not found.')
    }
  });/*.on("blur", function (e) {
        console.log('1- on blur called');
        var control = $(this).data("kendoNumericTextBox");
        if (control) {
            control.value($(this).val());
            control.trigger("change");
        }
        else
            console.log('1- onblur - numeric text box not found.')
    }).on("focusout", function (e) {
        console.log('1- on focusout called');
        var control = $(this).data("kendoNumericTextBox");
        if (control) {
            control.value($(this).val());
            control.trigger("change");
        }
        else
            console.log('1- focusout - numeric text box not found.')
    });*/

  //-- hack for Chrome - after change lost message - add new row - resources cols - value lost when type plus user can enter any char.
  $(".k-numeric-wrap").find(".k-formatted-value.k-input").focus().on("focus", function () {
    $(this).css("display", "none");
    $(".k-numeric-wrap").find(".k-input:eq(1)").css("display", "inline-block").focus();
  });

};

function HideDimension() {
  $("#divDimension").slideToggle({ direction: 'left' }, 1000);
}
Globals.CheckIfMobileDevice = function () {
  var isMobile = false;
  try {
    //var ifMobile = {
    //    Android: function () { return navigator.userAgent.match(/Android/i); },
    //    BlackBerry: function () { return navigator.userAgent.match(/BlackBerry/i); },
    //    iOS: function () { return navigator.userAgent.match(/iPhone|iPad|iPod/i); },
    //    Opera: function () { return navigator.userAgent.match(/Opera Mini/i); },
    //    Windows: function () { return navigator.userAgent.match(/IEMobile/i); },
    //    any: function () { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); }
    //};
    var mediQuery = window.matchMedia("only screen and (max-width: 550px), (min-width: 551px) and (max-height:500px)");
    if (mediQuery.matches)
      isMobile = true;
  } catch (e) {
    isMobile = false;
  }
  return isMobile;
};
Globals.MobileLogout = function () {
  if (Globals.CurrentUser != null) {
    document.cookie = "";
    $.ajax({
      type: "GET",
      url: '/Logout',
      data: { username: Globals.CurrentUser.USER_NAME },
      cache: false,
      async: false,
      headers: {
                "Authorization": "UserID" + Globals.CurrentUser.USER_ID
      },
      success: function (data) {
        if (data === "True") {
          PrepareLogInPage();
        }
      },
      error: function (e) {
        onError(e);
      }
    });
  }
  else {
    PrepareLogInPage();
  }
};
function PrepareLogInPage() {
  try {
    Globals.ROLE = null;
    Globals.CurrentUser = null;
    if (sessionStorage) {
      sessionStorage.setItem("currentUser", null);
      sessionStorage.setItem("selectedEvent", null);
      sessionStorage.setItem("selectedEntityObject", null);
      sessionStorage.setItem("emptyEntityObject", null);
      sessionStorage.setItem("userCompaniesList", null);
    }
    Globals.DetachUnloadEventHandlers();
    window.location.replace(window.location.protocol + "//" + window.location.host);
  } catch (e) {

  }
}
function preUnload(e) {
  var confirmMsg = 'This action will close the application.';
  (e || window.event).returnValue = confirmMsg;
  return confirmMsg;
}
function Unload(e) {
  var isMobile = Globals.CheckIfMobileDevice();
  if (isMobile == false && document.getElementById("divBaseController")) {
    var scope = angular.element(document.getElementById("divBaseController")).scope();
    if (scope) {
      scope.logout(true);
    }
  }
  else {
    Globals.MobileLogout();
  }
}
Globals.AttachUnloadEventHandlers = function () {
  beforeUnloadListner = window.attachEvent || window.addEventListener;
  beforeUnloadEvent = window.attachEvent ? 'onbeforeunload' : 'beforeunload';     /// make IE7, IE8 compatible
  beforeUnloadListner(beforeUnloadEvent, preUnload);       // For >=IE7, Chrome, Firefox

  unloadListner = window.attachEvent || window.addEventListener;
  unloadEvent = window.attachEvent ? 'onunload' : 'unload';
  unloadListner(unloadEvent, Unload);
};

Globals.DetachUnloadEventHandlers = function () {
  beforeUnloadListner = window.detachEvent || window.removeEventListener;
  beforeUnloadEvent = window.attachEvent ? 'onbeforeunload' : 'beforeunload';     /// make IE7, IE8 compatible
  beforeUnloadListner(beforeUnloadEvent, preUnload);       // For >=IE7, Chrome, Firefox

  unloadListner = window.detachEvent || window.removeEventListener;
  unloadEvent = window.attachEvent ? 'onunload' : 'unload';
  unloadListner(unloadEvent, Unload);
};
