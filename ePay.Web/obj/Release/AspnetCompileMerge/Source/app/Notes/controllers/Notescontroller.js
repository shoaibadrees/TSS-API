
angular.module('HylanApp').controller("NotesController", ['$rootScope', '$scope', '$controller', '$timeout', 'Notesservice', 'Utility', 'NOTIFYTYPE', 'HylanApp.commonValidationService', '$state', '$stateParams', 'ngDialog', 'hylanCache',
    function ($rootScope, $scope, $controller, $timeout, Notesservice, Utility, NOTIFYTYPE, commonValidationService, $state, $stateParams, ngDialog, hylanCache) {
        init();
        function init() {
            $scope.form = {};
            $scope.validationMessages = [];
        }
        $scope.commonValidationService = commonValidationService;
        $scope.ScreenTitle = "ADD";
        $scope.ApiResource = "Notes";
        $scope.DialogChangesSaved = false;
        $scope.GetCustomToolbar = function () {
            var toolbar = [];
            return toolbar;
        };
        $scope.AllowToEdit = true;
        var isDataChanged = false;
        var editPerm = true;
        if ($scope.ngDialogData.SCREEN_ID == 2) {
            editPerm = Globals.CheckEditPermission($scope.Screens.PROJECT_NOTES.ID);
        }
        else if ($scope.ngDialogData.SCREEN_ID == 3) {
            editPerm = Globals.CheckEditPermission($scope.Screens.JOB_NOTES.ID);
        }
      if (editPerm == false)
          $scope.AllowToEdit = false;
      $scope.gridOptions.toolbar = $scope.GetCustomToolbar();
      $scope.gridOptions.editable = false;
      $scope.GetNotesDetails = function () {
        if ($scope.ngDialogData.SCREEN_ID && $scope.ngDialogData.SCREEN_RECORD_ID > 0)
          $scope.ScreenTitle = "ADD";
      };

      var datasource = new kendo.data.DataSource({
              transport: {
                  read: function (e) {
                      Notesservice.RetrieveNotes($scope.ngDialogData.SCREEN_ID, $scope.ngDialogData.SCREEN_RECORD_ID).then(function success(response) {
                          e.success(response.data.objResultsList);
                      }, function error(response) {
                          console.log(response);
                      });
                  }
              },
              sort: Notesservice.defaultSort
      });

      $scope.gridOptions = {
        columns: [
         { field: "ROW_HEADER", width: "20px", title: "   .", sortable: false, hidden: true, headerAttributes: { "class": "sub-col darkYellow-col rowHeaderHeadYellow", "style": "border-right: 0px !important;" }, attributes: { "class": "contert-alpha GridBorder rowHeaderCell" } },
         { field: "NOTE_ID", title: "NOTE ID", width: "0px", hidden: true, headerAttributes: { "class": "sub-col darkYellow-col rowHeaderHead2" }, attributes: { "class": "GridBorder" }, template: "#: NOTE_ID == null ? '' : NOTE_ID#" },
         { field: "NOTES", title: "NOTES", width: "350px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "GridBorder" }, template: "#: NOTES == null ? '' : NOTES#" },
         { field: "USER_NAME", title: "User Name", width: "100px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#: USER_NAME == null ? '' : USER_NAME#" },
         { field: "CREATED_ON", title: "Date/Time", width: "100px", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, attributes: { "class": "contert-number GridBorder" }, template: "#: CREATED_ON == null ? '' : moment(CREATED_ON).format('MM/DD/YYYY HH:mm')#" },
        ],                                                         
        pageable: false,
        sortable: {
          mode: "single",
          allowUnsort: false
        },
        dataSource: datasource
      }
      
      //$scope.defaultSort = Notesservice.defaultSort;
      //var sortdata = GetGridDataSource();
      //sortdata.sort($scope.defaultSort);
      $scope.closeModalWindow = function (thisForm) {
          if ( isDataChanged ) {
          if (confirm(Globals.ChangesLostMessage)) {
              $scope.closeDialog($scope.ngDialogData.SCREEN_RECORD_ID);
          }
        } else {
            $scope.closeDialog($scope.ngDialogData.SCREEN_RECORD_ID);
        }
      }

    

      $scope.PostData = function (thisForm) {
        $scope.thisForm = thisForm;
        $scope.validationMessages = [];
        $scope.$broadcast('saveClicked', { form: thisForm, validationMessages: $scope.validationMessages });
        if (thisForm.$valid) {
          //AddRowInGrid(GetGridDataSource());
          if ($scope.NoteDCModel.NOTES != '') {
            var currentDateTime = FormatDate(new Date(), false, false, true);
            $scope.NoteDCModel.NOTES = $scope.NoteDCModel.NOTES;
            $scope.NoteDCModel.MODIFIED_BY = $scope.ngDialogData.USER_ID;
            $scope.NoteDCModel.MODIFIED_ON = currentDateTime;
            $scope.NoteDCModel.SCREEN_ID = $scope.ngDialogData.SCREEN_ID;
            $scope.NoteDCModel.SCREEN_RECORD_ID = $scope.ngDialogData.SCREEN_RECORD_ID;
            $scope.NoteDCModel.CREATED_ON = $scope.NoteDCModel.MODIFIED_ON;
            $scope.NoteDCModel.CREATED_BY = $scope.NoteDCModel.MODIFIED_BY;

            Notesservice.CreateNotes(JSON.stringify($scope.NoteDCModel)).then(function (result) {
              $scope.DialogChangesSaved = true;
              onSuccess(result);
              if ($scope.ngDialogData.ID == 0) //add mode
              {
                $scope.ngDialogData.ID = result;
              }
              hylanCache.SetValue(hylanCache.Keys.NEWLYADDED_ROWID, $scope.ngDialogData.SCREEN_RECORD_ID, $scope.ngDialogData.SCREEN_ID);
              $scope.$emit("CRUD_OPERATIONS_SUCCESS", true);
              $scope.NoteDCModel = {};
              $scope.NoteDCModel.NOTES = '';
              //to reset the controls
              $scope.form.formNotes.$setPristine();
              $scope.form.formNotes.$setUntouched();

              $scope.gridOptions.dataSource.read();
              isDataChanged = false;
            });
          } else {
            Utility.Notify({ type: NOTIFYTYPE.ERROR, message: "Please provide mandatory fields.", IsPopUp: true });
          }
        } else {
          Utility.Notify({ type: NOTIFYTYPE.ERROR, message: $scope.validationMessages, IsPopUp: true });
        }
      };

      if ($scope.ngDialogData) {
        $scope.GetNotesDetails($scope.ngDialogData.SCREEN_ID, $scope.ngDialogData.SCREEN_RECORD_ID);
      }

      function onSuccess() {
        Utility.Notify({ type: NOTIFYTYPE.SUCCESS, message: "Changes Saved.", IsPopUp: $scope.ngDialogData });
        //$state.transitionTo($state.current, $stateParams, {
        //  reload: true, inherit: false, notify: false
        //});
      }

      $scope.ChangeStart = function () {
          isDataChanged = true;
          Utility.HideNotification();
      }

      var winHeight = $(window).height(),
   mainHead = $(".main-head").outerHeight();
      var availableHeight = winHeight - (mainHead);
      Notesservice.resizeGrid("#responsive-tables #gridnotes", availableHeight * 0.58);

      function onError(XMLHttpRequest, textStatus, errorThrown) {
        var exception = XMLHttpRequest.responseText ? XMLHttpRequest.responseText : errorThrown;
        Utility.Notify({ type: NOTIFYTYPE.ERROR, message: exception, IsPopUp: $scope.ngDialogData });
      }

      function GetGridDataSource() {
        var notesGrid = $('#gridnotes').data('kendoGrid');
        return notesGrid.dataSource;
      }

      function AddRowInGrid(dataSource) {
        dataSource.insert({
          NOTE_ID: $scope.NoteDCModel.NOTES_ID, NOTES: $scope.NoteDCModel.NOTES, NOTES_TYPE: '', SCREEN_ID: '', USER_NAME: Globals.CurrentUser.LAST_NAME + ', ' + Globals.CurrentUser.FIRST_NAME,
          CREATED_ON: new Date(), MODIFIED_BY: $scope.NoteDCModel.MODIFIED_BY, MODIFIED_ON: new Date().getTime(), LOCK_COUNTER: ''
        });
      }
    }
]);

