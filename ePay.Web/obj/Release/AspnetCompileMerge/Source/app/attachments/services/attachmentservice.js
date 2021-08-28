angular.module('HylanApp').factory('AttachmentService', ['DataContext', 'Utility', 'NOTIFYTYPE', 'AppConfig', '$rootScope', '$http', 'hylanCache',
    function (DataContext, Utility, NOTIFYTYPE, AppConfig, $rootScope, $http, hylanCache) {
        var defaultSort = { field: "MODIFIED_ON1", dir: "desc" };

      var getParams = function () {
          objParams = { projectIDs: 'All', attachmentTypeIDs: 'All' };

          var selectedProjectsList = hylanCache.GetValue(hylanCache.Keys.PROJECTS);
          if (selectedProjectsList == undefined) selectedProjectsList = hylanCache.GetValue(hylanCache.Keys.LATEST_PROJECTS, Globals.Screens.MANAGE_ATTACHMENTS.ID);

          var selectedAttachmentTypeList = hylanCache.GetValue(hylanCache.Keys.ATTACHMENT_TYPES, Globals.Screens.MANAGE_ATTACHMENTS.ID);
          
          if (selectedProjectsList && selectedProjectsList.length > 0) objParams.projectIDs = getIDFromList(selectedProjectsList, 'PROJECT_ID');
          if (selectedAttachmentTypeList && selectedAttachmentTypeList.length > 0) objParams.attachmentTypeIDs = getIDFromList(selectedAttachmentTypeList, 'ATTACHMENT_TYPE_ID');
          
          return objParams;
      }

      function GetFileNameTemplate(thisAttachment) {
          if (thisAttachment.FILE_TYPE.indexOf('image') !== -1) {
            return thisAttachment.FILE_ICON = "../Content/images/defaultimage.png";
          }
          if (thisAttachment.FILE_TYPE.indexOf('application/octet-stream') !== -1) {
            return thisAttachment.FILE_ICON = "../Content/images/zipfile.jpg";
          }
          if (thisAttachment.FILE_TYPE.indexOf('application/zip') !== -1 || thisAttachment.FILE_TYPE.indexOf('application/zip') !== -1 || thisAttachment.FILE_TYPE.indexOf('application/x-compressed-zip') !== -1) {
            return thisAttachment.FILE_ICON = "../Content/images/zipfile.jpg";
          }
          if (thisAttachment.FILE_TYPE.indexOf('application/msword') !== -1 || thisAttachment.FILE_TYPE.indexOf('application/vnd.openxmlformats-officedocument.wordprocessingml.document') !== -1) {
            return thisAttachment.FILE_ICON = "../Content/images/word.png";
          }
          if (thisAttachment.FILE_TYPE.indexOf('application/msexcel') !== -1 || thisAttachment.FILE_TYPE.indexOf('application/vnd.ms-excel') !== -1 || thisAttachment.FILE_TYPE.indexOf('application/vnd.openxmlformats-officedocument.spre') !== -1) {
            return thisAttachment.FILE_ICON = "../Content/images/excel.jpg";
          }
          if (thisAttachment.FILE_TYPE.indexOf('application/pdf') !== -1) {
            return thisAttachment.FILE_ICON = "../Content/images/pdf.jpg";
          }
          if (thisAttachment.FILE_TYPE.indexOf('text/plain') !== -1) {
            return thisAttachment.FILE_ICON = "../Content/images/text-plain.png";
          }
          if (thisAttachment.FILE_TYPE.indexOf('video/mpeg') !== -1 || thisAttachment.FILE_TYPE.indexOf('audio/mpeg') !== -1) {
            return thisAttachment.FILE_ICON = "../Content/images/video.png";
          } else {
            return thisAttachment.FILE_ICON = "../Content/images/file.png";
          }
      }

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

      return {
        defaultSort: defaultSort,
        resizeGrid:resizeGrid,
        RetrieveAttachments: function (screenid, screenRecordid) { return $http({ url: Globals.ApiUrl + "attachment/get", method: 'get', params: { SCREEN_ID: screenid, SCREEN_RECORD_ID: screenRecordid } }); },
        RetrieveAllAttachments: function () {
            var params = getParams();
            return $http({ url: Globals.ApiUrl + "attachment/getall", method: 'get', params: params });
        },
        UpdateAttachment: function (attachmentDCList) { return $http({ url: Globals.ApiUrl + "attachment/update", method: 'post', data: attachmentDCList }); },
        InsertAttachment: function (attachmentDCList) { return $http({ url: Globals.ApiUrl + "attachment/insertall", method: 'post', data: attachmentDCList }); },
        RetrieveDocumentsCategories: function (documentCategoryId) { return $http({ url: Globals.ApiUrl + "attachment/getcategories", method: 'get', params: { documentCategoryId: documentCategoryId } }); },
        DeleteAttachments: function (deletedItem) {
          return $http({ url: Globals.ApiUrl + "attachment/delete", method: 'post', data: JSON.stringify(deletedItem) });
        },
        ToDataModel: function (file, screenId, screenRecordId, projectId, jobId, permitId,dailyId) {
          return {
            FILE_KEYWORD: '',
            //JOB_FILE_NUMBER: 0,
            //HYLAN_PROJECT_ID: '',
            PROJECT_ID: angular.isDefined(projectId) ? projectId : 0,
            JOB_ID: angular.isDefined(jobId) ? jobId : 0,
            PERMIT_ID: angular.isDefined(permitId) ? permitId : 0,
            DAILY_ID: angular.isDefined(dailyId) ? dailyId : 0,
            //USER: $rootScope.currentUser.LAST_NAME + ' ' + $rootScope.currentUser.FIRST_NAME,
            FILE_TYPE: file.type,
            FILE_ICON: '',
            FILE_SIZE: file.size,
            FILE_NAME: file.name,
            FILE_TITLE: file.name.substring(0, file.name.lastIndexOf(".")),
            DOCUMENT_CATEGORY: '',
            Documentcategorydc: '',
            CREATED_ON: '',
            MODIFIED_ON:'',
            CREATED_BY: $rootScope.currentUser.USER_ID,
            MODIFIED_BY: $rootScope.currentUser.USER_ID,
            PARENT_ID: screenRecordId,
            ENTITY_TYPE: screenId === 2 ? 'PROJECT' : screenId === 3 ? 'JOB' : screenId === 5 ? 'PERMIT' : "DAILY",
            SCREEN_ID: screenId,
            SCREEN_RECORD_ID: screenRecordId
          }
        },
        ToViewModel: function (uploadedFile) {
          return {
            ATTACHMENT_ID: uploadedFile.ATTACHMENT_ID,
            FILE_KEYWORD: uploadedFile.FILE_KEYWORD,
            JOB_FILE_NUMBER: uploadedFile.JOB_FILE_NUMBER,
            HYLAN_PROJECT_ID: uploadedFile.HYLAN_PROJECT_ID,
            PROJECT_ID: uploadedFile.projectId,
            JOB_ID: uploadedFile.jobId,
            PERMIT_ID: uploadedFile.permitId,
            DAILY_ID:uploadedFile.dailyId,
            FILE_TYPE: uploadedFile.FILE_TYPE,
            FILE_SIZE: uploadedFile.FILE_SIZE,
            FILE_NAME: uploadedFile.FILE_NAME,
            FILE_TITLE: uploadedFile.FILE_TITLE,
            DOCUMENT_CATEGORY: uploadedFile.DOCUMENT_CATEGORY,
            Documentcategorydc: angular.isUndefined(uploadedFile) ? null : {
              CATEGORY_NAME: uploadedFile.Documentcategorydc.CATEGORY_NAME,
              CATEGORY_CODE: uploadedFile.Documentcategorydc.CATEGORY_CODE,
              CATEGORY_TYPE: uploadedFile.Documentcategorydc.CATEGORY_TYPE
            },
            MODIFIED_BY: uploadedFile.MODIFIED_BY,
            MODIFIED_ON: uploadedFile.MODIFIED_ON,
            ENTITY_TYPE: uploadedFile.ENTITY_TYPE,
            USER: angular.isDefined(uploadedFile.USER) ? uploadedFile.USER : null
          }
        },
        GetFileNameTemplate: GetFileNameTemplate
        
      }

    }]);