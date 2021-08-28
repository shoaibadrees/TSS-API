'use strict';
angular
    .module('HylanApp')
    .service('HylanApp.commonValidationService', CommonValidationService);

CommonValidationService.$inject = [];

function CommonValidationService() {
  var vm = this;
  vm.ValidateDropDown = ValidateDropDown;
  vm.ValidateTextBoxes = ValidateTextBoxes;
  vm.ValidateTextBoxesLength = ValidateTextBoxesLength;
  vm.ValidateTextBoxesRequired = ValidateTextBoxesRequired;
  vm.ValidateDuplicateRecord = ValidateDuplicateRecord;
  vm.IsValidDateCheck = IsValidDateCheck;
  vm.ValidateTextBoxesBasedOnDropDown = ValidateTextBoxesBasedOnDropDown;
  vm.ValidateTextBoxesNotesOnly = ValidateTextBoxesNotesOnly;

  function ValidateDropDown(thisForm, thisModel, thisDropDown) {
    if (angular.isDefined(thisForm) && thisForm.$submitted && ( angular.isDefined(thisModel) === false || angular.isDefined(thisDropDown) === false))
      return true;
      if (angular.isDefined(thisForm) && thisForm.$submitted && ((thisModel === 0 || thisModel === null || thisModel === "" || thisModel) && thisDropDown.$error.required && (thisForm.$submitted || thisDropDown.$dirty)))
      return true;
    return false;
  }

  function ValidateTextBoxesBasedOnDropDown(thisTextBox, thisDropDown, expectedValue) {
    if ((angular.isUndefined(thisTextBox.$modelValue) || thisTextBox.$modelValue === '') && thisDropDown.$modelValue === expectedValue)
      return true;
    return false;
  }

  function ValidateTextBoxes(thisForm, thisTextBox) {
    if (thisTextBox.$invalid && (thisForm.$submitted || thisTextBox.$dirty))
      return true;
    return false;
  }

  function ValidateTextBoxesNotesOnly(thisForm, thisTextBox, value) {
      if (thisTextBox.$invalid && (thisForm.$submitted || thisTextBox.$dirty )) {
          return true;
      }
      else {
          return false;
      }
  }

  function ValidateTextBoxesLength(thisForm, thisTextBox) {
    if (thisTextBox.$error.maxlength && (thisForm.$submitted || thisTextBox.$dirty))
      return true;
    return false;
  }

  function ValidateTextBoxesRequired(thisForm, thisTextBox) {
    if (thisTextBox.$error.required && (thisForm.$submitted || thisTextBox.$dirty))
      return true;
    return false;
  }

  function ValidateDuplicateRecord(thisTextBox, duplicatedField) {
    if (angular.isDefined(duplicatedField) && duplicatedField !== '') {
      thisTextBox.$setValidity('duplicateRecordCheck', false);
    } else {
      thisTextBox.$setValidity('duplicateRecordCheck', true);
    }
  }

  function IsValidDateCheck(thisForm, thisTextBox, value) {
      if ((thisForm.$submitted || thisTextBox.$dirty)) {
          if (value == null || value == undefined || value == "") {
              thisTextBox.$setValidity('isValidDateCheck', true);
              return false;
          }
          thisTextBox.$setValidity('isValidDateCheck', isDate(value));
          return !isDate(value);
      }
      else {
          thisTextBox.$setValidity('isValidDateCheck', true);
          return !true;
      }
  }

  function isDate(value) {
      if (value == null || value == undefined || value == "")
          return false;
      if (kendo.parseDate(value) == null)
          return false;
      return true;
  }
  //function isDate(value) {
  //    if (toString.call(value) === "[object Date]") {
  //        // it is a date
  //        if (isNaN(value.getTime())) {  // d.valueOf() could also work
  //            // date is not valid
  //            return true;
  //        }
  //        else {
  //            // date is valid
  //            return false;
  //        }
  //    }
  //    else {
  //        // not a date
  //        return false;
  //    }
  //    //return toString.call(value) === '[object Date]';
  //}
}
