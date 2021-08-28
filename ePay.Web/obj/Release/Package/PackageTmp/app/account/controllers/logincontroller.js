angular.module('HylanApp').controller('LoginController', ['$rootScope', '$scope', '$state', '$timeout', 'LoginService', 'Utility', 'NOTIFYTYPE', 'ngDialog',
    function ($rootScope, $scope, $state, $timeout, LoginService, Utility, NOTIFYTYPE, ngDialog) {
        $rootScope.title = $state.current.title;
        $scope.loginForm = {
            username: '',
            password: '',
            hasError: false,
            errorMessage: '',
            inProgress: false,
            forgetLoginView: false,
            SECURITY_QUESTION: '-1',
            ANSWER: '',
            emailSent: false
        };
        $scope.lostUser = null;
        $scope.login = function () {
            var ifusernamegiven = true;
            if ($scope.loginForm.inProgress == false) {
                $scope.loginForm.inProgress = true;
                $scope.loginForm.hasError = false;
                $scope.loginForm.errorMessage = '';
                if ($scope.loginForm.username == '' || $scope.loginForm.password == '') {
                    $scope.loginForm.inProgress = false;
                    $scope.loginForm.hasError = true;
                    if ($scope.loginForm.username == '') {
                        $scope.loginForm.errorMessage += 'Username is required.';
                        ifusernamegiven = false;
                        $('#username').focus();

                    }
                    if ($scope.loginForm.password == '') {
                        if ($scope.loginForm.errorMessage != '')
                            $scope.loginForm.errorMessage += "\n";
                        $scope.loginForm.errorMessage += 'Password is required.';
                        if (ifusernamegiven)
                            $('#password').focus();
                    }
                    return
                }
               
                var currUser = Cookies.get('currentUser');
                if (currUser != undefined && currUser != null) {
                  currUser = JSON.parse(currUser);
                  if (currUser.USER_NAME === $scope.loginForm.username) {
                    $state.go("Projects", { reload: true });
                  }
                  else {
                    //$scope.loginForm.inProgress = false;
                      //Utility.Notify({ type: NOTIFYTYPE.ERROR, message: "User is already sign in. Please logout first from that user." });
                      $state.go("Default", { reload: true });
                  }
                  return;
                }

                LoginService.Login($scope.loginForm.username, $scope.loginForm.password).then(function (result) {
                   
                    Globals._seedLookUpData();
                    if (typeof result.objResult === "undefined" || result.objResult == null || result.objResult.USER_NAME == null) {
                        $scope.$apply(function () {
                            $scope.loginForm.inProgress = false;
                            $scope.loginForm.hasError = true;
                            if (result.objResult.FAILED_LOGIN_ATTEMPT_MESSAGE)
                                $scope.loginForm.errorMessage = result.objResult.FAILED_LOGIN_ATTEMPT_MESSAGE;
                            else
                                $scope.loginForm.errorMessage = 'Username or password is not valid.';
                        });
                        return;
                    }
                    else {
                        if (result.objResult.STATUS == "N") {
                            $scope.$apply(function () {
                                $scope.loginForm.inProgress = false;
                                $scope.loginForm.hasError = true;
                                $scope.loginForm.errorMessage = 'Your account has been disabled. Contact your administrator for login.';
                            });
                            return;
                        }
                        else {
                            $rootScope.currentUser = result.objResult;

                            //ngDialog.open({
                            //    template: '/app/account/views/disclaimer.html',
                            //    showClose: false,
                            //    closeByDocument: false,
                            //    closeByEscape: false,
                            //    scope: $scope
                            //});
                            $scope.DisclaimerProceed(); // By pass disclaimer screen
                        }
                    }
                }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
                    var exception = XMLHttpRequest.responseText || XMLHttpRequest.statusText || errorThrown.message;
                    if (exception == "error")
                        exception = "Api is not running, please try by switching IP address with Host Name.";
                    Utility.Notify({ type: NOTIFYTYPE.ERROR, message: exception });
                    $rootScope.currentUser = null;
                    $scope.loginForm.inProgress = false;
                });
            }
        }

        $scope.DisclaimerProceed = function () {

            if ($("#btnProceed").hasClass("disabled"))
                return false;
            else {
                if ($scope.loginForm.username != 'undefined' && $scope.loginForm.username != '') {
                    var userObj = $rootScope.currentUser;
                    var errMsg = "Error in setting authentication ticket, please try again!";
                    if (userObj) {
                        var companystring = userObj.USER_COMPANIES.join();
                        LoginService.SetAuthCookie(userObj.USER_NAME, companystring, userObj.EMAIL_ADDRESS, userObj.MODIFIED_ON).then(function (resp) {

                            //ngDialog.close();
                            Cookies.set('currentUser', $rootScope.currentUser, { path: '' });
                            if (resp == "1") {
                                if ($rootScope.currentUser.PASSWORD_AGE && $rootScope.currentUser.PASSWORD_AGE > AppSettings.DaysToExpirePassword) {
                                    ////Utility.Notify({ type: NOTIFYTYPE.WARNING, message: Globals.PasswordAgeWarning });
                                    //alert(Globals.PasswordAgeWarning);
                                }
                                var defaultScreen = 'Default';
                                /*if ($rootScope.currentUser.USER_SCREENS != null && $rootScope.currentUser.USER_SCREENS.length > 0) {
                                    if (_.contains($rootScope.currentUser.USER_SCREENS, Globals.Screens.MANAGE_EVENTS.ID)) {
                                        defaultScreen = 'Events';
                                    }
                                    else if (_.contains($rootScope.currentUser.USER_SCREENS, Globals.Screens.REQUESTS.ID)) {
                                        defaultScreen = 'Requests';
                                    }
                                    else if (_.contains($rootScope.currentUser.USER_SCREENS, Globals.Screens.RESPONSES.ID)) {
                                        defaultScreen = 'Responses';
                                    }
                                }*/
                                var isMobile = Globals.CheckIfMobileDevice();
                                if (isMobile) {
                                   // var screenID = Globals.Screens.RESPONSES.ID;
                                    Globals.CurrentUser = $rootScope.currentUser;
                                    //Globals.EventType = Globals.GetEVENTTYPE();
                                    sessionStorage.setItem("currentUser", JSON.stringify(Globals.CurrentUser));
                                   // sessionStorage.setItem("selectedEvent", null);
                                    sessionStorage.setItem("selectedEntityObject", null);
                                    sessionStorage.setItem("emptyEntityObject", null);
                                    sessionStorage.setItem("userCompaniesList", null);
                                    Cookies.remove('currentUser', { path: '' });
                                   // Cookies.remove('selectedEvent', { path: '' });
                                    window.location.replace('app/mobile/default.html');
                                    return false;
                                }
                                $state.go(defaultScreen, { reload: true });
                                $rootScope.isUserLoggedIn = true;
                            } else {
                                $rootScope.currentUser = null;
                                $scope.loginForm.inProgress = false;
                                if (resp == "2") {
                                    $scope.loginForm.hasError = true;
                                    $scope.loginForm.errorMessage = "You are already logged in to the application from another location/browser.";
                                    Cookies.remove('currentUser', { path: '' });
                                    Utility.Notify({ type: NOTIFYTYPE.ERROR, message: $scope.loginForm.errorMessage });
                                }
                                else
                                    Utility.Notify({ type: NOTIFYTYPE.ERROR, message: errMsg });
                            }

                        }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
                            var exception = XMLHttpRequest.responseText || XMLHttpRequest.statusText || errorThrown.message;
                            Utility.Notify({ type: NOTIFYTYPE.ERROR, message: exception });
                            $rootScope.currentUser = null;
                            $scope.loginForm.inProgress = false;
                            Cookies.remove('currentUser', { path: '' });
                        });
                    }
                    else
                        Utility.Notify({ type: NOTIFYTYPE.ERROR, message: errMsg });
                }
            }
        };



        $scope.ForgetPassword = function () {
            $scope.loginForm.hasError = false;
            $scope.loginForm.SECURITY_QUESTION = "-1";
            $scope.loginForm.ANSWER = '';
            $scope.loginForm.emailSent = false;
            if ($scope.loginForm.username == undefined || $scope.loginForm.username == null || $scope.loginForm.username == '') {
                $scope.loginForm.hasError = true;
                $scope.loginForm.errorMessage = "Please provide a valid username or contact your administrator.";
            }
            else {
                LoginService.GetUsersByUsername($scope.loginForm.username).then(
                    function (result) {
                        if (result.objResultList && result.objResultList.length > 0) {
                            $scope.loginForm.hasError = false;
                            $scope.lostUser = result.objResultList[0];
                            $scope.loginForm.forgetLoginView = true;
                            if (result.objResultList[0].SECURITY_QUESTION != undefined &&  result.objResultList[0].SECURITY_QUESTION != null && result.objResultList[0].SECURITY_QUESTION != "") {
                              $scope.loginForm.SECURITY_QUESTION = result.objResultList[0].SECURITY_QUESTION;
                            }
                        }
                        else {
                            $scope.loginForm.hasError = true;
                            $scope.loginForm.errorMessage = "Please provide a valid username or contact your administrator.";
                        }
                        $timeout(function () { });
                    }, onError);
            }
        }
        $scope.SendPassword = function () {
            $scope.loginForm.hasError = false;
            if ($scope.lostUser != null) {
                if ($scope.lostUser.SECURITY_QUESTION != $scope.loginForm.SECURITY_QUESTION) {
                    $scope.loginForm.hasError = true;
                    $scope.loginForm.errorMessage = "Security Question is incorrect. Please contact your administrator.";
                }
                else if ($scope.lostUser.ANSWER != null && $scope.loginForm.ANSWER != null &&
                    $scope.lostUser.ANSWER.toString().toLowerCase() != $scope.loginForm.ANSWER.toString().toLowerCase()) {
                    $scope.loginForm.hasError = true;
                    $scope.loginForm.errorMessage = "Answer is incorrect. Please contact your administrator.";
                }
                else if ($scope.lostUser.SECURITY_QUESTION != $scope.loginForm.SECURITY_QUESTION &&
                    $scope.lostUser.ANSWER != $scope.loginForm.ANSWER) {
                    $scope.loginForm.hasError = true;
                    $scope.loginForm.errorMessage = "Security Question & Answer are incorrect. Please contact your administrator.";
                }
                if ($scope.loginForm.hasError == false) {
                    LoginService.EmailResetPassword($scope.lostUser.USER_ID, $scope.lostUser.USER_ID, $scope.lostUser.USER_NAME, $scope.lostUser.EMAIL_ADDRESS).then(function () {
                        $scope.loginForm.emailSent = true;
                    }, onError);
                }
            }
            $scope.loginForm.inProgress = true;
        }

        function onError(XMLHttpRequest, textStatus, errorThrown) {
          var exception = XMLHttpRequest.responseText ? XMLHttpRequest.responseText : errorThrown;          
          if (XMLHttpRequest.responseJSON && XMLHttpRequest.responseJSON.Message && (XMLHttpRequest.responseJSON.Message.indexOf(Globals.EmailMessageNotSent) != -1 || XMLHttpRequest.responseJSON.Message.indexOf(Globals.PasswordResetError) != -1))
          {
            Utility.Notify({ type: NOTIFYTYPE.ERROR, message: XMLHttpRequest.responseJSON.Message });
          }
          else {
            Utility.Notify({ type: NOTIFYTYPE.ERROR, message: XMLHttpRequest.responseText });
          }
          $scope.loginForm.inProgress = true;

        }

        $scope.HideNotification = function () {
            Utility.HideNotification();
        };

        $scope.HideNotification();
        ngDialog.close();
    }
]);