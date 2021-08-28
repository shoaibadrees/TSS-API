//http://jsfiddle.net/SAWsA/804/
//http://jsfiddle.net/dubilla/dj6mX/798/
angular.module('HylanApp').directive('formatAmountInput', ['$filter', function ($filter) {
    return {
        require: '?ngModel',
        link: function (scope, elem, attrs, ctrl) {
            if (!ctrl) return;

            var symbol = "$"; // dummy usage

            ctrl.$formatters.unshift(function (a) {
                return symbol + $filter("number")(ctrl.$modelValue);
            });

            ctrl.$parsers.unshift(function (inputValue) {

                
                var inputVal = elem.val();

                //clearing left side zeros
                while (inputVal.charAt(0) == '0') {
                    inputVal = inputVal.substr(1);
                }

                inputVal = inputVal.replace(/[^\d.\',']/g, '');

                var point = inputVal.indexOf(".");
                if (point >= 0) {
                    inputVal = inputVal.slice(0, point + 3);
                }

                var decimalSplit = inputVal.split(".");
                var intPart = decimalSplit[0];
                var decPart = decimalSplit[1];

                intPart = intPart.replace(/[^\d]/g, '');

                intPart = $filter('number')(intPart)

                if (decPart === undefined) {
                    decPart = "";
                }
                else {
                    decPart = "." + decPart;
                }
                var res = intPart + decPart;

                //if (res != inputValue) {
                //    ctrl.$setViewValue(res);
                //    ctrl.$render();
                //}

               
                /////////////
                //var plainNumber = inputValue.replace(/[^\d|\-+|+]/g, '');
                elem.val(symbol + res);
                return res;
            });
        }
    };
}]);