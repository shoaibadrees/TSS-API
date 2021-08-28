angular.module('HylanApp').controller("AttachmentsCrudController", ['$rootScope', '$scope', '$controller', '$timeout', 'Utility', 'NOTIFYTYPE', 'HylanApp.commonValidationService', '$state', '$stateParams', 'ngDialog', 'AttachmentService', 'AttachmentGridConfig', 'hylanCache',
  function ($rootScope, $scope, $controller, $timeout, Utility, NOTIFYTYPE, commonValidationService, $state, $stateParams, ngDialog, AttachmentService, AttachmentGridConfig, hylanCache) {
    if ($rootScope.isUserLoggedIn == false) return false;
    $controller('BaseController', { $scope: $scope });
    var vm = this;
    vm.uploadedFiles = [];
    vm.DestroyRecords = AttachmentGridConfig.DestroyRecords;
    vm.commonValidationService = commonValidationService;
    vm.ScreenTitle = "ADD";
    vm.Save = AttachmentGridConfig.Save;
    vm.gridOptions = AttachmentGridConfig.GetGridOptions;
    vm.CloseModalWindow = CloseModalWindow;
    vm.Upload = AttachmentGridConfig.Upload;
    vm.GetGridDataSource = GetGridDataSource;
    vm.SetBlockingWindowInstance = AttachmentGridConfig.SetBlockingWindowInstance;
    vm.GetExcludedFiles = AttachmentGridConfig.GetExcludedFiles;
    vm.downloadFile = AttachmentGridConfig.downloadFile;
    vm.HideWarningMessage = HideWarningMessage;
    vm.documentCategories = [];


    init();
    function init() {
      vm.form = {};
      vm.validationMessages = [];
      vm.AllowedAttachments =
      'application/msword,' +
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document,' +
      'application/vnd.openxmlformats-officedocument.wordprocessingml.template,' +
      'application/vnd.ms-excel,' +
      'application/vnd.ms-excel,' +
      'application/vnd.ms-excel,' +
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,' +
      'application/vnd.openxmlformats-officedocument.spreadsheetml.template,' +
      'application/vnd.ms-powerpoint,' +
      'application/vnd.openxmlformats-officedocument.presentationml.presentation,' +
      'application/vnd.openxmlformats-officedocument.presentationml.template,' +
      'application/vnd.openxmlformats-officedocument.presentationml.slideshow,' +
      'image/*,' +
      'application/pdf,' +
      'audio/*,' +
      'video/*,' +
      'application/vnd.ms-powerpointtd,' +
      'text/*';
      AttachmentService.RetrieveDocumentsCategories($scope.ngDialogData.SCREEN_ID).then(function success(response) {
        AttachmentGridConfig.SetDocumentCategories(response.data);
      }, function error(response) {
        console.log(response);
      });
    }
    $scope.AllowToEdit = true;
    var editPerm = Globals.CheckEditPermission($scope.Screens.MANAGE_ATTACHMENTS.ID);
    if (editPerm == false) {
        $scope.AllowToEdit = false;
    }
    var winHeight = $(window).height(),
      mainHead = $(".main-head").outerHeight();
    var availableHeight = winHeight - (mainHead);
    AttachmentService.resizeGrid("#responsive-tables #gridattachments", availableHeight * 0.58);

    function HideWarningMessage() {
      Utility.HideNotification();
    }

    $rootScope.$watch('droppedFiles', function (newValue, oldValue) {
      if (newValue !== oldValue) {
        $scope.droppedFiles = $rootScope.droppedFiles;
        if ($scope.droppedFiles.length === 0) {
          closeLoading("#window");
        }
      }
    });

    $rootScope.$watch('files', function (newValue, oldValue) {
      if (newValue !== oldValue) 
        $scope.files = $rootScope.files;
    });

    

    function displayLoading(target) {
      var element = $(target);
      kendo.ui.progress(element, true);
    }

    function closeLoading(target) {
      var element = $(target);
      $timeout(function () {
        kendo.ui.progress(element, false);
      }, 200);
    }

    $rootScope.$watch('uploadPercentage', function (newValue, oldValue) {
      if (newValue !== oldValue) {
        displayLoading("#window");
        vm.uploadPercentage = $rootScope.uploadPercentage;
        if (vm.uploadPercentage === 100) {
          $timeout(function () {
            vm.uploadPercentage = 0;
          }, 500);
        }
      }
    });

    AttachmentGridConfig.SetDialogData($scope.ngDialogData);

    function CloseModalWindow(gridAttachments) {
        hylanCache.SetValue(hylanCache.Keys.NEWLYADDED_ROWID, $scope.ngDialogData.SCREEN_RECORD_ID, $scope.ngDialogData.SCREEN_ID);
      var data = gridAttachments._data;
      if (angular.isDefined(data)) {
        var dirty = $.grep(data, function (item) {
          return item.dirty || item.ATTACHMENT_ID === 0;
        });
        if (dirty.length) {
          if (confirm("Any changes made on this screen will be lost.")) {
            GetGridDataSource().data([]);
            $("form.k-filter-menu button[type='reset']").trigger("click");
            $scope.$emit("CLOSE_WITHOUT_CHANGE", true);
            ngDialog.close();
          } else {
            return;
          }
          Utility.HideNotification();
        } else {
          GetGridDataSource().data([]);
          $("form.k-filter-menu button[type='reset']").trigger("click");
          $scope.$emit("CRUD_OPERATIONS_SUCCESS", true);
          ngDialog.close();
        }
      } else {
          $scope.$emit("CLOSE_WITHOUT_CHANGE", true);
        ngDialog.close();
      }
      //k$scope.$emit("CRUD_OPERATIONS_SUCCESS", true);

    }

    function GetGridDataSource() {
      var attachmentsGrid = $('#gridattachments').data('kendoGrid');
      return attachmentsGrid.dataSource;
    }
  }

]);

