var manPowerJobTypeLU = [];
var rowNumber = 0;

var dtLigginsText = "MDU";
var dtByrneText = "Aerial-MDU";
var dtWifiText = "Wifi";
var isManpowerExporting = false;
angular.module('HylanApp').controller("DailiesCRUDController", ['$rootScope', '$scope', '$controller', '$timeout', 'DailiesCRUDService', 'Utility', 'NOTIFYTYPE', 'NotificationService', 'HylanApp.commonValidationService', 'JobCRUDService', 'AppConfig', '$filter', 'hylanCache','ngDialog',
function ($rootScope, $scope, $controller, $timeout, DailyCRUDService, Utility, NOTIFYTYPE, NotificationService, commonValidationService, JobCRUDService, AppConfig, $filter, hylanCache, ngDialog) {
    init();


    var objSendEmail = {
        IsNewDaily: true, IsRecordSaved: false,
        reset: function () {
            this.IsNewDaily = true;
            this.IsRecordSaved = false
        }
    }
    objSendEmail.reset();

    function init() {
        $scope.form = {};
        $scope.validationMessages = [];
        $scope.jobDCModel = {
            PROJECT_ID: 0,
            STATE: 0,
            JOB_STATUS: 0
        };
        $scope.ScreenTitle = "ADD";
        $scope.DialogChangesSaved = false;
        $scope.PageTitle = "Job & Daily Details";
        $scope.DisableJobDetails = true;
        $scope.DaysDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        $scope.FirstPageSelected = true;
        $scope.isManPowerInit = false;
        $scope.isVehiclesInit = false;
        $scope.isMaterialsInit = false;
        $scope.isLaborsInit = false;
        $scope.isWorkDetailsInit = false;
        $scope.isLaborItemInit = false;
        $scope.isAerialInit = false;
        $scope.isMDUInit = false;

        $scope.AllowToEdit = true;
        var editPerm = Globals.CheckEditPermission($scope.Screens.MANAGE_DAILIES.ID);
        if (editPerm == false)
            $scope.AllowToEdit = false;
        var pages = {
           dailyjob: "page1", manpower: "page2", labor: "page3", vehicles: "page4", materials: "page5", workdetail: "page6",
           laboritem: "page7", aerial: "page8", mdu: "page9", notes: "page10"
        };

        $scope.pages = pages;
        $scope.CurrentView = "DailiesCRUD"; //need to reset on close;
        $scope.DailyTypeWorkFlow = [];
        $scope.DailyTypeWorkFlow["Fiber Splicing/Testing/Extras"] = [pages.dailyjob, pages.notes, pages.manpower, pages.vehicles, pages.materials, pages.workdetail];
        $scope.DailyTypeWorkFlow["Node Install"] = [pages.dailyjob, pages.notes, pages.manpower, pages.vehicles, pages.workdetail];
        $scope.DailyTypeWorkFlow["Pole Work"]=[pages.dailyjob, pages.notes, pages.manpower, pages.vehicles, pages.workdetail];
        $scope.DailyTypeWorkFlow["Rodding/Roping"]=[pages.dailyjob, pages.notes, pages.manpower, pages.vehicles, pages.workdetail];
        $scope.DailyTypeWorkFlow["Underground/Foundation"]=[pages.dailyjob, pages.notes, pages.manpower, pages.labor, pages.vehicles, pages.materials, pages.workdetail];
        $scope.DailyTypeWorkFlow["Power supply"]=[pages.dailyjob, pages.notes, pages.manpower, pages.labor, pages.vehicles, pages.materials];
        $scope.DailyTypeWorkFlow[dtWifiText]=[pages.dailyjob, pages.notes, pages.manpower, pages.labor, pages.vehicles, pages.laboritem, pages.materials];
        $scope.DailyTypeWorkFlow[dtLigginsText]=[pages.dailyjob, pages.notes, pages.manpower, pages.laboritem, pages.materials];
        $scope.DailyTypeWorkFlow[dtByrneText] = [pages.dailyjob, pages.notes, pages.manpower, pages.labor, pages.vehicles, pages.aerial, pages.materials, pages.mdu];

        $scope.DailyTypeWorkFlow["Manhattan Underground/Foundation"] = [pages.dailyjob, pages.notes, pages.manpower, pages.labor, pages.vehicles, pages.materials, pages.workdetail];

        $scope.sumTemplate = "#=(sum == undefined || sum == null) ? 0 : kendo.toString(sum,'n1')#";
        $scope.manPowerJobTypeGroups = [];

    }

    //used for export 
    function Sheet() {
        this.title = "";
        this.columns = [];
        this.rows = [];
    } //insdie columns need to defind column attributes only ,
    function Row() { this.cells = []; };
    //inside rows one can define cells only 
    var evenColor = "#f1f1f1";
    var headerColor = "#FFF1B9";
    function Cell(val, backgroundColor, vAlign, hAlign, bold,showBorder) {

        this.bold = bold != null && bold != '' ? bold : false; //black
        this.value = val;
        this.color = "#000000";;
        this.background = backgroundColor != null && backgroundColor != "" ? backgroundColor : "#ffffff"; 
        this.vAlign = vAlign != null && vAlign != "" ? vAlign : "top";
        this.hAlign = hAlign != null && hAlign != "" ? hAlign : "left";
        var cellBorder = { color: "#000000", size: 1 };

        showBorder = showBorder == null || showBorder === '' ? true : showBorder;
        if (showBorder) {
            this.borderTop = cellBorder;
            this.borderRight = cellBorder;
            this.borderBottom = cellBorder;
            this.borderLeft = cellBorder;
            
        }
        function setEven() { this.background = "#f1f1f1"; this.bold = false; }
        function setHeader() { this.background = "#FFF1B9"; this.bold = true; }

    }

    $scope.exportDailyToExcel1 = function () {
        alert('Bismillah');
    }
    $scope.abc = function () {
        alert('Bismillah');
    }

    $scope.commonValidationService = commonValidationService;

    var isScreenInitialized = false;
    var isDataChanged = false;
    $controller('BaseController', { $scope: $scope });

    $scope.UpdateDailyDcModel = function (dailyDcModel) {
        $scope.dailyDCModel = dailyDcModel;
        $scope.dailyDCModel.DAILY_DATE = FormatDate($scope.dailyDCModel.DAILY_DATE);
        if ($scope.dailyDCModel.DAILY_ID == 0) {
            $scope.dailyDCModel.DAILY_DATE = '';
            $scope.dailyDCModel.PROJECT_ID = ($scope.dailyDCModel.PROJECT_ID == null) ? "" : $scope.dailyDCModel.PROJECT_ID;
            $scope.dailyDCModel.JOB_ID = ($scope.dailyDCModel.JOB_ID == null) ? "" : $scope.dailyDCModel.JOB_ID;
        }
        else {
            $scope.dailyDCModel.PROJECT_ID = ($scope.dailyDCModel.PROJECT_ID == null) ? -1 : $scope.dailyDCModel.PROJECT_ID;
            $scope.dailyDCModel.JOB_ID = ($scope.dailyDCModel.JOB_ID == null) ? -1 : $scope.dailyDCModel.JOB_ID;
        }
        if ($scope.ScreenTitle == "ADD") {
            $scope.primaryFields = false;
        }
        $timeout(function () {
            $scope.dailyDCModel = $scope.dailyDCModel;
            isDataChanged = false;
            $scope.GetManPowerJobTypes();
            $scope.SetWorkFlowSteps();
        });
    };
    $scope.GetDailyDetails = function (DAILY_ID, updatedDailyDcModel) {
        if (DAILY_ID > 0) {
            $scope.ScreenTitle = "UPDATE";
            $scope.primaryFields = false;
        }
        if (updatedDailyDcModel == undefined) {
            DailyCRUDService.RetrieveDaily(DAILY_ID).then(function (result) {
                $scope.UpdateDailyDcModel(result.objResult);
            }).fail(onError);
        }
        else {
            $scope.UpdateDailyDcModel(updatedDailyDcModel);
        }
    };
    if ($scope.ngDialogData && $scope.ngDialogData.DAILY_ID != undefined) {
        $scope.GetDailyDetails($scope.ngDialogData.DAILY_ID);
        if ($scope.ngDialogData.DAILY_ID > 0)
        {
            objSendEmail.IsNewDaily = false;
            objSendEmail.IsRecordSaved = false
        }
    }
    $scope.OnChangeJobFileNumber = function () {
        $scope.ChangeStart();
        if ($scope.dailyDCModel.JOB_ID == "-1" || $scope.dailyDCModel.PROJECT_ID == "-1") {// Unknowns
            $scope.DisableJobDetails = false;
            $scope.dailyDCModel.PROJECT_ID = -1;
        }
        else {
            $scope.DisableJobDetails = true;

            if ($scope.dailyDCModel.JOB_ID && $scope.dailyDCModel.JOB_ID != "") {
                JobCRUDService.RetrieveJob($scope.dailyDCModel.JOB_ID).then(function (result) {
                    var jobDCModel = result.objResult;

                    $scope.dailyDCModel.NODE_ID1 = jobDCModel.NODE_ID1;
                    $scope.dailyDCModel.NODE_ID2 = jobDCModel.NODE_ID2;
                    $scope.dailyDCModel.NODE_ID3 = jobDCModel.NODE_ID3;
                    $scope.dailyDCModel.HUB = jobDCModel.HUB;
                    $scope.dailyDCModel.STREET_ADDRESS = jobDCModel.STREET_ADDRESS;
                    $scope.dailyDCModel.CITY = jobDCModel.CITY;
                    $scope.dailyDCModel.STATE = jobDCModel.STATE;
                    $scope.dailyDCModel.ZIP = jobDCModel.ZIP;
                    $scope.dailyDCModel.LAT = jobDCModel.LAT;
                    $scope.dailyDCModel.LONG = jobDCModel.LONG;
                    $scope.dailyDCModel.POLE_LOCATION = jobDCModel.POLE_LOCATION;
                    $scope.dailyDCModel.HYLAN_PM = jobDCModel.HYLAN_PM;


                    var jobClient = $.grep($scope._ClientsDS, function (client) {
                        return (client.COMPANY_ID == jobDCModel.CLIENT_ID)
                    });
                    if (jobClient && jobClient.length > 0) {
                        $scope.dailyDCModel.CLIENT_PM = jobClient[0].COMPANY_NAME;
                    }

                }).fail(onError);
            }
        }
    };

    $scope.FillJobFileNumberDropDown = function (initCall) {
        if ($scope.dailyDCModel.PROJECT_ID == "-1") { // Unknown
            $scope.DisableJobDetails = false;
        }
        else {
            $scope.DisableJobDetails = true;
        }
        var projectIds = '';
        var selPrjId = $scope.dailyDCModel.PROJECT_ID;
        if (selPrjId == "-1") {
            $scope.DSJobFileNumbers = [{ VALUE: -1, TEXT: "Unknown" }];
            $scope.dailyDCModel.JOB_ID = -1;
            return;
        }
        if (selPrjId != undefined && selPrjId != "") {
            Globals.GetJobFileNumbers(selPrjId).then(function (result) {
                $scope.DSJobFileNumbers = $filter('orderBy')(result.objResultList, 'TEXT');
                //$scope.DSJobFileNumbers = result.objResultList;
                $timeout(function () {
                    $scope.DSJobFileNumbers = $scope.DSJobFileNumbers;
                });
            }).fail(onError);
        }
        if (initCall != true)
            $scope.dailyDCModel.JOB_ID = "";
    };
    Globals.GetProjects().then(function (result) {
        var unknownPrj = { PROJECT_ID: -1, HYLAN_PROJECT_ID: "Unknown" };
        if (result.objResultList && result.objResultList.length == 0)
            result.objResultList = [];
        var projectIds = '';
        $.each(result.objResultList, function (index, item) {
            projectIds += item.PROJECT_ID;
            if ((index + 1) < result.objResultList.length) {
                projectIds += ',';
            }
        });

        $scope.DSProjects = $filter('orderBy')(result.objResultList, 'HYLAN_PROJECT_ID');


        $scope.DSProjects.splice(0, 0, unknownPrj);
        $scope.FillJobFileNumberDropDown(true);
    }).fail(onError);


    Globals.GetLookUp(Globals.LookUpTypes.DAILY_TYPE, false, function (result) {
        $scope.dailyTypeOptions = result;
    });

    Globals.GetLookUp(Globals.LookUpTypes.DAILY_STATUS, false, function (result) {
        $scope.dailyStatusLU = result;
    });

    $scope.GetManPowerJobTypes = function () {
        var dailyTypeText = $("#ddlDailyType option:selected").text();
        if (dailyTypeText == dtWifiText) {
            Globals.GetLookUp(Globals.LookUpTypes.WIFI_JOB_TYPE, false, function (result) {
                manPowerJobTypeLU = result;
            });
        }
        else if (dailyTypeText == dtByrneText) {
            Globals.GetLookUp(Globals.LookUpTypes.BYRNE_JOB_TYPE, false, function (result) {
                manPowerJobTypeLU = result;
            });
        }
        else {
            Globals.GetLookUp(Globals.LookUpTypes.MAN_POWER_JOB_TYPE, false, function (result) {
                manPowerJobTypeLU = result;
            });
        }
    };

    Globals.GetLookUp(Globals.LookUpTypes.MATERIAL_SUB_CATEGORY, false, function (result) {
        $scope.matSubCategoryLU = result;
    });


    Globals.GetLookUp(Globals.LookUpTypes.DAILY_SHIFT, false, function (result) {
        $scope.dailyShiftLU = result;
    });
    Globals.GetUsers(false, AppSettings.Hylan_PM_RoleName).then(function (result) {
        $scope.DSAdminUsers = result.objResultList;
    });
    Globals.GetCompanies(false).then(function (result) {
        $scope._ClientsDS = result.objResultList;
    });
    $scope.DSStates = Globals.GetStates();
    $scope.GetGridData = function (gridId) {
        var modifiedData = [];
        var kendoGridObj = $("#" + gridId).data("kendoGrid");
        if (kendoGridObj != undefined && kendoGridObj.dataSource.hasChanges()) {
            var allData = kendoGridObj.dataSource.data();
            modifiedData = $.grep(allData, function (item) {
                return item.dirty
            });
            if (modifiedData.length == 0) {
                switch (gridId) {
                    case "gridManPower": $scope.gridManPowerInit(); break;
                }
            }
        }
        return modifiedData;
    };
    $scope.ValidateAndPostData = function (thisForm, fromBtnSave, sender, prmNextPageId) {
        if ($scope.AllowToEdit == false) {
            $scope.NextPrevClick(sender, prmNextPageId);
            return;
        }
        if ($(".alert-boxpopup").is(":visible") == true)
            Utility.HideNotification();
        if (sender == 'repeat') {
            if (isDataChanged == true) {
                alert("Please save your changes before performing 'Repeat' operation.");
                return;
            }
            if (confirm("Are you sure you want to repeat this daily?") == false) {
                return;
            }
            else {
                SendEmail();
            }
        }
        thisForm.$submitted = true;
        $scope.thisForm = thisForm;
        $scope.validationMessages = [];
        $scope.$broadcast('saveClicked', { form: thisForm, validationMessages: $scope.validationMessages });
        if (thisForm.$valid) {
            $scope.PostData(fromBtnSave, sender, prmNextPageId);
        }
        else {
            ShowHideMessages(NOTIFYTYPE.ERROR, $scope.validationMessages, true);
        }
    }

    function getManpowerSheet(ManPowerList) {
        var sheet1 = new Sheet();
        sheet1.title = "MANPOWER";
        sheet1.columns = [{ width: 300 }, { width: 200 }, { width: 150 }, { width: 150 }, { width: 150 }];
        var headerRow = new Row();
        var cells = [new Cell("*Name", headerColor), new Cell("ST Hours", headerColor), new Cell("OT Hours", headerColor), new Cell("Diff.Hours", headerColor)];
        headerRow.cells = cells;
        sheet1.rows.push(headerRow);

        var rowIndex = 1;

        for (var i = 0; i < ManPowerList.length; i++, rowIndex++) {            

            var dataRow = new Row();
            if (rowIndex % 2 == 0) {
                var cells = [new Cell(ManPowerList[i].FIRST_NAME, evenColor)
                                , new Cell(ManPowerList[i].ST_HOURS, evenColor, "", "right")
                                , new Cell(ManPowerList[i].OT_HOURS, evenColor, "", "right")
                                , new Cell(ManPowerList[i].HOURS_DIFF, evenColor, "", "right")];
                dataRow.cells = cells;
            }
            else {
                var cells = [new Cell(ManPowerList[i].FIRST_NAME)                                           
                                                    , new Cell(ManPowerList[i].ST_HOURS, "", "", "right")
                                                    , new Cell(ManPowerList[i].OT_HOURS, "", "", "right")
                                                    , new Cell(ManPowerList[i].HOURS_DIFF, "", "", "right")];
                dataRow.cells = cells;
            }
            sheet1.rows.push(dataRow);

        }
        return sheet1;
    }
        
    function getManpowerWithJobTypeSheet(ManPowerList){
        var sheet1 = new Sheet();
        sheet1.title = "MANPOWER";
        sheet1.columns = [{ width: 300 }, { width: 200 }, { width: 150 }, { width: 150 }, { width: 150 }];
        var headerRow = new Row();
        var cells = [new Cell("*Name", headerColor), new Cell("Job Type", headerColor), new Cell("ST Hours", headerColor), new Cell("OT Hours", headerColor), new Cell("Diff.Hours", headerColor)];
        headerRow.cells = cells;
        sheet1.rows.push(headerRow);

        var rowIndex = 1;
            
        for (var i = 0; i < ManPowerList.length; i++, rowIndex++)
        {

            var ManpowerJobTypes = $.grep(manPowerJobTypeLU, function (lookup) {
                return (lookup.LOOK_UP_ID == ManPowerList[i].MAN_POWER_JOB_TYPE)
            });

            var selectedJobType = "";
            if (ManpowerJobTypes && ManpowerJobTypes.length > 0) {
                selectedJobType = ManpowerJobTypes[0].LU_NAME;
            }

 
            var dataRow = new Row();
            if (rowIndex % 2 == 0) {
                var cells = [new Cell(ManPowerList[i].FIRST_NAME, evenColor)
                                , new Cell(selectedJobType, evenColor)
                                , new Cell(ManPowerList[i].ST_HOURS, evenColor, "", "right")
                                , new Cell(ManPowerList[i].OT_HOURS, evenColor, "", "right")
                                , new Cell(ManPowerList[i].HOURS_DIFF, evenColor, "", "right")];
                dataRow.cells = cells;
            }
            else {
                var cells = [new Cell(ManPowerList[i].FIRST_NAME)
                                                    , new Cell(selectedJobType)
                                                    , new Cell(ManPowerList[i].ST_HOURS, "", "", "right")
                                                    , new Cell(ManPowerList[i].OT_HOURS, "", "", "right")
                                                    , new Cell(ManPowerList[i].HOURS_DIFF, "", "", "right")];
                dataRow.cells = cells;
            }
            sheet1.rows.push(dataRow);

        }
        return sheet1;
    }

    function getLaborSheet(LaborList) {
        var sheet1 = new Sheet();
        sheet1.title = "LABOR";
        sheet1.columns = [{ width: 180 }, { width: 300 }, { width: 180 }];
        var headerRow = new Row();
        var cells = [new Cell("ID#", headerColor), new Cell("Labor", headerColor), new Cell("Hours", headerColor)];
        headerRow.cells = cells;
        sheet1.rows.push(headerRow);

        var rowIndex = 1;

        for (var i = 0; i < LaborList.length; i++, rowIndex++) {
            var dataRow = new Row();
            if (rowIndex % 2 == 0) {
                var cells = [new Cell(LaborList[i].ID_NUMBER, evenColor)
                                , new Cell(LaborList[i].LABOR_NAME, evenColor)
                                , new Cell(LaborList[i].HOURS, evenColor, "", "right")];
                                
                dataRow.cells = cells;
            }
            else {
                var cells = [new Cell(LaborList[i].ID_NUMBER)
                                , new Cell(LaborList[i].LABOR_NAME)
                                , new Cell(LaborList[i].HOURS, "", "", "right")];
                              
                dataRow.cells = cells;
            }
            sheet1.rows.push(dataRow);

        }
        return sheet1;
    }

    function getVehicleSheet(VehicleList) {
        var sheet1 = new Sheet();
        sheet1.title = "VEHICLE";
        sheet1.columns = [{ width: 180 }, { width: 300 }, { width: 300 }, { width: 180 }];
        var headerRow = new Row();
        var cells = [new Cell("ID#", headerColor), new Cell("Vehicle Type", headerColor), new Cell("Vehicle Notes", headerColor), new Cell("Hours", headerColor)];
        headerRow.cells = cells;
        sheet1.rows.push(headerRow);

        var rowIndex = 1;

        for (var i = 0; i < VehicleList.length; i++, rowIndex++) {
            var dataRow = new Row();
            if (rowIndex % 2 == 0) {
                var cells = [new Cell(VehicleList[i].ID_NUMBER, evenColor)
                                , new Cell(VehicleList[i].VEHICLE_TYPE, evenColor)
                                , new Cell(VehicleList[i].NOTES, evenColor)
                                , new Cell(VehicleList[i].HOURS, evenColor, "", "right")];

                dataRow.cells = cells;
            }
            else {
                var cells = [new Cell(VehicleList[i].ID_NUMBER)
                                , new Cell(VehicleList[i].VEHICLE_TYPE)
                                , new Cell(VehicleList[i].NOTES)
                                , new Cell(VehicleList[i].HOURS, "", "", "right")];

                dataRow.cells = cells;
            }
            sheet1.rows.push(dataRow);

        }
        return sheet1;
    }

    function getVehicle3ColumnSheet(VehicleList) {
        var sheet1 = new Sheet();
        sheet1.title = "VEHICLE";
        sheet1.columns = [{ width: 300 }, { width: 300 }, { width: 180 }];
        var headerRow = new Row();
        var cells = [new Cell("Vehicle Type", headerColor), new Cell("Vehicle Notes", headerColor), new Cell("Hours", headerColor)];
        headerRow.cells = cells;
        sheet1.rows.push(headerRow);

        var rowIndex = 1;

        for (var i = 0; i < VehicleList.length; i++, rowIndex++) {
            var dataRow = new Row();
            if (rowIndex % 2 == 0) {
                var cells = [new Cell(VehicleList[i].VEHICLE_TYPE, evenColor)
                                , new Cell(VehicleList[i].NOTES, evenColor)
                                , new Cell(VehicleList[i].HOURS, evenColor, "", "right")];

                dataRow.cells = cells;
            }
            else {
                var cells = [new Cell(VehicleList[i].VEHICLE_TYPE)
                                , new Cell(VehicleList[i].NOTES)
                                , new Cell(VehicleList[i].HOURS, "", "", "right")];

                dataRow.cells = cells;
            }
            sheet1.rows.push(dataRow);

        }
        return sheet1;
    }

    function getLaborItemSheet(LaborItemsList) {
        var sheet1 = new Sheet();
        sheet1.title = "LABORITEM";
        var c1Title = "Item#";
        var c2Title = "Description of Labor Item";

        sheet1.columns = [{ width: 180 }, { width: 300 }, { width: 180 }, { width: 300 }];
        var headerRow = new Row();

        var cells = [new Cell(c1Title, headerColor), new Cell(c2Title, headerColor), new Cell("Quantity", headerColor), new Cell("Comments", headerColor)];
        headerRow.cells = cells;
        sheet1.rows.push(headerRow);

        var rowIndex = 1;

        for (var i = 0; i < LaborItemsList.length; i++, rowIndex++) {
            var dataRow = new Row();
            if (rowIndex % 2 == 0) {
                var cells = [new Cell(LaborItemsList[i].ID_NUMBER, evenColor)
                                , new Cell(LaborItemsList[i].MATERIAL_NAME, evenColor)
                                , new Cell(LaborItemsList[i].UNITS, evenColor, "", "right")
                                , new Cell(LaborItemsList[i].COMMENTS, evenColor)];
                dataRow.cells = cells;
            }
            else {
                var cells = [new Cell(LaborItemsList[i].ID_NUMBER)
                                , new Cell(LaborItemsList[i].MATERIAL_NAME)
                                , new Cell(LaborItemsList[i].UNITS, "", "", "right")
                                , new Cell(LaborItemsList[i].COMMENTS)];
                dataRow.cells = cells;
            }
            sheet1.rows.push(dataRow);

        }
        return sheet1;
    }
    
    function getMaterialTwoColumnSheet(MaterialList) {
        var sheet1 = new Sheet();
        sheet1.title = "MATERIALS";
        sheet1.columns = [{ width: 300 }, { width: 150 }];
        var headerRow = new Row();
        var cells = [new Cell("Material", headerColor), new Cell("Quantity", headerColor)];
        headerRow.cells = cells;
        sheet1.rows.push(headerRow);

        var rowIndex = 1;

        for (var i = 0; i < MaterialList.length; i++, rowIndex++) {
            var dataRow = new Row();
            if (rowIndex % 2 == 0) {
                var cells = [new Cell(MaterialList[i].MATERIAL_NAME, evenColor)
                                , new Cell(MaterialList[i].UNITS, evenColor, "", "right")];
                dataRow.cells = cells;
            }
            else {
                var cells = [new Cell(MaterialList[i].MATERIAL_NAME)
                                , new Cell(MaterialList[i].UNITS, "", "", "right")];
                dataRow.cells = cells;
            }
            sheet1.rows.push(dataRow);

        }
        return sheet1;
    }
    function getMaterialSheet(MaterialList, dailyType) {
        var sheet1 = new Sheet();
        sheet1.title = "MATERIALS";
        var c1Title = "Item#";
        var c2Title = "Description of Material Item";

        if (dailyType === "Manhattan Underground/Foundation" || dailyType === "Underground/Foundation" || dailyType === "Power supply")
        {
            c1Title = "ID#";
            c2Title = "Material";
        }

        sheet1.columns = [{ width: 180 }, { width: 300 }, { width: 180 }, { width: 300 }];
        var headerRow = new Row();

        var cells = [new Cell(c1Title, headerColor), new Cell(c2Title, headerColor), new Cell("Quantity", headerColor), new Cell("Comments", headerColor)];
        headerRow.cells = cells;
        sheet1.rows.push(headerRow);

        var rowIndex = 1;

        for (var i = 0; i < MaterialList.length; i++, rowIndex++) {
            var dataRow = new Row();
            if (rowIndex % 2 == 0) {
                var cells = [new Cell(MaterialList[i].ID_NUMBER, evenColor)
                                , new Cell(MaterialList[i].MATERIAL_NAME, evenColor)
                                , new Cell(MaterialList[i].UNITS, evenColor, "", "right")
                                , new Cell(MaterialList[i].COMMENTS, evenColor)];
                dataRow.cells = cells;
            }
            else {
                var cells = [new Cell(MaterialList[i].ID_NUMBER)
                                , new Cell(MaterialList[i].MATERIAL_NAME)
                                , new Cell(MaterialList[i].UNITS, "", "", "right")
                                , new Cell(MaterialList[i].COMMENTS)];
                dataRow.cells = cells;
            }
            sheet1.rows.push(dataRow);

        }
        return sheet1;
    }

    function getAerialSheet(MaterialList) {
        var sheet1 = new Sheet();
        sheet1.title = "AERIAL";
        sheet1.columns = [{ width: 180 }, { width: 300 }, { width: 180 }, { width: 300 }];
        var headerRow = new Row();
        var cells = [new Cell("Item#", headerColor), new Cell("Description of Aerial Item", headerColor), new Cell("Quantity", headerColor), new Cell("Comments", headerColor)];
        headerRow.cells = cells;
        sheet1.rows.push(headerRow);

        var rowIndex = 1;

        for (var i = 0; i < MaterialList.length; i++, rowIndex++) {
            var dataRow = new Row();
            if (rowIndex % 2 == 0) {
                var cells = [new Cell(MaterialList[i].ID_NUMBER, evenColor)
                                , new Cell(MaterialList[i].MATERIAL_NAME, evenColor)
                                , new Cell(MaterialList[i].UNITS, evenColor, "", "right")
                                , new Cell(MaterialList[i].COMMENTS, evenColor)];
                dataRow.cells = cells;
            }
            else {
                var cells = [new Cell(MaterialList[i].ID_NUMBER)
                                , new Cell(MaterialList[i].MATERIAL_NAME)
                                , new Cell(MaterialList[i].UNITS, "", "", "right")
                                , new Cell(MaterialList[i].COMMENTS)];
                dataRow.cells = cells;
            }
            sheet1.rows.push(dataRow);

        }
        return sheet1;
    }

    function getMDUSheet(MDUList) {
        var sheet1 = new Sheet();
        sheet1.title = "MDU";
        sheet1.columns = [{ width: 180 }, { width: 300 }, { width: 180 }, { width: 300 }];
        var headerRow = new Row();
        var cells = [new Cell("Item#", headerColor), new Cell("Description of MDU Item", headerColor), new Cell("Quantity", headerColor), new Cell("Comments", headerColor)];
        headerRow.cells = cells;
        sheet1.rows.push(headerRow);

        var rowIndex = 1;

        for (var i = 0; i < MDUList.length; i++, rowIndex++) {
            var dataRow = new Row();
            if (rowIndex % 2 == 0) {
                var cells = [new Cell(MDUList[i].ID_NUMBER, evenColor)
                                , new Cell(MDUList[i].MATERIAL_NAME, evenColor)
                                , new Cell(MDUList[i].UNITS, evenColor, "", "right")
                                , new Cell(MDUList[i].COMMENTS, evenColor)];
                dataRow.cells = cells;
            }
            else {
                var cells = [new Cell(MDUList[i].ID_NUMBER)
                                , new Cell(MDUList[i].MATERIAL_NAME)
                                , new Cell(MDUList[i].UNITS, "", "", "right")
                                , new Cell(MDUList[i].COMMENTS)];
                dataRow.cells = cells;
            }
            sheet1.rows.push(dataRow);

        }
        return sheet1;
    }
    
    function getWorkDetailForPoleWork(WorkDetailList) {
           var sheet1 = new Sheet();
           sheet1.title = "WORK DETAIL";
           sheet1.columns =[{ width : 180 }, {
              width: 300 }, {
              width: 180 }, {
              width: 300 }];
           var headerRow = new Row();

           var cells = [new Cell("ID#", headerColor), new Cell("Description", headerColor), new Cell("Unit", headerColor), new Cell("Comments", headerColor)];
           headerRow.cells = cells;
           sheet1.rows.push(headerRow);

           var rowIndex = 1;

           for (var i = 0; i < WorkDetailList.length; i++, rowIndex++) {
               var dataRow = new Row();
               if (rowIndex % 2 == 0) {
                   var cells = [new Cell(WorkDetailList[i].ID_NUMBER, evenColor)
                                   , new Cell(WorkDetailList[i].DESCRIPTION, evenColor)
                                   , new Cell(WorkDetailList[i].UNITS, evenColor)
                                   , new Cell(WorkDetailList[i].COMMENTS, evenColor)];
                   dataRow.cells = cells;
               }
               else {
                   var cells = [new Cell(WorkDetailList[i].ID_NUMBER)
                                   , new Cell(WorkDetailList[i].DESCRIPTION)
                                   , new Cell(WorkDetailList[i].PERFORMED)
                                   , new Cell(WorkDetailList[i].COMMENTS)];
                   dataRow.cells = cells;
               }
               sheet1.rows.push(dataRow);

           }
           return sheet1;
       }

    function getWorkDetailWithQtySheet(WorkDetailList) {
        var sheet1 = new Sheet();
        sheet1.title = "WORK DETAIL";
        sheet1.columns = [{ width: 180 }, { width: 300 }, { width: 180 }, { width: 300 }];
        var headerRow = new Row();
        var cells = [new Cell("ID#", headerColor), new Cell("Description", headerColor), new Cell("Quantity", headerColor), new Cell("Comments", headerColor)];
        headerRow.cells = cells;
        sheet1.rows.push(headerRow);

        var rowIndex = 1;

        for (var i = 0; i < WorkDetailList.length; i++, rowIndex++) {
            var dataRow = new Row();
            if (rowIndex % 2 == 0) {
                var cells = [new Cell(WorkDetailList[i].ID_NUMBER, evenColor)
                                , new Cell(WorkDetailList[i].DESCRIPTION, evenColor)
                                , new Cell(WorkDetailList[i].UNITS, evenColor)
                                , new Cell(WorkDetailList[i].COMMENTS, evenColor)];
                dataRow.cells = cells;
            }
            else {
                var cells = [new Cell(WorkDetailList[i].ID_NUMBER)
                                , new Cell(WorkDetailList[i].DESCRIPTION)
                                , new Cell(WorkDetailList[i].PERFORMED)
                                , new Cell(WorkDetailList[i].COMMENTS)];
                dataRow.cells = cells;
            }
            sheet1.rows.push(dataRow);

        }
        return sheet1;
    }


    function getWorkDetailSheet(WorkDetailList) {
        var sheet1 = new Sheet();
        sheet1.title = "WORK DETAIL";
        sheet1.columns = [{ width: 180 }, { width: 300 }, { width: 180 }, { width: 300 }];
        var headerRow = new Row();
        var cells = [new Cell("ID#", headerColor), new Cell("Description", headerColor), new Cell("Performed", headerColor), new Cell("Comments", headerColor)];
        headerRow.cells = cells;
        sheet1.rows.push(headerRow);

        var rowIndex = 1;

        for (var i = 0; i < WorkDetailList.length; i++, rowIndex++) {
            var dataRow = new Row();
            if (rowIndex % 2 == 0) {
                var cells = [new Cell(WorkDetailList[i].ID_NUMBER, evenColor)
                                , new Cell(WorkDetailList[i].DESCRIPTION, evenColor)
                                , new Cell(WorkDetailList[i].PERFORMED, evenColor)
                                , new Cell(WorkDetailList[i].COMMENTS, evenColor)];
                dataRow.cells = cells;
            }
            else {
                var cells = [new Cell(WorkDetailList[i].ID_NUMBER)
                                , new Cell(WorkDetailList[i].DESCRIPTION)
                                , new Cell(WorkDetailList[i].PERFORMED)
                                , new Cell(WorkDetailList[i].COMMENTS)];
                dataRow.cells = cells;
            }
            sheet1.rows.push(dataRow);

        }
        return sheet1;
    }

    function getNotesSheet(daily) {
       var sheet1 = new Sheet();
       sheet1.title = "NOTES";
       sheet1.columns = [{ width: 900 }];
    
       //----row 1
       dataRowPoleLocationLabel = new Row();
       dataRowPoleLocationLabel.cells = [new Cell("Notes", evenColor)];
       sheet1.rows.push(dataRowPoleLocationLabel);
       //----row 2
       dataRowPoleLocationValues = new Row();
       var Notes = $('#txtNotes').val();
       dataRowPoleLocationValues.cells = [new Cell(Notes)];//var cellwithHeight = { cells: [{ value: Notes,vAlign :"top",hAlign : "left" }], height: 200 }
      var cellwithHeight = {cells: dataRowPoleLocationValues.cells,height: 250}
       sheet1.rows.push(cellwithHeight);

       return sheet1;
       }

    function getJobSheet(daily) {
        var sheet1 = new Sheet();
        sheet1.title = "JOB & DAILY";
        sheet1.columns = [{ width: 300 }, { width: 300 }, { width: 300 }];
        //----row 1 
        var screenNameRow = new Row();
        var screenNameCells = [new Cell("Screen", undefined, "", "", true, false), new Cell("Add/Edit Daily", undefined, "", "", "", false)];
        screenNameRow.cells = screenNameCells;
        sheet1.rows.push(screenNameRow);
        //----row 2 
        var exportRunRow = new Row();       
        var date = FormatDate(new Date(), null, true)
        var exportRunCells = [new Cell("Export Run Date/Time", undefined, "", "", true, false), new Cell(date, undefined, "", "", "", false)];
        exportRunRow.cells = exportRunCells;
        sheet1.rows.push(exportRunRow);

        //----row 3
        var exportedByRow = new Row();
        var exportedBy = ($rootScope.currentUser.LAST_NAME + ", " + $rootScope.currentUser.FIRST_NAME);
        var exportedByCells = [new Cell("Exported By", undefined, "", "", true, false), new Cell(exportedBy, undefined, "", "", "", false)];
        exportedByRow.cells = exportedByCells;
        sheet1.rows.push(exportedByRow);

        //----row 3
        var emptyRow = new Row();       

        emptyRow.cells = [];
        sheet1.rows.push(emptyRow);

        //----row 4
        var projectIDRow = new Row();
        var projectCellsLabels = [new Cell("*Project ID", evenColor), new Cell("*Job File#", evenColor), new Cell("*Daily Type", evenColor)];
        projectIDRow.cells = projectCellsLabels;
        sheet1.rows.push(projectIDRow);

        //----row 5 
        var projectID = $("#ddlProjectId option:selected").text();
        var jobID = $("#ddlJobFileNumber option:selected").text();
        var dailyType = $("#ddlDailyType option:selected").text();
        var dataRowProject = new Row();
        dataRowProject.cells = [new Cell(projectID), new Cell(jobID), new Cell(dailyType)];
        sheet1.rows.push(dataRowProject);
        //----row 6
        dataRowClient = new Row();
        dataRowClient.cells = [new Cell("*Client", evenColor), new Cell("Node ID1", evenColor), new Cell("Work Date", evenColor)];
        sheet1.rows.push(dataRowClient);
        //----row 7
        dataRowClientValues = new Row();
        var clientPM = $("#txtClientPM").val();
        var nodeID1 = $("#txtNodeID1").val();    
        var dailyDate = $("#calDailyDate").val()
        dataRowClientValues.cells = [new Cell(clientPM), new Cell(nodeID1), new Cell(dailyDate)];;
        sheet1.rows.push(dataRowClientValues);
        //----row 8
        dataRowNode2 = new Row();
        dataRowNode2.cells = [new Cell("Node ID2", evenColor), new Cell("Node ID3", evenColor), new Cell("Days", evenColor)];
        sheet1.rows.push(dataRowNode2);
        //----row 9
        dataRowNode2Values = new Row();
        var nodeID2 = $("#txtNodeID2").val();
        var nodeID3 = $("#txtNodeID3").val();
        var days = $("#ddlDailyDays option:selected").text();
        dataRowNode2Values.cells = [new Cell(nodeID2), new Cell(nodeID3), new Cell(days)];
        sheet1.rows.push(dataRowNode2Values);
        //----row 10
        dataRowStreetAddressLabel = new Row();
        dataRowStreetAddressLabel.cells = [new Cell("HUB", evenColor), new Cell("HYLAN PM", evenColor), new Cell("Status", evenColor)];
        sheet1.rows.push(dataRowStreetAddressLabel);
        //----row 11
        dataRowStreetAddressValues = new Row();
        var hub = $("#txtHub").val();
        var hylanPM ="";
        if (daily.HYLAN_PM > 0) {
            hylanPM =  $("#ddlHylanPM option:selected").text();
        }
        var status = hylanPM = $("#ddlDailyStatus option:selected").text();
        dataRowStreetAddressValues.cells = [new Cell(hub), new Cell(hylanPM), new Cell(status)];
        sheet1.rows.push(dataRowStreetAddressValues);
        //----row 12
        dataRowStreetAddressLabel = new Row();
        dataRowStreetAddressLabel.cells = [new Cell("*Street Address", evenColor), new Cell("*City", evenColor), new Cell("Shift", evenColor)];
        sheet1.rows.push(dataRowStreetAddressLabel);
        //----row 13
        dataRowStreetAddressValues = new Row();
        //var address = $("#txtStreetAddress").text();
        var city = $("#txtCity").val();
        var shift = $("#ddlDailyShift option:selected").text();
        dataRowStreetAddressValues.cells = [new Cell(daily.STREET_ADDRESS), new Cell(city), new Cell(shift)];
        sheet1.rows.push(dataRowStreetAddressValues);
        //----row 14
        dataRowStateLabel = new Row();
        dataRowStateLabel.cells = [new Cell("*State", evenColor), new Cell("Zip", evenColor), new Cell("Day of Week", evenColor)];
        sheet1.rows.push(dataRowStateLabel);
        var state = $("#ddlState option:selected").text();
        var zip = $("#ddlDailyShift option:selected").text();
        var dayOfWeek = daily.DAY_OF_WEEK;//$("#ddlDailyShift option:selected").text();
        dataRowStateValues = new Row();
        dataRowStateValues.cells = [new Cell(state), new Cell(daily.ZIP), new Cell(dayOfWeek)];
        sheet1.rows.push(dataRowStateValues);
        //----row 15
        dataRowLatitudeLabel = new Row();
        dataRowLatitudeLabel.cells = [new Cell("Latitude", evenColor), new Cell("Longitude", evenColor), new Cell("Work Order #", evenColor)];
        sheet1.rows.push(dataRowLatitudeLabel);
        var lat = $('#txtLatitude').val();
        var long = $('#txtLongitude').val();
        var workOrderNo = $('#txtWorkOrder').val();
        dataRowLatitudeValues = new Row();      
        dataRowLatitudeValues.cells = [new Cell(lat), new Cell(long), new Cell(workOrderNo)];
        sheet1.rows.push(dataRowLatitudeValues);
        //----row 17
        dataRowPoleLocationLabel = new Row();
        dataRowPoleLocationLabel.cells = [new Cell("Pole Location", evenColor), new Cell("Quick Notes", evenColor), new Cell("Track Revenue", evenColor)];
        sheet1.rows.push(dataRowPoleLocationLabel);
        //----row 18
        dataRowPoleLocationValues = new Row();
        var poleLocation = $('#txtPoleLocation').val();
        var Notes = $('#txtQuickNotes').val();
        var trackRevenue = $('#txtTrackRevenue').val();
        dataRowPoleLocationValues.cells = [new Cell(poleLocation), new Cell(Notes), new Cell(trackRevenue)];
        sheet1.rows.push(dataRowPoleLocationValues);
       
        return sheet1;
    }

    $scope.ExportWholeDaily = function (e) {
        var dailyTypeText1 = $("#ddlDailyType option:selected").text();

        var dailyDTO;
        DailyCRUDService.RetrieveWholeDailyByID($scope.ngDialogData.DAILY_ID).then(function (result) {            
            dailyDTO = result.objResult;
        }).fail(onError);

        var excelSheets = [];
        var jobSheet = getJobSheet(dailyDTO.DAILYDC);
        excelSheets.push(jobSheet);
         var notesSheet = getNotesSheet(dailyDTO.DAILYDC);
         excelSheets.push(notesSheet);
        if (dailyTypeText1 == "Fiber Splicing/Testing/Extras") {
            //$scope.DailyTypeWorkFlow["Fiber Splicing/Testing/Extras"] = [pages.dailyjob, pages.manpower, pages.vehicles, pages.materials, pages.workdetail];
            var manPowerSheet = getManpowerSheet(dailyDTO.listMAN_POWERDC);
            var vechicleSheet = getVehicle3ColumnSheet(dailyDTO.listVEHICLEDC);
            var materialSheet = getMaterialTwoColumnSheet(dailyDTO.listMATERIALDC);
            var workDetailSheet = getWorkDetailWithQtySheet(dailyDTO.listWORK_DETAILDC);
            excelSheets.push(manPowerSheet);
            excelSheets.push(vechicleSheet);
            excelSheets.push(materialSheet);
            excelSheets.push(workDetailSheet);
        }
        else if (dailyTypeText1 == "Node Install" ) {
            //$scope.DailyTypeWorkFlow["Node Install"] = [pages.dailyjob, pages.manpower, pages.vehicles, pages.workdetail];     
            var manPowerSheet = getManpowerSheet(dailyDTO.listMAN_POWERDC);
            var vechicleSheet = getVehicle3ColumnSheet(dailyDTO.listVEHICLEDC);
            var workDetailSheet = getWorkDetailSheet(dailyDTO.listWORK_DETAILDC);
            excelSheets.push(manPowerSheet);      
            excelSheets.push(vechicleSheet);
            excelSheets.push(workDetailSheet);
        }
        else if (dailyTypeText1 == "Rodding/Roping" ) {
            //$scope.DailyTypeWorkFlow["Node Install"] = [pages.dailyjob, pages.manpower, pages.vehicles, pages.workdetail];     
            var manPowerSheet = getManpowerSheet(dailyDTO.listMAN_POWERDC);
            var vechicleSheet = getVehicle3ColumnSheet(dailyDTO.listVEHICLEDC);
            var workDetailSheet = getWorkDetailWithQtySheet(dailyDTO.listWORK_DETAILDC);
            excelSheets.push(manPowerSheet);
            excelSheets.push(vechicleSheet);
            excelSheets.push(workDetailSheet);
        }
        else if ( dailyTypeText1 == "Pole Work") {
           //$scope.DailyTypeWorkFlow["Node Install"] = [pages.dailyjob, pages.manpower, pages.vehicles, pages.workdetail];     
           var manPowerSheet = getManpowerSheet(dailyDTO.listMAN_POWERDC);
           var vechicleSheet = getVehicle3ColumnSheet(dailyDTO.listVEHICLEDC);
           var workDetailSheet = getWorkDetailForPoleWork(dailyDTO.listWORK_DETAILDC);
           excelSheets.push(manPowerSheet);
           excelSheets.push(vechicleSheet);
           excelSheets.push(workDetailSheet);
           }
        //$scope.DailyTypeWorkFlow["Underground/Foundation"] = [pages.dailyjob, pages.manpower, pages.labor, pages.vehicles, pages.materials, pages.workdetail];
        else if (dailyTypeText1 == "Underground/Foundation" || dailyTypeText1 == "Manhattan Underground/Foundation") {  // manpower, laborItem, material
            var manPowerSheet = getManpowerWithJobTypeSheet(dailyDTO.listMAN_POWERDC);
            var laborSheet = getLaborSheet(dailyDTO.listLABORDC);
            var vechicleSheet = getVehicleSheet(dailyDTO.listVEHICLEDC);
            var materialSheet = getMaterialSheet(dailyDTO.listMATERIALDC, dailyTypeText1);
            var workDetailSheet = getWorkDetailSheet(dailyDTO.listWORK_DETAILDC);
            excelSheets.push(manPowerSheet);
            excelSheets.push(laborSheet);
            excelSheets.push(vechicleSheet);
            excelSheets.push(materialSheet);
            excelSheets.push(workDetailSheet);
        }
        else if (dailyTypeText1 == "Power supply") { 
            //$scope.DailyTypeWorkFlow["Power supply"] = [pages.dailyjob, pages.manpower, pages.labor, pages.vehicles, pages.materials];
            var manPowerSheet = getManpowerWithJobTypeSheet(dailyDTO.listMAN_POWERDC);
            var laborSheet = getLaborSheet(dailyDTO.listLABORDC);
            var vechicleSheet = getVehicleSheet(dailyDTO.listVEHICLEDC);
            var materialSheet = getMaterialSheet(dailyDTO.listMATERIALDC, dailyTypeText1);
            excelSheets.push(manPowerSheet);
            excelSheets.push(laborSheet);
            excelSheets.push(vechicleSheet);
            excelSheets.push(materialSheet);
        }
        
        else if (dailyTypeText1 == "Wifi") {  
            //$scope.DailyTypeWorkFlow[dtWifiText] = [pages.dailyjob, pages.manpower, pages.labor, pages.vehicles, pages.laboritem, pages.materials];
            var manPowerSheet = getManpowerWithJobTypeSheet(dailyDTO.listMAN_POWERDC);
            var laborSheet = getLaborSheet(dailyDTO.listLABORDC);
            var vechicleSheet = getVehicle3ColumnSheet(dailyDTO.listVEHICLEDC);
            var laborItemSheet = getLaborItemSheet(dailyDTO.listLaborItemDC);
            var materialSheet = getMaterialSheet(dailyDTO.listMATERIALDC);
            excelSheets.push(manPowerSheet);
            excelSheets.push(laborSheet);
            excelSheets.push(vechicleSheet);
            excelSheets.push(laborItemSheet);
            excelSheets.push(materialSheet);
        }
        else if (dailyTypeText1 == "MDU") {
            //$scope.DailyTypeWorkFlow[dtLigginsText] = [pages.dailyjob, pages.manpower, pages.laboritem, pages.materials];
            var manPowerSheet = getManpowerSheet(dailyDTO.listMAN_POWERDC);
            var laborItemSheet = getLaborItemSheet(dailyDTO.listLaborItemDC);
            var materialSheet = getMaterialSheet(dailyDTO.listMATERIALDC);
            excelSheets.push(manPowerSheet);
            excelSheets.push(laborItemSheet);
            excelSheets.push(materialSheet);
        }
        else if (dailyTypeText1 == "Aerial-MDU") {  
            //$scope.DailyTypeWorkFlow[dtByrneText] = [pages.dailyjob, pages.manpower, pages.labor, pages.vehicles, pages.aerial, pages.materials, pages.mdu];
            var manPowerSheet = getManpowerWithJobTypeSheet(dailyDTO.listMAN_POWERDC);
            var laborSheet = getLaborSheet(dailyDTO.listLABORDC);
            var vechicleSheet = getVehicleSheet(dailyDTO.listVEHICLEDC);
            var aerialSheet = getAerialSheet(dailyDTO.listAerialDC);
            var materialSheet = getMaterialSheet(dailyDTO.listMATERIALDC);
            var mduSheet = getMDUSheet(dailyDTO.listMDUDC);
            excelSheets.push(manPowerSheet);
            excelSheets.push(laborSheet);
            excelSheets.push(vechicleSheet);
            excelSheets.push(aerialSheet);
            excelSheets.push(materialSheet);
            excelSheets.push(mduSheet);
        }
        
        var workbook1 = new kendo.ooxml.Workbook({
            sheets: excelSheets
        });

        //$(sheet.columns).each(function (colInd, col) {
        //    col.autoWidth = true;
        //});

        var projectID = $("#ddlProjectId option:selected").text();
        var jobID = $("#ddlJobFileNumber option:selected").text();
        var dailyType = $("#ddlDailyType option:selected").text();
        var dailyFileName = "Daily_" + projectID + "_" + jobID+".xlsx"

        kendo.saveAs({
            dataURI: workbook1.toDataURL(),
            fileName: dailyFileName
        });
    };
    $scope.closeDialog1 = function () {
        var closeNow = true;
        if (isChildDataChanged) {
            if (confirm(Globals.ChangesLostMessage)) {
                
                closeNow = true;
                if ($scope.CurrentView == "DailiesCRUD") {
                    $scope.CurrentView = "";
                }
                if ($scope.userProfile) {
                    $scope.userProfile = null;
                }
                else if ($scope.Message) {
                    $scope.Message = null;
                }
                else {
                    if ($("#grid2").data("kendoGrid") && $("#grid2").data("kendoGrid").dataSource)
                        $("#grid2").data("kendoGrid").dataSource.cancelChanges();
                }
                isPopupFirstLoad = true;
                isChildDataChanged = false;
                Globals.isNewRowAdded = false;
            } else
                closeNow = false;
        }
        if (closeNow == true) {
            var isRecordSaved = objSendEmail.IsRecordSaved;
            SendEmail();
            if ($scope.DialogChangesSaved == true || isRecordSaved ) {
                $scope.$emit("CRUD_OPERATIONS_SUCCESS", true);
            }
            else {
                $scope.$emit("CLOSE_WITHOUT_CHANGE", true);
            }

            ngDialog.close();
        }
        else
            return false;
    };

    var SendEmail = function () {
        if (objSendEmail.IsRecordSaved)
        {
            DailyCRUDService.SendDailyEmail($scope.ngDialogData.DAILY_ID, objSendEmail.IsNewDaily).then(function (result) {
                console.log("Daily Email Sent");
            });
            objSendEmail.reset();
        }
    };

    $scope.PostData = function (fromBtnSave, sender, prmNextPageId) {
       
        var dailyDTO = {};
        var repeatIt = false;
        if (sender == 'repeat') {
            repeatIt = true;
            dailyDTO.Repeat = repeatIt;
            var subCatObjLU = GetLookUpObject($scope.matSubCategoryLU, "MATERIAL_SUB_CATEGORY", "Labor");
            if (subCatObjLU != null) {
                dailyDTO.LU_ID_LABOR = subCatObjLU.LOOK_UP_ID;
            }
            subCatObjLU = GetLookUpObject($scope.matSubCategoryLU, "MATERIAL_SUB_CATEGORY", "Aerial");
            if (subCatObjLU != null) {
                dailyDTO.LU_ID_AERIAL = subCatObjLU.LOOK_UP_ID;
            }
            subCatObjLU = GetLookUpObject($scope.matSubCategoryLU, "MATERIAL_SUB_CATEGORY", "MDU");
            if (subCatObjLU != null) {
                dailyDTO.LU_ID_MDU = subCatObjLU.LOOK_UP_ID;
            }
        }

        dailyDTO.listMAN_POWERDC = $scope.GetGridData("gridManPower");
        dailyDTO.listVEHICLEDC = $scope.GetGridData("gridVehicles");
        dailyDTO.listLABORDC = [];
        dailyDTO.listMATERIALDC = $scope.GetGridData("gridMaterials");
        dailyDTO.listWORK_DETAILDC = $scope.GetGridData("gridWorkDetails");

        dailyDTO.listLaborItemDC = $scope.GetGridData("gridLaborItem");
        dailyDTO.listAerialDC = $scope.GetGridData("gridAerial");
        dailyDTO.listMDUDC = $scope.GetGridData("gridMDU");

        if (isDataChanged == true || repeatIt == true ||
                dailyDTO.listMAN_POWERDC.length > 0 ||
                dailyDTO.listVEHICLEDC.length > 0 ||
                dailyDTO.listMATERIALDC.length > 0 ||
                dailyDTO.listWORK_DETAILDC.length > 0 ||
                dailyDTO.listLaborItemDC.length > 0 ||
                dailyDTO.listAerialDC.length > 0 ||
                dailyDTO.listMDUDC.length > 0) {

            var gridValidation = true;
            if (dailyDTO.listMAN_POWERDC.length > 0) {
                var hideJobTypeColumn = (($("#ddlDailyType option:selected").text() != "Manhattan Underground/Foundation") && ($("#ddlDailyType option:selected").text() != "Underground/Foundation") && $("#ddlDailyType option:selected").text() != "Power supply");
                var validManPowers = [];
                $(dailyDTO.listMAN_POWERDC).each(function (index, item) {
                    if (IsNullOrEmpty(item.FIRST_NAME)) {
                        gridValidation = false;
                        return false;
                    }
                });
            }

            if (gridValidation == true) {
                $scope.dailyDCModel.MODIFIED_BY = $scope.ngDialogData.USER_ID;
                $scope.dailyDCModel.MODIFIED_ON = new Date();
                if ($scope.ngDialogData.DAILY_ID <= 0) { // For new dailies
                    $scope.dailyDCModel.CREATED_ON = $scope.dailyDCModel.MODIFIED_ON;
                    $scope.dailyDCModel.CREATED_BY = $scope.dailyDCModel.MODIFIED_BY;
                }
                var crudAction = ($scope.ngDialogData.DAILY_ID > 0) ? DailyCRUDService.UpdateDaily : DailyCRUDService.CreateDaily;
                if (repeatIt == true) { // Repeat - Always create new daily
                    crudAction = DailyCRUDService.CreateDaily;
                    $scope.dailyDCModel.CREATED_BY = $scope.ngDialogData.USER_ID;
                }
                dailyDTO.DAILYDC = $scope.dailyDCModel;
                ShowHideLoaderOverly(true);
                crudAction(JSON.stringify(dailyDTO)).then(function (result) {                    
                    ShowHideLoaderOverly(false);
                    if (result.dailyDTO.DAILYDC.TRANSACTION_SUCCESS == true) {
                        if (repeatIt == true) { //repeat is considered as record is not yet saved
                            objSendEmail.reset();
                        }
                        else {
                            objSendEmail.IsRecordSaved = true;
                        }
                        
                        isChildDataChanged = false;
                        isDataChanged = false;
                        $scope.DialogChangesSaved = true;

                        //$scope.EmailDailyID = result.dailyDTO.DAILYDC.DAILY_ID;

                        hylanCache.SetValue(hylanCache.Keys.NEWLYADDED_ROWID, result.dailyDTO.DAILYDC.DAILY_ID, $scope.Screens.MANAGE_DAILIES.ID);
                        $timeout(function () { });
                        if ($scope.ngDialogData.DAILY_ID != undefined && ($scope.ngDialogData.DAILY_ID == 0 || repeatIt == true)) //add mode
                        {
                            $scope.ngDialogData.DAILY_ID = result.DAILY_ID;
                        }
                        $scope.GetDailyDetails($scope.ngDialogData.DAILY_ID, result.dailyDTO.DAILYDC); // It will not make any extra api-calls
                        $scope.isManPowerInit = false;
                        $scope.isVehiclesInit = false;
                        $scope.isMaterialsInit = false;
                        $scope.isLaborsInit = false;
                        $scope.isWorkDetailsInit = false;
                        $scope.isLaborItemInit = false;
                        $scope.isAerialInit = false;
                        $scope.isMDUInit = false;
                        $scope.loadGridData(); // Refresh current page grid data
                        var curPageId = $("#pageSection > div:visible").attr("id");
                        $("#li-" + curPageId).removeClass("edit").addClass("completed");
                        if (curPageId == "page2" && $("#li-page3").hasClass("hide") == false) {
                            $("#li-page3").removeClass("edit").addClass("completed");
                        }
                        else if (curPageId == "page10") {
                           if ($scope.dailyDCModel.DAILY_TYPE_NOTES == undefined || $scope.dailyDCModel.DAILY_TYPE_NOTES == '')
                              $("#li-page10").removeClass("completed");
                        }
                        if (sender == 'next' || sender == 'back' || prmNextPageId != undefined) {
                            $scope.NextPrevClick(sender, prmNextPageId); // Move to the next or prev page
                        }
                        else {
                            if (sender == 'repeat') {
                                $scope.dailyDCModel.DAILY_DATE = '';
                                $scope.dailyDCModel.DAILY_DAYS = '';
                                onSuccess("Repeat operation is performed successfully. Please update 'Date' and 'Day(s)' fields.");
                                if (curPageId != "page1") {
                                    $("#li-page1").trigger("click");
                                }
                            }
                            else
                                onSuccess("Changes Saved.");
                        }
                    }
                    else {
                        var retDailyDTO = result.dailyDTO;
                        var errorMessage = '';
                        var temp = [];
                        temp.push(retDailyDTO.DAILYDC);
                        var page1ResSummary = GetResultSummary($("#page1").data("page-title"), temp);
                        errorMessage += page1ResSummary.summary;
                        if (page1ResSummary.type == "CONCURRENCY_ERROR") {
                            $scope.GetDailyDetails(retDailyDTO.DAILYDC.DAILY_ID);
                        }
                        else {
                            isDataChanged = true;
                        }

                        var page2ResSummary = GetResultSummary($("#page2").data("page-title"), retDailyDTO.listMAN_POWERDC);
                        errorMessage += page2ResSummary.summary;
                        $scope.isManPowerInit = (page2ResSummary.type == "CONCURRENCY_ERROR") ? false : true;

                        var page4ResSummary = GetResultSummary($("#page4").data("page-title"), retDailyDTO.listVEHICLEDC);
                        errorMessage += page4ResSummary.summary;
                        $scope.isVehiclesInit = (page4ResSummary.type == "CONCURRENCY_ERROR") ? false : true;

                        var page6ResSummary = GetResultSummary($("#page6").data("page-title"), retDailyDTO.listWORK_DETAILDC);
                        errorMessage += page6ResSummary.summary;
                        $scope.isWorkDetailsInit = (page6ResSummary.type == "CONCURRENCY_ERROR") ? false : true;

                        if (retDailyDTO.listLABORDC.length > 0) {
                            var page3ResSummary = GetResultSummary($("#page3").data("page-title"), retDailyDTO.listLABORDC);
                            errorMessage += page3ResSummary.summary;
                            $scope.isLaborsInit = (page3ResSummary.type == "CONCURRENCY_ERROR") ? false : true;
                        }

                        if (retDailyDTO.listMATERIALDC.length > 0) {
                            var page5ResSummary = GetResultSummary($("#page5").data("page-title"), retDailyDTO.listMATERIALDC);
                            errorMessage += page5ResSummary.summary;
                            $scope.isMaterialsInit = (page5ResSummary.type == "CONCURRENCY_ERROR") ? false : true;
                        }

                        if (retDailyDTO.listLaborItemDC.length > 0) {
                            var page7ResSummary = GetResultSummary($("#page7").data("page-title"), retDailyDTO.listLaborItemDC);
                            errorMessage += page7ResSummary.summary;
                            $scope.isLaborItemInit = (page7ResSummary.type == "CONCURRENCY_ERROR") ? false : true;
                        }
                        if (retDailyDTO.listAerialDC.length > 0) {
                            var page8ResSummary = GetResultSummary($("#page8").data("page-title"), retDailyDTO.listAerialDC);
                            errorMessage += page8ResSummary.summary;
                            $scope.isAerialInit = (page8ResSummary.type == "CONCURRENCY_ERROR") ? false : true;
                        }
                        if (retDailyDTO.listMDUDC.length > 0) {
                            var page9ResSummary = GetResultSummary($("#page9").data("page-title"), retDailyDTO.listMDUDC);
                            errorMessage += page9ResSummary.summary;
                            $scope.isMDUInit = (page9ResSummary.type == "CONCURRENCY_ERROR") ? false : true;
                        }

                        $scope.loadGridData(); // Refresh current page grid data
                        ShowHideMessages(NOTIFYTYPE.ERROR, errorMessage, true);
                    }
                   
                }).fail(onError);
            }
            else {
                ShowHideMessages(NOTIFYTYPE.ERROR, "Please enter Name.", true);
            }
        }
        else {
            if (fromBtnSave == true)
                alert(Globals.NoChanges);
            if (sender == 'next' || sender == 'back' || prmNextPageId != undefined)
                $scope.NextPrevClick(sender, prmNextPageId);
        }

    };

    function onSuccess(message) {
        ShowHideLoaderOverly(false);
        ShowHideMessages(NOTIFYTYPE.SUCCESS, message, true);
    }
    function ShowHideMessages(msgType, msgText, toShow) {
        if (toShow == true) {
            Utility.Notify({ type: msgType, message: msgText, IsPopUp: true });
        }
        else if (toShow == false) {
            Utility.HideNotification();
        }
        AdjustWorkflowSteps();
    }
    function onError(XMLHttpRequest, textStatus, errorThrown) {
        ShowHideLoaderOverly(false);
        var exception = XMLHttpRequest.responseText ? XMLHttpRequest.responseText : errorThrown;
        var exceptionParsed = JSON.parse(exception);
        ShowHideMessages(NOTIFYTYPE.ERROR, exception, true);
    }

    $scope.ChangeStart = function () {
        isDataChanged = true;
        isChildDataChanged = true;
        ShowHideMessages(null, null, false);
        if ($scope.dailyDCModel.DAILY_DATE != "") {
            var dailyDate = new Date($scope.dailyDCModel.DAILY_DATE);
            var weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            $scope.dailyDCModel.DAY_OF_WEEK = weekDays[dailyDate.getDay()];
        }
        else {
            $scope.dailyDCModel.DAY_OF_WEEK = "";
        }

        var curPageId = $("#pageSection > div:visible").attr("id");
        $("#li-" + curPageId).removeClass("completed").addClass("edit");
    }

    $scope.OnChangeDailyType = function () {
        $scope.ChangeStart();
        $scope.GetManPowerJobTypes();
        $scope.SetWorkFlowSteps();
    };

    $scope.NextPrevClick = function (sender, prmNextPageId) {
        var dailyTypeText = $("#ddlDailyType option:selected").text();
        var currentPageSet = $scope.DailyTypeWorkFlow[dailyTypeText];
        var nextPageId = (prmNextPageId == '' || prmNextPageId == undefined) ? undefined : prmNextPageId;
        var curPage = $("#pageSection > div:visible").attr("id");
        if (curPage == prmNextPageId) {
            return;
        }
        var keepNavigating = true;
        if (curPage != "page1" && nextPageId == undefined) {
            var gridId = $("#" + curPage + " > div:visible").attr("id");
            var kendoGridObj = $("#" + gridId).data("kendoGrid");
            if (kendoGridObj != undefined) {
                var gridPageSize = kendoGridObj.dataSource.pageSize();
                var gridPage = kendoGridObj.dataSource.page();
                var gridTotalPages = kendoGridObj.dataSource.totalPages();
                if (gridTotalPages > 1) {
                    if ((sender == "next" && gridPage < gridTotalPages) || (sender == "back" && gridPage > 1)) {
                        var gridPagerNextPrev = (sender == "next") ? "#" + gridId + " span.k-i-arrow-e" : "#" + gridId + " span.k-i-arrow-w";
                        $(gridPagerNextPrev).parent().click();
                        keepNavigating = false;
                    }
                    else {
                        keepNavigating = true;
                    }
                }
                //setActivePageInfo(curPage);
            }
        }

        if (keepNavigating == true) {
            var curIndex = currentPageSet.indexOf(curPage);

            var newPageIndex = (sender == "next") ? curIndex + 1 : curIndex - 1;
            if (nextPageId == undefined && newPageIndex >= 0 && newPageIndex < currentPageSet.length) {
                nextPageId = currentPageSet[newPageIndex];
            }
            else {
                newPageIndex = currentPageSet.indexOf(nextPageId);
            }
            if (nextPageId != undefined) {
                $("#pageSection > div").addClass("hide");
                $("#" + nextPageId).removeClass("hide");
                $(".progress-indicator li").removeClass("active-page");
                $("#li-" + nextPageId).addClass("active-page");
                //setActivePageInfo(nextPageId);
                $scope.PageTitle = $("#" + nextPageId).data("page-title");
                $scope.FirstPageSelected = (nextPageId == "page1");
            }
            if (newPageIndex + 1 == currentPageSet.length) {
                $("#nextButton").addClass("hide");
                $scope.btnNextPageVisibilitySetting();
            }
            else
                $("#nextButton").removeClass("hide");

            if (newPageIndex > 0)
                $("#backButton").removeClass("hide");
            else
                $("#backButton").addClass("hide");

            $scope.loadGridData();
        }
    };

    $scope.loadGridData = function () {
        var pageId = $("#pageSection > div:visible").attr("id");
        var gridInitCalled = false;
        if (pageId == "page10" ) {
            //var gridPageSize = 12;
            //$scope.gridManPowerInit(gridPageSize);
            //gridInitCalled = true;
        }
        if (pageId == "page2" && $scope.isManPowerInit == false) {
            var gridPageSize = 12;
            $scope.gridManPowerInit(gridPageSize);
            gridInitCalled = true;
        }
        else if (pageId == "page3" && $scope.isLaborsInit == false) {
            if ($scope.isManPowerInit == false) {
                $scope.gridManPowerInit();
            }
            $scope.gridLaborsInit();
            gridInitCalled = true;
        }
        else if (pageId == "page4" && $scope.isVehiclesInit == false) {
            $scope.gridVehiclesInit();
            gridInitCalled = true;
        }
        else if (pageId == "page5" && $scope.isMaterialsInit == false) {
            $scope.gridMaterialsInit(null);
            gridInitCalled = true;
        }
        else if (pageId == "page6" && $scope.isWorkDetailsInit == false) {
            $scope.gridWorkDetailsInit();
            gridInitCalled = true;
        }
        else if (pageId == "page7" && $scope.isLaborItemInit == false) {
            $scope.gridMaterialsInit('Labor');
            gridInitCalled = true;
        }
        else if (pageId == "page8" && $scope.isAerialInit == false) {
            $scope.gridMaterialsInit('Aerial');
            gridInitCalled = true;
        }
        else if (pageId == "page9" && $scope.isMDUInit == false) {
            $scope.gridMaterialsInit('MDU');
            gridInitCalled = true;
        }
        var kendoGridObj = $("#" + pageId + " .k-grid").data("kendoGrid");
        if (gridInitCalled == false && kendoGridObj != undefined) {
            kendoGridObj.dataSource.page(1);
            //setActivePageInfo(pageId);
        }
    };
    
    $scope.PreExportSetting1 = function () {
       isManpowerExporting = true;
        if (childGrid1) {
            if ($scope.handleFilterChange() == true) {
                childGrid1.hideColumn("ROW_HEADER");
               
                if (childGrid1.$angular_scope.ApiResource == "Dailies" || childGrid1.$angular_scope.ApiResource == "Permits") {
                    childGrid1.hideColumn("VIEW_EDIT");

                }
                $("th a span.k-i-filter").hide();
                $('.k-filter-row').hide();

                var screenTitle = "";
                if ($rootScope.title && $rootScope.title != null) {
                    screenTitle = $rootScope.title.replace(" - Hylan", "");
                }
                var rptHeaderHtml = "<table border='0' class='pdf-report-header' style='font-size:8pt'><tr style='height: 20px;'><td style='width:110px;padding:0px'>Screen</td><td style='width:200px;padding:0px'>" + screenTitle + "</td></tr>";
                rptHeaderHtml += "<tr style='height: 20px;'><td style='padding:0px'>Export Run Date/Time</td><td style='padding:0px'>" + FormatDate(new Date(), null, true) + "</td></tr>";
                rptHeaderHtml += "<tr style='height: 20px;'><td style='padding:0px'>Exported By</td><td style='padding:0px'>" + ($rootScope.currentUser.LAST_NAME + ", " + $rootScope.currentUser.FIRST_NAME) + "</td></tr>";
                //-------Add Daily Info

                var projectID = $('#ddlProjectId option:selected').text();
                var JobFileNo = $("#ddlJobFileNumber option:selected").text();
                var DailyType = $('#ddlDailyType option:selected').text();

                rptHeaderHtml += "<tr style='height: 20px;'><td style='padding:0px'>*Project Id</td><td style='padding:0px'>" +(projectID) + "</td></tr>";
                rptHeaderHtml += "<tr style='height: 20px;'><td style='padding:0px'>*Job File #</td><td style='padding:0px'>" +(JobFileNo) + "</td></tr>";
                rptHeaderHtml += "<tr style='height: 20px;'><td style='padding:0px'>*Daily type</td><td style='padding:0px'>" + (DailyType) + "</td></tr></table>";




                var divHtml = "<div id='pdfRptHeader'>" + rptHeaderHtml + "</div>";
                $("#" + $(childGrid1.element).attr("id")).prepend(divHtml);
            }
        }
    };
    $scope.PostExportSetting1 = function () {
       isManpowerExporting = false;
        if (childGrid1) {
            if ($scope.handleFilterChange() == true) {
                childGrid1.showColumn("ROW_HEADER");
               
                if (childGrid1.$angular_scope.ApiResource == "Dailies" || childGrid1.$angular_scope.ApiResource == "Permits") {
                    childGrid1.showColumn("VIEW_EDIT");
                }
                $("th a span.k-i-filter").show();
                $('.k-filter-row').show();
                $("#" + $(childGrid1.element).attr("id")).find("#pdfRptHeader").remove();

                var kendoGridObj = $("#" + $(childGrid1.element).attr("id")).data("kendoGrid");

                kendoGridObj.dataSource.read();

            }
        }
    };

   

    $scope.exportDailyToExcel = function () {
        if (childGrid1) {
            if ($scope.handleFilterChange() == true) {
                for (var i = 0; i <= childGrid1.columns.length -1; i++) {
                    if (angular.isDefined(childGrid1.columns[i]))
                        childGrid1.columns[i].title = childGrid1.columns[i].title.replace("<sup><img src='../../../Content/images/red_asterisk.png' /></sup>", '*').replace("<sup><img src='Content/images/red_asterisk.png' /></sup>", '*').replace("<span style='text-transform: lowercase'>s</span>", 's');
            }
                $scope.PreExportSetting1();
                var fileName = childGrid1.$angular_scope.ApiResource;
                if ($rootScope.title && $rootScope.title != null) {
                    fileName = $rootScope.title.replace(" - Hylan", "");
            }
                childGrid1.options.excel.fileName = fileName + ".xlsx";
                childGrid1.saveAsExcel();

                $scope.PostExportSetting1();
    }
    }
    else {
            Utility.Notify({
                    type: NOTIFYTYPE.WARNING,
                    message: "Grid is not loaded yet", IsPopUp: true
    });
        }
    }
    
    $scope.exportDailyToPDF = function () {
        if (childGrid1) {
            if ($scope.handleFilterChange() == true) {
                $scope.PreExportSetting1();


                var fileName = childGrid1.$angular_scope.ApiResource;
                if ($rootScope.title && $rootScope.title != null) {
                    fileName = $rootScope.title.replace(" - Hylan", "");
                }
                childGrid1.options.pdf.fileName = fileName + ".pdf";
                childGrid1.saveAsPDF().then($scope.PostExportSetting1).fail($scope.PostExportSetting1);
            }
        }
        else {
            Utility.Notify({
                type: NOTIFYTYPE.WARNING,
                message: "Grid is not loaded yet", IsPopUp: true
            });
        }
    };

    $scope.gridManPowerInit = function (gridPageSize) {
        gridPageSize = gridPageSize == null ? 10 : gridPageSize;
        var selDailyTypeText = $("#ddlDailyType option:selected").text();
        var hideJobTypeColumn = (selDailyTypeText != "Manhattan Underground/Foundation" && selDailyTypeText != "Underground/Foundation" && selDailyTypeText != "Power supply" && selDailyTypeText != dtWifiText && selDailyTypeText != dtByrneText);
        var schema = {
            model: {
                id: "MAN_POWER_ID",
                fields: {
                    ROW_HEADER: { editable: false },
                    MAN_POWER_ID: { title: "MAN_POWER_ID", editable: false },
                    DAILY_ID: { title: "DAILY_ID", editable: false },
                    LAST_NAME: { title: "Last Name", editable: false },
                    FIRST_NAME: { title: "First Name", editable: true },
                    ST_HOURS: { title: "ST Hours", type: "number", editable: true },
                    OT_HOURS: { title: "OT Hours", type: "number", editable: true },
                    HOURS_DIFF: { title: "Diff. Hours", type: "number", editable: true },
                    MAN_POWER_JOB_TYPE: { title: "Job Type", type: "number", editable: true },
                    CREATED_BY: { title: "CREATED_BY", editable: false },
                    CREATED_ON: { type: "date", title: "CREATED_ON", editable: false },
                    MODIFIED_BY: { title: "MODIFIED_BY", editable: false },
                    MODIFIED_ON: { type: "date", title: "MODIFIED_ON", editable: false },
                    LOCK_COUNTER: { title: "LOCK_COUNTER", editable: false },
                }
            }
        };
       
        var manPowerJobTypeFilterTemplate = function (args) {
            // create a DropDownList of unique values (colors)
            args.element.kendoDropDownList({
                dataSource: manPowerJobTypeLU,
                dataTextField: "LU_NAME",
                dataValueField: "LOOK_UP_ID",
                valuePrimitive: true,
                optionLabel: " "
            });
        }

        var aggr = [{ field: "ST_HOURS", aggregate: "sum" },
                   { field: "OT_HOURS", aggregate: "sum" },
                   { field: "HOURS_DIFF", aggregate: "sum" }
        ];
        var columns = [
                   { field: "ROW_HEADER", width: "1%", title: "   .", sortable: false, filterable:false, headerAttributes: { "class": "sub-col darkYellow-col rowHeaderHeadYellow", "style": "border-right: 0px !important;" }, attributes: { "class": "contert-alpha GridBorder rowHeaderCell" } },
                   { field: "MAN_POWER_ID", type: "number", title: "MAN_POWER_ID", width: "80px", hidden: true, template: "#: MAN_POWER_ID == null ? '' : MAN_POWER_ID#" },
                   { field: "DAILY_ID", title: "DAILY_ID", width: "80px", hidden: true, template: "#: DAILY_ID == null ? '' : DAILY_ID#" },

                   { field: "LAST_NAME", title: "<sup><img src='../../../Content/images/red_asterisk.png' /></sup>Last Name", hidden: true, width: "20%", headerAttributes: { "class": "sub-col lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#=Globals.dirtyField(data,'LAST_NAME')# #:LAST_NAME#", filterable: stringFilterAttributes },
                   { field: "FIRST_NAME", title: "<sup><img src='../../../Content/images/red_asterisk.png' /></sup>Name", width: "40%", headerAttributes: { "class": "sub-col  lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, editor: manPowerAjaxEditor, template: "#=Globals.dirtyField(data,'FIRST_NAME')# #:FIRST_NAME#", filterable: stringFilterAttributes },

                   { field: "MAN_POWER_JOB_TYPE", title: "Job Type", width: "15%", hidden: hideJobTypeColumn, headerAttributes: { "class": "sub-col lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, editor: manPowerJobTypeEditor, template: "#= GetManPowerJobTypeName(data)#", filterable: { cell: { template: manPowerJobTypeFilterTemplate, showOperators: false } } },

                   { field: "ST_HOURS", title: "ST Hours", width: "15%", headerAttributes: { "class": "sub-col lightYellow-col" }, attributes: { "class": "contert-number GridBorder" }, editor: editNumber, aggregates: ["sum"], footerTemplate: $scope.sumTemplate, footerAttributes: { "class": "contert-number" }, filterable: numberFilterAttributes },
                   { field: "OT_HOURS", title: "OT Hours", width: "15%", headerAttributes: { "class": "sub-col lightYellow-col" }, attributes: { "class": "contert-number GridBorder" }, editor: editNumber, aggregates: ["sum"], footerTemplate: $scope.sumTemplate, footerAttributes: { "class": "contert-number" }, filterable: numberFilterAttributes },
                   { field: "HOURS_DIFF", title: "Diff. Hours", width: "15%", headerAttributes: { "class": "sub-col lightYellow-col" }, attributes: { "class": "contert-number GridBorder" }, editor: editNumber, aggregates: ["sum"], footerTemplate: $scope.sumTemplate, footerAttributes: { "class": "contert-number" }, filterable: numberFilterAttributes },

                   { field: "CREATED_BY", title: "CREATED_BY", width: "150px", hidden: true, template: "#: CREATED_BY == null ? '' : CREATED_BY#" },
                   { field: "CREATED_ON", title: "CREATED_ON", width: "150px", hidden: true, template: "#: CREATED_ON == null ? '' : moment(CREATED_ON).format('MM/DD/YYYY')#" },
                   { field: "MODIFIED_BY", title: "MODIFIED_BY", width: "150px", hidden: true, template: "#: MODIFIED_BY == null ? '' : MODIFIED_BY#" },
                   { field: "MODIFIED_ON", title: "MODIFIED_ON", width: "150px", hidden: true, template: "#: MODIFIED_ON == null ? '' : moment(MODIFIED_ON).format('MM/DD/YYYY')#" },
                   { field: "LOCK_COUNTER", title: "LOCK_COUNTER", width: "150px", hidden: true, template: "#: LOCK_COUNTER == null ? '' : LOCK_COUNTER#" }
        ];
        var addBtn = { name: "create", text: "Add Name" };
        var deleteBtn = {
            name: "custom_destroy",
            template: '<a class="k-button k-button-icontext k-grid-destroyRecord" ng-click="btnDeleteManPowerClick()"><span class="k-icon k-i-delete"></span>Delete</a>'
        };
        var exportToPdfBtn = { name : "pdf1",
            template: '<a class="k-button k-button-icontext" ng-click="exportDailyToPDF()" ><span class="k-icon k-i-file-pdf"></span>Export to PDF</a>'
        };
        var exportToExcelBtn = { name: "excel1", 
            template: '<a class="k-button k-button-icontext" ng-click="exportDailyToExcel()" ><span class="k-icon k-i-file-excel"></span>Export to Excel</a>'
        };
        var toolbar = [];
        toolbar.push(exportToPdfBtn);
        toolbar.push(exportToExcelBtn);

        if (/iPad/.test(Globals.UserAgent) == false && (/Android/.test(Globals.UserAgent)) == false) {
            toolbar.push(deleteBtn);
        }
        toolbar.push(addBtn);
        
        var gridInitParams = {
            "gridId": "gridManPower",
            "readCallBack": DailyCRUDService.RetrieveManPower,
            "readCallBackParams": { 'dailyid': $scope.ngDialogData.DAILY_ID },
            "dsSchema": schema,
            "dsAggregate": aggr,
            "columns": columns,
            "toolbar": toolbar,
            "defaultSortFieldName": "FIRST_NAME",
            "dir": "asc",
            "gridPageSize": gridPageSize
        };
        $scope.kendoGridInit(gridInitParams);
        $scope.isManPowerInit = true;      
    };
    $scope.gridVehiclesInit = function () {
        var hideIDNumberColumn = ($("#ddlDailyType option:selected").text() != "Manhattan Underground/Foundation" && $("#ddlDailyType option:selected").text() != "Underground/Foundation" && $("#ddlDailyType option:selected").text() != dtByrneText && $("#ddlDailyType option:selected").text() != "Power supply");
        var schema = {
            model: {
                id: "VEHICLE_VALUE_ID",
                fields: {
                    ROW_HEADER: { editable: false },

                    VEHICLE_VALUE_ID: { title: "VEHICLE_VALUE_ID", editable: false },
                    VEHICLE_ID: { title: "VEHICLE_ID", editable: false },
                    DAILY_ID: { title: "DAILY_ID", editable: false },
                    DAILY_TYPE: { title: "DAILY_TYPE", editable: false },

                    ID_NUMBER: { title: "First Name", editable: false },
                    VEHICLE_TYPE: { title: "Vehicle Type", editable: false },
                    NOTES: { title: "Vehicle Notes", editable: true },
                    HOURS: { title: "Hours", type: "number", editable: true },

                    CREATED_BY: { title: "CREATED_BY", editable: false },
                    CREATED_ON: { type: "date", title: "CREATED_ON", editable: false },
                    MODIFIED_BY: { title: "MODIFIED_BY", editable: false },
                    MODIFIED_ON: { type: "date", title: "MODIFIED_ON", editable: false },
                    LOCK_COUNTER: { title: "LOCK_COUNTER", editable: false },
                }
            }
        };
        var aggr = [{ field: "HOURS", aggregate: "sum" }];
        var columns = [
                   { field: "VEHICLE_ID", type: "number", title: "VEHICLE_ID", hidden: true, template: "#: VEHICLE_ID == null ? '' : VEHICLE_ID#" },
                   { field: "DAILY_ID", title: "DAILY_ID", hidden: true, template: "#: DAILY_ID == null ? '' : DAILY_ID#" },
                   { field: "DAILY_TYPE", title: "DAILY_TYPE", hidden: true, template: "#: DAILY_TYPE == null ? '' : DAILY_TYPE#" },
                   { field: "VEHICLE_VALUE_ID", title: "VEHICLE_VALUE_ID", hidden: true, template: "#: VEHICLE_VALUE_ID == null ? '' : VEHICLE_VALUE_ID#" },

                   { field: "ID_NUMBER", title: "ID#", width: "10%", hidden: hideIDNumberColumn, headerAttributes: { "class": "sub-col  lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#=Globals.dirtyField(data,'ID_NUMBER')# #:ID_NUMBER#", filterable: numberFilterAttributes },
                   { field: "VEHICLE_TYPE", title: "Vehicle Type", width: "40%", headerAttributes: { "class": "sub-col lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#=Globals.dirtyField(data,'VEHICLE_TYPE')# #:VEHICLE_TYPE#", filterable: stringFilterAttributes },
                   { field: "NOTES", title: "Vehicle Notes", width: "40%", headerAttributes: { "class": "sub-col lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#= checkNull(data.NOTES,0)#", filterable: stringFilterAttributes },
                   { field: "HOURS", title: "Hours", width: "10%", headerAttributes: { "class": "sub-col lightYellow-col" }, attributes: { "class": "contert-number GridBorder" }, editor: editNumber, aggregates: ["sum"], footerTemplate: $scope.sumTemplate, footerAttributes: { "class": "contert-number" }, filterable: numberFilterAttributes },

                   { field: "CREATED_BY", title: "CREATED_BY", hidden: true, template: "#: CREATED_BY == null ? '' : CREATED_BY#" },
                   { field: "CREATED_ON", title: "CREATED_ON", hidden: true, template: "#: CREATED_ON == null ? '' : moment(CREATED_ON).format('MM/DD/YYYY')#" },
                   { field: "MODIFIED_BY", title: "MODIFIED_BY", hidden: true, template: "#: MODIFIED_BY == null ? '' : MODIFIED_BY#" },
                   { field: "MODIFIED_ON", title: "MODIFIED_ON", hidden: true, template: "#: MODIFIED_ON == null ? '' : moment(MODIFIED_ON).format('MM/DD/YYYY')#" },
                   { field: "LOCK_COUNTER", title: "LOCK_COUNTER", hidden: true, template: "#: LOCK_COUNTER == null ? '' : LOCK_COUNTER#" }
        ];
        var exportToPdfBtn = {
            name: "pdf1",
            template: '<a class="k-button k-button-icontext" ng-click="exportDailyToPDF()" ><span class="k-icon k-i-file-pdf"></span>Export to PDF</a>'
        };
        var exportToExcelBtn = {
            name: "excel1",
            template: '<a class="k-button k-button-icontext" ng-click="exportDailyToExcel()" ><span class="k-icon k-i-file-excel"></span>Export to Excel</a>'
        };
        var toolbar = [];
        toolbar.push(exportToPdfBtn);
        toolbar.push(exportToExcelBtn);

        var gridInitParams = {
            "gridId": "gridVehicles",
            "readCallBack": DailyCRUDService.RetrieveVehicles,
            "readCallBackParams": { 'dailyid': $scope.ngDialogData.DAILY_ID, 'dailytype': $scope.dailyDCModel.DAILY_TYPE },
            "dsSchema": schema,
            "dsAggregate": aggr,
            "columns": columns,
            "toolbar": toolbar,
            "defaultSortFieldName": "HOURS",
            "dir": "desc",
            "gridPageSize": 9

        };
        $scope.kendoGridInit(gridInitParams);
        $scope.isVehiclesInit = true;
    };
    $scope.gridMaterialsInit = function (subCategory) {

        var hideIDNumberCommentsCol = (($("#ddlDailyType option:selected").text() != "Manhattan Underground/Foundation" && $("#ddlDailyType option:selected").text() != "Underground/Foundation") && ($("#ddlDailyType option:selected").text() != "Power supply")) && (subCategory == null);
        var gridId = "";
        var subCatId = -1;
        var ID_NUMBER_TITLE = "ID#";
        var MATERIAL_NAME_TITLE = "Material";
        var subCatObjLU = GetLookUpObject($scope.matSubCategoryLU, "MATERIAL_SUB_CATEGORY", subCategory);
        if (subCatObjLU != null) {
            subCatId = subCatObjLU.LOOK_UP_ID;
        }
        switch (subCategory) {
            case "Labor": gridId = "gridLaborItem"; ID_NUMBER_TITLE = "Item#"; MATERIAL_NAME_TITLE = "Description of Labor Item"; break;
            case "Aerial": gridId = "gridAerial"; ID_NUMBER_TITLE = "Item#"; MATERIAL_NAME_TITLE = "Description of Aerial Item"; break;
            case "MDU": gridId = "gridMDU"; ID_NUMBER_TITLE = "Item#"; MATERIAL_NAME_TITLE = "Description of MDU Item"; break;
            default:
                gridId = "gridMaterials";
                if ($("#ddlDailyType option:selected").text() == dtLigginsText ||
                    $("#ddlDailyType option:selected").text() == dtByrneText ||
                     $("#ddlDailyType option:selected").text() == dtWifiText) {
                    ID_NUMBER_TITLE = "Item#";
                    MATERIAL_NAME_TITLE = "Description of Material Item";
                    hideIDNumberCommentsCol = false;
                }
                break;
        }
        var schema = {
            model: {
                id: "MATERIAL_VALUE_ID",
                fields: {
                    ROW_HEADER: { editable: false },

                    MATERIAL_VALUE_ID: { title: "MATERIAL_VALUE_ID", editable: false },
                    MATERIAL_ID: { title: "MATERIAL_ID", editable: false },
                    DAILY_ID: { title: "DAILY_ID", editable: false },
                    DAILY_TYPE: { title: "DAILY_TYPE", editable: false },


                    ID_NUMBER: { title: "ID#", editable: false },
                    MATERIAL_NAME: { title: "Material", editable: false },
                    UNITS: { title: "Quantity", type: "number", editable: true },
                    COMMENTS: { title: "Comments", editable: true },
                    SUB_CATEGORY: { title: "SUB_CATEGORY", editable: false },

                    CREATED_BY: { title: "CREATED_BY", editable: false },
                    CREATED_ON: { type: "date", title: "CREATED_ON", editable: false },
                    MODIFIED_BY: { title: "MODIFIED_BY", editable: false },
                    MODIFIED_ON: { type: "date", title: "MODIFIED_ON", editable: false },
                    LOCK_COUNTER: { title: "LOCK_COUNTER", editable: false },
                }
            }
        };
        var columns = [
                   { field: "MATERIAL_VALUE_ID", type: "number", title: "MATERIAL_VALUE_ID", hidden: true, template: "#: MATERIAL_VALUE_ID == null ? '' : MATERIAL_VALUE_ID#" },
                   { field: "DAILY_ID", title: "DAILY_ID", hidden: true, template: "#: DAILY_ID == null ? '' : DAILY_ID#" },
                   { field: "DAILY_TYPE", title: "DAILY_TYPE", hidden: true, template: "#: DAILY_TYPE == null ? '' : DAILY_TYPE#" },
                   { field: "MATERIAL_ID", title: "MATERIAL_ID", hidden: true, template: "#: MATERIAL_ID == null ? '' : MATERIAL_ID#" },

                   { field: "ID_NUMBER", title: ID_NUMBER_TITLE, width: "10%", hidden: hideIDNumberCommentsCol, headerAttributes: { "class": "sub-col  lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#=Globals.dirtyField(data,'ID_NUMBER')# #:ID_NUMBER#", filterable: stringFilterAttributes },
                   { field: "MATERIAL_NAME", title: MATERIAL_NAME_TITLE, width: "40%", headerAttributes: { "class": "sub-col lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#=Globals.dirtyField(data,'MATERIAL_NAME')# #:MATERIAL_NAME#", filterable: stringFilterAttributes },
                   { field: "UNITS", title: "Quantity", width: "15%", headerAttributes: { "class": "sub-col lightYellow-col" }, attributes: { "class": "contert-number GridBorder" }, editor: editNumber, filterable: numberFilterAttributes },
                   { field: "COMMENTS", title: "Comments", width: "35%", hidden: hideIDNumberCommentsCol, headerAttributes: { "class": "sub-col lightYellow-col" }, attributes: { "class": "contert-alphar GridBorder" }, template: "#= checkNull(data.COMMENTS,0)#", filterable: stringFilterAttributes },
                   { field: "SUB_CATEGORY", title: "SUB_CATEGORY", hidden: true, template: "#: SUB_CATEGORY == null ? '' : SUB_CATEGORY#", filterable: stringFilterAttributes },

                   { field: "CREATED_BY", title: "CREATED_BY", hidden: true, template: "#: CREATED_BY == null ? '' : CREATED_BY#" },
                   { field: "CREATED_ON", title: "CREATED_ON", hidden: true, template: "#: CREATED_ON == null ? '' : moment(CREATED_ON).format('MM/DD/YYYY')#" },
                   { field: "MODIFIED_BY", title: "MODIFIED_BY", hidden: true, template: "#: MODIFIED_BY == null ? '' : MODIFIED_BY#" },
                   { field: "MODIFIED_ON", title: "MODIFIED_ON", hidden: true, template: "#: MODIFIED_ON == null ? '' : moment(MODIFIED_ON).format('MM/DD/YYYY')#" },
                   { field: "LOCK_COUNTER", title: "LOCK_COUNTER", hidden: true, template: "#: LOCK_COUNTER == null ? '' : LOCK_COUNTER#" }
        ];
        var exportToPdfBtn = {
            name: "pdf1",
            template: '<a class="k-button k-button-icontext" ng-click="exportDailyToPDF()" ><span class="k-icon k-i-file-pdf"></span>Export to PDF</a>'
        };
        var exportToExcelBtn = {
            name: "excel1",
            template: '<a class="k-button k-button-icontext" ng-click="exportDailyToExcel()" ><span class="k-icon k-i-file-excel"></span>Export to Excel</a>'
        };
        var toolbar = [];
        toolbar.push(exportToPdfBtn);
        toolbar.push(exportToExcelBtn);
        var gridInitParams = {
            "gridId": gridId,
            "readCallBack": DailyCRUDService.RetrieveMaterials,
            "readCallBackParams": { 'dailyid': $scope.ngDialogData.DAILY_ID, 'dailytype': $scope.dailyDCModel.DAILY_TYPE, 'subcategory': subCatId },
            "dsSchema": schema,
            "dsAggregate": undefined,
            "columns": columns,
            "toolbar": toolbar,
            "defaultSortFieldName": "UNITS",
            "dir": "desc",
            "gridPageSize": 10
        };
        $scope.kendoGridInit(gridInitParams);
        switch (subCategory) {
            case "Labor": $scope.isLaborItemInit = true; break;
            case "Aerial": $scope.isAerialInit = true; break;
            case "MDU": $scope.isMDUInit = true; break;
            default: $scope.isMaterialsInit = true; break;
        }

    };
    $scope.gridLaborsInit = function () {
        var schema = {
            model: {
                id: "LABOR_VALUE_ID",
                fields: {
                    ROW_HEADER: { editable: false },

                    LABOR_VALUE_ID: { title: "LABOR_VALUE_ID", editable: false },
                    LABOR_ID: { title: "LABOR_ID", editable: false },
                    DAILY_ID: { title: "DAILY_ID", editable: false },
                    DAILY_TYPE: { title: "DAILY_TYPE", editable: false },


                    ID_NUMBER: { title: "ID#", editable: false },
                    LABOR_NAME: { title: "Labor", editable: false },
                    HOURS: { title: "Hours", type: "number", editable: false },

                    CREATED_BY: { title: "CREATED_BY", editable: false },
                    CREATED_ON: { type: "date", title: "CREATED_ON", editable: false },
                    MODIFIED_BY: { title: "MODIFIED_BY", editable: false },
                    MODIFIED_ON: { type: "date", title: "MODIFIED_ON", editable: false },
                    LOCK_COUNTER: { title: "LOCK_COUNTER", editable: false },
                }
            }
        };
        var columns = [
                   { field: "LABOR_VALUE_ID", type: "number", title: "LABOR_VALUE_ID", hidden: true, template: "#: LABOR_VALUE_ID == null ? '' : LABOR_VALUE_ID#" },
                   { field: "LABOR_ID", title: "DAILY_ID", hidden: true, template: "#: LABOR_ID == null ? '' : LABOR_ID#" },
                   { field: "DAILY_ID", title: "DAILY_ID", hidden: true, template: "#: DAILY_ID == null ? '' : DAILY_ID#" },
                   { field: "DAILY_TYPE", title: "DAILY_TYPE", hidden: true, template: "#: DAILY_TYPE == null ? '' : DAILY_TYPE#" },

                   { field: "ID_NUMBER", title: "ID#", width: "15%", headerAttributes: { "class": "sub-col  lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#=Globals.dirtyField(data,'ID_NUMBER')# #:ID_NUMBER#", filterable: stringFilterAttributes },
                   { field: "LABOR_NAME", title: "Labor", width: "70%", headerAttributes: { "class": "sub-col lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#=Globals.dirtyField(data,'LABOR_NAME')# #:LABOR_NAME#", filterable: stringFilterAttributes },
                   { field: "HOURS", title: "Hours", width: "15%", headerAttributes: { "class": "sub-col lightYellow-col" }, attributes: { "class": "contert-number GridBorder" }, template: "#= checkNull(data.HOURS,0)#", filterable: numberFilterAttributes },

                   { field: "CREATED_BY", title: "CREATED_BY", hidden: true, template: "#: CREATED_BY == null ? '' : CREATED_BY#" },
                   { field: "CREATED_ON", title: "CREATED_ON", hidden: true, template: "#: CREATED_ON == null ? '' : moment(CREATED_ON).format('MM/DD/YYYY')#" },
                   { field: "MODIFIED_BY", title: "MODIFIED_BY", hidden: true, template: "#: MODIFIED_BY == null ? '' : MODIFIED_BY#" },
                   { field: "MODIFIED_ON", title: "MODIFIED_ON", hidden: true, template: "#: MODIFIED_ON == null ? '' : moment(MODIFIED_ON).format('MM/DD/YYYY')#" },
                   { field: "LOCK_COUNTER", title: "LOCK_COUNTER", hidden: true, template: "#: LOCK_COUNTER == null ? '' : LOCK_COUNTER#" }
        ];
        var exportToPdfBtn = {
            name: "pdf1",
            template: '<a class="k-button k-button-icontext" ng-click="exportDailyToPDF()" ><span class="k-icon k-i-file-pdf"></span>Export to PDF</a>'
        };
        var exportToExcelBtn = {
            name: "excel1",
            template: '<a class="k-button k-button-icontext" ng-click="exportDailyToExcel()" ><span class="k-icon k-i-file-excel"></span>Export to Excel</a>'
        };
        var toolbar = [];
        toolbar.push(exportToPdfBtn);
        toolbar.push(exportToExcelBtn);
      
        var gridInitParams = {
            "gridId": "gridLabor",
            "readCallBack": DailyCRUDService.RetrieveLabors,
            "readCallBackParams": { 'dailyid': $scope.ngDialogData.DAILY_ID, 'dailytype': $scope.dailyDCModel.DAILY_TYPE },
            "dsSchema": schema,
            "dsAggregate": undefined,
            "columns": columns,
            "toolbar": toolbar,
            "defaultSortFieldName": "HOURS",
            "dir": "desc",
            "gridPageSize": 10
        };
        $scope.kendoGridInit(gridInitParams);
        $scope.isLaborsInit = true;        
    };

    $scope.gridWorkDetailsInit = function () {
        var hideUnitColumn = ($("#ddlDailyType option:selected").text() != "Pole Work"
                                    && $("#ddlDailyType option:selected").text() != "Rodding/Roping"
                                    && $("#ddlDailyType option:selected").text() != "Fiber Splicing/Testing/Extras");
        var UNIT_TITLE = "Unit";
        if ($("#ddlDailyType option:selected").text() == "Rodding/Roping" || $("#ddlDailyType option:selected").text() == "Fiber Splicing/Testing/Extras")
            UNIT_TITLE = "Quantity";
        var hideRowNumberColumn = ($("#ddlDailyType option:selected").text() != "Pole Work");
        var schema = {
            model: {
                id: "WORK_DETAIL_VALUE_ID",
                fields: {
                    ROW_HEADER: { editable: false },

                    WORK_DETAIL_VALUE_ID: { title: "WORK_DETAIL_VALUE_ID", editable: false },
                    WORK_DETAIL_ID: { title: "WORK_DETAIL_ID", editable: false },
                    DAILY_ID: { title: "DAILY_ID", editable: false },
                    DAILY_TYPE: { title: "DAILY_TYPE", editable: false },

                    ID_NUMBER: { title: "ID_NUMBER", editable: false },
                    DESCRIPTION: { title: "Description", editable: false },
                    PERFORMED: { title: "Performed", editable: true },
                    UNITS: { title: "Quantity", type: "number", editable: true },
                    COMMENTS: { title: "Comments", editable: true },

                    CREATED_BY: { title: "CREATED_BY", editable: false },
                    CREATED_ON: { type: "date", title: "CREATED_ON", editable: false },
                    MODIFIED_BY: { title: "MODIFIED_BY", editable: false },
                    MODIFIED_ON: { type: "date", title: "MODIFIED_ON", editable: false },
                    LOCK_COUNTER: { title: "LOCK_COUNTER", editable: false },
                }
            }
        };
        var columns = [
                   { field: "WORK_DETAIL_VALUE_ID", type: "number", title: "WORK_DETAIL_VALUE_ID", hidden: true, template: "#: WORK_DETAIL_VALUE_ID == null ? '' : WORK_DETAIL_VALUE_ID#" },
                   { field: "WORK_DETAIL_ID", title: "DAILY_ID", hidden: true, template: "#: WORK_DETAIL_ID == null ? '' : WORK_DETAIL_ID#" },
                   { field: "DAILY_ID", title: "DAILY_ID", hidden: true, template: "#: DAILY_ID == null ? '' : DAILY_ID#" },
                   { field: "DAILY_TYPE", title: "DAILY_TYPE", hidden: true, template: "#: DAILY_TYPE == null ? '' : DAILY_TYPE#" },
                   { title: "Number", template: "#= ++rowNumber #", width: "5%", hidden: hideRowNumberColumn, headerAttributes: { "class": "sub-col lightYellow-col" }, attributes: { "class": "contert-number GridBorder" }, filterable: numberFilterAttributes },
                   { field: "ID_NUMBER", title: "ID#", width: "10%", headerAttributes: { "class": "sub-col lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#= checkNull(data.ID_NUMBER,0)#", filterable: stringFilterAttributes },
                   { field: "DESCRIPTION", title: "Description", width: "35%", headerAttributes: { "class": "sub-col lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#=Globals.dirtyField(data,'DESCRIPTION')# #:DESCRIPTION#", filterable: stringFilterAttributes },
                   { field: "PERFORMED", title: "Performed", width: "10%", hidden: !hideUnitColumn, headerAttributes: { "class": "sub-col lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, editor: editNumberWorkDetails, template: "#= checkBoxColumnTemplate(data)#", filterable: false },
                   { field: "UNITS", title: UNIT_TITLE, width: "10%", hidden: hideUnitColumn, headerAttributes: { "class": "sub-col lightYellow-col" }, attributes: { "class": "contert-number GridBorder" }, editor: editNumber, filterable: numberFilterAttributes },
                   { field: "COMMENTS", title: "Comments", width: "35%", headerAttributes: { "class": "sub-col lightYellow-col" }, attributes: { "class": "contert-alpha GridBorder" }, template: "#= checkNull(data.COMMENTS,0)#", filterable: stringFilterAttributes },

                   { field: "CREATED_BY", title: "CREATED_BY", hidden: true, template: "#: CREATED_BY == null ? '' : CREATED_BY#" },
                   { field: "CREATED_ON", title: "CREATED_ON", hidden: true, template: "#: CREATED_ON == null ? '' : moment(CREATED_ON).format('MM/DD/YYYY')#" },
                   { field: "MODIFIED_BY", title: "MODIFIED_BY", hidden: true, template: "#: MODIFIED_BY == null ? '' : MODIFIED_BY#" },
                   { field: "MODIFIED_ON", title: "MODIFIED_ON", hidden: true, template: "#: MODIFIED_ON == null ? '' : moment(MODIFIED_ON).format('MM/DD/YYYY')#" },
                   { field: "LOCK_COUNTER", title: "LOCK_COUNTER", hidden: true, template: "#: LOCK_COUNTER == null ? '' : LOCK_COUNTER#" }
        ];
        var exportToPdfBtn = { name: "pdf1",
            template: '<a class="k-button k-button-icontext" ng-click="exportDailyToPDF()" ><span class="k-icon k-i-file-pdf"></span>Export to PDF</a>'
            };
        var exportToExcelBtn = {
        name: "excel1",
        template: '<a class="k-button k-button-icontext" ng-click="exportDailyToExcel()" ><span class="k-icon k-i-file-excel"></span>Export to Excel</a>'
        };
        var toolbar =[];
        toolbar.push(exportToPdfBtn);
        toolbar.push(exportToExcelBtn);
        var gridInitParams = {
            "gridId": "gridWorkDetails",
            "readCallBack": DailyCRUDService.RetrieveWorkDetails,
            "readCallBackParams": { 'dailyid': $scope.ngDialogData.DAILY_ID, 'dailytype': $scope.dailyDCModel.DAILY_TYPE },
            "dsSchema": schema,
            "dsAggregate": undefined,
            "columns": columns,
            "toolbar": toolbar,
            "defaultSortFieldName": "DESCRIPTION",
            "dir": "asc",
            "gridPageSize": 10
        };
        $scope.kendoGridInit(gridInitParams);
        $scope.isWorkDetailsInit = true;
    };
    $scope.kendoGridInit = function (gridInitParams) {       
        var dataSource = new kendo.data.DataSource({
            transport: {
                read: function (e) {
                    gridInitParams.readCallBack(gridInitParams.readCallBackParams).then(function success(response) {
                        if (gridInitParams.gridId == "gridManPower") {
                            $scope.manPowerJobTypeGroups = _.groupBy(response.objResult, function (elem) { return elem.MAN_POWER_JOB_TYPE; });
                        }
                        else if (gridInitParams.gridId == "gridLabor") {
                            var aggByJobType = _($scope.manPowerJobTypeGroups).map(function (g, key) {
                                return {
                                    MAN_POWER_JOB_TYPE: key,
                                    JOB_TYPE_NAME: _(g).reduce(function (m, x) { return GetManPowerJobTypeName(x); }, 0),
                                    ST_HOURS: _(g).reduce(function (m, x) { return m + x.ST_HOURS; }, 0),
                                    OT_HOURS: _(g).reduce(function (m, x) { return m + x.OT_HOURS; }, 0),
                                    HOURS_DIFF: _(g).reduce(function (m, x) { return m + x.HOURS_DIFF; }, 0)
                                };
                            });
                            $.each(aggByJobType, function (index, mpObj) {
                                $.each(response.objResult, function (index, lbrObj) {
                                    if (mpObj.JOB_TYPE_NAME != "" && lbrObj.LABOR_NAME.indexOf(mpObj.JOB_TYPE_NAME) >= 0) {
                                        if (lbrObj.LABOR_NAME.indexOf("Reg") >= 0) {
                                            lbrObj.HOURS = mpObj.ST_HOURS;
                                        }
                                        else if (lbrObj.LABOR_NAME.indexOf("OT") >= 0) {
                                            lbrObj.HOURS = mpObj.OT_HOURS;
                                        }
                                        else if (lbrObj.LABOR_NAME.indexOf("Diff") >= 0) {
                                            lbrObj.HOURS = mpObj.HOURS_DIFF;
                                        }
                                    }
                                });
                            });
                        }

                        e.success(response.objResult);
                    }, function error(response) {
                        console.log(response);
                    }).fail(onError);
                }
            },
            schema: gridInitParams.dsSchema,
            aggregate: gridInitParams.dsAggregate,
            batch: true,
            pageSize: gridInitParams.gridPageSize,
            serverPaging: false,
            serverSorting: false,
            change: function (e) {
                if (e.field && e.action == "itemchange") {
                    var grid = $("#" + gridInitParams.gridId).data("kendoGrid");
                    var model = e.items[0];
                    var groupFooterIndex = 0;
                    var groupFooters = grid.tbody.children(".k-group-footer");

                    function updateGroupFooters(items) {
                        var updatedElement;
                        for (var idx = 0; idx < items.length; idx++) {
                            var item = items[idx];
                            if ($.inArray(model, item.items) !== -1) {
                                updatedElement = true;
                                groupFooters.eq(groupFooterIndex).replaceWith(grid.groupFooterTemplate(item.aggregates));
                            }
                            groupFooterIndex++;
                        }
                        return updatedElement;
                    }

                    updateGroupFooters(this.view());

                    if (grid && grid.footerTemplate) {
                        grid.footer.find(".k-footer-template").replaceWith(grid.footerTemplate(this.aggregates()));
                    }
                    ApplySummaryRowStyle(gridInitParams.gridId);
                    var curPageId = $("#pageSection > div:visible").attr("id");
                    $("#li-" + curPageId).removeClass("completed").addClass("edit");
                }
            }            
        });

        kendoGridOptions = JSON.parse(JSON.stringify($scope.gridOptions));
        if (gridInitParams.toolbar != undefined) {
            kendoGridOptions.toolbar = gridInitParams.toolbar;
        }
        else {
            kendoGridOptions.toolbar = undefined;
            kendoGridOptions.selectable = false;
        }

        kendoGridOptions.filterable = {
            //extra: true,
            //messages: { isTrue: "True", isFalse: "False" }
            mode: "row"
        };
       
        kendoGridOptions.excelExport = $scope.gridOptions.excelExport;
        kendoGridOptions.scrollable = false;
        kendoGridOptions.pageable.pageSizes = false;
        kendoGridOptions.pageable.refresh = false;
        kendoGridOptions.pageable.info = true;
        kendoGridOptions.pageable.numeric = true;
        kendoGridOptions.pageable.buttonCount = 20;
        kendoGridOptions.dataSource = dataSource;
        kendoGridOptions.columns = gridInitParams.columns;
        kendoGridOptions.height = CalculateGridHeight() + 10;
        kendoGridOptions.dataBound = $scope.onGridDataBound;
        kendoGridOptions.edit = function (e) {
            if ($(".alert-boxpopup").is(":visible") == true)
                Utility.HideNotification();
            isChildDataChanged = true;
            if (e.model.hasOwnProperty("PERFORMED") &&
                this.columns[e.container.index()].field == "PERFORMED" && (e.model.DESCRIPTION != "Number of Nodes Installed")) {
                this.closeCell();
                return;
            }
        };
        kendoGridOptions.dataBinding = function (e) {
            rowNumber = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        };
        var gridJQID = "#" + gridInitParams.gridId ;
        if ($(gridJQID).data("kendoGrid") != undefined) {
            $(gridJQID).data("kendoGrid").setOptions(kendoGridOptions);
        }
        else
            $(gridJQID).kendoGrid(kendoGridOptions);
        var grid = $(gridJQID).data("kendoGrid");
        grid.dataSource.sort({
            field: gridInitParams.defaultSortFieldName, dir: gridInitParams.dir
        });
        grid.dataSource.page(1);
        grid.table.on("click", ".chkbx", function () {
            if ($(".alert-boxpopup").is(":visible") == true)
                Utility.HideNotification();
            var checked = this.checked,
            row = $(this).closest("tr"),
            vargrid = $("#gridWorkDetails").data("kendoGrid"),
            dataItem = grid.dataItem(row);
            dataItem.set("PERFORMED", (this.checked == true) ? 'Y' : 'N');
        });
        grid.table.on("click", ".rowHeaderCell", function () {
            if ($(".alert-boxpopup").is(":visible") == true)
                Utility.HideNotification();
        });
        $(gridJQID + " .k-grid-content").css("min-height", kendoGridOptions.height);


    };

    $scope.SetWorkFlowSteps = function () {
        var dailyTypeText = $("#ddlDailyType option:selected").text();
        var currentPageSet = $scope.DailyTypeWorkFlow[dailyTypeText];
        if (currentPageSet != undefined) {
            $(".progress-indicator li").addClass("hide");
        }
        else {
            $("#li-page3, #li-page5").addClass("hide");
        }
        $(currentPageSet).each(function (index, item) {
            $(".progress-indicator #li-" + item).removeClass("hide");
        });

        try {
            AdjustWorkflowSteps();
        } catch (e) { }
    };
    var childGrid1;
    $scope.onGridDataBound = function (args) {
        var pageId = $(this.element).parent().attr("id");
        var gridID = $(this.element).attr("id");
        ApplySummaryRowStyle(gridID);
        //setActivePageInfo(pageId);
        $scope.btnNextPageVisibilitySetting();
        //$scope.$emit("ChildGrid2Loaded", args.sender);
        childGrid1 = args.sender;

    };
    $scope.btnNextPageVisibilitySetting = function () {
        var dailyTypeText = $("#ddlDailyType option:selected").text();
        var currentPageSet = $scope.DailyTypeWorkFlow[dailyTypeText];
        var pageId = $("#pageSection > div:visible").attr("id");
        var curIndex = currentPageSet.indexOf(pageId);
        if ((curIndex + 1) == currentPageSet.length) { // Only for the last workflow step
            var gridId = $("#" + pageId + " > div:visible").attr("id");
            var kendoGridObj = $("#" + gridId).data("kendoGrid");
            if (kendoGridObj != undefined) {
                var gridPageSize = kendoGridObj.dataSource.pageSize();
                var gridPage = kendoGridObj.dataSource.page();
                var gridTotalPages = kendoGridObj.dataSource.totalPages();
                if (gridTotalPages > 1 && gridPage < gridTotalPages) {
                    $("#nextButton").removeClass("hide");
                }
                else
                    $("#nextButton").addClass("hide");
            }
        }
    };
    $scope.btnDeleteManPowerClick = function (e) {
        var grid = $("#gridManPower").data("kendoGrid");
        var selectedRows = grid.select();

        if (selectedRows == undefined || selectedRows.length == 0) {
            alert('Please select row(s) to delete by clicking on the row header.');
            return;
        }
        if (confirm(Globals.BasicDeleteConfirmation) == false)
            return;

        var selDataItems = [];
        $.each(selectedRows, function (index, value) {
            var dataItem = grid.dataItem(value);
            if (dataItem.MAN_POWER_ID > 0) {
                var row = grid.dataItem(value);
                row.MODIFIED_BY = $scope.ngDialogData.USER_ID;
                selDataItems.push(row);
            }
        });
        if (selDataItems.length > 0) {
            DailyCRUDService.DeleteManPower(JSON.stringify(selDataItems)).then(function (result) {
               if (result) {
                  objSendEmail.IsRecordSaved = true;
                  //$scope.EmailDailyID = result.dailyDTO.DAILYDC.DAILY_ID;
                  $scope.dailyDCModel.LOCK_COUNTER = result.updatedLockCounter;
                  var pageId = $("#pageSection > div:visible").attr("id");
                  if (pageId == "page2") {
                     var gridPageSize = 12;
                     $scope.gridManPowerInit(gridPageSize);
                  }
                  else {
                       $scope.gridManPowerInit();
                  }

                  onSuccess("Changes Saved.");
                  }
            }).fail(onError);
        }
        else {
            $scope.gridManPowerInit();
        }
    };
}
]);
function ApplySummaryRowStyle(gridID) {
    $("#" + gridID + " tr.k-footer-template").addClass("SummaryRow");
    var summaryTitle = 'Total';

    if (gridID == "gridManPower") {
        var totalHours = 0;
        $("#" + gridID + ' .SummaryRow .contert-number').each(function() {
            totalHours += parseFloat($(this).text().replace(',', ''));
        });
        
        var totalColIndex = 1;
        if (isManpowerExporting) {
            totalHours = totalHours / 2 //while exporting total is doubling due to doubling of Grid
            totalHours = kendo.toString(totalHours, 'n1'); //formating amount
            summaryTitle = "Total Hours: " +(totalHours); 
            totalColIndex = 0;
        } else {

            totalHours = kendo.toString(totalHours, 'n1');//formating amount
            summaryTitle = "Total Hours: " +totalHours;
         }
        $("#" + gridID + ' tr.SummaryRow > td:visible').eq(totalColIndex).append(function () {
            return $(this).css("text-align", "left").html('<label>' + summaryTitle + '</label>').next().contents();
        });
    }
    else if (gridID == "gridVehicles") {
        summaryTitle = 'Total Hours';
        $("#" + gridID + ' tr.SummaryRow > td:visible').eq(0).append(function () {
            return $(this).attr("colspan", "2").css("text-align", "left").html('<label>' + summaryTitle + '</label>').next().remove().contents();
        });
    }



    // Right-Border is set for the last column of the grid
    $("#" + gridID + " .k-grid-header tr th:visible").last().addClass("right-border");
    $("#" + gridID + " tr.SummaryRow > td:visible").last().addClass("right-border");
    $("#" + gridID + " table tbody tr").each(function () {
        $(this).find('td:visible').last().addClass('right-border');
    });
}
function setActivePageInfo(pageId) {
    $(".progress-indicator li .page-info").text("");
    var inneText = $("#" + pageId + " span.k-pager-info").text();
    $("#li-" + pageId + " .page-info").html("(" + inneText + ")");
};


function checkBoxColumnTemplate(data) {
    var elementToReturn = ''
    if (data.PERFORMED == 'Y')
        elementToReturn = "<input name='PERFORMED' type='checkbox' checked='checked' class='chkbx' />";
    else
        elementToReturn = "<input name='PERFORMED' type='checkbox' class='chkbx' />";

    var dailyTypeText = $("#ddlDailyType option:selected").text();
    if (dailyTypeText == "Node Install" && data.DESCRIPTION == "Number of Nodes Installed") {
        if (data.PERFORMED != null)
            elementToReturn = data.PERFORMED;
        else
            elementToReturn = "";
    }
    return elementToReturn;
}

function manPowerJobTypeEditor(container, options) {
    $('<input id="ddlJobTypeEditor" data-text-field="LU_NAME" data-value-field="LU_NAME"  />')
        .appendTo(container)
        .kendoDropDownList({
            autoBind: true,
            dataSource: manPowerJobTypeLU,
            dataTextField: "LU_NAME",
            dataValueField: "LOOK_UP_ID",
            dataBound: function (e) {
                var selJobType = $("#gridManPower").data("kendoGrid").dataItem(this.element.closest("tr")).MAN_POWER_JOB_TYPE;
                this.select(function (dataItem) {
                    return dataItem.LOOK_UP_ID === selJobType;
                });
            },
            change: function (lookupRow) {
                var item = this.dataItem().toJSON();
                var dataItem = $("#gridManPower").data("kendoGrid").dataItem(this.element.closest("tr"));
                dataItem.set("MAN_POWER_JOB_TYPE", item.LOOK_UP_ID);
                dataItem.get().dirty = true;
            },
            optionLabel: "-- Select Job Type --"
        });
}
function manPowerAjaxEditor(container, options) {
    $('<input class="autoAjaxEdit" />')
    .appendTo(container)
    .kendoAutoComplete({
        filter: "startswith",
        dataSource: {
            serverFiltering: true,
            transport: {
                read: function (e) {
                    var toSearch = '';
                    if (e.data && e.data.filter && e.data.filter.filters && e.data.filter.filters.length > 0)
                        toSearch = e.data.filter.filters[0].value;

                    var ajaxParams = {
                        'COLUMN_NAME': options.field, 'COLUMN_VALUE': toSearch
                    };
                    var api = "Dailies/LoadNames";
                    Globals.Get(api, ajaxParams, false).then(function success(response) {
                        e.success(response.objResult);
                    }, function error(response) {
                        console.log(response);
                    });
                }
            }
        }
        , change: function (lookupRow) {
            var item = this._oldText;
            var dataItem = $("#gridManPower").data("kendoGrid").dataItem(this.element.closest("tr"));
            dataItem.set(options.field, item);
            dataItem.get().dirty = true;
        },
        value: (options.field == "FIRST_NAME") ? options.model.FIRST_NAME : options.model.LAST_NAME
    });
}


function GetManPowerJobTypeName(data) {
    var luName = "";
    if (manPowerJobTypeLU && manPowerJobTypeLU.length > 0) {
        var lu = _.findWhere(manPowerJobTypeLU, {
            'LOOK_UP_ID': data.MAN_POWER_JOB_TYPE
        });
        if (lu) {
            luName = lu.LU_NAME;
        }
    }
    return luName;
}

function GetResultSummary(pageTitle, pageModelDCList) {
    var resultSummary = '';
    var type = "";
    $.each(pageModelDCList, function (index, pageModelDC) {
        if (pageModelDC.POST_MESSAGEDC.Type == "ERROR" || pageModelDC.POST_MESSAGEDC.Type == "EXCEPTION") {
            resultSummary += pageTitle + ": Failed to Update </br>";
            if (pageModelDC.POST_MESSAGEDC.Type == "EXCEPTION") {
                resultSummary += " Exception: " + pageModelDC.POST_MESSAGEDC.Message;
            }
            type = pageModelDC.POST_MESSAGEDC.Type;
        }
        else if (pageModelDC.POST_MESSAGEDC.Type == "CONCURRENCY_ERROR") {
            resultSummary +=  "Record(s) could not be updated since it has been edited by another user.Data has been refreshed.";
            type = pageModelDC.POST_MESSAGEDC.Type;
        }
        if (resultSummary != '' && type != '')
            return false;

    });

    return {
        "type": type, "summary": resultSummary
    };
}

function editNumber(container, options) {
    $('<input id="ipEditNumber" type="number" maxLength="5" class="vNumber" data-bind="value:' + options.field + '"/>')
        .appendTo(container).kendoNumericTextBox({
            spinners: false,
            decimals: 1
        });

    var ipEditNumber = $("#ipEditNumber").data("kendoNumericTextBox");
    RestrictDecimalNumbers(ipEditNumber);
}
function RestrictDecimalNumbers(kendoNumericTB) {
    if (kendoNumericTB) {
        $(kendoNumericTB.element).on("change", function (e) {
            var val = kendoNumericTB.element.val();
            var parts;
            if (val.indexOf(".") !== -1) {
                parts = val.split(".");
                var afterDecimal = parts[0] + ".5";
                kendoNumericTB.element.val(afterDecimal);
            }
        });
    }
}
function editNumberWorkDetails(container, options) {
    var dailyTypeText = $("#ddlDailyType option:selected").text();
    if (dailyTypeText == "Node Install" && options.field == "PERFORMED" && options.model.DESCRIPTION == "Number of Nodes Installed") {
        $('<input id="ipEditNumberWorkDetails" type="number" maxLength="5" data-bind="value:' + options.field + '"/>')
            .appendTo(container).kendoNumericTextBox({
                spinners: false,
                decimals: 1,
                value: " "
            });
        var ipEditNumberWorkDetails = $("#ipEditNumberWorkDetails").data("kendoNumericTextBox");
        RestrictDecimalNumbers(ipEditNumberWorkDetails);
    }
}

function IsNullOrEmpty(value) {
    return (value == null || value == "" || value == undefined)
}

function GetLookUpObject(LookUpList, LU_TYPE, LU_NAME) {
    return _.findWhere(LookUpList, {
        LU_TYPE: LU_TYPE, LU_NAME: LU_NAME
    });
}





