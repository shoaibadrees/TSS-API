(function () {
  angular.module('HylanApp').directive('hylanControlValidation', function () {
    var controller = ['$scope', function ($scope) {

      $scope.validateControls = function (data) {
        if (angular.isDefined(data.form.$error)) {
          if (angular.isDefined(data.form.$error.maxlength)) {
            data.form.$error.maxlength.forEach(function (ctrl) {
              if (ctrl.$name.indexOf($scope.hylancontrolname) !== -1) {
                  data.validationMessages.push($scope.hylancontrollabel + " value too long. <br />");
              }
            });
          }
          if (angular.isDefined(data.form.$error.minlength)) {
            data.form.$error.minlength.forEach(function (ctrl) {
              if (ctrl.$name.indexOf($scope.hylancontrolname) !== -1) {
                  data.validationMessages.push($scope.hylancontrollabel + " value too short. <br />");
              }
            });
          }
          if (angular.isDefined(data.form.$error.required)) {
            data.form.$error.required.forEach(function (ctrl) {
                if (ctrl.$name.indexOf($scope.hylancontrolname) !== -1) {
                    if (ctrl.$name.indexOf("ddl") != -1) {
                        data.validationMessages.push("Please select " + $scope.hylancontrollabel + ".<br />");
                    }
                    else {
                        data.validationMessages.push("Please enter " + $scope.hylancontrollabel + ".<br />");
                    }
              }
            });
          }
          if (angular.isDefined(data.form.$error.number)) {
            data.form.$error.number.forEach(function (ctrl) {
              if (ctrl.$name.indexOf($scope.hylancontrolname) !== -1) {
                  data.validationMessages.push($scope.hylancontrollabel + " should be number only.<br />");
              }
            });
          }
          if (angular.isDefined(data.form.$error.min)) {
            data.form.$error.min.forEach(function (ctrl) {
              if (ctrl.$name.indexOf($scope.hylancontrolname) !== -1) {
                  data.validationMessages.push($scope.hylancontrollabel + " cannot be negative. <br />");
              }
            });
          }
          if (angular.isDefined(data.form.$error.duplicateRecordCheck)) {
            data.form.$error.duplicateRecordCheck.forEach(function (ctrl) {
              if (ctrl.$name.indexOf($scope.hylancontrolname) !== -1) {
                  data.validationMessages.push($scope.hylancontrollabel + " already exists. <br />");
              }
            });
          }
          if (angular.isDefined(data.form.$error.isValidDateCheck)) {
              data.form.$error.isValidDateCheck.forEach(function (ctrl) {
                  if (ctrl.$name.indexOf($scope.hylancontrolname) !== -1) {
                      data.validationMessages.push($scope.hylancontrollabel + ": " + Globals.InvalidDateMessage + "<br />");
                  }
              });
          }
          if (angular.isDefined(data.form.$error.pattern)) {
              data.form.$error.pattern.forEach(function (ctrl) {
                  if (ctrl.$name.indexOf($scope.hylancontrolname) !== -1) {
                      data.validationMessages.push($scope.hylancontrollabel + " value is incorrect. <br />");
                  }
              });
          }
            

        }
      };
      $scope.$on('saveClicked', function (event, data) {
        $scope.validateControls(data);
      });
    }
    ];

    return {
      restrict: 'A',
      scope: {
          hylancontrolname: '@',
          hylancontrollabel: '@'
      },
      controller: controller
    };
  });

}());