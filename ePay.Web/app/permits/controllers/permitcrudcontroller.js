var manPowerJobStatusLU;
angular.module('HylanApp').controller("PermitCRUDController", ['$rootScope', '$scope', '$controller', '$timeout', 'PermitCRUDService', 'Utility', 'NOTIFYTYPE', 'NotificationService', 'HylanApp.commonValidationService', 'JobCRUDService', 'AppConfig', '$filter', 'hylanCache',
function ($rootScope, $scope, $controller, $timeout, PermitCRUDService, Utility, NOTIFYTYPE, NotificationService, commonValidationService, JobCRUDService, AppConfig, $filter, hylanCache) {
        init();
        function init() {
            $scope.form = {};
            $scope.validationMessages = [];
            $scope.permitDCModel = {
                PROJECT_ID: 0,
                STATE: 0,
                PERMIT_STATUS: 0
            };
            $scope.ScreenTitle = "ADD";
            $scope.DialogChangesSaved = false;
            $scope.PageTitle = "Permit Details";
            $scope.DisableJobDetails = true;

            $scope.FirstPageSelected = true;
            $scope.isWorkDetailsInit = false;
            //manpower: "page2", labor: "page3", vehicles: "page4", materials: "page5", 
            var pages = { permitjob: "page1", otherDetails: "page2" };
            $scope.PermitTypeWorkFlow = [];
            $scope.PermitTypeWorkFlow["Permits"] = [pages.permitjob, pages.otherDetails];
            //$scope.PermitTypeWorkFlow["Node Install"] = [pages.permitjob, pages.manpower, pages.vehicles, pages.workdetail];
            //$scope.PermitTypeWorkFlow["Pole Work"] = [pages.permitjob, pages.manpower, pages.vehicles, pages.workdetail];
            //$scope.PermitTypeWorkFlow["Rodding/Roping"] = [pages.permitjob, pages.manpower, pages.vehicles, pages.workdetail];
            //$scope.PermitTypeWorkFlow["Underground/Foundation"] = [pages.permitjob, pages.manpower, pages.labor, pages.vehicles, pages.materials, pages.workdetail];
            //$scope.PermitTypeWorkFlow["WIFI"] = [];
            //$scope.PermitTypeWorkFlow["Liggins"] = [];
            //$scope.PermitTypeWorkFlow["Byrne"] = [];
            //$scope.sumTemplate = "#=(sum == undefined || sum == null) ? 0 : kendo.toString(sum,'n1')#";
            //$scope.manPowerJobTypeGroups = [];
            $scope.isLoadingRecord = true;
            $scope.permitStatusDefault = 0;

        }

        var editPerm = Globals.CheckEditPermission($scope.Screens.MANAGE_PERMITS.ID);
        if (editPerm == false) {
            $scope.AllowToEdit = false;
        }
        $scope.commonValidationService = commonValidationService;

        var isScreenInitialized = false;
        var isDataChanged = false;
        $controller('BaseController', { $scope: $scope });

        Globals.GetUsers(false, AppSettings.Hylan_PM_RoleName).then(function (result) {
            $scope.DSAdminUsers = result.objResultList;
        });

        Globals.GetLookUp(Globals.LookUpTypes.PERMIT_STATUS, false, function (result) {
            $scope.permitStatusOptions = result;
            var pendingItems = $.grep($scope.permitStatusOptions, function (e) {
                return e.LU_NAME == 'Pending';
            });
            if (pendingItems && pendingItems.length > 0) {
                $scope.permitStatusDefault = pendingItems[0].LOOK_UP_ID;
            }
            //
            var RejectedItems = $.grep($scope.permitStatusOptions, function (e) {
                return e.LU_NAME == 'Rejected';
            });
            if (RejectedItems && RejectedItems.length > 0) {
                $scope.RejectedPermitStatusID = RejectedItems[0].LOOK_UP_ID;
            }

            var ExpiredItems = $.grep($scope.permitStatusOptions, function (e) {
                return e.LU_NAME == 'Expired';
            });
            if (ExpiredItems && ExpiredItems.length > 0) {
                $scope.ExpiredPermitStatusID = ExpiredItems[0].LOOK_UP_ID;
            }
        });

        Globals.GetPermitTypes().then(function (result) {
            $scope.permitTypesOptions = result.objResultList;
            //$scope.projectIdDS = $filter('orderBy')($scope.projectIdDS, '-CREATED_ON');
            //if (hylanCache.GetValue(hylanCache.Keys.LATEST_PROJECTS) == undefined && $scope.projectIdDS.length > 0) {
            //    var latestProjects = [];
            //    latestProjects.push($scope.projectIdDS[0]);
            //    hylanCache.SetValue(hylanCache.Keys.LATEST_PROJECTS, latestProjects);
            //}
        });

        $scope.currentPage = "page1";
        //$scope.RejectedPermitStatusID = 0;
        $scope.UpdatePermitDcModel = function (permitDcModel) {
            $scope.permitDCModel = permitDcModel;

            $scope.permitDCModel.MARKOUT_START_DATE = FormatDate($scope.permitDCModel.MARKOUT_START_DATE);
            $scope.permitDCModel.MARKOUT_END_DATE = FormatDate($scope.permitDCModel.MARKOUT_END_DATE);
            $scope.permitDCModel.ISSUED_DATE = FormatDate($scope.permitDCModel.ISSUED_DATE);
            $scope.permitDCModel.VALID_DATE = FormatDate($scope.permitDCModel.VALID_DATE);
            $scope.permitDCModel.EXPIRES_DATE = FormatDate($scope.permitDCModel.EXPIRES_DATE);
            $scope.permitDCModel.SUBMITTED_DATE = FormatDate($scope.permitDCModel.SUBMITTED_DATE);
            $scope.permitDCModel.REJECTED_DATE = FormatDate($scope.permitDCModel.REJECTED_DATE);

            $scope.permitDCModel.PERMIT_DATE = FormatDate($scope.permitDCModel.PERMIT_DATE);
            if ($scope.permitDCModel.PERMIT_ID == 0) {
                $scope.permitDCModel.PERMIT_DATE = '';
                $scope.permitDCModel.PROJECT_ID = ($scope.permitDCModel.PROJECT_ID == null) ? "" : $scope.permitDCModel.PROJECT_ID;
                $scope.permitDCModel.JOB_ID = ($scope.permitDCModel.JOB_ID == null) ? "" : $scope.permitDCModel.JOB_ID;
            }
            else {
                $scope.permitDCModel.PROJECT_ID = ($scope.permitDCModel.PROJECT_ID == null) ? -1 : $scope.permitDCModel.PROJECT_ID;
                $scope.permitDCModel.JOB_ID = ($scope.permitDCModel.JOB_ID == null) ? -1 : $scope.permitDCModel.JOB_ID;
            }

            if ($scope.permitDCModel.PERMIT_STATUS == $scope.RejectedPermitStatusID || $scope.permitDCModel.REJECTED_DATE || $scope.permitDCModel.REJECTED_REASON) {
                $scope.IsRejectedStatus = true;
            }

            if ($scope.permitDCModel.PERMIT_STATUS == $scope.ExpiredPermitStatusID) {
                $scope.IsExpiresDateRequired = true;
            }

            if ($scope.ScreenTitle == "ADD") {
                $scope.primaryFields = false;
            }
            $timeout(function () {
                $scope.permitDCModel = $scope.permitDCModel;
                isDataChanged = false;
                $scope.SetWorkFlowSteps();
            });

        };

        $scope.DSStates = Globals.GetStates();

        $scope.GetPermitDetails = function (PERMIT_ID, updatedPermitDcModel) {
            if (PERMIT_ID > 0) {
                $scope.ScreenTitle = "UPDATE";
                $scope.primaryFields = false;
            }
            if (updatedPermitDcModel == undefined) {
                PermitCRUDService.RetrievePermit(PERMIT_ID).then(function (result) {
                    $scope.UpdatePermitDcModel(result.objResult);
                }).fail(onError);
            }
            else {
                $scope.UpdatePermitDcModel(updatedPermitDcModel);
            }
            if ($scope.permitDCModel.PERMIT_ID == 0) {//add mode set default values
                $scope.permitDCModel.PERMIT_STATUS = $scope.permitStatusDefault;
            }

        };

        if ($scope.ngDialogData && $scope.ngDialogData.PERMIT_ID != undefined) {
            $scope.GetPermitDetails($scope.ngDialogData.PERMIT_ID);
        }
        $scope.OnChangeJobFileNumber = function () {
            $scope.ChangeStart();
            if ($scope.permitDCModel.JOB_ID == undefined) {
                $scope.DisableJobDetails = true;
                clearJobRelatedControls();
            }
            else if ($scope.permitDCModel.JOB_ID == "-1" || $scope.permitDCModel.PROJECT_ID == "-1") {// Unknowns
                $scope.DisableJobDetails = false;
                $scope.permitDCModel.PROJECT_ID = -1;
                //clear controls
                clearJobRelatedControls();
            }
            else {
                $scope.DisableJobDetails = true;

                if ($scope.permitDCModel.JOB_ID && $scope.permitDCModel.JOB_ID != "") {
                    JobCRUDService.RetrieveJob($scope.permitDCModel.JOB_ID).then(function (result) {
                        var jobDCModel = result.objResult;

                        $scope.permitDCModel.CLIENT = jobDCModel.CLIENT_NAME;
                        $scope.permitDCModel.NODE_ID1 = jobDCModel.NODE_ID1;
                        $scope.permitDCModel.NODE_ID2 = jobDCModel.NODE_ID2;
                        $scope.permitDCModel.NODE_ID3 = jobDCModel.NODE_ID3;
                        $scope.permitDCModel.HUB = jobDCModel.HUB;
                        $scope.permitDCModel.STREET_ADDRESS = jobDCModel.STREET_ADDRESS;
                        $scope.permitDCModel.CITY = jobDCModel.CITY;
                        $scope.permitDCModel.STATE = jobDCModel.STATE;
                        $scope.permitDCModel.ZIP = jobDCModel.ZIP;
                        $scope.permitDCModel.LAT = jobDCModel.LAT;
                        $scope.permitDCModel.LONG = jobDCModel.LONG;
                        $scope.permitDCModel.POLE_LOCATION = jobDCModel.POLE_LOCATION;
                        $scope.permitDCModel.HYLAN_PM = jobDCModel.HYLAN_PM;


                    }).fail(onError);
                }
            }


        };


        function clearJobRelatedControls() {
            if ($scope.isLoadingRecord == true) {
                return;
            }
            $scope.permitDCModel.CLIENT = "";
            $scope.permitDCModel.NODE_ID1 = "";
            $scope.permitDCModel.NODE_ID2 = "";
            $scope.permitDCModel.NODE_ID3 = "";
            $scope.permitDCModel.HUB = "";
            $scope.permitDCModel.STREET_ADDRESS = "";
            $scope.permitDCModel.CITY = "";
            $scope.permitDCModel.STATE = "";
            $scope.permitDCModel.ZIP = "";
            $scope.permitDCModel.LAT = "";
            $scope.permitDCModel.LONG = "";
            $scope.permitDCModel.POLE_LOCATION = "";
            $scope.permitDCModel.HYLAN_PM = 0;
        }

        $scope.PermitType_Change = function () {
            if ($scope.permitDCModel.PERMIT_TYPE != null && $scope.permitDCModel.PERMIT_TYPE.length == 4) {
                //populate values from DB
                $scope.permitDCModel.PERMIT_TYPE = $filter("uppercase")($scope.permitDCModel.PERMIT_TYPE)
                var item = $.grep($scope.permitTypesOptions, function (e) {
                    return e.PERMIT_TYPE_ID == $scope.permitDCModel.PERMIT_TYPE;
                });

                if (item && item.length > 0) {
                    $scope.permitDCModel.PERMIT_CATEGORY = item[0].PERMIT_CATEGORY;
                    $("#divPermitType").removeClass("has-error");
                }
                else {
                    $scope.permitDCModel.PERMIT_CATEGORY = -1
                }
            }
            $scope.ChangeStart();
        };



        $scope.FillJobFileNumberDropDown = function () {
            if ($scope.permitDCModel.PROJECT_ID == undefined || $scope.permitDCModel.PROJECT_ID == "") {
                $scope.DSJobFileNumbers = [];
                $scope.permitDCModel.JOB_ID == "";
                clearJobRelatedControls();
                return;
            }
            else if ($scope.permitDCModel.PROJECT_ID == "-1") { // Unknown
                $scope.DisableJobDetails = false;
            }
            else {
                $scope.DisableJobDetails = true;
            }
            var projectIds = '';
            var selPrjId = $scope.permitDCModel.PROJECT_ID;
            if (selPrjId == "-1") {
                $scope.DSJobFileNumbers = [{ VALUE: -1, TEXT: "Unknown" }];
                $scope.permitDCModel.JOB_ID = -1;
                clearJobRelatedControls();
                return;
            }
                //else if (selPrjId == "" || selPrjId == null) {
                //    $.each($scope.DSProjects, function (index, item) {
                //        if (item.PROJECT_ID != "" && item.PROJECT_ID != "-1") {
                //            projectIds += item.PROJECT_ID;
                //            if ((index + 1) < $scope.DSProjects.length) {
                //                projectIds += ',';
                //            }
                //        }
                //    });
                //}
            else if (selPrjId != "") {
                projectIds = selPrjId;
                clearJobRelatedControls();
                Globals.GetJobFileNumbers(projectIds).then(function (result) {
                    var unknownJob = { VALUE: -1, TEXT: "Unknown" };
                    if (result.objResultList && result.objResultList.length == 0)
                        result.objResultList = [];
                    //result.objResultList.splice(0, 0, unknownJob);
                    $scope.DSJobFileNumbers = $filter('orderBy')(result.objResultList, 'TEXT');
                    $timeout(function () {
                        $scope.DSJobFileNumbers = $scope.DSJobFileNumbers;
                    });

                });
            }
        };
        Globals.GetProjects().then(function(result) {
            var unknownPrj = { PROJECT_ID: -1, HYLAN_PROJECT_ID: "Unknown" };
            if (result.objResultList && result.objResultList.length == 0)
                result.objResultList = [];

            $scope.DSProjects = $filter('orderBy')(result.objResultList, 'HYLAN_PROJECT_ID');
            $scope.DSProjects.splice(0, 0, unknownPrj);

            $scope.FillJobFileNumberDropDown();
        });



        Globals.GetLookUp(Globals.LookUpTypes.PERMIT_CATEGORY, false, function (result) {
            $scope.permitCategoryOptions = result;
        });

        Globals.GetLookUp(Globals.LookUpTypes.PERMIT_REJECTION_REASON, false, function (result) {
            $scope.rejectedReasonOptions = result;
        });

        //Globals.GetUsers(false, AppSettings.Hylan_PM_RoleName).then(function (result) {
        //    $scope.DSAdminUsers = result.objResultList;
        //});



        $scope.IsValidPermitType = function () {
            if ($scope.permitDCModel.PERMIT_TYPE && $scope.permitDCModel.PERMIT_TYPE.length == 4 && ($scope.permitDCModel.PERMIT_CATEGORY < 0)) {
                $("#divPermitType").addClass("has-error");
                return false;
            }
            else {
                $("#divPermitType").removeClass("has-error");
            }
            return true;
        }

        var UnknownCheck = function () {
            if ($scope.permitDCModel.PROJECT_ID == -1 && $scope.permitDCModel.JOB_ID != -1
                || $scope.permitDCModel.PROJECT_ID != -1 && $scope.permitDCModel.JOB_ID == -1) {
                return false;
            }
            return true;
        }

        $scope.Repeat = function () {

            //get all data from server side against 
            Utility.HideNotification();
            var message = Globals.ChangesLostMessage;
            if (isDataChanged == true || isChildDataChanged == true) {
               alert("Please save your changes before performing 'Repeat' operation.");
                    return;
            }

            if (confirm( Globals.PermitRepeatMessage ) == true) {; }
            else return;

            $scope.GetPermitDetails($scope.ngDialogData.PERMIT_ID);
            $scope.ScreenTitle = "Add";
            $scope.PermitStatusChange();
            $scope.permitDCModel.PERMIT_ID = 0;
            $scope.permitDCModel.IsRepeatOperation = true;
            $scope.IsRepeatOperation = true;
            isDataChanged = true;
            isChildDataChanged = true;

            $("#li-" + 'page1').removeClass("completed").addClass("edit");
            if ($scope.permitDCModel.IS_PAGE2_FILLED) {
                $("#li-" + 'page2').removeClass("completed").addClass("edit");
            }

            $scope.NextPrevClick('', 'page1');
            //set focus on dotTracking No
            $scope.permitDCModel.PERMIT_NUMBER_TEXT = null;
            $scope.permitDCModel.SUBMITTED_DATE = null;
            $scope.permitDCModel.PERMIT_STATUS = $scope.permitStatusDefault;
            $scope.PermitStatusChange();
            $("#target").focus('#txtSubmittedDate');

        }

        ValidateAllDates = function () {
            IsValid = true;
            //if (!$scope.IsValidDate('txtSubmittedDate')) IsValid = false;
            if (!$scope.IsValidDate('txtExpiresDate')) IsValid = false;
            if (!$scope.IsValidDate('txtRejectedDate')) IsValid = false;
            if (!$scope.IsValidDate('txtMarkoutStartDate')) IsValid = false;
            if (!$scope.IsValidDate('txtMarkoutEndDate')) IsValid = false;
            if (!$scope.IsValidDate('txtIssuedDate')) IsValid = false;
            if (!$scope.IsValidDate('txtValidDate')) IsValid = false;


            return IsValid;
        }

        $scope.IsValidDate = function (controlID) {
            control = $('#' +controlID);
            controlLabel = control.attr('hylancontrollabel');
            controlVal = control.val();
            if (controlVal != "" && kendo.parseDate(controlVal) == null) {
                if ($scope.validationMessages.indexOf(controlLabel + ": " + Globals.InvalidDateMessage + "<br/>")== -1) //if donot have value then push it
                    $scope.validationMessages.push(controlLabel + ": " + Globals.InvalidDateMessage + "<br/>");
                control.addClass('has-error')
                return false;
            }
            else {
                control.removeClass('has-error')
                return true;
            }
        }

        $scope.ValidateAndPostData = function (thisForm, fromBtnSave, sender, prmNextPageId) {
            var curPage = $("#pageSection > div:visible").attr("id");
            if (curPage == prmNextPageId) {
                return;
            }
            if ($scope.AllowToEdit==false) {
                $scope.NextPrevClick(sender, prmNextPageId);
                return;
            }
            thisForm.$submitted = true;
            $scope.thisForm = thisForm;
            $scope.validationMessages = [];
            $scope.$broadcast('saveClicked', {
                form: thisForm, validationMessages: $scope.validationMessages
            });

            if (!$scope.IsValidPermitType()) {
                $scope.validationMessages.push("Permit Type is invalid <br />");
            }

            if (!UnknownCheck) {
                $scope.validationMessages.push("Project ID and Job ID must be Unknown at the same time <br />");
            }
           var hasValidDates = ValidateAllDates();
           var IsValidStatus = $scope.PermitStatusChange();

           if (thisForm.$valid && $scope.IsValidPermitType() && hasValidDates && IsValidStatus) {
                if (sender != undefined || prmNextPageId) { // == "next" || sender == "back"
                    Utility.HideNotification();
                }
                $scope.PostData(fromBtnSave, sender, prmNextPageId);
            }
            else {
                Utility.Notify({
                    type: NOTIFYTYPE.ERROR, message: $scope.validationMessages, IsPopUp: true
                });
            }
        }        

    $scope.PostData = function (fromBtnSave, sender, prmNextPageId) {

            if (isDataChanged == true) {
                isChildDataChanged = false;
                $scope.permitDCModel.MODIFIED_BY = $scope.ngDialogData.USER_ID;
                $scope.permitDCModel.MODIFIED_ON = new Date();
                if ($scope.ngDialogData.PERMIT_ID <= 0) { // For new projects
                    $scope.permitDCModel.CREATED_ON = $scope.permitDCModel.MODIFIED_ON;
                    $scope.permitDCModel.CREATED_BY = $scope.permitDCModel.MODIFIED_BY;
                }

                var crudAction = ($scope.ngDialogData.PERMIT_ID > 0) ? PermitCRUDService.UpdatePermit : PermitCRUDService.CreatePermit;
                if ($scope.IsRepeatOperation == true) // Repeat - Always create new daily
                {
                    crudAction = PermitCRUDService.CreatePermit;
                    $scope.permitDCModel.IsRepeatOperation = true;
                }
                //curd action start
                $scope.permitDCModel.CurrentPage = $("#pageSection > div:visible").attr("id");
                var permit = $scope.permitDCModel;
                crudAction(JSON.stringify(permit)).then(function (result) {
                    if (result.permit.TRANSACTION_SUCCESS == true) {
                        isDataChanged = false;
                        $scope.DialogChangesSaved = true;
                       
                        $timeout(function () {
                    });
                        if ($scope.ngDialogData.PERMIT_ID != undefined && $scope.ngDialogData.PERMIT_ID == 0 || $scope.IsRepeatOperation == true) //add mode
                        {
                            $scope.ngDialogData.PERMIT_ID = result.PERMIT_ID;
                            hylanCache.SetValue(hylanCache.Keys.NEWLYADDED_ROWID, result.PERMIT_ID, $scope.ngDialogData.SCREEN_ID);
                        }
                        $scope.GetPermitDetails($scope.ngDialogData.PERMIT_ID, result.permit); // It will not make any extra api-calls
                        var curPageId = $("#pageSection > div:visible").attr("id");
                        $scope.currentPage = curPageId;
                        $("#li-" +curPageId).removeClass("edit").addClass("completed");
                        //if (curPageId == "page2" && $("#li-page3").hasClass("hide") == false) {
                        //    $("#li-page3").addClass("completed");
                        //}
                        if ($scope.IsRepeatOperation) {
                            $scope.IsRepeatOperation = false;
                            $("#li-" + 'page1').removeClass("edit").addClass("completed");
                            if ($scope.permitDCModel.IS_PAGE2_FILLED) {
                                $("#li-" + 'page2').removeClass("edit").addClass("completed");
                        }
                    }

                        if (sender == 'next' || sender == 'back' || prmNextPageId) {
                            $scope.NextPrevClick(sender, prmNextPageId); // Move to the next or prev page
                        }
                        else {
                            onSuccess(result);
                    }
                    }
                    else {
                        var retPermitDTO = result.permitDTO;
                        var errorMessage = '';
                        var temp =[];
                        temp.push(retPermitDTO.PERMITDC);
                        //var page1ResSummary = GetResultSummary($("#page1").data("page-title"), temp);
                        errorMessage += page1ResSummary.summary;
                        if (page1ResSummary.type == "CONCURRENCY_ERROR") {
                            $scope.GetPermitDetails(retPermitDTO.PERMITDC.PERMIT_ID);
                        }
                        else {
                            isDataChanged = true;
                    }

                        //var page6ResSummary = GetResultSummary($("#page6").data("page-title"), retPermitDTO.listWORK_DETAILDC);
                        errorMessage += page2ResSummary.summary;
                        $scope.isWorkDetailsInit = (page2ResSummary.type == "CONCURRENCY_ERROR") ? false: true;
                        Utility.Notify({
                                type: NOTIFYTYPE.ERROR, message: errorMessage
                    });
                }
                }).fail(onError);
                //curd action end
            }
            else {
                if (fromBtnSave == true)
                    alert(Globals.NoChanges);
                if (sender == 'next' || sender == 'back' || prmNextPageId != undefined)
                    $scope.NextPrevClick(sender, prmNextPageId);
        }
        };

            function onSuccess(result) {
            Utility.Notify({
                    type: NOTIFYTYPE.SUCCESS, message: "Changes Saved.", IsPopUp: $scope.ngDialogData
            });

        }

            function onError(XMLHttpRequest, textStatus, errorThrown) {
            var exception = XMLHttpRequest.responseText ? XMLHttpRequest.responseText : errorThrown;
            var exceptionfieldindex = exception.indexOf('$');
            var exceptionMsg = exception.substring(0, exceptionfieldindex);
            var exceptionfieldids = exception.substring(exceptionfieldindex +2, exception.length).split(',');
            if (Utility.IsJSON(exception)) {
                var jsonObj = JSON.parse(exception)
                if (jsonObj.Message) {
                    var dollarIndex = jsonObj.Message.indexOf('$');
                    if (dollarIndex > -1)
                        exceptionMsg = jsonObj.Message.substring(0, dollarIndex);
                    else
                        exceptionMsg = jsonObj.Message;
            }
            }
            if (exceptionMsg.indexOf(Globals.ConcurrencyMessageSingleRow) > -1 && exceptionfieldids.length > 0) {
                //refresh record
                //$scope.GetJobDetails(exceptionfieldids[0]);
                $scope.GetPermitDetails(exceptionfieldids[0]);
            }
            if (exceptionMsg.indexOf("Permit # already exists") != -1) {
                $("#txtPermitNumberText").addClass("has-error");
                $("#target").focus('#txtPermitNumberText');

            }
            Utility.Notify({ type: NOTIFYTYPE.ERROR, message: exceptionMsg, IsPopUp: true
            });

        }
       

        $scope.PermitStatusChange = function () {
            var isValid = true;
            if ($scope.permitDCModel.PERMIT_STATUS == $scope.RejectedPermitStatusID || $scope.permitDCModel.REJECTED_DATE || $scope.permitDCModel.REJECTED_REASON) {

                $scope.IsRejectedStatus = true;
                if ($scope.permitDCModel.REJECTED_DATE == undefined || $scope.permitDCModel.REJECTED_DATE == '') {
                    $("#txtRejectedDate").addClass("has-error");
                    isValid = false;
                }
                else {
                    if ($scope.IsValidDate('txtRejectedDate'))
                        $("#txtRejectedDate").removeClass("has-error");
                }

                if ($scope.permitDCModel.REJECTED_REASON == '' || $scope.permitDCModel.REJECTED_REASON == null) {
                    $("#ddlRejectedReason").addClass("has-error");
                    isValid = false;
                }
                else {
                    $("#ddlRejectedReason").removeClass("has-error");
                }

            }
            else {

                $scope.IsRejectedStatus = false;
                if ($scope.IsValidDate('txtRejectedDate'))
                    $("#txtRejectedDate").removeClass("has-error");
                $("#ddlRejectedReason").removeClass("has-error");
            }

            //if ($scope.permitDCModel.PERMIT_STATUS == $scope.RejectedPermitStatusID || $scope.permitDCModel.REJECTED_REASON) {
            //    $scope.IsRejectedReasonRequired = true;
            //    if ($scope.permitDCModel.REJECTED_REASON == undefined || $scope.permitDCModel.REJECTED_REASON == '')
            //        $("#txtRejectedDate").addClass("has-error");
            //    else {
            //        $("#txtRejectedDate").removeClass("has-error");
            //    }
            //    $('#ddlRejectedReason').addClass("has-error");
            //}
            //else {
            //    $scope.IsRejectedReasonRequired = false;
            //    $('#ddlRejectedReason').removeClass("has-error");
            //}

            if ($scope.permitDCModel.PERMIT_STATUS == $scope.ExpiredPermitStatusID) {
                $scope.IsExpiresDateRequired = true;
                if ($scope.permitDCModel.EXPIRES_DATE == undefined || $scope.permitDCModel.EXPIRES_DATE == '') {
                    $("#txtExpiresDate").addClass("has-error");
                    isValid = false;
                }
                else {
                    if ($scope.IsValidDate('txtExpiresDate'))
                        $("#txtExpiresDate").removeClass("has-error");

                }
            }
            else {
                $scope.IsExpiresDateRequired = false;
                if ($scope.IsValidDate('txtExpiresDate'))
                    $("#txtExpiresDate").removeClass("has-error");
            }


            //$scope.ChangeStart();
            return isValid;
        }

        $scope.PermitNumberTextChanged = function () {
            $("#txtPermitNumberText").removeClass("has-error");
        }

        $scope.ChangeStart = function () {
            $scope.PermitNumberTextChanged();
            isDataChanged = true;
            isChildDataChanged = true;
            //$scope.DialogChangesSaved = false;
            Utility.HideNotification();
            var curPageId = $("#pageSection > div:visible").attr("id");
            $("#li-" +curPageId).removeClass("completed").addClass("edit");
            //if ($scope.permitDCModel.PERMIT_DATE != "") {
            //    var permitDate = new Date($scope.permitDCModel.PERMIT_DATE);
            //    var weekDays =['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            //    $scope.permitDCModel.DAY_OF_WEEK = weekDays[permitDate.getDay()];
            //}
            //else {
            //    $scope.permitDCModel.DAY_OF_WEEK = "";
            //}
        }

            //$scope.OnChangePermitType = function () {
            //    $scope.ChangeStart();
            //    $scope.SetWorkFlowSteps();
            //};

        $scope.NextPrevClick = function (sender, prmNextPageId) {
            //var permitTypeText = $("#ddlPermitType option:selected").text();
            var currentPageSet = $scope.PermitTypeWorkFlow["Permits"];
            var nextPageId = (prmNextPageId == '' || prmNextPageId == undefined) ? undefined : prmNextPageId;

            var curPage = $("#pageSection > div:visible").attr("id");
            if (curPage == prmNextPageId) {
                    return;
        }
            var keepNavigating = true;

            if (keepNavigating == true) {
                var curIndex = currentPageSet.indexOf(curPage);

                var newPageIndex = (sender == "next") ? curIndex +1 : curIndex -1;
                if (nextPageId == undefined && newPageIndex >= 0 && newPageIndex < currentPageSet.length) {
                    nextPageId = currentPageSet[newPageIndex];
                    $scope.currentPage = nextPageId;
                }
                else {
                    newPageIndex = currentPageSet.indexOf(nextPageId);
            }
                if (nextPageId != undefined) {
                    $("#pageSection > div").addClass("hide");
                    $("#" +nextPageId).removeClass("hide");
                    $(".progress-indicator li").removeClass("active-page");
                    $("#li-" +nextPageId).addClass("active-page");
                    //setActivePageInfo(nextPageId);
                    $scope.PageTitle = $("#" +nextPageId).data("page-title");
                    $scope.FirstPageSelected = (nextPageId == "page1");
            }
                if (newPageIndex +1 == currentPageSet.length)
                    $("#nextButton").addClass("hide");
                else
                    $("#nextButton").removeClass("hide");

                if (newPageIndex > 0)
                    $("#backButton").removeClass("hide");
                else
                    $("#backButton").addClass("hide");

            //$scope.loadGridData();
        }
    };

    $scope.SetWorkFlowSteps = function () {
        //var permitTypeText = $("#ddlPermitType option:selected").text();
            var currentPageSet = $scope.PermitTypeWorkFlow["Permits"];
            if (currentPageSet != undefined) {
                $(".progress-indicator li").addClass("hide");
            }
            else {
        //$("#li-page3, #li-page5").addClass("hide");
    }
            $(currentPageSet).each(function (index, item) {
                $(".progress-indicator #li-" +item).removeClass("hide");
    });

            var firstStepLeft = ($(".progress-indicator li:visible").eq(0).width() / 2);
            var lastStepHalfWidth = $(".progress-indicator li:visible").eq($(".progress-indicator li:visible").length - 1).width() / 2;

            $(".progress-indicator span.line").css("left", (firstStepLeft +10) +150);
            var lineWidth = $(".progress-indicator").width() -(firstStepLeft +lastStepHalfWidth +6);
            $(".progress-indicator span.line").width(lineWidth -1);

            if ($scope.ngDialogData.PERMIT_ID > 0) {
                $("#li-page1").addClass("completed");
    }

            if ($scope.permitDCModel.IS_PAGE2_FILLED == true) {
                $("#li-page2").addClass("completed");
        }

    };

    $scope.isLoadingRecord = false;
    }
]);





