(function () {
  angular.module('HylanApp').directive('fileAttachmentControl', function () {
    var controller = ['$scope', function ($scope) {

      $scope.validateControls = function (data) {
        if (angular.isDefined(data.form.$error)) {
          if (angular.isDefined(data.form.$error.maxlength)) {
            data.form.$error.maxlength.forEach(function (ctrl) {
              if (ctrl.$name.indexOf($scope.hylancontrolname) !== -1) {
                data.validationMessages.push($scope.hylancontrolname + " value too long <br />");
              }
            });
          }
          if (angular.isDefined(data.form.$error.minlength)) {
            data.form.$error.minlength.forEach(function (ctrl) {
              if (ctrl.$name.indexOf($scope.hylancontrolname) !== -1) {
                data.validationMessages.push($scope.hylancontrolname + " value too short <br />");
              }
            });
          }
          if (angular.isDefined(data.form.$error.required)) {
            data.form.$error.required.forEach(function (ctrl) {
              if (ctrl.$name.indexOf($scope.hylancontrolname) !== -1) {
                data.validationMessages.push($scope.hylancontrolname + " value is required <br />");
              }
            });
          }
          if (angular.isDefined(data.form.$error.number)) {
            data.form.$error.number.forEach(function (ctrl) {
              if (ctrl.$name.indexOf($scope.hylancontrolname) !== -1) {
                data.validationMessages.push($scope.hylancontrolname + " should be number only <br />");
              }
            });
          }
          if (angular.isDefined(data.form.$error.min)) {
            data.form.$error.min.forEach(function (ctrl) {
              if (ctrl.$name.indexOf($scope.hylancontrolname) !== -1) {
                data.validationMessages.push($scope.hylancontrolname + " cannot be negative <br />");
              }
            });
          }
          if (angular.isDefined(data.form.$error.duplicateRecordCheck)) {
            data.form.$error.duplicateRecordCheck.forEach(function (ctrl) {
              if (ctrl.$name.indexOf($scope.hylancontrolname) !== -1) {
                data.validationMessages.push($scope.hylancontrolname + " is already present <br />");
              }
            });
          }
        }
      };
    }
    ];

    return {
      restrict: 'E',
      scope: {
        //hylancontrolname: '@'
      },
      controller: controller
    };
  });

}());