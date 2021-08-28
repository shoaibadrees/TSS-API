angular.module('HylanApp').controller('GlobalController', [ '$scope', '$state', '$http', 'Utility', 'AppConfig', 'NOTIFYTYPE','$log','SessionTimeoutService', 
    function ($scope, $state, $http, Utility, AppConfig, NOTIFYTYPE,$log, SessionTimeoutService) {
        Globals = function () { };
        Globals.ApiUrl = 'http://localhost:32425/';
        Globals.BaseUrl = "/";
        Globals.CurrentUser = {};
        Globals.ROLE = {};
        Globals._lookUps = [];
        Globals._states = [];
        Globals.UserCompanies = null;
        Globals.MapState = { center: null, zoom: null };
        Globals.$CurrentState = null;
        Globals.isActiveEventClosed = false;
        Globals.UserAgent = navigator.userAgent;

        Globals.LookUpTypes = {

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
            FIBER_DIG_VAULT: "FIBER_DIG_VAULT"
        };

        Globals.Screens = {

            //-----------------------------------
            MANAGE_CLIENTS: {
                ID: 1, TITLE: "MANAGE CLIENTS",
                SPECIAL_FUNCTION: { CHANGE_HOME_RMAG_ID: 1 }
            },
            MANAGE_PROJECTS: { ID: 2, TITLE: "Manage Projects" },
            MANAGE_JOBS: { ID: 3, TITLE: "Manage Jobs" },
            MANAGE_TASKS: { ID: 4, TITLE: "Manage Tasks" },
            MANAGE_PERMITS: { ID: 5, TITLE: "Manage Permits" },
            MANAGE_DAILIES: { ID: 6, TITLE: "Manage Dailies" },
            PERMIT_DASHBOARD: { ID: 7, TITLE: "Permit Dashboard" },
            JOB_MAP: { ID: 8, TITLE: "Job Map" },
            MANAGE_USERS: {
                ID: 9, TITLE: "MANAGE USERS",
                SPECIAL_FUNCTION: { RESTRICTED_ROLES_ID: 1, RESET_PSWD_ID: 2 }
            },
            MANAGE_USER_ROLES: { ID: 10, TITLE: "MANAGE USER ROLES" },
            ADHOC_REPORTS: { ID: 11, TITLE: "AD HOC REPORTS" },
            SYSTEM_LOGS: { ID: 12, TITLE: "SYSTEM LOG" },


            MANAGE_USER_ROLES_DETAILS: { ID: 12, TITLE: "ROLE DETAILS" },

            SCHEDULE_MEETING: { ID: 15, TITLE: "Schedule Meeting" },
            TASK: { ID: 16, TITLE: "Tasks" },

        };

        Globals._isDataSeeded = false;
        Globals.isNewRowAdded = false;
        Globals.changedModels = [];
        Globals.changedModelIds = [];
        Globals.isFilterReset = false;
        Globals.ChangesLostMessage = "Any changes made on this screen will be lost.";
        Globals.DeleteConfirmation = "Records with status ‘Allocated’ will be ignored and any other unsaved changes will be lost. Do you want to proceed?";
        Globals.BasicDeleteConfirmation = "Are you sure you want to delete the selected record(s)? Any other unsaved changes will be lost.";
        Globals.ResetPasswordConfirmation = "Are you sure you want to reset password for selected user(s)? Any other unsaved changes will be lost.";
        Globals.AllocationConfirmation = "Records with status 'Allocated' will be ignored. Are you sure you want to proceed?";
        Globals.AllocationAlert = "Records with status 'Allocated' cannot be deleted.";
        Globals.AllocationAlertEdit = "Records with status 'Allocated' cannot be edited.";
        Globals.NoChanges = "There are no changes to be saved.";
        Globals.NoEventSelectedMessage = "No event found to load data.";
        Globals.PasswordAgeWarning = "It has been more than " + AppSettings.DaysToExpirePassword + " days since you have changed your password.";
        Globals.IdleTimeoutMessage = "Due to inactivity your session will time out in 5 minutes. All your unsaved work will be lost. Click ok to continue working";
        Globals.InvalidDateTimeMessage = "Please provide date/time in correct format (MM/dd/yyyy HH:mm).";
        Globals.ClosedEventMessage = "The event you are working on is closed by some other user.\r\nPlease click on OK button to reload the page.";
        Globals.ExceptionFields = '';
        Globals.SaveMessage = "Changes saved.";

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

/// Move it into datacontext

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


        Globals.Post = function (resource, params, async) {
            return $http({
                type: "POST",
                url: Globals.ApiUrl + "/" + resource,
               // dataType: "json",
               // contentType: "application/json; charset=utf-8",
                data: params,
                async: async,
                cache: false
            });
        };
      
        Globals.Get = function (resource, params, async) {
            $.support.cors = true;
            return $http({
                url: Globals.ApiUrl + "/" + resource,
                type: "GET",
               // dataType: "json",
                //contentType: "application/json; charset=utf-8",
                data: params,
                async: async,
                cache: false
            });
        };

        Globals.SecureGet = function (resource, params, async) {
            $.support.cors = true;
            return $http({
                url: Globals.ApiUrl + "/" + resource,
                type: "GET",
                //dataType: "json",
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
            return $http({
                type: "POST",
                url: Globals.ApiUrl + "/" + resource,
               // dataType: "json",
               // contentType: "application/json; charset=utf-8",
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

        Globals.RedirectToDefaultPage = function ($state) {
            $state.go('Default', { reload: true });
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

        Globals.GetStates = function (callback) {
            if (callback) {  //-- for DDLs
                if (Globals._states.length && Globals._states.length > 0)
                    callback(Globals._states);
                else {
                    Globals.Get("States/GetAll", null, true).then(function (result) {
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
                Globals.GetLookUp(Globals.LookUpTypes.PROJECT_STATUS, false);
                Globals.GetLookUp(Globals.LookUpTypes.TASK_HOLD_REASON, false);
                Globals.GetLookUp(Globals.LookUpTypes.FOUNDATION_WORK_TYPE, false);
                Globals.GetLookUp(Globals.LookUpTypes.POLE_WORK_TYPE, false);
                Globals.GetLookUp(Globals.LookUpTypes.FIBER_TYPE, false);
                Globals.GetLookUp(Globals.LookUpTypes.FIBER_OPTIC_POSITION, false);
                Globals.GetLookUp(Globals.LookUpTypes.FIBER_DIG_TYPE, false);
                Globals.GetLookUp(Globals.LookUpTypes.FIBER_DIG_VAULT, false);
                Globals.GetStates();
                Globals._isDataSeeded = true;
            }
        };
        Globals._seedLookUpData();

        ///////////// Need to move in relvent service ////////////////////////////////////////////////////////////////
        Globals.GetUserRoles = function (async) {
            return Globals.Get("Roles/GetAll", null, async);
        }
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


       

        Globals.GetProjects = function () {
            var api = 'Project/GetAll'
            var result1 = Globals.Get(api, null, false)
            return result1.responseJSON.objResultList;
        }

        ///////////////////////////////////////////////////////////////////////



        Globals.sendEmail = function (pagename, operation, data) {
            var api = "";
            if (AppSettings.StopGeneratingEventEmails)
                return true;
            else
                return Globals.Post(api, param, true);

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
            });

            //-- hack for Chrome - after change lost message - add new row - resources cols - value lost when type plus user can enter any char.
            $(".k-numeric-wrap").find(".k-formatted-value.k-input").focus().on("focus", function () {
                $(this).css("display", "none");
                $(".k-numeric-wrap").find(".k-input:eq(1)").css("display", "inline-block").focus();
            });

        };


        Globals.CheckIfMobileDevice = function () {
            var isMobile = false;
            try {
                
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
                        "Authorization": "UserID" + $rootScope.currentUser.USER_ID
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
    }]);
