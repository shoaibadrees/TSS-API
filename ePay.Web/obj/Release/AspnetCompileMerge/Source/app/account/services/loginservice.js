angular.module('HylanApp').factory('LoginService', ['$http', '$q', 'DataContext',
    function ($http, $q, DataContext) {
        var Login = function (username, password, onSuccess) {
            var params = { username: username, password: password };
            return Globals.Get('User/AuthenticateUser', params);
        };

        var authCookieUrl = (Globals.BaseUrl == "/" ? "" : Globals.BaseUrl) + "/SetAuthenticationTicket";
        var SetAuthCookie = function (username,companies,email,logindate) {
            return $.ajax({
                type: "GET",
                url: authCookieUrl,
                data: { username: username, companies: companies, email: email, logindate: logindate },
                async: false,
                cache: false
            });
        };
        var GetUsersByUsername = function (username) {
            var params = { username: username };
            return Globals.Get('User/GetUsersByUsername', params);
        };
        var EmailResetPassword = function (selectedUserIds, currentUserId, username, emailId) {
            var api = "User/EmailResetPassword?selectedUserIds=" + selectedUserIds + "&currentUserId=" + currentUserId + "&username=" + username + "&emailId=" + emailId;
            return Globals.Post(api, null, false);
        };
        return {
            Login: Login,
            SetAuthCookie: SetAuthCookie,
            GetUsersByUsername: GetUsersByUsername,
            EmailResetPassword: EmailResetPassword
        };
    }
]);