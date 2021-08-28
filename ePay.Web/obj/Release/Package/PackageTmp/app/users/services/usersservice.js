angular.module('HylanApp').factory('UsersService', ['DataContext', 'Utility', 'NOTIFYTYPE', 'AppConfig', '$rootScope',
     function (DataContext, Utility, NOTIFYTYPE, AppConfig, $rootScope) {
    var resource = "User";
    var schema = {
        model: {
            id: "USER_ID",
            fields: {
                ROW_HEADER: { editable: false },
                USER_ID: {},
                USER_NAME: {
                    title: "User Name", validation: {                        
                        maxlength: function (input) {
                            if (input.val().length > 12) {
                                input.attr("data-maxlength-msg", "Max. length for User Name is 12.");
                                return false;
                            }
                            return true;
                        }
                    }
                },
                FIRST_NAME: {
                    title: "First Name",
                    validation: {
                        firstnamemaxlength: function (input) {
                            if (input.val().length > 30) {
                                input.attr("data-firstnamemaxlength-msg", "Max. length for First Name is 30.");
                                return false;
                            }
                            return true;
                        }
                    }
                },
                LAST_NAME: {
                    title: "Last Name",
                    validation: {
                       lastnamemaxlength: function (input) {
                            if (input.val().length > 30) {
                                input.attr("data-lastnamemaxlength-msg", "Max. length for Last Name is 30.");
                                return false;
                            }
                            return true;
                        }
                    }
                },
                ROLE: { title: "User Role", defaultValue: { ROLE_ID: -1, ROLE_NAME: '' } },
                RMAG: { },
                USER_COMPANIES: {},
                USER_COMPANIES_NAMES: {},
                HOME_RMAGS: {},
                EMAIL_ADDRESS: {
                    title: "Email Address",
                    validation: {                        
                        emailaddressmaxlength: function (input) {
                            if (input.val().length > 250) {
                                input.attr("data-emailaddressmaxlength-msg", "Max. length for Email Address is 250.");
                                return false;
                            }
                            return true;
                        },
                        emailformat: function (input) {

                            if (input.is("[name='EMAIL_ADDRESS']") && input.val() != "") {
                                input.attr("data-emailformat-msg", "Please enter Email in correct format.");
                                return /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/.test(input.val().toLowerCase());
                            }
                            return true;
                        }

                    }
                },
                OFFICE_PHONE: {
                    title: "Office Phone #"
                },
                MOBILE_PHONE: {
                    title: "Cell #"
                },
                STATUS: {
                    title: "Status", editable: false, defaultValue: 'Y'
                },
                CREATED_ON: {},
                CREATED_BY: {},
                MODIFIED_ON: {},
                MODIFIED_BY: {},
                LOCK_COUNTER: {}
            }
        }
    };

    var defaultSort = {
        field: "LAST_NAME",
        dir: "asc"
    };
    var GetAllByRMAGID = function (options) {
        $('.k-grid-save-changes').removeClass('disabled');
    
        if (options.data.RMAG_ID) {
            this.selectedRmagID = options.data.RMAG_ID;
           
        }
        else
            options.data = { RMAG_ID: this.selectedRmagID };
        $.ajax({
            url: AppConfig.ApiUrl + "/" + resource + "/GetAll",
            dataType: "json",
            data: options.data,
            cache: false,
            headers: {
                "Authorization": "UserID" + $rootScope.currentUser.USER_ID
            },
            success: function (result, textStatus, xhr) {
                $rootScope.lastServerDateTime = xhr.getResponseHeader('X-LastServerDateTime');
                options.success(result.objResultList);
                isDataChanged = false;
                isDublicateCompany = false;                
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                var exception = XMLHttpRequest.responseText ? XMLHttpRequest.responseText : errorThrown;
                Utility.Notify({ type: NOTIFYTYPE.ERROR, message: exception });
            }
        });

    };

    var datasource = DataContext.CreateDataSource(resource, schema, null, null, null, defaultSort);
    datasource.transport.read = GetAllByRMAGID;

    var ResetPassword = function (selectedUserIds, currentUserId, username, emailId) {
        //var api = "User/ResetPassword?selectedUserIds=" + selectedUserIds + "&currentUserId=" + currentUserId;
        var api = "User/EmailResetPassword?selectedUserIds=" + selectedUserIds + "&currentUserId=" + currentUserId + "&username=" + username + "&emailId=" + emailId + "&isFromManageUsers=true";
        return Globals.Post(api, null, false);
    }
    //var EmailResetPassword = function (selectedUserIds, currentUserId, username, emailId) {
    //    var api = "User/EmailResetPassword?selectedUserIds=" + selectedUserIds + "&currentUserId=" + currentUserId + "&username=" + username + "&emailId=" + emailId;
    //    return Globals.Post(api, null, false);
    //};

    return {
        ResetPassword: ResetPassword,
        dataSource: datasource,
        defaultSort: defaultSort
    };
}]);