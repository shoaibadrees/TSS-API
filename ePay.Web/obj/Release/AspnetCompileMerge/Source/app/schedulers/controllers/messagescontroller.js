angular.module('HylanApp').controller("MessagesController", ['$rootScope', '$scope', '$controller', '$timeout', 'MessagesService', 'Utility', 'NOTIFYTYPE', 'CompaniesService', 'NotificationService',
    function ($rootScope, $scope, $controller, $timeout, MessagesService, Utility, NOTIFYTYPE, CompaniesService, NotificationService) {
        $controller('BaseController', { $scope: $scope });
        $scope.emptyState = {};
        $scope.objSelectedRMAGs = [];
        $scope.objSelectedCompanies = [];
        $scope.removedEmailIds = [];
        $scope.loadPrimaryData = function () {
            MessagesService.GetEmptyModel().then(function (result) {
                $scope.emptyState = angular.copy(result.resultObject);
                $scope.Message = angular.copy($scope.emptyState);
                Globals.GetAllEventsofLoggedUser(false, Globals.Screens.SCHEDULE_MEETING.ID).then(function (result) {
                    result.objResultList = ChangeEventName(result.objResultList);
                    $scope.Events = result.objResultList;
                    if ($scope.Events.length > 0) {
                        // $scope.Message.EVENT_ID = $scope.Events[0].EVENT_ID;
                        if (Cookies.get("selectedEvent") === undefined) {
                            Cookies.set('selectedEvent', $scope.Events[0].EVENT_ID, { path: '' });
                            $scope.Message.EVENT_ID = Cookies.get("selectedEvent");
                        }
                        else {
                            $scope.Message.EVENT_ID = Cookies.get("selectedEvent");

                        }
                        selectedEventItem = Globals.CheckActiveEvent($scope.Events, $scope.Message.EVENT_ID);
                        $scope.Message.EVENT_ID = selectedEventItem[0].EVENT_ID;

                        $scope.Message.EVENT_TIME_ZONE = selectedEventItem[0].TIME_ZONE;
                        $scope.selectedEventType = selectedEventItem[0].EVENT_TYPE.LU_NAME;
                        $scope.showTimeZone();
                        isChildDataChanged = false;
                    }
                    $timeout(function () { });
                }, onError);
                $scope.Message.PURPOSE_ID = '-1';
            });

            $scope.InitializeMultiSelectModels();

            CompaniesService.GetRmags().then(function (result) {
                $scope.rmagOptions = result.objResultList;
                setTooltipOnMultiSelect('divMultiSelRMAG', null, $scope.objSelectedRMAGs);
            });
            Globals.GetLookUp(Globals.LookUpTypes.CALL_PURPOSE, true, function (result) {
                $scope.callPurposeOptions = result;
            });
        };

        $scope.InitializeMultiSelectModels = function () {
            $scope.rmagOptions = [];
            $scope.rmagSettings = {
                externalIdProp: '',
                idProp: 'RMAG_ID',
                displayProp: 'RMAG_NAME',
                enableSearch: true,
                scrollable: true,
                showCheckAll: false,
                showUncheckAll: false,
                smartButtonMaxItems: 5
            };


            $scope.rmagEvents = {
                onItemSelect: function (item) {
                    var scope = Globals.GetCurrentScope();
                    scope.rmagChange(item, 'add');                    
                },
                onItemDeselect: function (item) {
                    var scope = Globals.GetCurrentScope();
                    scope.rmagChange(item, 'remove');                    
                }
            };

            $scope.companyOptions = [];
            $scope.companySettings = {
                externalIdProp: '',
                idProp: 'COMPANY_ID',
                displayProp: 'COMPANY_NAME',
                enableSearch: true,
                scrollable: true,
                showCheckAll: false,
                showUncheckAll: false,
                smartButtonMaxItems: 5
            };

            $scope.companyEvents = {
                onItemSelect: function (item) {
                    var scope = Globals.GetCurrentScope();
                    scope.companyChange();                    
                },
                onItemDeselect: function (item) {
                    var scope = Globals.GetCurrentScope();
                    scope.companyChange();                    
                }
            };
        };

        $scope.HideNotification = function () {
            Utility.HideNotification();
            isChildDataChanged = true;
        };
        $scope.loadPrimaryData();
        $scope.rmagChange = function (item, action) {
            $scope.HideNotification();
            var selectedRmagIds = $.map($scope.objSelectedRMAGs, function (item) { return item.RMAG_ID }).join(',');
            $scope.objSelectedCompanies = [];
            $scope.companyOptions = [];
            if (selectedRmagIds != "") {
                Globals.GetCompaniesByRmagsAndInvitedCompanies(selectedRmagIds, $scope.Message.EVENT_ID).then(function (result) {
                    $scope.companyOptions = result.objResultList;
                    var selectedIds = _.pluck(result.objResultList, "COMPANY_ID");
                    if (selectedIds && selectedIds != null && selectedIds.length > 0) {
                        $.each(selectedIds, function (index, id) {
                            $scope.objSelectedCompanies.push({ COMPANY_ID: id });
                        });
                        $scope.companyChange();
                        setTooltipOnMultiSelect('divMultiSelCompany', $scope.companyOptions, $scope.objSelectedCompanies);
                    }
                });
            }
            else {
                $scope.companyChange();
            }
            setTooltipOnMultiSelect('divMultiSelRMAG', null, $scope.objSelectedRMAGs);
        };

        $scope.companyChange = function () {
            $scope.HideNotification();
            var selectedCompanies = $.map($scope.objSelectedCompanies, function (item) { return item.COMPANY_ID });
            if (selectedCompanies != [] && selectedCompanies.length > 0) {
                var api = "User/GetUsersEmailAddressByCompanyId?companyIds=" + selectedCompanies.toString();
                Globals.Get(api, null, true).then(function (result) {
                    $('#emailTo').tagsinput('removeAll');
                    $.each(result.objResult, function (index, item) {
                        if ($scope.removedEmailIds && $scope.removedEmailIds.length > 0) {
                            if (!_.contains($scope.removedEmailIds, item))
                                $('#emailTo').tagsinput('add', item);
                        }
                        else {
                            $('#emailTo').tagsinput('add', item);
                        }
                    });
                    $('#emailTo').tagsinput('refresh');
                });
            }
            else {
                $('#emailTo').tagsinput('removeAll');
                $scope.Message.RECIPIENTS = "";
                $scope.removedEmailIds = [];
            }
            $('#emailTo').on('itemRemoved', function (event) {
                $scope.removedEmailIds.push(event.item);
            });
            setTooltipOnMultiSelect('divMultiSelCompany', $scope.companyOptions, $scope.objSelectedCompanies);
        };


        $scope.showTimeZone = function () {
            var eventitem;
            eventitem = $.grep($scope.Events, function (elem, index) {
                return elem.EVENT_ID == $scope.Message.EVENT_ID;
            });
            Cookies.set('selectedEvent', eventitem[0].EVENT_ID, { path: '' });
            $scope.SelectedEventTimeZone = GetTimeZonePostFix(eventitem[0].TIME_ZONE.LU_NAME);
            $scope.HideNotification();
            var selectedRmagIds = $.map($scope.objSelectedRMAGs, function (item) { return item.RMAG_ID }).join(',');
            Globals.GetCompaniesByRmagsAndInvitedCompanies(selectedRmagIds, $scope.Message.EVENT_ID).then(function (result) {
                $scope.companyOptions = result.objResultList;
            });
        }
        $scope.sendEmail = function () {
            if ($scope.Message.CALL_ON != null && $scope.Message.CALL_ON != '') {
                var currentDate = kendo.parseDate($scope.Message.CALL_ON, "MM/dd/yyyy HH:mm");
                if (!currentDate) {
                    Utility.Notify({ type: NOTIFYTYPE.ERROR, message: "Invalid Date/Time of Call. Please provide correct date format (MM/dd/yyyy).", IsPopUp: true });
                    return;
                }
                var eventitem;
                eventitem = $.grep($scope.Events, function (elem, index) {
                    return elem.EVENT_ID == $scope.Message.EVENT_ID;
                });
                $scope.Message.TIME_ZONE_CALL_ON = kendo.toString($scope.Message.CALL_ON, 'MM/dd/yyyy HH:mm') + GetTimeZonePostFix(eventitem[0].TIME_ZONE.LU_NAME);
            }
            var validator = $("#frmMessageIndex").kendoValidator().data("kendoValidator");
            if (validator.validate()) {
                if (validateAllEmailAddresses()) {
                    if (($scope.Message.SUBJECT == null || $scope.Message.SUBJECT == '') && confirm("Are you sure you want to send the email without a subject?") != true) {
                        return;
                    }
                    if ($scope.currentUser != null) {
                        $scope.Message.CREATED_BY = $scope.currentUser.USER_ID;
                        $scope.Message.FROM = $scope.currentUser.EMAIL_ADDRESS;
                    }
                    $scope.Message.SUBJECT = ($scope.Message.SUBJECT == null || $scope.Message.SUBJECT == '') ? "no subject" : $scope.Message.SUBJECT;
                    $scope.Message.CONTENTS = ($scope.Message.CONTENTS == null) ? "" : $scope.Message.CONTENTS;
                    $scope.Message.CALL_PURPOSE_TEXT = $("#ddlPurpose").find("option:selected").text();

                    if ($('#ipAppendSenderID').is(":checked")) {
                        $scope.Message.USER_INFO += "<tr><td></td></tr><tr><td></td></tr><tr><td>" + $rootScope.currentUser.FIRST_NAME + " " + $rootScope.currentUser.LAST_NAME + "</td></tr>";
                        if ($scope.currentUser != null) {
                            $scope.Message.USER_INFO += "<tr><td>" + $scope.currentUser.EMAIL_ADDRESS + "</td></tr>";
                            $scope.Message.USER_INFO += "<tr><td>" + $scope.currentUser.MOBILE_PHONE + "</td></tr>";
                        }
                    }
                    else {
                        $scope.Message.USER_INFO = '';
                    }
                    $scope.Message.MESSAGE_RMAGS = $.map($scope.objSelectedRMAGs, function (item) { return item.RMAG_ID });
                    $scope.Message.MESSAGE_COMPANIES = $.map($scope.objSelectedCompanies, function (item) { return item.COMPANY_ID });

                    if ($scope.Events && $scope.Events.length > 0) {
                        var selEvent = _.findWhere($scope.Events, { EVENT_ID: parseInt($scope.Message.EVENT_ID) });
                        if (selEvent)
                            $scope.Message.EVENT_NAME = selEvent.EVENT_NAME;
                    }
                    if ($scope.objSelectedRMAGs && $scope.objSelectedRMAGs.length > 0) {
                        var selRmags = _.pluck($scope.objSelectedRMAGs, "RMAG_NAME");
                        if (selRmags)
                            $scope.Message.RMAG_NAMES = selRmags.join(',');
                    }

                    Globals.CheckActiveEventFromDB($scope.Message.EVENT_ID);
                    if (Globals.isActiveEventClosed) {
                        resetControls();
                        return;
                    }

                    if (AppSettings.StopGeneratingEventEmails)
                        return true;
                    MessagesService.ScheduleMeeting(JSON.stringify($scope.Message)).then(function (result) {
                        isChildDataChanged = false;
                        onSuccess(result);
                        NotificationService.transmit('Message');

                        var lastSelectedEventId = $scope.Message.EVENT_ID;
                        $scope.Message = angular.copy($scope.emptyState);
                        $('#emailTo').tagsinput('removeAll');
                        $scope.removedEmailIds = [];
                        $('#ipAppendSenderID').prop('checked', false);
                        $scope.objSelectedRMAGs = [];
                        $scope.objSelectedCompanies = [];
                        $scope.Message.EVENT_ID = lastSelectedEventId;
                        $scope.Message.EVENT_TYPE = $scope.selectedEventType;
                        $scope.Message.PURPOSE_ID = -1;
                        $scope.$apply();
                    }).fail(onError);
                }
                else {
                    Utility.Notify({ type: NOTIFYTYPE.ERROR, message: "Some email addresses are not in correct format.", IsPopUp: true });
                }
            }
            else {
                Utility.Notify({ type: NOTIFYTYPE.ERROR, message: "Please provide mandatory fields.", IsPopUp: true });
            }
        };

        function resetControls() {            
            isChildDataChanged = false;
            $('#emailTo').tagsinput('removeAll');
            $scope.removedEmailIds = [];
            $('#ipAppendSenderID').prop('checked', false);
            $scope.objSelectedRMAGs = [];
            $scope.objSelectedCompanies = [];

            $scope.Message.PURPOSE_ID = -1;

            setTooltipOnMultiSelect('divMultiSelRMAG', null, $scope.objSelectedRMAGs);
            setTooltipOnMultiSelect('divMultiSelCompany', $scope.companyOptions, $scope.objSelectedCompanies);

            $scope.loadPrimaryData();
        }

        function validateAllEmailAddresses() {
            var isInvalid = false;
            var allEmails = $("#emailTo").val().split(',');
            if (allEmails != null && allEmails.length > 0) {
                $.each(allEmails, function (index, email) {
                    isInvalid = Globals.validateEmail(email);
                    if (isInvalid == false) {
                        return false;
                    }
                });
            }
            return isInvalid;
        }
        function onSuccess(result) {
            Utility.Notify({ type: NOTIFYTYPE.SUCCESS, message: "Message Sent.", IsPopUp: $scope.ngDialogData });
        }
        function onError(XMLHttpRequest, textStatus, errorThrown) {
            Utility.Notify({ type: NOTIFYTYPE.ERROR, message: XMLHttpRequest.responseText, IsPopUp: $scope.ngDialogData });
        }

    }
]);