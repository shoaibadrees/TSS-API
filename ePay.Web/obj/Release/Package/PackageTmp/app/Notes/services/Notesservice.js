angular.module('HylanApp').factory('Notesservice', ['DataContext', 'Utility', 'NOTIFYTYPE', 'AppConfig', '$rootScope', '$http',
    function (DataContext, Utility, NOTIFYTYPE, AppConfig, $rootScope, $http) {
      
        function resizeGrid(gridID, gridHeight) {
            if (($("#numfield").is(":focus") == false && $("input[type='text']").is(":focus") == false && $("input[type='password']").is(":focus") == false && $("input[type='number']").is(":focus") == false)
                    && !(/Android/.test(Globals.UserAgent) || /iPad/.test(Globals.UserAgent))) {
                setTimeout(function () {

                    var grid = $(gridID),
                        gridToolbar = $(gridID + " .k-grid-toolbar"),
                        gridHeader = $(gridID + " .k-grid-header"),
                        gridLockedContent = $(gridID + " .k-grid-content-locked"),
                        gridContent = $(gridID + " .k-grid-content"),
                        gridPagger = $(gridID + " .k-grid-pager"),
                        docHeight = $(window).height(),
                        mainHead = $(".main-head").outerHeight(),
                        filterSec = $(".event-select").outerHeight();
                    
                    var newHeight = 0;
                    if (gridHeight)
                        newHeight = gridHeight;
                    else
                        newHeight = docHeight - (mainHead + filterSec);
                    var contentHeight = newHeight - ((gridToolbar.outerHeight() || 0) + (gridHeader.outerHeight() || 0) + (gridPagger.outerHeight() || 0));
                    if (gridContent.scrollWidth > gridContent.width()) //-- gridcontent has horizental scroll
                        contentHeight = contentHeight - 17;
                    newHeight = newHeight - 5; //-- differential
                    contentHeight = contentHeight - 5;  //-- differential
                    if (grid.length > 0)
                        grid.height(newHeight);
                    if (gridContent.length > 0)
                        gridContent.height(contentHeight);
                    if (gridLockedContent.length > 0)
                        gridLockedContent.height(contentHeight);
                }, 1000);
            }
        }
        
       
          
      var defaultSort = {
        field: "CREATED_ON",
        dir: "desc"
      };
      return {
          RetrieveNotes: function (screenid, screenRecordid) { return $http({url: Globals.ApiUrl + "Notes/Get", method: 'get', params: { SCREEN_ID: screenid, SCREEN_RECORD_ID: screenRecordid } }); },
          CreateNotes: function (NoteDC) { return $http({ url: Globals.ApiUrl + "Notes/Insert", method: 'post', data: NoteDC }); },
          resizeGrid: resizeGrid,
          defaultSort: defaultSort
      }
      
    }]);