angular.module('HylanApp').controller("TaskController",
  ['$rootScope', '$scope', '$controller', '$timeout', 'TaskService', 'Utility', 'NOTIFYTYPE', 'NotificationService', '$stateParams', 'hylanCache', '$state',
function ($rootScope, $scope, $controller, $timeout, TaskService, Utility, NOTIFYTYPE, NotificationService, $stateParams, hylanCache, $state) {
  var isDataChanged = false;
  var implementedTasksCount = 11;
  var loadedTasksCount = 0;
  
  var currentSequence = [];
  var ssKey = "EditTask" + $stateParams.JOB.JOB_ID;
  $controller('BaseController', { $scope: $scope });
  $scope.AllowToEdit = true;
  var editPerm = Globals.CheckEditPermission($scope.Screens.MANAGE_TASKS.ID);
  if (editPerm == false) {
      $scope.AllowToEdit = false;
  }
  var vm = this;
  
  vm.ScreenTitle = "ADD/UPDATE";
  vm.DialogChangesSaved = false;
  vm.JOB = $stateParams.JOB;
  vm.TasksType = {
    CONTINUITY_ZERO: 1,
    FOUNDATION_WORK: 2,
    POLE_WORK: 3,
    FIBER_DIG: 4,
    POWER_DIG: 5,
    UG_MISC: 6,
    FIBER_PULL: 7,
    FIBER_SPLICE: 8,
    AC_POWER_POLE: 9,
    SHROUD_ANTENA: 10,
    PIM_SWEEP: 11
  };
  var defaultSequence = [
          vm.TasksType.CONTINUITY_ZERO,
          vm.TasksType.UG_MISC,
          vm.TasksType.AC_POWER_POLE,
          vm.TasksType.FIBER_PULL,
          vm.TasksType.FIBER_SPLICE,
          vm.TasksType.PIM_SWEEP,
          vm.TasksType.FOUNDATION_WORK,
          vm.TasksType.POLE_WORK,
          vm.TasksType.FIBER_DIG,
          vm.TasksType.POWER_DIG,
          vm.TasksType.SHROUD_ANTENA         
  ];
  vm.LookUp = [];
  vm.LookUp = vm.LookUp.concat(Globals._lookUps[Globals.LookUpTypes.TASK_HOLD_REASON]);
  vm.LookUp = vm.LookUp.concat(Globals._lookUps[Globals.LookUpTypes.FOUNDATION_WORK_TYPE]);
  vm.LookUp = vm.LookUp.concat(Globals._lookUps[Globals.LookUpTypes.POLE_WORK_TYPE]);
  vm.LookUp = vm.LookUp.concat(Globals._lookUps[Globals.LookUpTypes.FIBER_TYPE]);
  vm.LookUp = vm.LookUp.concat(Globals._lookUps[Globals.LookUpTypes.FIBER_OPTIC_POSITION]);
  vm.LookUp = vm.LookUp.concat(Globals._lookUps[Globals.LookUpTypes.FIBER_DIG_TYPE]);
  vm.LookUp = vm.LookUp.concat(Globals._lookUps[Globals.LookUpTypes.FIBER_DIG_VAULT]);

  vm.ContinuityZeroModel = {};
  vm.FoundationWorkModel = {};
  vm.PoleWorkModel = {};
  vm.FiberDigModel = {};
  vm.PowerDigModel = {};
  vm.UgMiscModel = {};
  vm.FiberPullModel = {};
  vm.FiberSpliceModel = {};
  vm.AcPowerPoleModel = {};
  vm.ShroudAntenaModel = {};
  vm.PimSweepModel = {};

  vm.SetContinuityZeroModel = function (TASK_CONTINUITY_ZERODC) {
    TASK_CONTINUITY_ZERODC.EST_COMPLETION_DATE = FormatDate(TASK_CONTINUITY_ZERODC.EST_COMPLETION_DATE);
    TASK_CONTINUITY_ZERODC.ACT_COMPLETION_DATE = FormatDate(TASK_CONTINUITY_ZERODC.ACT_COMPLETION_DATE);

    vm.ContinuityZeroModel = TASK_CONTINUITY_ZERODC;
    $timeout(function () {
      vm.ContinuityZeroModel = vm.ContinuityZeroModel;
      loadedTasksCount++;
    });
  };
  vm.SetFoundationWorkModel = function (TASK_FOUNDATION_POLE_WORKDC) {
    TASK_FOUNDATION_POLE_WORKDC.EST_START_DATE = FormatDate(TASK_FOUNDATION_POLE_WORKDC.EST_START_DATE);
    TASK_FOUNDATION_POLE_WORKDC.ACT_START_DATE = FormatDate(TASK_FOUNDATION_POLE_WORKDC.ACT_START_DATE);
    TASK_FOUNDATION_POLE_WORKDC.ACT_COMPLETION_DATE = FormatDate(TASK_FOUNDATION_POLE_WORKDC.ACT_COMPLETION_DATE);
    vm.FoundationWorkModel = TASK_FOUNDATION_POLE_WORKDC;
    $timeout(function () {
      vm.FoundationWorkModel = vm.FoundationWorkModel;
      loadedTasksCount++;
    });
  };
  vm.SetPoleWorkModel = function (TASK_FOUNDATION_POLE_WORKDC) {
    TASK_FOUNDATION_POLE_WORKDC.EST_START_DATE = FormatDate(TASK_FOUNDATION_POLE_WORKDC.EST_START_DATE);
    TASK_FOUNDATION_POLE_WORKDC.ACT_START_DATE = FormatDate(TASK_FOUNDATION_POLE_WORKDC.ACT_START_DATE);
    TASK_FOUNDATION_POLE_WORKDC.ACT_COMPLETION_DATE = FormatDate(TASK_FOUNDATION_POLE_WORKDC.ACT_COMPLETION_DATE);
    vm.PoleWorkModel = TASK_FOUNDATION_POLE_WORKDC;
    $timeout(function () {
      vm.PoleWorkModel = vm.PoleWorkModel;
      loadedTasksCount++;
    });
  };
  vm.SetFiberDigModel = function (TASK_FIBER_POWER_DIGDC) {
    TASK_FIBER_POWER_DIGDC.EST_START_DATE = FormatDate(TASK_FIBER_POWER_DIGDC.EST_START_DATE);
    TASK_FIBER_POWER_DIGDC.ACT_START_DATE = FormatDate(TASK_FIBER_POWER_DIGDC.ACT_START_DATE);
    TASK_FIBER_POWER_DIGDC.ACT_COMPLETION_DATE = FormatDate(TASK_FIBER_POWER_DIGDC.ACT_COMPLETION_DATE);
    vm.FiberDigModel = TASK_FIBER_POWER_DIGDC;
    $timeout(function () {
      vm.FiberDigModel = vm.FiberDigModel;
      loadedTasksCount++;
    });
  };
  vm.SetPowerDigModel = function (TASK_FIBER_POWER_DIGDC) {
    TASK_FIBER_POWER_DIGDC.EST_START_DATE = FormatDate(TASK_FIBER_POWER_DIGDC.EST_START_DATE);
    TASK_FIBER_POWER_DIGDC.ACT_START_DATE = FormatDate(TASK_FIBER_POWER_DIGDC.ACT_START_DATE);
    TASK_FIBER_POWER_DIGDC.ACT_COMPLETION_DATE = FormatDate(TASK_FIBER_POWER_DIGDC.ACT_COMPLETION_DATE);
    vm.PowerDigModel = TASK_FIBER_POWER_DIGDC;
    $timeout(function () {
      vm.PowerDigModel = vm.PowerDigModel;
      loadedTasksCount++;
    });
  };
  vm.SetUgMiscModel = function (TASK_MISC_AC_POWERDC) {
    TASK_MISC_AC_POWERDC.ACT_COMPLETION_DATE = FormatDate(TASK_MISC_AC_POWERDC.ACT_COMPLETION_DATE);
    vm.UgMiscModel = TASK_MISC_AC_POWERDC;
    $timeout(function () {
      vm.UgMiscModel = vm.UgMiscModel;
      loadedTasksCount++;
    });
  };
  vm.SetFiberPullModel = function (TASK_FIBER_PULL_SPLICEDC) {
    TASK_FIBER_PULL_SPLICEDC.ACT_COMPLETION_DATE = FormatDate(TASK_FIBER_PULL_SPLICEDC.ACT_COMPLETION_DATE);
    vm.FiberPullModel = TASK_FIBER_PULL_SPLICEDC;
    $timeout(function () {
      vm.FiberPullModel = vm.FiberPullModel;
      loadedTasksCount++;
    });
  };
  vm.SetFiberSpliceModel = function (TASK_FIBER_PULL_SPLICEDC) {
    TASK_FIBER_PULL_SPLICEDC.ACT_COMPLETION_DATE = FormatDate(TASK_FIBER_PULL_SPLICEDC.ACT_COMPLETION_DATE);
    TASK_FIBER_PULL_SPLICEDC.LIGHT_TEST_CLIENT_DATE = FormatDate(TASK_FIBER_PULL_SPLICEDC.LIGHT_TEST_CLIENT_DATE);
    vm.FiberSpliceModel = TASK_FIBER_PULL_SPLICEDC;
    $timeout(function () {
      vm.FiberSpliceModel = vm.FiberSpliceModel;
      loadedTasksCount++;
    });
  };
  vm.SetAcPowerPoleModel = function (TASK_MISC_AC_POWERDC) {
    TASK_MISC_AC_POWERDC.ACT_COMPLETION_DATE = FormatDate(TASK_MISC_AC_POWERDC.ACT_COMPLETION_DATE);
    vm.AcPowerPoleModel = TASK_MISC_AC_POWERDC;
    $timeout(function () {
      vm.AcPowerPoleModel = vm.AcPowerPoleModel;
      loadedTasksCount++;
    });
  };
  vm.SetShroudAntenaModel = function (TASK_SHROUD_ANTENADC) {
    TASK_SHROUD_ANTENADC.EST_START_DATE = FormatDate(TASK_SHROUD_ANTENADC.EST_START_DATE);
    TASK_SHROUD_ANTENADC.ACT_COMPLETION_DATE = FormatDate(TASK_SHROUD_ANTENADC.ACT_COMPLETION_DATE);
    vm.ShroudAntenaModel = TASK_SHROUD_ANTENADC;
    $timeout(function () {
      vm.ShroudAntenaModel = vm.ShroudAntenaModel;
      loadedTasksCount++;
    });
  };
  vm.SetPimSweepModel = function (TASK_PIM_SWEEPDC) {
    TASK_PIM_SWEEPDC.SUBMITTED_DATE = FormatDate(TASK_PIM_SWEEPDC.SUBMITTED_DATE);
    TASK_PIM_SWEEPDC.ACT_COMPLETION_DATE = FormatDate(TASK_PIM_SWEEPDC.ACT_COMPLETION_DATE);
    TASK_PIM_SWEEPDC.CLIENT_APPROVAL_DATE = FormatDate(TASK_PIM_SWEEPDC.CLIENT_APPROVAL_DATE);
    vm.PimSweepModel = TASK_PIM_SWEEPDC;
    $timeout(function () {
      vm.PimSweepModel = vm.PimSweepModel;
      loadedTasksCount++;
    });
  };

  vm.Tasks = [];
  vm.Tasks[vm.TasksType.CONTINUITY_ZERO] = { TASK_TITLE_ID: vm.TasksType.CONTINUITY_ZERO, CallBack: vm.SetContinuityZeroModel };
  vm.Tasks[vm.TasksType.FOUNDATION_WORK] = { TASK_TITLE_ID: vm.TasksType.FOUNDATION_WORK, CallBack: vm.SetFoundationWorkModel };
  vm.Tasks[vm.TasksType.POLE_WORK] = { TASK_TITLE_ID: vm.TasksType.POLE_WORK, CallBack: vm.SetPoleWorkModel };
  vm.Tasks[vm.TasksType.FIBER_DIG] = { TASK_TITLE_ID: vm.TasksType.FIBER_DIG, CallBack: vm.SetFiberDigModel };
  vm.Tasks[vm.TasksType.POWER_DIG] = { TASK_TITLE_ID: vm.TasksType.POWER_DIG, CallBack: vm.SetPowerDigModel };
  vm.Tasks[vm.TasksType.UG_MISC] = { TASK_TITLE_ID: vm.TasksType.UG_MISC, CallBack: vm.SetUgMiscModel };
  vm.Tasks[vm.TasksType.FIBER_PULL] = { TASK_TITLE_ID: vm.TasksType.FIBER_PULL, CallBack: vm.SetFiberPullModel };
  vm.Tasks[vm.TasksType.FIBER_SPLICE] = { TASK_TITLE_ID: vm.TasksType.FIBER_SPLICE, CallBack: vm.SetFiberSpliceModel };
  vm.Tasks[vm.TasksType.AC_POWER_POLE] = { TASK_TITLE_ID: vm.TasksType.AC_POWER_POLE, CallBack: vm.SetAcPowerPoleModel };
  vm.Tasks[vm.TasksType.SHROUD_ANTENA] = { TASK_TITLE_ID: vm.TasksType.SHROUD_ANTENA, CallBack: vm.SetShroudAntenaModel };
  vm.Tasks[vm.TasksType.PIM_SWEEP] = { TASK_TITLE_ID: vm.TasksType.PIM_SWEEP, CallBack: vm.SetPimSweepModel };

  implementedTasksCount = (vm.Tasks.length - 1); // Very important - 1 Based Index

  vm.GetTask = function (TASK_TITLE_ID, callBackMethod) {
    ShowHideLoaderOverly(TASK_TITLE_ID, true);
    TaskService.RetrieveTasks(TASK_TITLE_ID, vm.JOB.JOB_ID, true).then(function (result) {
      ShowHideLoaderOverly(TASK_TITLE_ID, false);
      result.objResult.CREATED_ON = FormatDate(result.objResult.CREATED_ON);
      result.objResult.MODIFIED_ON = FormatDate(result.objResult.MODIFIED_ON);
      result.objResult.JOB_ID = vm.JOB.JOB_ID;
      result.objResult.TASK_TITLE_ID = TASK_TITLE_ID;
      if (result.objResult.TASK_ID == 0) {
          var lu_NOT_ON_HOLD = GetLookUpValue(Globals.LookUpTypes.TASK_HOLD_REASON, "Not On-Hold");
          if (lu_NOT_ON_HOLD) {
              result.objResult.ON_HOLD_REASON = lu_NOT_ON_HOLD.LOOK_UP_ID;
          }
      }
      if (callBackMethod)
        callBackMethod(result.objResult);

      if (result.objResult && result.objResult.REQUIRED == 'Y') {
        var idPrefix = '#CardHeader' + TASK_TITLE_ID + " ";
        jQuery(idPrefix + " .CardSelector").removeClass("CardUnselectedIcon").addClass("CardSelectedIcon");
      }

    }).fail(onError);
  };
  vm.GetAllTasks = function () {
    CheckIfAllTasksLoaded();
    vm.GetTask(vm.TasksType.CONTINUITY_ZERO, vm.SetContinuityZeroModel);
    vm.GetTask(vm.TasksType.FOUNDATION_WORK, vm.SetFoundationWorkModel);
    vm.GetTask(vm.TasksType.POLE_WORK, vm.SetPoleWorkModel);
    vm.GetTask(vm.TasksType.FIBER_DIG, vm.SetFiberDigModel);
    vm.GetTask(vm.TasksType.POWER_DIG, vm.SetPowerDigModel);
    vm.GetTask(vm.TasksType.UG_MISC, vm.SetUgMiscModel);
    vm.GetTask(vm.TasksType.FIBER_PULL, vm.SetFiberPullModel);
    vm.GetTask(vm.TasksType.FIBER_SPLICE, vm.SetFiberSpliceModel);
    vm.GetTask(vm.TasksType.AC_POWER_POLE, vm.SetAcPowerPoleModel);
    vm.GetTask(vm.TasksType.SHROUD_ANTENA, vm.SetShroudAntenaModel);
    vm.GetTask(vm.TasksType.PIM_SWEEP, vm.SetPimSweepModel);
  }
  vm.GetAllTasks();
  vm.AddCommonData = function (hylanTaskDC) {
    hylanTaskDC.MODIFIED_BY = $rootScope.currentUser.USER_ID;
    hylanTaskDC.MODIFIED_ON = new Date();
    if (hylanTaskDC.TASK_ID <= 0) { // For new tasks
      hylanTaskDC.CREATED_ON = hylanTaskDC.MODIFIED_ON;
      hylanTaskDC.CREATED_BY = hylanTaskDC.MODIFIED_BY;
    }
    return hylanTaskDC;
  };

  vm.Changed = function (hylanTaskDC) {
      if (hylanTaskDC.TASK_TITLE_ID == vm.ContinuityZeroModel.TASK_TITLE_ID
          || vm.ContinuityZeroModel.TASK_ID == undefined || vm.ContinuityZeroModel.TASK_ID <= 0) {
          vm.ChangeStart(vm.ContinuityZeroModel);
      }
      
      if (hylanTaskDC.TASK_TITLE_ID == vm.UgMiscModel.TASK_TITLE_ID
          || vm.UgMiscModel.TASK_ID == undefined || vm.UgMiscModel.TASK_ID <= 0) {
          vm.ChangeStart(vm.UgMiscModel);
      }

      if (hylanTaskDC.TASK_TITLE_ID == vm.AcPowerPoleModel.TASK_TITLE_ID
          || vm.AcPowerPoleModel.TASK_ID == undefined || vm.AcPowerPoleModel.TASK_ID <= 0) {
          vm.ChangeStart(vm.AcPowerPoleModel);
      }
      if (hylanTaskDC.TASK_TITLE_ID == vm.FoundationWorkModel.TASK_TITLE_ID
          || vm.FoundationWorkModel.TASK_ID == undefined || vm.FoundationWorkModel.TASK_ID <= 0) {
          vm.ChangeStart(vm.FoundationWorkModel);
      }
      if (hylanTaskDC.TASK_TITLE_ID == vm.PowerDigModel.TASK_TITLE_ID
          || vm.PowerDigModel.TASK_ID == undefined || vm.PowerDigModel.TASK_ID <= 0) {
          vm.ChangeStart(vm.PowerDigModel);
      }
      if (hylanTaskDC.TASK_TITLE_ID == vm.PoleWorkModel.TASK_TITLE_ID
          || vm.PoleWorkModel.TASK_ID == undefined || vm.PoleWorkModel.TASK_ID <= 0) {
          vm.ChangeStart(vm.PoleWorkModel);
      }
      if (hylanTaskDC.TASK_TITLE_ID == vm.ShroudAntenaModel.TASK_TITLE_ID
          || vm.ShroudAntenaModel.TASK_ID == undefined || vm.ShroudAntenaModel.TASK_ID <= 0) {
          vm.ChangeStart(vm.ShroudAntenaModel);
      }
      if (hylanTaskDC.TASK_TITLE_ID == vm.FiberPullModel.TASK_TITLE_ID
          || vm.FiberPullModel.TASK_ID == undefined || vm.FiberPullModel.TASK_ID <= 0) {
              vm.ChangeStart(vm.FiberPullModel);
          }
      if (hylanTaskDC.TASK_TITLE_ID == vm.FiberSpliceModel.TASK_TITLE_ID
          || vm.FiberSpliceModel.TASK_ID == undefined || vm.FiberSpliceModel.TASK_ID <= 0) {
          vm.ChangeStart(vm.FiberSpliceModel);
      }
      if (hylanTaskDC.TASK_TITLE_ID == vm.PimSweepModel.TASK_TITLE_ID
          || vm.PimSweepModel.TASK_ID == undefined || vm.PimSweepModel.TASK_ID <= 0) {
          vm.ChangeStart(vm.PimSweepModel);
      }
      if (hylanTaskDC.TASK_TITLE_ID == vm.FiberDigModel.TASK_TITLE_ID
          || vm.FiberDigModel.TASK_ID == undefined || vm.FiberDigModel.TASK_ID <= 0) {
          vm.ChangeStart(vm.FiberDigModel);
      }
  };

  vm.ChangeStart = function (hylanTaskModel) {
    isDataChanged = true;
    hylanTaskModel.HasChanges = true;
    if (event && event.srcElement && $(event.srcElement).data("select-type") == "TASK_HOLD_REASON") {
      var lu_TASK_HOLD_REASON = GetLookUpValue(Globals.LookUpTypes.TASK_HOLD_REASON, "Other");
      if ($(event.srcElement).val() != lu_TASK_HOLD_REASON.LOOK_UP_ID)
        hylanTaskModel.ON_HOLD_OTHER = '';
    }
    $(".date-control").parent().removeClass("Invalid");
    $("#Card" + hylanTaskModel.TASK_TITLE_ID).removeClass("SavedCard").addClass("EditCard");
    HideNotification();
  };
  vm.CheckOnHoldReason = function (hylanModel) {
    var otherReasonSelected = false;
    var lu_TASK_HOLD_REASON = GetLookUpValue(Globals.LookUpTypes.TASK_HOLD_REASON, "Other");
    if (hylanModel && lu_TASK_HOLD_REASON && hylanModel.ON_HOLD_REASON == lu_TASK_HOLD_REASON.LOOK_UP_ID)
      otherReasonSelected = true;
    return otherReasonSelected;
  }
  vm.PostData = function () {
    HideNotification();
    if (vm.JOB.JOB_ID == 0 || vm.JOB.HYLAN_PROJECT_ID == 0 || vm.JOB.JOB_FILE_NUMBER == 0) {
      Utility.Notify({ type: NOTIFYTYPE.ERROR, message: "Job information does not exist." });
      return;
    }
    if (isDataChanged) {
      var validationSummary = ExecValidationCheck();
      if (validationSummary && validationSummary != "") {
        Utility.Notify({ type: NOTIFYTYPE.ERROR, message: validationSummary, IsPopUp: false });
        return false;
      }
      
      var insertList = [];
      var updateList = [];

      if (vm.ContinuityZeroModel.HasChanges == true &&
          vm.ContinuityZeroModel.TASK_ID != undefined) {
        if (vm.ContinuityZeroModel.TASK_ID <= 0)
          insertList.push(vm.AddCommonData(vm.ContinuityZeroModel));
        else
          updateList.push(vm.AddCommonData(vm.ContinuityZeroModel));
      }

      if (vm.FoundationWorkModel.HasChanges == true &&
          vm.FoundationWorkModel.TASK_ID != undefined) {
        if (vm.FoundationWorkModel.TASK_ID <= 0)
          insertList.push(vm.AddCommonData(vm.FoundationWorkModel));
        else
          updateList.push(vm.AddCommonData(vm.FoundationWorkModel));
      }

      if (vm.PoleWorkModel.HasChanges == true &&
          vm.PoleWorkModel.TASK_ID != undefined) {
        if (vm.PoleWorkModel.TASK_ID <= 0)
          insertList.push(vm.AddCommonData(vm.PoleWorkModel));
        else
          updateList.push(vm.AddCommonData(vm.PoleWorkModel));
      }

      if (vm.FiberDigModel.HasChanges == true &&
          vm.FiberDigModel.TASK_ID != undefined) {
        if (vm.FiberDigModel.TASK_ID <= 0)
          insertList.push(vm.AddCommonData(vm.FiberDigModel));
        else
          updateList.push(vm.AddCommonData(vm.FiberDigModel));
      }

      if (vm.PowerDigModel.HasChanges == true &&
          vm.PowerDigModel.TASK_ID != undefined) {
        if (vm.PowerDigModel.TASK_ID <= 0)
          insertList.push(vm.AddCommonData(vm.PowerDigModel));
        else
          updateList.push(vm.AddCommonData(vm.PowerDigModel));
      }

      if (vm.UgMiscModel.HasChanges == true &&
          vm.UgMiscModel.TASK_ID != undefined) {
        if (vm.UgMiscModel.TASK_ID <= 0)
          insertList.push(vm.AddCommonData(vm.UgMiscModel));
        else
          updateList.push(vm.AddCommonData(vm.UgMiscModel));
      }

      if (vm.FiberPullModel.HasChanges == true &&
          vm.FiberPullModel.TASK_ID != undefined) {
        if (vm.FiberPullModel.TASK_ID <= 0)
          insertList.push(vm.AddCommonData(vm.FiberPullModel));
        else
          updateList.push(vm.AddCommonData(vm.FiberPullModel));
      }

      if (vm.FiberSpliceModel.HasChanges == true &&
          vm.FiberSpliceModel.TASK_ID != undefined) {
        if (vm.FiberSpliceModel.TASK_ID <= 0)
          insertList.push(vm.AddCommonData(vm.FiberSpliceModel));
        else
          updateList.push(vm.AddCommonData(vm.FiberSpliceModel));
      }

      if (vm.AcPowerPoleModel.HasChanges == true &&
          vm.AcPowerPoleModel.TASK_ID != undefined) {
        if (vm.AcPowerPoleModel.TASK_ID <= 0)
          insertList.push(vm.AddCommonData(vm.AcPowerPoleModel));
        else
          updateList.push(vm.AddCommonData(vm.AcPowerPoleModel));
      }

      if (vm.ShroudAntenaModel.HasChanges == true &&
          vm.ShroudAntenaModel.TASK_ID != undefined) {
        if (vm.ShroudAntenaModel.TASK_ID <= 0)
          insertList.push(vm.AddCommonData(vm.ShroudAntenaModel));
        else
          updateList.push(vm.AddCommonData(vm.ShroudAntenaModel));
      }

      if (vm.PimSweepModel.HasChanges == true &&
          vm.PimSweepModel.TASK_ID != undefined) {
        if (vm.PimSweepModel.TASK_ID <= 0)
          insertList.push(vm.AddCommonData(vm.PimSweepModel));
        else
          updateList.push(vm.AddCommonData(vm.PimSweepModel));
      }

      var postData = [];
      postData.push(insertList);
      postData.push(updateList);
      TaskService.InsertUpdateTasks(JSON.stringify(postData)).then(function (result) {
        isDataChanged = false;
        onSuccess(result);
        $timeout(function () { });
        SortTasks();
      }).fail(onError);

    }
    else {
      alert(Globals.NoChanges);
    }
  };
  vm.BackButton = function () {
      var ScreenName = $stateParams.JOB.BACK_STATE;
    
      if (ScreenName == "OnHoldDashboard") {
          var rowID = $stateParams.JOB.JOB_ID + "," + $stateParams.JOB.PROJECT_ID + "," + $stateParams.JOB.TASK_NAME;
          hylanCache.SetValue(hylanCache.Keys.NEWLYADDED_ROWID, rowID, $scope.Screens.TASK_ON_HOLD.ID);
          hylanCache.SetValue(hylanCache.Keys.TASK_BACKBUTTON, "Back", $scope.Screens.TASK_ON_HOLD.ID);
      }
      else if (ScreenName == "TasksRoster") {
          hylanCache.SetValue(hylanCache.Keys.NEWLYADDED_ROWID, $stateParams.JOB.JOB_ID, $scope.Screens.MANAGE_TASKS.ID);
          hylanCache.SetValue(hylanCache.Keys.TASK_BACKBUTTON, "Back", $scope.Screens.MANAGE_TASKS.ID);
      }
      else if (ScreenName == "TaskMatrixDashboard") {
          hylanCache.SetValue(hylanCache.Keys.NEWLYADDED_ROWID, $stateParams.JOB.JOB_ID, $scope.Screens.TASK_MATRIX.ID);
          hylanCache.SetValue(hylanCache.Keys.TASK_BACKBUTTON, "Back", $scope.Screens.TASK_MATRIX.ID);

      }
      else if (ScreenName == "Jobs") {
          hylanCache.SetValue(hylanCache.Keys.NEWLYADDED_ROWID, $stateParams.JOB.JOB_ID, $scope.Screens.MANAGE_JOBS.ID);
          hylanCache.SetValue(hylanCache.Keys.TASK_BACKBUTTON, "Back", $scope.Screens.MANAGE_JOBS.ID);

      }
      
      $state.go($stateParams.JOB.BACK_STATE, { reload: true });
  };
  vm.ToggleCardView = function (sender, task_type, isCollapsed) {
    var idPrefix = '#CardHeader' + task_type + " ";
    if (isCollapsed == undefined)
      isCollapsed = jQuery(idPrefix + " .CardToggler").hasClass("CardCollapsedIcon");

    if (isCollapsed) {
      jQuery(idPrefix + " .CardToggler").removeClass("CardCollapsedIcon").addClass("CardExpandedIcon");
      $("#Card" + task_type + " .CardContents").hide();
      $("#Card" +task_type).css("height","auto");
      sessionStorage.setItem(ssKey + task_type, isCollapsed);
    }
    else {
      jQuery(idPrefix + " .CardToggler").removeClass("CardExpandedIcon").addClass("CardCollapsedIcon");
      $("#Card" + task_type + " .CardContents").show();
      $("#Card" + task_type).css("height", "315px");
      sessionStorage.setItem(ssKey + task_type, isCollapsed);
    }
    ReloadMasonryStructure();
  };
  vm.ToggleRequired = function (senderModel, task_type) {
    vm.Changed(senderModel);
    var idPrefix = '#CardHeader' + task_type + " ";
    var isUnselected = jQuery(idPrefix + " .CardSelector").hasClass("CardUnselectedIcon");
    if (isUnselected) {
      jQuery(idPrefix + " .CardSelector").removeClass("CardUnselectedIcon").addClass("CardSelectedIcon");
      senderModel.REQUIRED = 'Y';
    }
    else {
      jQuery(idPrefix + " .CardSelector").removeClass("CardSelectedIcon").addClass("CardUnselectedIcon");
      senderModel.REQUIRED = 'N';
    }
  };

  
  $scope.$on('AllTasksLoaded', function () {
    setScrollPaneHeight();
    $("input, select, textarea, input[type='checkbox']").on("click", function (e) {
      HideNotification();
    });
    SortTasks();

    $(".Card").draggable({
      start: handleDragStart,
      cursor: 'move',
      revert: "invalid",
      stack: ".Card",
      revert: function (dropped) {
        $(this).css("height","").css("width","");
        if ($(this).hasClass("droppedSuccess")) {
          $(this).removeClass("droppedSuccess");
          return false;
        }
        return true;
      }
    });
    $(".Card").droppable({
      greedy: false,
      drop: handleDropEvent,
      hoverClass: "drop-hover",
      tolerance: "pointer"
    });
    $("#MasonryGrid").droppable({
      drop: handleDropEvent
    });
    function handleDragStart(event, ui) { }
    function handleDropEvent(event, ui) {
      var trgTaskDataSort = $(this).data("sort");
      if (trgTaskDataSort) {
        var srcTaskDataSort = $(ui.draggable).data("sort");
        var srcIndex = _.indexOf(defaultSequence, srcTaskDataSort);
        if (srcIndex != -1) {
          defaultSequence.splice(srcIndex, 1);
          var trgIndex = _.indexOf(defaultSequence, trgTaskDataSort);
          defaultSequence.splice(trgIndex, 0, srcTaskDataSort);
          $(ui.draggable).addClass("droppedSuccess");
          sessionStorage.setItem(ssKey, JSON.stringify(defaultSequence));
          SortTasks($(this).attr('id'));
        }
      }
      $('.Card').css('z-index', 'auto');
    }
  });
  $scope.$on('$stateChangeStart', function ($event, toState, toParams, fromState, fromParams) {
    if (isDataChanged) {
      if (confirm(Globals.ChangesLostMessage) == false) {
        $event.preventDefault();
        HideMainMenu();
      }
    }
  });

  function GetLookUpValue(LU_TYPE, LU_NAME) {
    return _.findWhere(vm.LookUp, { LU_TYPE: LU_TYPE, LU_NAME: LU_NAME });
  }
  function SortTasks(scrollToElem) {
    DestroyMasonry();
    var allCards = [];
    var requiredSequence = [];
    var cacheSequence = [];
    var finalSequence = [];
    // Make required-sequence based on needed tasks
    $(".Card").each(function (index, item) {
      var $data_sort = parseInt($(this).attr('data-sort'));
      allCards[$data_sort] = $(this);

      if ($(this).find(".CardSelector").hasClass("CardSelectedIcon") == true) {
        requiredSequence.push($data_sort);
      }
    });
    requiredSequence = requiredSequence.sort(function (a, b) { return a - b; });
    // Merge and adjust default sequence based on required-sequence; it supersedes default-sequence
    $(defaultSequence).each(function (index, item) {
      if (requiredSequence.indexOf(item) == -1)
        requiredSequence.push(item);
    });
    finalSequence = requiredSequence;
    // Merge and adjust default sequence based on cached-sequence; it supersedes required-sequence
    var cachedSeq = sessionStorage.getItem(ssKey);
    if (cachedSeq) {
      cacheSequence = JSON.parse(cachedSeq);
      $(requiredSequence).each(function (index, item) {
        if (cacheSequence.indexOf(item) == -1)
          cacheSequence.push(item);
      });
    }
    if (cacheSequence && cacheSequence != [] && cacheSequence.length > 0)
      finalSequence = cacheSequence;
    // End

    // Sort and reposition all tasks
    defaultSequence = finalSequence;
    $.each(defaultSequence, function (index, value) {
      var card = allCards[value];
      $('#MasonryGrid').append(card);
    });
    setTimeout(function () {
      InitMasnory(true, scrollToElem);
      // Expand/Collapse all the cards based on the session.
      $(".Card").each(function (index, item) {
        var $data_sort = $(this).data("sort");
        var isCollapsed = sessionStorage.getItem(ssKey + $data_sort); // JobId+TaskType
        if (isCollapsed != null && isCollapsed != "")
          vm.ToggleCardView(this, $data_sort, (isCollapsed == "true"));
      });
    }, 10);
  }
  function CheckIfAllTasksLoaded() {
    if (loadedTasksCount < implementedTasksCount) {
      setTimeout(function () {
        CheckIfAllTasksLoaded();
      }, 1);
    }
    else {
      $scope.$broadcast("AllTasksLoaded", true);
    }
  }
  function onSuccess(result) {
    var insertSuccess = true;
    var updateSuccess = true;
    var resultSummary = '';
    if (result.insertList && result.insertList.length > 0) {
      var insertFail = _.find(result.insertList, function (item)
      { return (item.POST_MESSAGEDC.Type != null && item.POST_MESSAGEDC.Type != ""); });
      if (insertFail == undefined) {
        insertSuccess = true;
      }
      else {
        insertSuccess = false;
      }
      $.each(result.insertList, function (index, item) {
        if (insertSuccess == false) {
          $("#Card" + item.TASK_TITLE_ID).addClass("CardError");
          if (item.POST_MESSAGEDC.Type == "ERROR" || item.POST_MESSAGEDC.Type == "EXCEPTION") {
            resultSummary += item.TASK_NAME + ": Failed to add task.";
            if (item.POST_MESSAGEDC.Type == "EXCEPTION") {
              resultSummary += " Exception: " + item.POST_MESSAGEDC.Message;
            }
          }
          else if (item.POST_MESSAGEDC.Type == "CONCURRENCY_ERROR") {
              resultSummary += item.TASK_NAME + ": Task is added by some other users. Data has been refreshed and your changes are lost.";
            vm.GetTask(vm.Tasks[item.TASK_TITLE_ID].TASK_TITLE_ID, vm.Tasks[item.TASK_TITLE_ID].CallBack);
          }
          if (index < (result.insertList.length - 1))
            resultSummary += "</br>";
        }
        else {
            $("#Card" + item.TASK_TITLE_ID).addClass("CardSuccess");
            $("#Card" + item.TASK_TITLE_ID).removeClass("EditCard").addClass("SavedCard");
          vm.GetTask(vm.Tasks[item.TASK_TITLE_ID].TASK_TITLE_ID, vm.Tasks[item.TASK_TITLE_ID].CallBack);
        }
      });
    }

    if (result.updatedList) {
      if (resultSummary != '')
        resultSummary += '</br>';

      var updateFail = _.find(result.updatedList, function (item)
      { return (item.POST_MESSAGEDC.Type != null && item.POST_MESSAGEDC.Type != ""); });
      if (updateFail == undefined) {
        updateSuccess = true;
      }
      else {
        updateSuccess = false;
      }
      $.each(result.updatedList, function (index, item) {
        if (updateSuccess == false) {
          $("#Card" + item.TASK_TITLE_ID).addClass("CardError");
          if (item.POST_MESSAGEDC.Type == "ERROR" || item.POST_MESSAGEDC.Type == "EXCEPTION") {
            resultSummary += item.TASK_NAME + ": Failed to update task.";
            if (item.POST_MESSAGEDC.Type == "EXCEPTION") {
              resultSummary += " Exception: " + item.POST_MESSAGEDC.Message;
            }
          }
          else if (item.POST_MESSAGEDC.Type == "CONCURRENCY_ERROR") {
              resultSummary += item.TASK_NAME + ": Task is updated by some other users. Data has been refreshed and your changes are lost.";
            vm.GetTask(vm.Tasks[item.TASK_TITLE_ID].TASK_TITLE_ID, vm.Tasks[item.TASK_TITLE_ID].CallBack);
          }

          if (index < (result.updatedList.length - 1))
            resultSummary += "</br>";
        }
        else {
            $("#Card" + item.TASK_TITLE_ID).addClass("CardSuccess");
            $("#Card" + item.TASK_TITLE_ID).removeClass("EditCard").addClass("SavedCard");
          vm.GetTask(vm.Tasks[item.TASK_TITLE_ID].TASK_TITLE_ID, vm.Tasks[item.TASK_TITLE_ID].CallBack);
        }
      });
    }
    if (insertSuccess == true && updateSuccess == true)
      Utility.Notify({ type: NOTIFYTYPE.SUCCESS, message: "Changes Saved." });

    if (resultSummary != '') {
      isDataChanged = true;
      Utility.Notify({ type: NOTIFYTYPE.ERROR, message: resultSummary });
    }
  }
  function onError(XMLHttpRequest, textStatus, errorThrown) {
    var exception = XMLHttpRequest.responseText ? XMLHttpRequest.responseText : errorThrown;
    Utility.Notify({ type: NOTIFYTYPE.ERROR, message: exception });
  }
  function ShowHideLoaderOverly(taskType, toShow) {
    var cardSelector = "#Card" + taskType + " .CardContents";
    if (toShow == true)
      $(cardSelector).children(".overlay").show();
    else
      $(cardSelector).children(".overlay").hide();
  }
  function ExecValidationCheck() {
    var validationSummary = "";
    $("input.Required").each(function (index, item) {
      validationSummary += "</br>\u2022 " + $(this).closest(".Card").find(".CARD_NAME").text() + ": Please enter 'Other Reason'";
    });
    $(".date-control").each(function (index, item) {
      var dateValue = $(this).val();
      if (dateValue != "" && kendo.parseDate(dateValue) == null) {
        validationSummary += "</br>\u2022 " + $(this).closest(".Card").find(".CARD_NAME").text() + ": Please provide date in correct format (MM/dd/yyyy)</br>";
        $(this).parent().addClass("Invalid");
      }
    });
    return validationSummary;
  }
  function HideNotification() {
    Utility.HideNotification();
    $(".Card").removeClass("CardError").removeClass("CardSuccess");
  }
  function DestroyMasonry() {
    if (masnoryGrid != null) {
      masnoryGrid.masonry('destroy');
    }
  }
}
]);

