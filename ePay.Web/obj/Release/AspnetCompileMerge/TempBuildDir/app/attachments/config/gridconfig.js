angular.module('HylanApp').factory('AttachmentGridConfig', ['DataContext', 'Utility', 'NOTIFYTYPE', 'AppConfig', '$rootScope', '$http', 'AttachmentService', 'Upload',
    function (DataContext, Utility, NOTIFYTYPE, AppConfig, $rootScope, $http, AttachmentService, Upload) {

      var vm = this;
      vm.existingFiles = [];
      vm.excludedFiles = [];
      vm.recentlyUploadedFiles = [];
      vm.documentCategories = [];
      var thisDialogData = {};
      $rootScope.uploadPercentage = 0;

      var GridDataSource = new kendo.data.DataSource({
        transport: {
          read: function (e) {
            AttachmentService.RetrieveAttachments(thisDialogData.SCREEN_ID, thisDialogData.SCREEN_RECORD_ID).then(function success(response) {
              var attachmentListFull = response.data.objResultList;
              var attachmentListUnique = [];
              angular.forEach(attachmentListFull, function (attachment) {
                if (attachment.ATTACHMENT_ID != -111) {
                  attachmentListUnique.push(attachment);
                }
              });
              GetFileNameTemplate(attachmentListUnique);
              e.success(attachmentListUnique);
            }, function error(response) {
              console.log(response);
            });
          }
        },
        sort: ({ field: "MODIFIED_ON", dir: "desc" }),
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
              DAILY_ID: {
                  type: "number",
                  editable: false
              },
              PARENT_ID: {
                type: "number",
                editable: false
              },
              FILE_NAME: {
                type: "string",
                editable: false
              },
              FILE_TITLE: {
                type: "string",
                editable: true,
                validation: {
                  maxlength:
                      function (input) {
                        if (input.val().length > 50) {
                          input.attr("data-maxlength-msg", "Max. length for Title is 50");
                          return false;
                        }
                        return true;
                      }
                }
              },
              FILE_KEYWORD: {
                type: "string",
                editable: true,
                validation: {
                  maxlength:
                      function (input) {
                        if (input.val().length > 50) {
                          input.attr("data-maxlength-msg", "Max. length for Keyword is 50");
                          return false;
                        }
                        return true;
                      }
                }
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
              DOCUMENT_CATEGORY: {
                type: "string",
                editable: true
              },
              Documentcategorydc: { CATEGORY_CODE: { type: "string" }, CATEGORY_NAME: { type: "string" } },
              USER: {
                type: "string",
                editable: false
              },
              MODIFIED_ON: {
                type: "date",
                editable: false
              }
            }
          }
        },
        serverFiltering: false
      });

      function SetDocumentCategories(documentCategories) {
        vm.documentCategories = documentCategories;
      }

      function FileTemplate(container) {
        if (container.USER == null)
          return container.FILE_NAME;
        var template = "<a href='javascript:;' ng-click='vm.downloadFile(\"" + container.FILE_NAME + "\", \"" + container.ENTITY_TYPE + "\", " + container.PARENT_ID + ", " + container.PROJECT_ID + ", " + container.JOB_ID + ", " + container.PERMIT_ID +  ", " + container.DAILY_ID + ", \"" + container.USER + "\")' ><img class='img-responsive img-thumbnail img-rounded' style='width:15px; height:15px;' src='" + container.FILE_ICON + "'/>" + container.FILE_NAME + "</a>";
        return template;
      }

      var GridOptions = {
        columns: [
          { field: "ROW_HEADER", width: "30px", title: "   .", sortable: false, filterable: false, locked: false, headerAttributes: { "class": "sub-col darkYellow-col rowHeaderHeadYellow", "style": "border-right: 0px !important;" }, attributes: { "class": "contert-alpha GridBorder rowHeaderCell" } },
          { field: "FILE_NAME", title: "NAME", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, width: "150px", attributes: { "class": "contert-alpha GridBorder" }, template: FileTemplate },
          { field: "FILE_TITLE", title: "TITLE", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, width: "110px", attributes: { "class": "contert-alpha GridBorder" }, template: "#: FILE_TITLE == null ? '' : FILE_TITLE#" },
          { field: "FILE_KEYWORD", title: "KEYWORD", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, width: "110px", attributes: { "class": "contert-alpha GridBorder" }, template: "#: FILE_KEYWORD == null ? '' : FILE_KEYWORD#" },
          { field: "FILE_SIZE", title: "SIZE", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, width: "100px", attributes: { "class": "contert-alpha GridBorder" }, template: "#:FILE_SIZE#" },
          { field: "Documentcategorydc", sortable: false, filterable: false, title: "<sup><img src='Content/images/red_asterisk.png' /></sup> CATEGORY", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, width: "150px", editor: GetCategoryDropDownEditor, attributes: { "class": "contert-alpha GridBorder" }, template: "#: Documentcategorydc.CATEGORY_NAME == null ? '' : Documentcategorydc.CATEGORY_NAME#" },
          { field: "USER", title: "UPDATED BY", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, width: "150px", attributes: { "class": "contert-alpha GridBorder" }, template: "#: USER == null ? '' : USER#" },
          { field: "MODIFIED_ON", title: "UPDATED ON", headerAttributes: { "class": "sub-col no-left-border lightYellow-col" }, width: "125px", attributes: { "class": "contert-alpha GridBorder" }, template: "#: MODIFIED_ON == null ? '' : moment(MODIFIED_ON).format('MM/DD/YY HH:mm')#" }
        ],
        sortable: {
          mode: "single",
          allowUnsort: false
        },
        filterable: false,
        dataSource: GridDataSource,
        editable: true,
        dataBound: ToggleScrollbar,
        selectable: "multiple",
        navigatable: true,
        change: function onChange(arg) {
          Utility.HideNotification();
        }
      }

      function GetCategoryDropDownEditor(container, options) {
        $('<input name="' + options.field + '"/>')
                        .appendTo(container)
                        .kendoDropDownList({
                          autoBind: false,
                          dataTextField: "CATEGORY_NAME",
                          dataValueField: "CATEGORY_CODE",
                          dataSource: new kendo.data.DataSource({
                            data: vm.documentCategories
                          })
                        });
      }

      function downloadFile(name, type, parentId, projectId, jobId, permitId,dailyId, user) {
        if (user !== "null") {
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
            OnServiceFailure(errorThrown.statusText);
          });
        }

      }

      function OnServiceSuccess() {
        Utility.Notify({ type: NOTIFYTYPE.SUCCESS, message: "Changes Saved.", IsPopUp: thisDialogData });
      }

      function OnServiceFailure(errorThrown) {
        if (angular.isDefined(errorThrown.Message) && errorThrown.Message.indexOf("Record(s) could not be updated since it has been edited by another user. Data has been refreshed") > -1) {
          GridOptions.dataSource.read();
          Utility.Notify({ type: NOTIFYTYPE.ERROR, message: errorThrown.Message, IsPopUp: thisDialogData });
        }
        else if (errorThrown.indexOf("404 - File or directory not found") > -1)
          Utility.Notify({ type: NOTIFYTYPE.ERROR, message: "Uploaded files size exceeded its limits", IsPopUp: thisDialogData });
        else if (errorThrown.indexOf("Internal Server Error") > -1)
          Utility.Notify({ type: NOTIFYTYPE.ERROR, message: "File does not exist, renamed or moved to another location.", IsPopUp: thisDialogData });
        else if (angular.isDefined(errorThrown.Message) && angular.isDefined(errorThrown.StackTrace))
          Utility.Notify({ type: NOTIFYTYPE.ERROR, message: errorThrown.Message + errorThrown.StackTrace, IsPopUp: thisDialogData });
        else if (errorThrown.indexOf("404.13 - Not Found") > -1)
          Utility.Notify({ type: NOTIFYTYPE.ERROR, message: "One of the uploaded file is malformed", IsPopUp: thisDialogData });
        else
          Utility.Notify({ type: NOTIFYTYPE.ERROR, message: errorThrown, IsPopUp: thisDialogData });
      }

      function ToggleScrollbar(e) {
        var gridWrapper = e.sender.wrapper;
        var gridDataTable = e.sender.table;
        var gridDataArea = gridDataTable.closest(".k-grid-content");

        gridWrapper.toggleClass("no-scrollbar", gridDataTable[0].offsetHeight < gridDataArea[0].offsetHeight);
      }

      function FileSizeTemplate(container) {
        return container.FILE_SIZE == null ? '0 KB' : Math.round(container.FILE_SIZE / 1024) > 1024 ? Math.round(Math.round(container.FILE_SIZE / 1024) / 1024).toString() + " MB" : (Math.round(container.FILE_SIZE / 1024)).toString() + " KB";
      }

      function SetAttachmentsDataModel(files, attachmentDCModels) {
          var projectId, jobId, permitId, dailyId;
        if (thisDialogData.SCREEN_ID === 2)
          projectId = angular.isDefined(thisDialogData.SCREEN_RECORD_ID) ? thisDialogData.SCREEN_RECORD_ID : 0;
        if (thisDialogData.SCREEN_ID === 3) {
          jobId = thisDialogData.SCREEN_RECORD_ID;
          projectId = angular.isDefined(thisDialogData.PROJECT_ID) ? thisDialogData.PROJECT_ID : 0;
        }
        if (thisDialogData.SCREEN_ID === 5) {
            permitId = thisDialogData.SCREEN_RECORD_ID;
           
          jobId = angular.isDefined(thisDialogData.JOB_ID) ? thisDialogData.JOB_ID : 0;
          projectId = angular.isDefined(thisDialogData.PROJECT_ID) ? thisDialogData.PROJECT_ID : 0;
        }
        if (thisDialogData.SCREEN_ID === 6) {
            dailyId = thisDialogData.SCREEN_RECORD_ID;
            jobId = angular.isDefined(thisDialogData.JOB_ID) ? thisDialogData.JOB_ID : 0;
            projectId = angular.isDefined(thisDialogData.PROJECT_ID) ? thisDialogData.PROJECT_ID : 0;
        }
        angular.forEach(files, function (file) {
          var dataModel = AttachmentService.ToDataModel(file, thisDialogData.SCREEN_ID, thisDialogData.SCREEN_RECORD_ID, projectId, jobId, permitId,dailyId);
          attachmentDCModels.push(dataModel);
        });
        return attachmentDCModels;
      }

      function Save(thisForm, gridAttachments) {
        $("#btnSave").prop("disabled", true);
        if (thisForm.$valid || thisForm.$error.pattern.length) {
          var data = GridDataSource;
          for (var i = 0; i < data._data.length; i++) {
            $(gridAttachments.tbody.find('tr:eq(' + i + ')').removeClass('k-state-selected'));
            if (data._data[i].Documentcategorydc.CATEGORY_CODE === null) {
              var documentCategory = gridAttachments.tbody.find('tr:eq(' + i + ') td:eq(' + 5 + ')');
              gridAttachments.editCell(documentCategory);
              $(gridAttachments.tbody.find('tr:eq(' + i + ')').addClass('k-state-selected'));
              Utility.Notify({ type: NOTIFYTYPE.ERROR, message: "Please set document category of all attachments.", IsPopUp: thisDialogData });
              $("#btnSave").prop("disabled", false);
              return;
            }
          }
          var dirty = $.grep(data._data, function (item) {
            return item.dirty;
          });
          if (!dirty.length) {
            alert("There are no changes to be saved.");
            Utility.HideNotification();
            $("#btnSave").prop("disabled", false);
            return;
          }
          for (var i = 0; i < dirty.length; i++) {
            if (dirty[i].Documentcategorydc.CATEGORY_CODE === null) {
              Utility.Notify({ type: NOTIFYTYPE.ERROR, message: "Please first set category of each document before making any other changes.", IsPopUp: thisDialogData });
              $("#btnSave").prop("disabled", false);
              return;
            }
          }
          var newlyInsertedAttachments = [];
          var updatedAttachments = [];
          angular.forEach(dirty, function (dirtyAttachment) {
            if (dirtyAttachment.ATTACHMENT_ID === 0) {
              newlyInsertedAttachments.push(dirtyAttachment);
            } else {
              dirtyAttachment.MODIFIED_BY = $rootScope.currentUser.USER_ID;
              updatedAttachments.push(dirtyAttachment);
            }
          });

          if (newlyInsertedAttachments.length > 0) {
            AttachmentService.InsertAttachment(JSON.stringify(newlyInsertedAttachments)).then(function (response) {
              angular.forEach(response.data, function (attachment) {
                if (attachment.ATTACHMENT_ID === -111) {
                  vm.existingFiles.push(attachment);
                }
              });
              GridOptions.dataSource.read();
              $("#btnSave").prop("disabled", false);
              GridDataSource.sort({ field: "MODIFIED_ON", dir: "desc" });
              vm.existingFiles.length > 0 ? vm.existingFiles = WarnUserOfExistingFiles(vm.existingFiles) : OnServiceSuccess();
            }, function errorCallback(errorThrown) {
              OnServiceFailure(errorThrown);
              $("#btnSave").prop("disabled", false);
            });
          } if (updatedAttachments.length > 0) {
            AttachmentService.UpdateAttachment(JSON.stringify(updatedAttachments)).then(function () {
              GridOptions.dataSource.read();
              $("#btnSave").prop("disabled", false);
              GridDataSource.sort({ field: "MODIFIED_ON", dir: "desc" });
              if (newlyInsertedAttachments.length <= 0) {
                OnServiceSuccess();
              }
            }, function errorCallback(errorThrown) {
              OnServiceFailure(errorThrown.data);
              $("#btnSave").prop("disabled", false);
            });
          }
        } else {
          OnServiceFailure("Something went wrong, please try again");
          $("#btnSave").prop("disabled", false);
        }
      }

      function DestroyRecords(e, gridAttachments) {
        Utility.HideNotification();
        Globals.changedModelIds = [];
        Globals.changedModelNames = [];
        var grid = gridAttachments;
        var selectedRows = grid.select();
        var selDataItems = [];
        $.each(selectedRows, function (index, value) {
          var dataItem = grid.dataItem(value);
          if ($.inArray(dataItem.id, Globals.changedModelIds) == -1) {
            if (dataItem.id > 0) {
              Globals.changedModelIds.push(dataItem.id);
              selDataItems.push(grid.dataItem(value));
            }
          }
          if (dataItem.id == 0 && $.inArray(dataItem.FILE_NAME, Globals.changedModelNames) == -1) {
            if (dataItem.FILE_NAME !== "") {
              Globals.changedModelNames.push(dataItem.FILE_NAME);
            }
          }
        });
        if (Globals.changedModelNames.length > 0) {
          Globals.changedModelNames = [];
          alert("Please save changes first.");
          return;
        }
        if (!selDataItems.length) {
          alert("Please select row(s) to delete by clicking on the row header.");
          return;
        }
        if (Globals.changedModelIds <= 0) {
          return;
        }
        var message = Globals.BasicDeleteConfirmation;
        if (confirm(message) == true) { }
        else return;

        AttachmentService.DeleteAttachments(selDataItems).then(function (result) {
          OnServiceSuccess();
          GridOptions.dataSource.read();
        }, function errorCallback(errorThrown) {
          OnServiceFailure(errorThrown);
        });
      }

      function WarnUserOfExistingFiles(sameFiles) {
        if (sameFiles.length)
          Utility.Notify({ type: NOTIFYTYPE.ERROR, message: " Following " + sameFiles.length + " file(s) already exist and cannot be saved: <br/>" + GetRemovedFileNames(sameFiles) + "All other changes saved successfully", IsPopUp: thisDialogData });
        return sameFiles = [];
      }

      function GetRemovedFileNames(problematicFiles) {
        var fileNames = "";
        for (var i = 0; i < problematicFiles.length; i++) {
          fileNames = angular.isDefined(problematicFiles[i].FILE_NAME) ? fileNames.concat(problematicFiles[i].FILE_NAME + "<br/>") : fileNames.concat(problematicFiles[i].name + "<br/>");
        }
        return fileNames;
      }

      function ShowNoFileUploadedMessage(files, existingFilesFound) {
        if ((angular.isUndefined(files) || !files.length) && existingFilesFound)
          return true;
        if (angular.isUndefined(files) || files.length === 0) {
          Utility.Notify({ type: NOTIFYTYPE.ERROR, message: "Please select file(s) to upload.", IsPopUp: thisDialogData });
          return true;
        }
      }

      function RemoveFilesWithLongName(files) {
        var longNameFiles = [];
        for (var i = files.length - 1; i >= 0; i--) {
          if (files[i].name.length > 250) {
            longNameFiles.push(files[i]);
            files.splice(i, 1);
          }
        }
        if (longNameFiles.length > 0)
          Utility.Notify({ type: NOTIFYTYPE.ERROR, message: " Following " + longNameFiles.length + " file(s) are not uploaded due to long names: <br/>" + GetRemovedFileNames(longNameFiles) + "All other files uploaded successfully", IsPopUp: thisDialogData });
        return files;
      }

      function UploadFiles(files) {
        var attachmentDCModels = [];
        if (ShowNoFileUploadedMessage(files, false))
          return;

        if (ShowNoFileUploadedMessage(files, true))
          return;

        files = RemoveFilesWithLongName(files);
        if (files.length <= 0)
          return;

        attachmentDCModels = SetAttachmentsDataModel(files, attachmentDCModels);
        var uploadObject = {
          url: Globals.ApiUrl + 'attachment/upload',
          data: {
            files: files,
            attachmentDCModels: attachmentDCModels
          }
        }

        Upload.upload(uploadObject).then(function (attachmentDataModels) {
          AddRowInGrid(attachmentDataModels.data);
          $rootScope.files = [];
          $rootScope.droppedFiles = [];
        }, function (response) {
          vm.excludedFiles = [];
          OnServiceFailure(angular.isDefined(response.data.StackTraceString) ? response.data.StackTraceString : response.data);
        }, function (evt) {
          $rootScope.uploadPercentage = parseInt(100.0 * evt.loaded / evt.total);
        });
      }

      function AddRowInGrid(attachmentDataModels) {
        angular.forEach(attachmentDataModels, function (recentlyUploadedFileDataModel) {
          GridOptions.dataSource.insert(recentlyUploadedFileDataModel);
        });
        GridDataSource.sort({ field: "MODIFIED_ON", dir: "asc" });
      }

      function SetBlockingWindowInstance(blockWindowInstance) {
        vm.blockWindowInstance = blockWindowInstance;
      }

      function GetFileNameTemplate(attachmentList) {
        angular.forEach(attachmentList, function (thisAttachment) {
          if (thisAttachment.FILE_TYPE.indexOf('image') !== -1) {
            thisAttachment.FILE_ICON = "../Content/images/defaultimage.png";
            return;
          }
          if (thisAttachment.FILE_TYPE.indexOf('application/octet-stream') !== -1) {
            thisAttachment.FILE_ICON = "../Content/images/zipfile.jpg";
            return;
          }
          if (thisAttachment.FILE_TYPE.indexOf('application/zip') !== -1 || thisAttachment.FILE_TYPE.indexOf('application/zip') !== -1 || thisAttachment.FILE_TYPE.indexOf('application/x-compressed-zip') !== -1) {
            thisAttachment.FILE_ICON = "../Content/images/zipfile.jpg";
            return;
          }
          if (thisAttachment.FILE_TYPE.indexOf('application/msword') !== -1 || thisAttachment.FILE_TYPE.indexOf('application/vnd.openxmlformats-officedocument.wordprocessingml.document') !== -1) {
            thisAttachment.FILE_ICON = "../Content/images/word.png";
            return;
          }
          if (thisAttachment.FILE_TYPE.indexOf('application/msexcel') !== -1 || thisAttachment.FILE_TYPE.indexOf('application/vnd.ms-excel') !== -1 || thisAttachment.FILE_TYPE.indexOf('application/vnd.openxmlformats-officedocument.spre') !== -1) {
            thisAttachment.FILE_ICON = "../Content/images/excel.jpg";
            return;
          }
          if (thisAttachment.FILE_TYPE.indexOf('application/pdf') !== -1) {
            thisAttachment.FILE_ICON = "../Content/images/pdf.jpg";
            return;
          }
          if (thisAttachment.FILE_TYPE.indexOf('text/plain') !== -1) {
            thisAttachment.FILE_ICON = "../Content/images/text-plain.png";
            return;
          }
          if (thisAttachment.FILE_TYPE.indexOf('video/mpeg') !== -1 || thisAttachment.FILE_TYPE.indexOf('audio/mpeg') !== -1) {
            thisAttachment.FILE_ICON = "../Content/images/video.png";
            return;
          } else {
            thisAttachment.FILE_ICON = "../Content/images/file.png";
            return;
          }
        });
      }

      return {
        DestroyRecords: DestroyRecords,
        Save: Save,
        SetDialogData: function (dialogData) { thisDialogData = dialogData; },
        GetGridOptions: GridOptions,
        Upload: UploadFiles,
        AddRowInGrid: AddRowInGrid,
        GetFileNameTemplate: GetFileNameTemplate,
        FileSizeTemplate: FileSizeTemplate,
        SetBlockingWindowInstance: SetBlockingWindowInstance,
        downloadFile: downloadFile,
        SetDocumentCategories: SetDocumentCategories
      }

    }]);