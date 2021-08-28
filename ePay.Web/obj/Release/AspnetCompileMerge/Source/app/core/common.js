var common = angular.module('Common', []);
common
    .constant('NOTIFYTYPE', {
        ERROR: 'error',
        SUCCESS: 'success',
        WARNING: 'warning',
        INFO: 'info'
    })

    .factory('AppConfig', function () {
        var apiUrl = Globals.ApiUrl;
        var gridPageSize = 50;
        var gridPageSizes = [50,100];  //-- values to display in 'items per page' dropdown
        var gridPageButtonCount = 10;      //-- number of pagging buttons to display
        var showStackTracke = true;
        var exportAllPages = true;
        return {
            ApiUrl: apiUrl,
            GridPageSize: gridPageSize,
            GridPageSizes: gridPageSizes,
            GridPageButtonCount: gridPageButtonCount,
            ShowStackTracke: showStackTracke,
            ExportAllPages: exportAllPages,
        }
    })

    .factory('SessionTimeoutService', ['$rootScope', '$timeout', '$log',
        function ($rootScope, $timeout, $log) {
            var idleTimer = null;
            var sessionTimer = null;
            var isIdleExpired = false;

            startTimer = function () {
                //$log.log('Starting timer');
                if (idleTimer == null) {
                    idleTimer = $timeout(idleTimeExpiring, AppSettings.InactivityTimeout);
                    sessionTimer = $timeout(sessionExpiring, AppSettings.SessionTimeout);
                }
            };

            stopTimer = function () {
                if (idleTimer) {
                    $timeout.cancel(idleTimer);
                    $timeout.cancel(sessionTimer);
                    idleTimer = null;
                    sessionTimer = null;
                    isIdleExpired = false;
                }
            };

            resetTimer = function () {
                ////if (!isIdleExpired) {
                stopTimer();
                startTimer();
                ////}
            };

            idleTimeExpiring = function () {
                isIdleExpired = true;
                ////$rootScope.$broadcast('IdleTimeExpiring');
                alert(Globals.IdleTimeoutMessage);
                $log.log('Idls Timer expiring ..');
            };

            sessionExpiring = function () {
                stopTimer();
                $rootScope.$broadcast('SessionExpiring');
                $log.log('Session expiring ..');
            };

            isServiceStarted = function () {
                if (idleTimer)
                    return true;
                else
                    false;
            };

            return {
                startTimer: startTimer,
                stopTimer: stopTimer,
                resetTimer: resetTimer,
                isServiceStarted: isServiceStarted
            };
        }])

    .factory('NotificationService', ['$log',
        function ($log) {

            starthub = function () {
                ////$.connection.hub.start({ waitForPageLoad: false }).done(function () {
                ////    $log.log('NotificationHub: started');
                ////}).fail(function (error) {
                ////    $log.log('NotificationHub: connection failed with details:' + error);
                ////});
            };

            transmit = function (type) {
                ////var notification = $.connection.notificationHub;
                ////$.connection.hub.transportConnectTimeout = 3000;
                ////$.connection.hub.logging = true;
                ////$.connection.hub.start({ waitForPageLoad: false }).done(function () {
                ////    $log.log('NotificationHub: started');
                ////    notification.server.send();
                ////    $log.log('NotificationHub: '+ type +' notification sent');
                ////}).fail(function (error) {
                ////    $log.log('NotificationHub: connection failed with details:' + error);
                ////});
            };

            return {
                starthub: starthub,
                transmit: transmit
            };
        }]);
