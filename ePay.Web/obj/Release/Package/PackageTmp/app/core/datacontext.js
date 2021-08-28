
angular.module('HylanApp').factory('DataContext', ['$rootScope', 'Utility', 'NOTIFYTYPE', 'AppConfig', 'NotificationService','$http',

function ($rootScope, Utility, NOTIFYTYPE, AppConfig, NotificationService) {

        var CreateDataSource = function (resource, schema, aggregates, groups, IsPopUp, defaultSort, _customPageSize, PageName) {

            var localagg = typeof (aggregates) == "object" ? aggregates : null;
            var localgroups = typeof (groups) == "object" ? groups : null;
            var notes;
            var datasource = new kendo.data.DataSource({
                transport: {
                    read: function (options) {                   
                        var action = this.defaultAction ? this.defaultAction : "GetAll";
                        var params = this.readParams ? this.readParams : options.data;
                        $.ajax({
                            url: AppConfig.ApiUrl + "/" +  resource + "/"+ action,
                            dataType: "json",
                            data: params,
                            cache: false,
                            headers: {
                                "Authorization": "UserID" + $rootScope.currentUser.USER_ID
                            },
                            success: function (result, textStatus, xhr) {
                                $rootScope.lastServerDateTime = xhr.getResponseHeader('X-LastServerDateTime');
                                options.success(result.objResultList);
                                $('.k-grid-save-changes').removeClass('disabled');                                
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                $('.k-grid-save-changes').removeClass('disabled');
                                var exception = XMLHttpRequest.responseText ? XMLHttpRequest.responseText : errorThrown;
                                if ((IsPopUp != null ? IsPopUp : false) == true)
                                    Utility.Notify({ type: NOTIFYTYPE.ERROR, message: exception, IsPopUp: IsPopUp });
                                else
                                    Utility.Notify({ type: NOTIFYTYPE.ERROR, message: exception });
                            }
                        });
                    },
                    create: function (options) {
                        for (var i = 0; i < options.data.models.length; i++) {
                          options.data.models[i].CREATED_BY = $rootScope.currentUser.USER_ID;
                          options.data.models[i].MODIFIED_BY = $rootScope.currentUser.USER_ID;
                        }
                        if (Globals.isActiveEventClosed)
                            return;
                        $.ajax({
                            type: "POST",
                            url: AppConfig.ApiUrl + "/" + resource + "/Insert",
                            dataType: "json",
                            contentType: "application/json; charset=utf-8",
                            data: JSON.stringify(options.data.models),
                            cache: false,
                            headers: {
                                "Authorization": "UserID" + $rootScope.currentUser.USER_ID
                            },
                            success: function (result) {
                                var NewEventid = 0;
                                if (resource == "Events") {
                                    if (result > 0) {
                                        NewEventid = result;
                                        Cookies.set('selectedEvent', NewEventid, { path: '' });
                                        result = 1;
                                    }
                                }
                                if (result >= 1) {
                                    options.success(result);
                                    if ((IsPopUp != null ? IsPopUp : false) == true)
                                        Utility.Notify({ type: NOTIFYTYPE.SUCCESS, message: 'Changes Saved.', IsPopUp: IsPopUp });
                                    else
                                        Utility.Notify({ type: NOTIFYTYPE.SUCCESS, message: 'Changes Saved.' });

                                    $rootScope.$broadcast('dbCommandCompleted', { source: 'create' });

                                    if (resource == "Events") {
                                        NotificationService.transmit('Event Create');
                                        Globals.sendEmail("Events", "EventCreation", NewEventid);
                                    }
                                }
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                $('.k-grid-save-changes').removeClass('disabled');
                                var exception = XMLHttpRequest.responseText ? XMLHttpRequest.responseText : errorThrown;
                                var exceptionfieldindex = exception.indexOf('$');
                                var exceptionMsg = exception.substring(0, exceptionfieldindex);
                                var exceptionfieldids = exception.substring(exceptionfieldindex + 2, exception.length).split(',');
                                if (Globals.changedModelIds.length != exceptionfieldids.length)
                                    exceptionMsg = exceptionfieldids[1];
                                IsPopUp != null ? IsPopUp : false;
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
                                Utility.Notify({ type: NOTIFYTYPE.ERROR, message: exceptionMsg, IsPopUp: IsPopUp });
                            }
                        });
                    },
                    update: function (options) {
                        for (var i = 0; i < options.data.models.length; i++) {
                          options.data.models[i].MODIFIED_BY = $rootScope.currentUser.USER_ID;
                        }
                        if (Globals.isActiveEventClosed)
                            return;
                        $.ajax({
                            type: "POST",
                            url: AppConfig.ApiUrl + "/" + resource + "/Update",
                            dataType: "json",
                            contentType: "application/json; charset=utf-8",
                            data: JSON.stringify(options.data.models),
                            cache: false,
                            headers: {
                                "Authorization": "UserID" + $rootScope.currentUser.USER_ID
                            },
                            success: function (result) {
                                var UpdatedEventids = '';
                                if (result > 0) {
                                    options.success(result);
                                    if ((IsPopUp != null ? IsPopUp : false) == true)
                                        Utility.Notify({ type: NOTIFYTYPE.SUCCESS, message: 'Changes Saved.', IsPopUp: IsPopUp });
                                    else
                                        Utility.Notify({ type: NOTIFYTYPE.SUCCESS, message: 'Changes Saved.' });

                                    ///  Send Email on Event Closed
                                    if (resource == 'Events') {
                                        for (var i = 0; i < options.data.models.length; i++) {
                                            if (options.data.models[i].STATUS.LU_NAME == 'Closed') {
                                                UpdatedEventids += options.data.models[i].EVENT_ID + ',';
                                            }
                                        }
                                        if (UpdatedEventids != '') {
                                            UpdatedEventids = UpdatedEventids.substring(0, UpdatedEventids.length - 1);
                                            NotificationService.transmit('Event Close');
                                            Globals.sendEmail("Events", "EventUpdation", UpdatedEventids);
                                        }
                                    }
                                    $rootScope.$broadcast('dbCommandCompleted', { source: 'update' });
                                }
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                var changedModelIds = Globals.changedModelIds;
                                $rootScope.$broadcast('dbCommandCompleted', { source: 'update' });

                                setTimeout(function () {
                                    $('.k-grid-save-changes').removeClass('disabled');

                                    var exception = XMLHttpRequest.responseText ? XMLHttpRequest.responseText : errorThrown;

                                    var exceptionfieldindex = exception.indexOf('$');
                                    var exceptionMsg = exception.substring(0, exceptionfieldindex);
                                    var exceptionfieldids = exception.substring(exceptionfieldindex + 2, exception.length).split(',');
                                    if (changedModelIds.length > 0) {
                                        $(changedModelIds).each(function (index, value) {
                                            var hasidError = false;
                                            var item;
                                            if (!IsPopUp)
                                                item = $.grep($("#grid1").data("kendoGrid")._data, function (item) { return (item.id == value); });
                                            else
                                                item = $.grep($("#grid2").data("kendoGrid")._data, function (item) { return (item.id == value); });
                                            if (item.length != 0) {
                                                for (var i = 0; i <= exceptionfieldids.length; i++) {
                                                    if (item[0].id == exceptionfieldids[i]) {
                                                        hasidError = true;
                                                        break;
                                                    }
                                                }
                                            }

                                            if (hasidError) {
                                                if (!IsPopUp) {
                                                    $("#grid1 .k-grid-content-locked").find("tr[data-uid='" + item[0].uid + "']").removeClass('k-state-selected');
                                                    $("#grid1 .k-grid-content").find("tr[data-uid='" + item[0].uid + "']").removeClass('k-state-selected');
                                                    $("#grid1 .k-grid-content-locked").find("tr[data-uid='" + item[0].uid + "']").css("background-color", "#FDCCCC");
                                                    $("#grid1 .k-grid-content").find("tr[data-uid='" + item[0].uid + "']").css("background-color", "#FDCCCC");
                                                }
                                                else {
                                                    $("#grid2 .k-grid-content-locked").find("tr[data-uid='" + item[0].uid + "']").removeClass('k-state-selected');
                                                    $("#grid2 .k-grid-content").find("tr[data-uid='" + item[0].uid + "']").removeClass('k-state-selected');
                                                    $("#grid2 .k-grid-content-locked").find("tr[data-uid='" + item[0].uid + "']").css("background-color", "#FDCCCC");
                                                    $("#grid2 .k-grid-content").find("tr[data-uid='" + item[0].uid + "']").css("background-color", "#FDCCCC");
                                                }
                                                hasidError = false;
                                            }
                                        });
                                    }
                                    IsPopUp != null ? IsPopUp : false;
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
                                    Utility.Notify({ type: NOTIFYTYPE.ERROR, message: exceptionMsg, IsPopUp: IsPopUp });
                                }, 500);
                            }
                        });
                    },
                    destroy: function (options) {
                        $.ajax({
                            type: "POST",
                            url: AppConfig.ApiUrl + "/" + resource + "/Delete",
                            dataType: "json",
                            contentType: "application/json; charset=utf-8",
                            data: JSON.stringify(options.data.models),
                            cache: false,
                            headers: {
                                "Authorization": "UserID" + $rootScope.currentUser.USER_ID
                            },
                            success: function (result) {
                                if (result == 1) {
                                    Utility.Notify({ type: NOTIFYTYPE.SUCCESS, message: 'Changes Saved.' });
                                    $rootScope.$broadcast('dbCommandCompleted', { source: 'destroy' });
                                }
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                $('.k-grid-save-changes').removeClass('disabled');
                                var exception = XMLHttpRequest.responseText ? XMLHttpRequest.responseText : errorThrown;
                                Utility.Notify({ type: NOTIFYTYPE.ERROR, message: exception });
                            }
                        });
                    },
                    parameterMap: function (options, operation) {
                        if (operation !== "read" && options.models) {
                            return { models: kendo.stringify(options.models) };
                        }
                    }
                },
                change: function (e) {
                    if (e.action == "itemchange") {
                        e.items[0].dirtyFields = e.items[0].dirtyFields || {};
                        if (typeof e.items[0] == 'object')
                            e.items[0].dirtyFields[e.field] = true;
                    }

                },
                success: function (result) {
                    //alert('done');
                },
                schema: schema,
                aggregate: localagg,
                //group: groups,
                batch: true,
                pageSize: (_customPageSize && _customPageSize > 0) ? _customPageSize : AppConfig.GridPageSize,
                serverPaging: false,
                serverSorting: false,
                sort: defaultSort
            });

            datasource.transport.read.cache = false;
            datasource.transport.create.cache = false;
            datasource.transport.update.cache = false;
            datasource.transport.destroy.cache = false;
            return datasource;
        };

        return {
            CreateDataSource: CreateDataSource
        };
    }
]);
