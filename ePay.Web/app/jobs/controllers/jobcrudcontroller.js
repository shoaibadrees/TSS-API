var _ClientsDS;


angular.module('HylanApp').controller("JobCRUDController", ['$rootScope', '$scope', '$controller', '$timeout', 'JobCRUDService', 'Utility', 'NOTIFYTYPE', 'NotificationService', 'HylanApp.commonValidationService', '$filter', 'hylanCache',
    function ($rootScope, $scope, $controller, $timeout, JobCRUDService, Utility, NOTIFYTYPE, NotificationService, commonValidationService, $filter, hylanCache) {
      init();
      function init() {
        $scope.form = {};
        $scope.validationMessages = [];
        $scope.jobDCModel = {
          PROJECT_ID: 0,
          STATE: 0,
          JOB_STATUS: 0,
          PO_AMOUNT: 0,
          INVOICE_AMOUNT: 0,
        };
      }
      $scope.commonValidationService = commonValidationService;

      var isScreenInitialized = false;
      var isDataChanged = false;
      $controller('BaseController', { $scope: $scope });
      $scope.ScreenTitle = "ADD";
      $scope.DialogChangesSaved = false;

      Globals.GetLookUp(Globals.LookUpTypes.DOITT_NTP_STATUS, false, function (result) {
        $scope.doittNTPStatusLU = result;
      });

      Globals.GetLookUp(Globals.LookUpTypes.JOB_STATUS, false, function (result) {
        $scope.jobStatusLU = result;
      });

      Globals.GetLookUp(Globals.LookUpTypes.JOB_CATEGORY, false, function (result) {
        $scope.jobCategoryLU = result;
      });
      $scope.DSStates = Globals.GetStates();
      
      Globals.GetProjects().then(function (result) {
          //$scope.DSProjects = result.objResultList;
          $scope.DSProjects = $filter('orderBy')(result.objResultList, 'HYLAN_PROJECT_ID');
      });

      Globals.GetUsers(false, AppSettings.Hylan_PM_RoleName).then(function (result) {
        $scope.DSAdminUsers = result.objResultList;
      });

      $scope.GetJobDetails = function (JOB_ID) {
        if (JOB_ID > 0) {
          $scope.ScreenTitle = "UPDATE";
          $scope.primaryFields = false;
        }
        $scope.AllowToEdit = true;
        var editPerm = Globals.CheckEditPermission($scope.Screens.MANAGE_JOBS.ID);
        if (editPerm == false)
            $scope.AllowToEdit = false;
        JobCRUDService.RetrieveJob(JOB_ID).then(function (result) {
          $scope.jobDCModel = result.objResult;

          $scope.jobDCModel.DOITT_NTP_GRANTED_DATE = FormatDate($scope.jobDCModel.DOITT_NTP_GRANTED_DATE);
          $scope.jobDCModel.PUNCHLIST_SUBMITTED_DATE = FormatDate($scope.jobDCModel.PUNCHLIST_SUBMITTED_DATE);
          $scope.jobDCModel.CLIENT_APPROVAL_DATE = FormatDate($scope.jobDCModel.CLIENT_APPROVAL_DATE);
          $scope.jobDCModel.INVOICE_DATE = FormatDate($scope.jobDCModel.INVOICE_DATE);
          $scope.jobDCModel.JOB_FILE_NUMBER = $scope.jobDCModel.JOB_FILE_NUMBER;
          $scope.jobDCModel.ZIP = $scope.jobDCModel.ZIP;
          //$scope.DSProjects = Globals.GetProjects();
          if ($scope.ScreenTitle == "ADD") {
            $scope.primaryFields = false;
            //$scope.jobDCModel.PROJECT_STATUS = "-1";
          }
          $timeout(function () {
            $scope.jobDCModel = $scope.jobDCModel;
            isDataChanged = false;
          });
        }).fail(onError);
      };

      if ($scope.ngDialogData && $scope.ngDialogData.JOB_ID) {
        $scope.GetJobDetails($scope.ngDialogData.JOB_ID);
      }


      $scope.$watch('jobDCModel', function (newValue, oldValue) {
        if (this.last) {
          if (isScreenInitialized) {
            isDataChanged = true;
          }
          else
            isScreenInitialized = true;
        }
      }, true);

      $scope.ChangeStart = function (element) {
        isDataChanged = true;
        $scope.DialogChangesSaved = false;
      };

      $scope.PostData = function (thisForm) {
        $scope.thisForm = thisForm;
        $scope.validationMessages = [];
        $scope.$broadcast('saveClicked', { form: thisForm, validationMessages: $scope.validationMessages });
        if (thisForm.$valid) {
          if (isDataChanged) {
            isChildDataChanged = false;
            if ($scope.jobDCModel.JOB_STATUS == 9 && ($scope.jobDCModel.ON_HOLD_REASON == undefined || $scope.jobDCModel.ON_HOLD_REASON == false)) {
              Utility.Notify({ type: NOTIFYTYPE.ERROR, message: Globals.OnHoldReason, IsPopUp: true });
              return false;
            }
            $scope.jobDCModel.MODIFIED_BY = $scope.ngDialogData.USER_ID;
            $scope.jobDCModel.MODIFIED_ON = new Date();
            if ($scope.ngDialogData.JOB_ID <= 0) { // For new projects
              $scope.jobDCModel.CREATED_ON = $scope.jobDCModel.MODIFIED_ON;
              $scope.jobDCModel.CREATED_BY = $scope.jobDCModel.MODIFIED_BY;
            }

            var crudAction = ($scope.ngDialogData.JOB_ID > 0) ? JobCRUDService.UpdateJob : JobCRUDService.CreateJob;

            crudAction(JSON.stringify($scope.jobDCModel)).then(function (result) {
              onSuccess(result);
              NotificationService.transmit('Jobs');
              isDataChanged = false;
              $scope.DialogChangesSaved = true;
              $timeout(function () { });
              //$scope.ngDialogData.ID = result;

              if ($scope.ngDialogData.JOB_ID == 0) //add mode
              {
                $scope.ngDialogData.JOB_ID = result;
              }

              $scope.GetJobDetails($scope.ngDialogData.JOB_ID);
              hylanCache.SetValue(hylanCache.Keys.NEWLYADDED_ROWID, $scope.ngDialogData.JOB_ID, $scope.Screens.MANAGE_JOBS.ID);
            }).fail(onError);
          }
            else {
                alert(Globals.NoChanges);
            }
        } else {
          Utility.Notify({ type: NOTIFYTYPE.ERROR, message: $scope.validationMessages, IsPopUp: true });
        }

      };

      function onSuccess(result) {
        Utility.Notify({ type: NOTIFYTYPE.SUCCESS, message: "Changes Saved.", IsPopUp: $scope.ngDialogData });

      }

      function onError(XMLHttpRequest, textStatus, errorThrown) {
        var exception = XMLHttpRequest.responseText ? XMLHttpRequest.responseText : errorThrown;
        var exceptionfieldindex = exception.indexOf('$');
        var exceptionMsg = exception.substring(0, exceptionfieldindex);
        var exceptionfieldids = exception.substring(exceptionfieldindex + 2, exception.length).split(',');
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
          $scope.GetJobDetails(exceptionfieldids[0]);
        }

        if (exceptionMsg != undefined && exceptionMsg == "JobNumber") {
            $scope.duplicateError = exceptionMsg;
            $scope.$apply(function () {
                $scope.ValidateDuplicateRecord($scope.thisForm.txtJobNumber, $scope.duplicateError);
            });
            $scope.$broadcast('saveClicked', {
                form: $scope.thisForm, validationMessages: $scope.validationMessages
            });
            Utility.Notify({ type: NOTIFYTYPE.ERROR, message: Globals.UniqueJobFileNo, IsPopUp: true });
        }
        else {
            if (exceptionMsg.indexOf("Job File Number already exists") !=-1)
            {
                $scope.duplicateError = "JobNumber";
                $scope.ValidateDuplicateRecord($scope.thisForm.txtJobNumber, $scope.duplicateError);
            }
            Utility.Notify({ type: NOTIFYTYPE.ERROR, message: exceptionMsg, IsPopUp: true });
        }
      }

      $scope.ValidateDuplicateRecord = function (control, error) {
        $scope.commonValidationService.ValidateDuplicateRecord(control, error);
        if (error === '') {
          Utility.HideNotification();
        }
      }

      $scope.ChangeStart = function () {
        isDataChanged = true;
        isChildDataChanged = true;
        $scope.DialogChangesSaved = false;
        Utility.HideNotification();

      }

      $scope.txtDIDNumber_FocusOut = function () {
         var didNumber = $('#txtDIDNumber').val()
         if (didNumber.length == 3 && (didNumber.substring(0, 3) == "DID" || didNumber.substring(0, 3) == "PID")) {
            var didNumber = $('#txtDIDNumber').val("");
            $scope.jobDCModel.DID_NUMBER = "";
         }
      }
      $scope.txtDIDNumber_Focus = function () {
         //var didNumber = $('#txtDIDNumber').val()
         //if (didNumber.length == 0 ) {
         //   var didNumber = $('#txtDIDNumber').val("DID");
         //   $scope.jobDCModel.DID_NUMBER = "DID";
         //}
      }
      

      $scope.today = function () {
        $scope.dt = new Date();
      };
      $scope.today();

      $scope.clear = function () {
        $scope.dt = null;
      };

      $scope.inlineOptions = {
        customClass: getDayClass,
        minDate: new Date(),
        showWeeks: true
      };

      $scope.dateOptions = {
        dateDisabled: disabled,
        formatYear: 'yy',
        maxDate: new Date(2020, 5, 22),
        minDate: new Date(),
        startingDay: 1
      };

      // Disable weekend selection
      function disabled(data) {
        var date = data.date,
          mode = data.mode;
        return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
      }

      $scope.toggleMin = function () {
        $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
        $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
      };

      $scope.toggleMin();

      $scope.open1 = function () {
        $scope.popup1.opened = true;
      };

      $scope.open2 = function () {
        $scope.popup2.opened = true;
      };

      $scope.setDate = function (year, month, day) {
        $scope.dt = new Date(year, month, day);
      };

      $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
      $scope.format = $scope.formats[0];
      $scope.altInputFormats = ['M!/d!/yyyy'];

      $scope.popup1 = {
        opened: false
      };

      $scope.popup2 = {
        opened: false
      };

      var tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      var afterTomorrow = new Date();
      afterTomorrow.setDate(tomorrow.getDate() + 1);
      $scope.events = [
        {
          date: tomorrow,
          status: 'full'
        },
        {
          date: afterTomorrow,
          status: 'partially'
        }
      ];

      function getDayClass(data) {
        var date = data.date,
          mode = data.mode;
        if (mode === 'day') {
          var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

          for (var i = 0; i < $scope.events.length; i++) {
            var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

            if (dayToCheck === currentDay) {
              return $scope.events[i].status;
            }
          }
        }

        return '';
      }
    }



]);

