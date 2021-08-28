
angular.module('HylanApp').controller("ProjectCRUDController", ['$rootScope', '$scope', '$controller', '$timeout', 'ProjectCRUDService', 'Utility', 'NOTIFYTYPE', 'NotificationService', 'HylanApp.commonValidationService','hylanCache',
    function ($rootScope, $scope, $controller, $timeout, ProjectCRUDService, Utility, NOTIFYTYPE, NotificationService, commonValidationService, hylanCache) {
      init();
      function init() {
        $scope.form = {};
        $scope.validationMessages = [];       
      }
      $scope.commonValidationService = commonValidationService;
      $scope.AllowToEdit = true;
      
      var editPerm = Globals.CheckEditPermission($scope.Screens.MANAGE_PROJECTS.ID);
      if (editPerm == false) {
          $scope.AllowToEdit = false;
          
      }
     
      var isScreenInitialized = false;
      var isDataChanged = false;
      $controller('BaseController', { $scope: $scope });
      $scope.ScreenTitle = "ADD";
      $scope.DialogChangesSaved = false;

      $scope.GetProjectDetails = function (ID) {
        if (ID && ID > 0)
          $scope.ScreenTitle = "UPDATE";

        ProjectCRUDService.RetrieveProject($scope.ngDialogData.ID).then(function (result) {
          $scope.projectDCModel = result.objResults;

          //formating date
          $scope.projectDCModel.TENTATIVE_PROJECT_START_DATE = FormatDate($scope.projectDCModel.TENTATIVE_PROJECT_START_DATE);
          $scope.projectDCModel.ACTUAL_PROJECT_START_DATE = FormatDate($scope.projectDCModel.ACTUAL_PROJECT_START_DATE);
          $scope.projectDCModel.PROJECTED_END_DATE = FormatDate($scope.projectDCModel.PROJECTED_END_DATE);
          $scope.projectDCModel.ACTUAL_PROJECT_CLOSE_DATE = FormatDate($scope.projectDCModel.ACTUAL_PROJECT_CLOSE_DATE);
          $scope.projectDCModel.PROJECT_BID_DATE = FormatDate($scope.projectDCModel.PROJECT_BID_DATE);
          $scope.projectDCModel.PROJECT_AWARDED = FormatDate($scope.projectDCModel.PROJECT_AWARDED);



          if ($scope.ngDialogData.ID == 0) {
              $scope.projectDCModel.PROJECT_STATUS.LOOK_UP_ID = "-1";
              $scope.projectDCModel.PO_AMOUNT = 0;
          }
          $timeout(function () {
            $scope.projectDCModel = $scope.projectDCModel;
            isDataChanged = false;
          });
        }).fail(onError);
      };

      if ($scope.ngDialogData) {
        $scope.GetProjectDetails($scope.ngDialogData.ID);
      }
      Globals.GetLookUp(Globals.LookUpTypes.PROJECT_STATUS, false, function (result) {
        $scope.ProjectStatusDS = result;
      });
      Globals.GetCompanies(false).then(function (result) {
        $scope._ClientsDS = result.objResultList;
      });

      $scope.$watch('projectDCModel', function (newValue, oldValue) {
        if (this.last) {
          if (isScreenInitialized) {
            isDataChanged = true;
          }
          else
              isScreenInitialized = true;
          if ($scope.AllowToEdit == false)
          {
              isDataChanged = false;
              isScreenInitialized = false;
          }
        }
      }, true);

      $scope.PostData = function (thisForm) {
        $scope.thisForm = thisForm;
        $scope.validationMessages = [];
        $scope.$broadcast('saveClicked', {
          form: thisForm, validationMessages: $scope.validationMessages
        });
        
        if (thisForm.$valid) {
          if (thisForm.$pristine) {
            alert(Globals.NoChanges);
            return;
          }
          $scope.projectDCModel.MODIFIED_BY = $scope.ngDialogData.USER_ID;
          $scope.projectDCModel.MODIFIED_ON = new Date();
          if ($scope.ngDialogData.ID <= 0) { // For new projects
            $scope.projectDCModel.CREATED_ON = $scope.projectDCModel.MODIFIED_ON;
            $scope.projectDCModel.CREATED_BY = $scope.projectDCModel.MODIFIED_BY;
          }

          var seprator = "";
          var jobNumber = "";
          if ($scope.projectDCModel.HYLAN_JOB_NUMBER && $scope.projectDCModel.HYLAN_JOB_NUMBER != '') {
            seprator = "-";
            jobNumber = $scope.projectDCModel.HYLAN_JOB_NUMBER;
          }
          $scope.projectDCModel.HYLAN_PROJECT_ID = jobNumber + seprator + $scope.projectDCModel.PROJECT_BID_NAME;

          var crudAction = ($scope.ngDialogData.ID > 0) ? ProjectCRUDService.UpdateProject : ProjectCRUDService.CreateProject;

          crudAction(JSON.stringify($scope.projectDCModel)).then(function (result) {
            $scope.DialogChangesSaved = true;
            onSuccess(result);
            isDataChanged = false;
            isChildDataChanged = false;
            $timeout(function () { });
            if ($scope.ngDialogData.ID == 0) //add mode
            {
                $scope.ngDialogData.ID = result;
                $scope.GetProjectDetails($scope.ngDialogData.ID);
                if ($scope.projectDCModel.PROJECT_STATUS == 1) {
                    var latestProjects = [];
                    $scope.ngDialogData.ID = $scope.projectDCModel.PROJECT_ID;
                    latestProjects.push($scope.projectDCModel);
                   
                }

            }
            else {
                $scope.GetProjectDetails($scope.ngDialogData.ID);
            }
            hylanCache.SetValue(hylanCache.Keys.NEWLYADDED_ROWID, $scope.ngDialogData.ID, $scope.Screens.MANAGE_PROJECTS.ID);
            $scope.thisForm.$setPristine();
          }).fail(onError);
        }
        else {
          Utility.Notify({ type: NOTIFYTYPE.ERROR, message: $scope.validationMessages, IsPopUp: true });
        }

      };

      function onSuccess(result) {
        Utility.Notify({ type: NOTIFYTYPE.SUCCESS, message: Globals.SaveMessage, IsPopUp: $scope.ngDialogData });

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
              $scope.GetProjectDetails(exceptionfieldids[0]);
          }

          if (exceptionMsg != undefined && exceptionMsg == 'ProjectName') {
              $scope.duplicateError = exceptionMsg;
              $scope.$apply(function () {
                  $scope.ValidateDuplicateRecord($scope.thisForm.txtProjectName, $scope.duplicateError);
              });
              $scope.$broadcast('saveClicked', {
                  form: $scope.thisForm, validationMessages: $scope.validationMessages
              });
              Utility.Notify({ type: NOTIFYTYPE.ERROR, message: $scope.validationMessages, IsPopUp: true });
          }
          else
              Utility.Notify({ type: NOTIFYTYPE.ERROR, message: exceptionMsg, IsPopUp: $scope.ngDialogData });
      }

      $scope.ValidateDuplicateRecord = function (control, error) {
        $scope.commonValidationService.ValidateDuplicateRecord(control, error);
        if (error === '') {
          Utility.HideNotification();
        }
      }
      $scope.DataChanged = function () {
        Utility.HideNotification();
        isDataChanged = true;
        isChildDataChanged = true;
        $scope.DialogChangesSaved = false;
      }
    }
]);

