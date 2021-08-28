angular.module('HylanApp').factory('MessagesService', ['DataContext', function (DataContext) {
    var GetEmptyModel = function () {
        var api = "Message/GetEmptyModel";
        return Globals.Get(api,null, true);
    };
    var SendEmail = function (emailData) {
        var api = "Message/SendEmail";
        return Globals.Post(api, emailData, true);
    };
    var ScheduleMeeting = function (emailData) {
        var api = "Message/ScheduleMeeting";
        return Globals.Post(api, emailData, true);
    };
    return {
        GetEmptyModel: GetEmptyModel,
        SendEmail: SendEmail,
        ScheduleMeeting: ScheduleMeeting
    };
}]);