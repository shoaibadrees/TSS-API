angular.module('HylanApp').factory('UserProfileService', ['DataContext', function (DataContext) {
    var GetUserProfile = function (userId) {
        var api = "User/Get";
        var param = { id: userId };
        return Globals.Get(api, param, false);
    };

    var UpdateUserProfile = function (userProfile) {
        var api = "User/UpdateUser";
        return Globals.Post(api, userProfile, true);
    };

    return {
        GetUserProfile: GetUserProfile,
        UpdateUserProfile: UpdateUserProfile
    };
}]);