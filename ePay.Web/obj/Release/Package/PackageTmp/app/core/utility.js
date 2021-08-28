common.factory('Utility', ['AppConfig', 'NOTIFYTYPE', '$filter',

    function (AppConfig, NOTIFYTYPE, $filter) {
      var ApplyFilters = function (field, value, operator, grid, logic, fieldValueOperation) {

        var filterLogic = logic ? logic : "and";
        orFilter = { logic: "or", filters: [] };
        //if (filterLogic == 'and') {
        HideNotification();
        //}
        if (grid && grid.dataSource) {
          var grdData = grid.dataSource.data();
          if (grdData && grdData.length > 0) {
            var currFilterObj = grid.dataSource.filter();
            var currentFilters = currFilterObj ? currFilterObj.filters.slice() : [];
            var isColumnFound = false;
            //find relevent column
            for (var i = 0; i < currentFilters.length; i++) {
              if (currentFilters[i].field && currentFilters[i].field == field && (currentFilters[i].value == value || filterLogic == 'and')) { //0 for and logic
                currentFilters.splice(i, 1);
                if ((filterLogic == 'and' && value != '0') || filterLogic == "or" && fieldValueOperation == "add") {
                  isColumnFound = true;
                  currentFilters.push({ field: field, operator: operator, value: value });
                }
                break;
              }
              if (currentFilters[i].filters && currentFilters[i].filters.length > 0 && currentFilters[i].filters[0].field == field) {

                var filtersOnColumn = currentFilters[i].filters
                // if a filter for "field" is already defined, remove it from the array
                for (var j = 0; j < filtersOnColumn.length; j++) {

                  if (filtersOnColumn[j].field == field && (filtersOnColumn[j].value == value || filterLogic == 'and')) { //0 for and logic
                    filtersOnColumn.splice(j, 1);
                    if ((filterLogic == 'or' && filtersOnColumn.length == 0 && fieldValueOperation != "add") || (filterLogic == 'and' && value == '0')) //if length become 0 then remove the object
                    {
                      currentFilters.splice(i, 1);
                    }
                    break;
                  }
                }
                if ((filterLogic == 'and' && value != '0') || filterLogic == "or" && fieldValueOperation == "add") {
                  isColumnFound = true;
                  currentFilters[i].filters.push({ field: field, operator: operator, value: value });
                }
                else if (filterLogic == "or" && fieldValueOperation == "remove") {
                  //donot add anything
                }
                break;
              }
            }

            if (value != '0' && isColumnFound == false && fieldValueOperation != "remove") {
              currentFilters.push(orFilter);
              orFilter.filters.push({ field: field, operator: operator, value: value });
            }

            grid.dataSource.filter({}); //clear the already feed filters                     
            if (currentFilters.length > 0) {
              grid.dataSource.filter(currentFilters);
            }
          }
        }
      };

      var ClearFilters = function (grid, defaultFilter, page) {
        HideNotification();
        var andFilter = { logic: "and", filters: [] };
        var orFilter = { logic: "or", filters: [] };
        if (grid && grid.dataSource) {
          var currFilterObj = grid.dataSource.filter();
          var currentFilters = currFilterObj ? currFilterObj.filters : [];
          currentFilters = [];
          if (defaultFilter && defaultFilter.value) {
            if (page == null) {
              if (defaultFilter.logic == 'or') {
                currentFilters.push(orFilter);
              }
              else {
                currentFilters.push(andFilter);
              }

              currentFilters[0].filters.push({
                field: defaultFilter.field,
                operator: defaultFilter.operator,
                value: defaultFilter.value
              });
            }
          }
          grid.dataSource.filter(currentFilters);
        }
      };

      function PrintGrid(lockedColumns, childGrid) {
         var gridID = 'grid1';
         if (childGrid.element != null && childGrid.element.length > 0) {
            gridID = childGrid.element[0].id;
         }
        var gridElement = $('#' + gridID);
        var  printableContent = '';
        var width = 1800;
        var height = 1800;
        var y = window.top.outerHeight / 2 + window.top.screenY - (height / 2);
        var x = window.top.outerWidth / 2 + window.top.screenX - (width / 2);
        var win = window.open('', '', 'scrollbars=1, resizable=1,height=' + height + ', width=' + width + ', top=' + y + ', left=' + x);

        if (!win || win.outerHeight === 0) {
              //First Checking Condition Works For IE & Firefox
              //Second Checking Condition Works For Chrome
              alert("Popup Blocker is enabled! Please add this site to your exception list.");
              return;
        } 
      

        var htmlStart =
                '<!DOCTYPE html>' +
                '<html>' +
                '<head>' +
                '<meta charset="utf-8" />' +
                '<title>Print</title>' +
                '<link href="http://kendo.cdn.telerik.com/' + kendo.version + '/styles/kendo.common.min.css" rel="stylesheet" /> ' +
                '<style>' +
                'html { font: 11pt sans-serif; }' +
                '.k-grid { border-top-width: 0; width:100% }' +
                '.k-grid, .k-grid-content { height: auto !important; }' +
                '.k-grid-content { overflow: visible !important; }' +
                'div.k-grid table { table-layout: visible; width: 100% !important; }' +
                '.k-grid .k-grid-header th { border: 2px solid; background-color: yellow; }' +
                '.k-grid-content, .k-grid-content-locked, .k-pager-wrap { white-space: nowrap; }' + 
                '.k-grid-header tr { height: 0px !important; }' +
                'div#grid1.k-grid.k-widget.k-grid-lockedcolumns{ border-width: 0px !important; }' +
                'sub-col.darkYellow-col.rowHeaderHeadYellow.k-header.ng-scope {display: none !important; }' +
                'td.contert-alpha.GridBorder.rowHeaderCell { border: 0px !important; }' +
                '.k-grouping-header, .k-grid-toolbar, .k-grid-pager > .k-link { display: none; }' +
                'td.section-border.ng-scope, td.ng-scope {display: none;}' +
                'table tr:nth-child(even) td{ background: #eeeaea; }'+
                '.k-grid-pager { display: none; }' + 
                '@page {size: A4;    margin: 0;}@media print {	html, body {    	width: 210mm;    	height: 297mm;  }    .page { margin: 0; page-break-after: always;    }}' +
                '.tick-icon { background-image: url(../../content/images/tick.png); background-repeat: no-repeat; background-position: center center; width: 24px; height: 24px;margin-left: 34%;}' +
                '</style>' +
               
                '</head>' +
                '<body style="overflow: visible !important;" >';

        var htmlEnd =
                '</body>' +
                '</html>';

        var gridHeader = gridElement.children('.k-grid-header');
        if (gridHeader[0]) {
          var thead = gridHeader.find('thead').clone().addClass('k-grid-header');
          printableContent = gridElement
              .clone()
                  .children('.k-grid-header').remove()
              .end()
                  .children('.k-grid-content')
                      .find('table')
                          .first()
                              .children('tbody').before(thead)
                          .end()
                      .end()
                  .end()
              .end()[0].outerHTML;
        } else {
          printableContent = gridElement.clone()[0].outerHTML;
        }   
        win.document.write(htmlStart + '<div onload="window.location.reload(false);window.print();">' + printableContent + '<div>' + htmlEnd);

        window.setTimeout(function () {
            win.document.close();
            win.focus();
            win.print();
            win.close();
        }, 3000);
        

        for (var i = 0; i < lockedColumns.length; i++) {
          if (lockedColumns[i] !== "ROW_HEADER" || lockedColumns[i] !== "VIEW_EDIT")
          childGrid.lockColumn(lockedColumns[i]);
          
          if (lockedColumns[i] === "ROW_HEADER" || lockedColumns[i] === "VIEW_EDIT") 
            childGrid.showColumn(lockedColumns[i]);
        }
        
        childGrid.lockColumn("DUMMY_FIELD");
        //To re-render complete grid because column headers got displaced
        childGrid.setOptions({
          sortable: true
        });
      }


      function PrintRadGrid() {
          var previewWnd = window.open('about:blank', '', '', false);
          var htmlStart =
               '<!DOCTYPE html>' +
               '<html>' +
               '<head>' +
               '<meta charset="utf-8" />' +
               '<title>Print</title>' +
               '<link href="/Content/bootstrap.min.css" rel="stylesheet"/>' +
               '<link href="/Content/scroll.css" rel="stylesheet"/>' +
               '<link href="/Content/kendo/kendo.common.min.css" rel="stylesheet"/>' +
               '<link href="/Content/kendo/kendo.default.min.css" rel="stylesheet"/>' +
               '<link href="/Content/custom.css" rel="stylesheet"/>' +
               '<link href="/Content/custom_index.css" rel="stylesheet"/>' +
               '</head>' +
               '<body style="overflow: auto !important;" onload="window.print();">' +
               '<script src="/Scripts/jquery.js"></script>' +
               '<script src="/Scripts/bootstrap.min.js"></script>' +
               '<script src="/Scripts/lionbars.js"></script>' +
               '<script src="/Scripts/kendo.all.min.js"></script>' +
               '<script src="/Scripts/underscore-min.js"></script>' +
               '<script src="/Scripts/respond.js"></script>' +
               '<script src="/Scripts/common.js"></script>';

          var $tblPrint = $('#responsive-tables').clone();
         // var sh = '<%= ClientScript.GetWebResourceUrl(grid1.GetType(),String.Format("Telerik.Web.UI.Skins.{0}.Grid.{0}.css",grid1.Skin)) %>';
          var styleStr =  htmlStart + "";
          var htmlcontent = htmlStart + $tblPrint.get(0).outerHTML + "</body></html>";
          previewWnd.document.open();
          previewWnd.document.write(htmlcontent);
          previewWnd.document.close();
          previewWnd.print();
      }

      var ApplySearch = function (searchColumns, value, grid) {
        var currFilterObj = grid.dataSource.filter();
        var currentFilters = currFilterObj ? currFilterObj.filters : [];
        //-- removing existing search criteria
        if (currentFilters && currentFilters.length > 0) {
          for (var i = 0; i < currentFilters.length; i++) {
            if (currentFilters[i].logic == "or") {
              currentFilters.splice(i, 1);
              break;
            }
          }
        }
        if (value) {
          //-- creating search pattern           
          for (var i = 0; i < searchColumns.length; i++) {
              searchColumns[i].value = value;
              searchColumns[i].operator = function (gridCellValue, toSearch) {
                  var result = false;
                  try {
                      if (toSearch && toSearch != null && toSearch != "") {
                          if (gridCellValue && gridCellValue != null) {
                              if (Date.parse(gridCellValue) >= 0 && gridCellValue.toTimeString != undefined) {
                                  gridCellValue = FormatDate(gridCellValue.toString(), null, true);
                              }
                              gridCellValue = gridCellValue.toString();
                              if (gridCellValue.toLowerCase) {
                                  gridCellValue = gridCellValue.toLowerCase();
                                  
                                  toSearch = toSearch.toLowerCase();
                                  if (gridCellValue.indexOf(toSearch) >= 0)
                                      result = true;
                              }
                          }
                      }
                  }
                  catch (e) {
                      result = false;
                  }
                  return result;
              };
          }

          currentFilters.push({
            logic: "or",
            filters: searchColumns
          });
          grid.dataSource.filter(currentFilters);
        }
        else {
          grid.dataSource.filter({
            logic: "and",
            filters: currentFilters
          });
        }
      };

      var Notify = function (args) {
        if (typeof (args) !== 'object') {
          args = { message: args };
        }
        args.type = args.type ? args.type : 'info';
        args.IsPopUp = args.IsPopUp ? args.IsPopUp : false;

        args.message = args.message ? args.message : '';
        if (AppConfig.ShowStackTracke && args.detail)
          args.message += '<br /><b>Details:</b> <br/>' + args.detail.replace(/ at /g, "<br/> at ");
        if (args.IsPopUp == false) {
          $(".alert-box .type").text(args.type);
          $(".alert-box .message").html(args.message);
          $(".alert-box").removeClass(NOTIFYTYPE.ERROR + ' ' + NOTIFYTYPE.SUCCESS + ' ' + NOTIFYTYPE.WARNING + ' ' + NOTIFYTYPE.INFO);
          $(".alert-box .close").click(function () {
            $(".alert-box").hide();
          });
          $(".alert-box").addClass(args.type).dequeue(this).show();

        } else {

          $(".alert-boxpopup .type").text(args.type);
          $(".alert-boxpopup .message").html(args.message);
          $(".alert-boxpopup").removeClass(NOTIFYTYPE.ERROR + ' ' + NOTIFYTYPE.SUCCESS + ' ' + NOTIFYTYPE.WARNING + ' ' + NOTIFYTYPE.INFO);
          $(".alert-boxpopup .close").click(function () {
            $(".alert-boxpopup").slideUp('slow');
          });
          $(".alert-boxpopup").addClass(args.type).dequeue().slideDown('slow');

        }
      };

      var HideNotification = function () {
        $(".alert-box").hide();
        $(".alert-boxpopup").slideUp('slow');
        //$(".alert-boxpopup").slideUp('slow');
        //$(".alert-box .close, .alert-boxpopup .close").click();
      };

      var ValidateDateTime = function (input) {
        var dtRegex = new RegExp(/(0[1-9]|1[012])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d\d ([0-1]\d|[2][0-3]):[0-5]\d/);
        var isValid = dtRegex.test(input.val());
        if (isValid == false) {
          this.Notify({ type: NOTIFYTYPE.ERROR, message: Globals.InvalidDateTimeMessage });
        }
        else {
          this.HideNotification();
        }
        return isValid;
      }

      var VerifyEventGridData = function (grid) {
        //-- have to convert Date to String bz if its Date & when on adding record, kando grid convert datetime accroding to Timezone associated with the object
        var col1 = _.findWhere(grid.columns, { field: "START_DATE" });
        var col2 = _.findWhere(grid.columns, { field: "EVENT_TYPE.LU_NAME" });
        var col3 = _.findWhere(grid.columns, { field: "EMERGENCY_TYPE.LU_NAME" });
        if (col1 && col2 && col3) {
          _angular.forEach(grid.dataSource._data, function (row) {
            if (row["START_DATE"] instanceof Date)
              row["START_DATE"] = kendo.toString(row["START_DATE"], 'MM/dd/yyyy HH:mm');
          });
        }
      };

      var IsJSON = function (str) {
        try {
          JSON.parse(str);
        } catch (e) {
          return false;
        }
        return true;
      }

      return {
        ApplyFilters: ApplyFilters,
        ClearFilters: ClearFilters,
        ApplySearch: ApplySearch,
        PrintGrid: PrintGrid,
        Notify: Notify,
        HideNotification: HideNotification,
        ValidateDateTime: ValidateDateTime,
        VerifyEventGridData: VerifyEventGridData,
        IsJSON: IsJSON
      };
    }]);
