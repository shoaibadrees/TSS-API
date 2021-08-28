(function () {
  'use strict';

  angular
    .module('HylanApp')
    .controller('AttachmentsController', AttachmentsController);

  AttachmentsController.$inject = ['$scope', '$http', 'Upload', '$rootScope', 'AttachmentService', '$controller', 'Utility', 'AttachmentGridConfig', '$filter', 'hylanCache', 'AppConfig', 'NOTIFYTYPE'];

  function AttachmentsController($scope, $http, Upload, $rootScope, AttachmentService, $controller, Utility, AttachmentGridConfig, $filter, hylanCache, AppConfig, NOTIFYTYPE) {
    var vm = this;

    $controller('BaseController', { $scope: $scope });
    $scope.ApiResource = "Attachments";
    $scope.CurrentView = "Attachments";
    $scope.Grid = "gridAttachment";
    var thisDataSource = new kendo.data.DataSource({
      transport: {
        read: function (e) {
          AttachmentService.RetrieveAllAttachments().then(function success(response) {
            var headers = response.headers();
            $rootScope.lastServerDateTime = headers['x-lastserverdatetime'];
            var attachmentList = response.data.objResultList;
            AttachmentGridConfig.GetFileNameTemplate(attachmentList);
            e.success(response.data.objResultList);
          }, function error(response) {
            console.log(response);
          });
        }
      },
      pageSize: 50,
      sort: AttachmentService.defaultSort,
      schema: {
        model: {
          id: "ATTACHMENT_ID",
          fields: {
            ROW_HEADER: {
              editable: false
            },
            ATTACHMENT_ID: {
              type: "number",
              editable: false
            },
            HYLAN_PROJECT_ID: {
              type: "string",
              editable: false
            },
            PROJECT_ID: {
              type: "number",
              editable: false
            },
            JOB_ID: {
              type: "number",
              editable: false
            },
            PERMIT_ID: {
              type: "number",
              editable: false
            },
            PARENT_ID: {
              type: "number",
              editable: false
            },
            FILE_NAME: {
              type: "string",
              editable: true
            },
            FILE_TITLE: {
              type: "string",
              editable: true
            },
            FILE_KEYWORD: {
              type: "string",
              editable: true
            },
            JOB_FILE_NUMBER: {
              type: "string",
              editable: true
            },
            FILE_TYPE: {
              type: "string",
              editable: false
            },
            FILE_ICON: {
              type: "string",
              editable: false
            },
            FILE_SIZE: {
              type: "string",
              editable: false
            },
            CATEGORY_NAME: {
              type: "string",
              editable: true
            },
            USER: {
              type: "string",
              editable: false
            },
            ENTITY_TYPE: {
              type: "string",
              editable: false
            },
            MODIFIED_ON1: {
               type: 'string',
                editable: false
            }
          }
        }
      }
    });

    $scope.AllowToEdit = true;
    var editPerm = Globals.CheckEditPermission($scope.Screens.MANAGE_ATTACHMENTS.ID);
    if (editPerm == false) {
      $scope.AllowToEdit = false;
    }

    function JobFileNumTemplate(container) {
      if (container.JOB_FILE_NUMBER !== "-1") {
        if (container.JOB_FILE_NUMBER !== null && container.JOB_FILE_NUMBER !== "0") {
            return "<a href='javascript:;' ng-click='setScreenAndRowID(\"" + container.ATTACHMENT_ID + "\"); OpenJobCRUDWindow(" + container.JOB_ID + "," + $scope.AllowToEdit + ")' >" + container.JOB_FILE_NUMBER + "</a>";
        } else {
          return "";
        }
      }
      return "Unknown";
    }

    function ProjectIDTemplate(container) {
      if (container.HYLAN_PROJECT_ID === "Unknown")
        return container.HYLAN_PROJECT_ID;
      if (container.HYLAN_PROJECT_ID === null) {
        return "";
      } else {
          return "<a ng-click='setScreenAndRowID(\"" + container.ATTACHMENT_ID + "\"); OpenProjectCRUDWindow(\"" + container.PROJECT_ID + "\")' >" + container.HYLAN_PROJECT_ID + "</a>";;
      }

    }

  

    var permitNumberTemplate = "<a href='javascript:;' ng-click='setScreenAndRowID(#:ATTACHMENT_ID#); OpenPermitCRUDWindow(#:PARENT_ID#," + $scope.AllowToEdit + ")' >#: (PermitLinkText == null) ? '' : PermitLinkText#</a>";
    init();
    function init() {
      $controller('BaseController', { $scope: $scope });

      var fileNameTemplate = "<a href='javascript:;' ng-click='downloadFile(\"#:FILE_NAME#\", \"#:ENTITY_TYPE#\", #:PARENT_ID#, #:PROJECT_ID#, #:JOB_ID#, #:PERMIT_ID#, #:DAILY_ID#)' ><img class='img-responsive img-thumbnail img-rounded' style='width:15px; height:15px;' src=' #: FILE_ICON#'/> #: FILE_NAME == null ? '' : FILE_NAME#</a>";
      vm.gridOptions = {
        columns: [
        { field: "ROW_HEADER", width: "20px", title: "   .", sortable: false, filterable: false, locked: true, headerAttributes: { "class": "sub-col darkYellow-col rowHeaderHeadYellow" }, attributes: { "class": "contert-alpha GridBorder rowHeaderCell" } },
        {
            field: "HYLAN_PROJECT_ID", locked: true, title: "PROJECT ID", width: "150px", headerAttributes: { "class": "sub-col darkYellow-col rowHeaderHead2" }, attributes: { "class": "GridBorder" }, template: ProjectIDTemplate, filterable: stringFilterAttributes
        },
        {
            field: "JOB_FILE_NUMBER", locked: true, title: "JOB FILE NUMBER", headerAttributes: { "class": "sub-col darkYellow-col rowHeaderHead2" }, width: "150px", attributes: { "class": "GridBorder" }, template: JobFileNumTemplate, filterable: stringFilterAttributes
        },
        {
            field: "PermitLinkText", locked: true, title: "DOT TRACKING #", headerAttributes: { "class": "sub-col darkYellow-col rowHeaderHead2" }, width: "210px", attributes: { "class": "GridBorder" }, template: permitNumberTemplate, filterable: stringFilterAttributes
        },
         //{
         //    field: "DailyLinkText", locked: true, title: "DOT TRACKING #", headerAttributes: { "class": "sub-col darkYellow-col rowHeaderHead2" }, width: "210px", attributes: { "class": "GridBorder" }, template: permitNumberTemplate, filterable: stringFilterAttributes
         //},
        {
            field: "FILE_NAME", title: "FILE NAME", locked: true, headerAttributes: { "class": "sub-col darkYellow-col rowHeaderHead2 section-border" }, width: "160px", attributes: { "class": "contert-alpha GridBorder section-border" }, template: fileNameTemplate, filterable: stringFilterAttributes
        },
        {
            field: "FILE_TITLE", title: "FILE TITLE", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, width: "150px", attributes: { "class": "contert-alpha GridBorder" }, template: "#: FILE_TITLE == null ? '' : FILE_TITLE#", filterable: stringFilterAttributes
        },
        {
            field: "FILE_KEYWORD", title: "FILE KEYWORD", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, width: "150px", attributes: { "class": "contert-alpha GridBorder" }, template: "#: FILE_KEYWORD == null ? '' : FILE_KEYWORD#", filterable: stringFilterAttributes
        },
        {
            field: "FILE_SIZE", title: "FILE SIZE", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, width: "100px", attributes: { "class": "contert-alpha GridBorder" }, template: "#: FILE_SIZE == null ? '' : FILE_SIZE#", filterable: stringFilterAttributes
        },
        {
            field: "Documentcategorydc.CATEGORY_NAME", title: "FILE CATEGORY", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, width: "200px", attributes: { "class": "contert-alpha GridBorder" }, template: "#: Documentcategorydc.CATEGORY_NAME#", filterable: stringFilterAttributes
        },
        {
            field: "USER", title: "UPDATED BY", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, width: "150px", attributes: { "class": "contert-alpha GridBorder" }, template: "#: USER == null ? '' : USER#", filterable: stringFilterAttributes
        },
        {
            field: "ENTITY_TYPE", title: "ATTACHED TO", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, width: "150px", attributes: { "class": "contert-alpha GridBorder" }, template: "#: ENTITY_TYPE#", filterable: stringFilterAttributes
        },
        {
            field: "MODIFIED_ON1", title: "LAST UPDATED", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, width: "130px", attributes: { "class": "contert-alpha GridBorder" }, template: "#: MODIFIED_ON1#", filterable: stringFilterAttributes 
        }
        ],
        //// --------------- FALL BACK to GLOBAL funtion
        ////excelExport: function (e) {
        ////  var sheet = e.workbook.sheets[0];
        ////  for (var rowIndex = 0; rowIndex < 1; rowIndex++) {
        ////    var row = sheet.rows[rowIndex];
        ////    for (var cellIndex = 0; cellIndex < row.cells.length; cellIndex++) {
        ////      row.cells[cellIndex].background = "#fe9c15";
        ////      row.cells[cellIndex].color = "#515e68";
        ////    }
        ////  }

        ////  for (var rowIndex = 1; rowIndex < sheet.rows.length; rowIndex++) {
        ////    if (rowIndex % 2 == 0) {
        ////      var row = sheet.rows[rowIndex];
        ////      for (var cellIndex = 0; cellIndex < row.cells.length; cellIndex++) {
        ////        row.cells[cellIndex].background = "#f1f1f1";
        ////      }
        ////    }
        ////  }

        ////  for (var rowIndex = 1; rowIndex < sheet.rows.length; rowIndex++) {
        ////    var row = sheet.rows[rowIndex];
        ////    for (var cellIndex = 0; cellIndex < row.cells.length; cellIndex++) {
        ////      if (cellIndex == 1) {
        ////        if (row.cells[cellIndex].value === "0")
        ////          row.cells[cellIndex].value = "";
        ////      }
        ////      if (cellIndex == 10)
        ////        row.cells[cellIndex].format = "MM/DD/YYYY HH:mm";
        ////    }
        ////  }
        ////},
        ////pdf: {
        ////  allPages: true,
        ////  margin: { top: "2cm", left: "2cm", right: "2cm", bottom: "2cm" },
        ////  landscape: true,
        ////  repeatHeaders: true,
        ////  scale: 0.2
        ////},
        sortable: {
          mode: "single",
          allowUnsort: false
        },
        filterable: {
            //extra: true,
          mode: "row",
          operators: {
            string: {
              startswith: "Starts with",
              eq: "Is equal to",
              neq: "Is not equal to",
              contains: "Contains",
              doesnotcontain: "Does not contain",
              endswith: "Ends with",
              isnull: "Is null",
              isnotnull: "Is not null",
              isempty: "Is empty",
              isnotempty: "Is not empty"

            }
          }
        },
        serverFiltering: true,
        //serverPaging: true,
        selectable: true,
        dataSource: thisDataSource,
        pageable: {
          refresh: true,
          pageSizes: AppConfig.GridPageSizes,
          buttonCount: 5
        },
        //height: 550,
        dataBound: function (e) {
          onDataBound(e);
        },
        editable: {
          update: false,
          destroy: false
        },
        sort: function (e) {
            AttachmentService.defaultSort = e.sort;
        }
      }

      vm.gridOptions.excelExport = $scope.gridOptions.excelExport;
      vm.gridOptions.pdf = $scope.gridOptions.pdf;

      Globals.GetProjects().then(function (result) {
          var unknownPrj = { PROJECT_ID: -1, HYLAN_PROJECT_ID: "Unknown" };
          if (result.objResultList && result.objResultList.length == 0)
              result.objResultList = [];
          $scope.projectsDS = $filter('orderBy')(result.objResultList, 'HYLAN_PROJECT_ID');
          $scope.projectsDS.splice(0, 0, unknownPrj);

      });

      $scope.multiSelectProjIdControl = {};
      $scope.ResetFilter = function () {
        $scope.clearFilters();
        hylanCache.RemoveKey(hylanCache.Keys.LATEST_PROJECTS, Globals.Screens.MANAGE_ATTACHMENTS.ID);
        hylanCache.RemoveKey(hylanCache.Keys.ATTACHMENT_TYPES, Globals.Screens.MANAGE_ATTACHMENTS.ID);

        $scope.ApplyCache();
        $scope.refreshGrid();

        if ($scope.multiSelectProjIdControl.resetQuerySearchBox != undefined) {
          $scope.multiSelectProjIdControl.resetQuerySearchBox();
        }
      }

      $scope.refreshGrid = function () {
          vm.gridOptions.dataSource.read();
          
      }
      $scope.setScreenAndRowID = function (rowID) {
          hylanCache.SetValue(hylanCache.Keys.NEWLYADDED_ROWID, rowID, $scope.Screens.MANAGE_ATTACHMENTS.ID);
      }
      $scope.$on("CLOSE_WITHOUT_CHANGE", function (event, args) {
          hilightEnteredRow();
      });
      //--------------------------Start Projects MultiSelect-----------------  
      var projectsMultiSelect = function () {

        var objMulti = {
          controlID: 'divMultiSelProjects', options: $scope.projectsDS, selectedList: [],
          idProp: 'HYLAN_PROJECT_ID', displayProp: 'HYLAN_PROJECT_ID', key: hylanCache.Keys.PROJECTS
        };
        $scope.MSProjects = objMulti;
        $scope.MSProjects.settings = {
          externalIdProp: '',
          idProp: objMulti.idProp,
          displayProp: objMulti.displayProp,
          enableSearch: true,
          scrollable: true,
          showCheckAll: false,
          showUncheckAll: true,
          smartButtonMaxItems: 3,  //need to change depends on size of control 
          closeOnBlur: true
        };



        $scope.MSProjects.events = {
          onItemSelect: function (item) {
            setTooltipOnMultiSelect(objMulti.controlID, objMulti.selectedList, objMulti.displayProp);
            hylanCache.SetValue(objMulti.key, objMulti.selectedList.slice());
            $scope.refreshGrid();
          },
          onItemDeselect: function (item) {
            setTooltipOnMultiSelect(objMulti.controlID, objMulti.selectedList, objMulti.displayProp);
            hylanCache.SetValue(objMulti.key, objMulti.selectedList.slice());
            $scope.refreshGrid();
          },
          onDeselectAll: function (items) {

            setTooltipOnMultiSelect(objMulti.controlID, [], objMulti.displayProp);
            hylanCache.SetValue(objMulti.key, []);
            $scope.refreshGrid();
          }
        };
      }

      projectsMultiSelect();
      //--------------------------End Projects MultiSelect----------------- 

      //--------------------------Start attachmentTypes MultiSelect-----------------  
      var attachmentTypesMultiSelect = function () {
          var attachmentTypeDS = [{ ATTACHMENT_TYPE_ID: 'Project', ENTITY_TYPE: 'Project' }, { ATTACHMENT_TYPE_ID: 'Job', ENTITY_TYPE: 'Job' }, { ATTACHMENT_TYPE_ID: 'Permit', ENTITY_TYPE: 'Permit' }, { ATTACHMENT_TYPE_ID: 'Daily', ENTITY_TYPE: 'Daily' }];

        var objMulti = {
          controlID: 'divMultiSelAttachmentTypes', options: attachmentTypeDS, selectedList: [],
          idProp: 'ATTACHMENT_TYPE_ID', displayProp: 'ENTITY_TYPE', key: hylanCache.Keys.ATTACHMENT_TYPES + Globals.Screens.MANAGE_ATTACHMENTS.ID
        };
        $scope.MSAttachmentTypes = objMulti;
        $scope.MSAttachmentTypes.settings = {
          externalIdProp: '',
          idProp: objMulti.idProp,
          displayProp: objMulti.displayProp,
          enableSearch: true,
          scrollable: true,
          showCheckAll: false,
          showUncheckAll: true,
          smartButtonMaxItems: 3,  //need to change depends on size of control 
          closeOnBlur: true
        };



        $scope.MSAttachmentTypes.events = {
          onItemSelect: function (item) {
            setTooltipOnMultiSelect(objMulti.controlID, objMulti.selectedList, objMulti.displayProp);
            hylanCache.SetValue(objMulti.key, objMulti.selectedList.slice());
            $scope.refreshGrid();
          },
          onItemDeselect: function (item) {
            setTooltipOnMultiSelect(objMulti.controlID, objMulti.selectedList, objMulti.displayProp);
            hylanCache.SetValue(objMulti.key, objMulti.selectedList.slice());
            $scope.refreshGrid();
          },
          onDeselectAll: function (items) {

            setTooltipOnMultiSelect(objMulti.controlID, [], objMulti.displayProp);
            hylanCache.SetValue(objMulti.key, []);
            $scope.refreshGrid();
          }
        };
      }

      attachmentTypesMultiSelect();
      //--------------------------End attachmentTypes MultiSelect----------------- 
      var setDefaultValuesOnMultiSelect = function (multiSelectObject) {
        var objMulti = multiSelectObject;  //need to set
        objMulti.selectedList = [];
        var projects = hylanCache.GetValue(objMulti.key);
        if (projects) {
          //add values in control ,values came from cache
          angular.forEach(projects, function (value) {
            objMulti.selectedList.push(value);
          });
          setTooltipOnMultiSelect(objMulti.controlID, objMulti.selectedList, objMulti.displayProp);
        }
        else {
          if (AppSettings.ShowLatestProjectInFilter && objMulti.controlID == 'divMultiSelProjects') {
            if ($scope.projectsDS.length > 0) {
              //var latestProjects = [];
              objMulti.selectedList.push($scope.projectsDS[0]);
              hylanCache.SetValue(hylanCache.Keys.LATEST_PROJECTS, objMulti.selectedList.slice(), Globals.Screens.MANAGE_ATTACHMENTS.ID);
              setTooltipOnMultiSelect(objMulti.controlID, objMulti.selectedList, objMulti.displayProp);
            }
          }
        }
      };
      $scope.ApplyCache = function () {
        setDefaultValuesOnMultiSelect($scope.MSProjects);
        setDefaultValuesOnMultiSelect($scope.MSAttachmentTypes);
      }
      $scope.ApplyCache();
    }

    $scope.downloadFile = function (name, type, parentId, projectId, jobId, permitId,dailyId) {
      $http({
        method: 'GET',
        url: Globals.ApiUrl + 'attachment/download',
        params: {
          name: name,
          type: type,
          parentId: parentId,
          projectId: projectId === 0 ? -1 : projectId,
          jobId: jobId === 0 ? -1 : jobId,
          permitId: permitId,
          dailyId:dailyId
        },
        responseType: 'arraybuffer'
      }).then(function (data) {

        var headers = data.headers();

        var filename = headers['filename'];
        var contentType = headers['content-type'];

        var linkElement = document.createElement('a');
        try {
          var blob = new Blob([data.data], { type: contentType });
          if (navigator.appVersion.toString().indexOf('.NET') > 0)
            window.navigator.msSaveBlob(blob, filename);
          else {
            var url = window.URL.createObjectURL(blob);

            linkElement.setAttribute('href', url);
            linkElement.setAttribute("download", filename);

            var clickEvent = new MouseEvent("click", {
              "view": window,
              "bubbles": true,
              "cancelable": false
            });
            linkElement.dispatchEvent(clickEvent);
          }

        } catch (ex) {
          console.log(ex);
        }
      }, function errorCallback(errorThrown) {
        OnServiceFailure(errorThrown);
      });
    }

    function OnServiceFailure(errorThrown) {
      if (angular.isDefined(errorThrown.statusText) && errorThrown.statusText.indexOf("Internal Server Error") > -1) {
        Utility.Notify({ type: NOTIFYTYPE.ERROR, message: "File does not exist, renamed or moved to another location.", IsPopUp: false });
      }
    }
    var hilightEnteredRow = function () {
        var newlyAddedRecordID = hylanCache.GetValue(hylanCache.Keys.NEWLYADDED_ROWID, $scope.Screens.MANAGE_ATTACHMENTS.ID);
        if (newlyAddedRecordID) {
            //SelID = newlyAddedRecordID;

            var grid = vm.gridOptions.dataSource;
            //setTimeout(function () {
            $.each(grid._data, function (index, value) {
                var model = value;
                if (model.ATTACHMENT_ID == newlyAddedRecordID) {//some condition
                    $('[data-uid=' + model.uid + ']').addClass('k-state-selected');
                }
                else
                {
                    $('[data-uid=' + model.uid + ']').removeClass('k-state-selected');
                }
            });

            hylanCache.RemoveKey(hylanCache.Keys.NEWLYADDED_ROWID, $scope.Screens.MANAGE_ATTACHMENTS.ID);

            //}, 3000);

        }

    }
    var onDataBound = function (args) {
      setLastServerDateTime();
      $scope.$emit("ChildGridLoaded-NoStyling", args.sender);
      hilightEnteredRow();
    };
    $scope.$on("CRUD_OPERATIONS_SUCCESS", function (event, args) {
        $scope.refreshGrid();
    });
    setLastServerDateTime = function (lblSelector) {
      //-- grid last updated datetime
      var elemPagger = '';
      if (lblSelector)
        elemPagger = $(lblSelector);
      else
        elemPagger = $(".k-pager-wrap.k-grid-pager.k-widget");

      var txt = '';
      if ($rootScope.lastServerDateTime) {
        var localDT = new Date($rootScope.lastServerDateTime + ' UTC');
        txt = kendo.toString(localDT, 'MM/dd/yyyy HH:mm:ss');
      }
      else
        txt = "CACHED";
      if (elemPagger.length > 0) {
        $(elemPagger).find(".last-updated").remove();
        $(elemPagger).append("<span class='last-updated'>Last updated: " + txt + "</span>");
      }
    }


    var winHeight = $(window).height(),
      mainHead = $(".main-head").outerHeight();
    var availableHeight = winHeight - (mainHead);
    
    AttachmentService.resizeGrid("#responsive-tables #gridAttachment", availableHeight * 0.83);

    if ($rootScope.isUserLoggedIn == false) return false;
    $scope.searchColumns = [
      {
        field: "HYLAN_PROJECT_ID"
      },
      {
        field: "JOB_FILE_NUMBER"
      },
      {
          field: "PermitLinkText"
      },
      {
        field: "FILE_NAME"
      },
      {
        field: "FILE_TITLE"
      },
      {
        field: "FILE_KEYWORD"
      },
      {
        field: "USER"
      },
      {
        field: "FILE_SIZE"
      },
      {
        field: "Documentcategorydc.CATEGORY_NAME"
      },
      {
        field: "ENTITY_TYPE"
      },
      {
        field: "MODIFIED_ON", type: 'date'
      }
    ];
  }
}
)();
