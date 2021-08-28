var _RolesDS;
var _CompaniesDS;
//var _RMAGDS;

angular.module('HylanApp').controller("UserProfileController", ['$rootScope', '$scope', '$controller', '$timeout', 'UserProfileService', 'Utility', 'NOTIFYTYPE', 'NotificationService', 'HylanApp.commonValidationService',
    function ($rootScope, $scope, $controller, $timeout, UserProfileService, Utility, NOTIFYTYPE, NotificationService, commonValidationService) {
      init();
      function init() {
        $scope.form = {};
        $scope.validationMessages = [];
      }
      $scope.commonValidationService = commonValidationService;
      var isProfileChanged = false;
      $controller('BaseController', { $scope: $scope });

      $scope.ResetPswd = { oldPassword: "", newPassword: "", newPasswordReType: "" };

      $scope.getUserProfile = function () {
        if ($scope.ngDialogData) {
          UserProfileService.GetUserProfile($scope.ngDialogData.USER_ID).then(function (result) {
            $scope.userProfile = result.objResult;
            $timeout(function () {
              $scope.userProfile = $scope.userProfile;
              isProfileChanged = false;
            });

            if ($scope.userProfile.SECURITY_QUESTION == null)
              $scope.userProfile.SECURITY_QUESTION = "";
          }).fail(onError);
        }
      };
      $scope.changeUserProfile = function (element) {
        Utility.HideNotification();
        isChildDataChanged = true;
        if (element && element != '') {
          if (element == 'OFFICE_PHONE') {
            if (/iPad/.test(Globals.UserAgent) || (/Android/.test(Globals.UserAgent))) {
              $('<input id="officePhone" type="text" value="' + $scope.userProfile.OFFICE_PHONE + '" />');
              VMasker(document.getElementById("officePhone")).maskPattern('(999) 999-9999');
            }
            else {                
              $("#officePhone").kendoMaskedTextBox({
                mask: "(999) 000-0000",
                value: $scope.userProfile.OFFICE_PHONE
              });
              $("#officePhone").css("width", "100%");
            }
          }

          if (element == 'MOBILE_PHONE') {
            if (/iPad/.test(Globals.UserAgent) || (/Android/.test(Globals.UserAgent))) {
              $('<input id="mobPhone" type="text" value="' + $scope.userProfile.MOBILE_PHONE + '" />');
              VMasker(document.getElementById("mobPhone")).maskPattern('(999) 999-9999');
            }
            else {
              $("#mobPhone").kendoMaskedTextBox({
                mask: "(999) 000-0000",
                value: $scope.userProfile.MOBILE_PHONE
              });
              $("#mobPhone").css("width", "100%");
            }
          }

          Globals.MaskedEditorKeyHandler();
        }
      };

      Globals.GetUserRoles(false).then(function (result) {
        _RolesDS = result.objResultList;
        var ddlRoles = $("#ddlRoles");
        angular.forEach(_RolesDS, function () {
          ddlRoles.append($("<option />").val(this.ROLE_NAME).text(this.ROLE_NAME));
        });
      }).fail(onError);

      Globals.GetCompanies(false).then(function (result) {
        $scope.companyOptions = result.objResultList;
        $scope.companySettings = {
          externalIdProp: '',
          idProp: 'COMPANY_ID',
          displayProp: 'COMPANY_NAME',
          enableSearch: true,
          scrollable: true,
          showCheckAll: false,
          showUncheckAll: false,
          smartButtonMaxItems: 5
        };



        $scope.companyEvents = {
          onItemSelect: function (item) {
            if ($.inArray(item.COMPANY_ID, $scope.userProfile.USER_COMPANIES) <= -1) {
              $scope.userProfile.USER_COMPANIES.push(item.COMPANY_ID);
            }
            setTooltipOnMultiSelect('divMultiSelCompany', $scope.companyOptions, $scope.objUserCompanies);
          },
          onItemDeselect: function (item) {
            $scope.userProfile.USER_COMPANIES = _.without($scope.userProfile.USER_COMPANIES, item.COMPANY_ID);
            setTooltipOnMultiSelect('divMultiSelCompany', $scope.companyOptions, $scope.objUserCompanies);
          }
        };

        $scope.objUserCompanies = [];

      }).fail(onError);

      $scope.getUserProfile();


      $scope.updateUserProfile = function (thisForm) {
        $scope.validationMessages = [];
        $scope.$broadcast('saveClicked', { form: thisForm, validationMessages: $scope.validationMessages });
        if (thisForm.$valid) {
          if (isChildDataChanged) {
            isChildDataChanged = false;
            var validator = $("#frmUserProfile").kendoValidator().data("kendoValidator");
            if (validator.validate() && $scope.userProfile.SECURITY_QUESTION != '-1' && $scope.userProfile.ANSWER && $scope.userProfile.ANSWER != '') {
              var isInvalid = Globals.validateEmail($scope.userProfile.EMAIL_ADDRESS);
              if (!isInvalid) {
                Utility.Notify({ type: NOTIFYTYPE.ERROR, message: "Please enter valid Email Address.", IsPopUp: true });
                return;
              }
              if ($scope.ResetPswd.newPassword != $scope.ResetPswd.newPasswordReType) {
                Utility.Notify({ type: NOTIFYTYPE.ERROR, message: "New passwords must match.", IsPopUp: true });
                return;
              }
              else if (AppSettings.EnablePasswordComplexity && !Globals.ValidatePassword($scope.ResetPswd.newPassword)) {
                Utility.Notify({ type: NOTIFYTYPE.ERROR, message: "Password must contain at least one capital letter, at least one digit and no spaces.", IsPopUp: true });
                return;
              }
              else {
                $scope.userProfile.NEW_PSWD = $scope.ResetPswd.newPassword;
              }
              UserProfileService.UpdateUserProfile(JSON.stringify($scope.userProfile)).then(function (result) {
                onSuccess(result);
                NotificationService.transmit('User Profile');
                isProfileChanged = false;
                $scope.ResetPswd.oldPassword =
                    $scope.ResetPswd.newPasswordReType =
                    $scope.ResetPswd.newPassword = "";

                //$timeout(function () { });
                $scope.getUserProfile();
              }).fail(onError);
            }
            else {
              Utility.Notify({ type: NOTIFYTYPE.ERROR, message: "Please provide mandatory fields.", IsPopUp: true });
            }
          }
          else {
            alert(Globals.NoChanges);
          }
        } else {
          Utility.Notify({ type: NOTIFYTYPE.ERROR, message: $scope.validationMessages, IsPopUp: true });
        }
      };

      function onSuccess(result) {
        Utility.Notify({ type: NOTIFYTYPE.SUCCESS, message: "Changes Saved.", IsPopUp: $scope.ngDialogData });

      }

      function onError(XMLHttpRequest, textStatus, errorThrown) {
        var exception = XMLHttpRequest.responseText ? XMLHttpRequest.responseText : errorThrown;
        Utility.Notify({ type: NOTIFYTYPE.ERROR, message: exception, IsPopUp: $scope.ngDialogData });
      }
    }
]);