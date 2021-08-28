var app = angular.module('HylanApp', ['ui.router', 'ngResource', 'ngCookies', 'kendo.directives',
                    'angularjs-dropdown-multiselect', 'Common', 'ngDialog', 'ngMessages', 'ui.bootstrap', 'ngFileUpload']);

var AuthHttpResponseInterceptor = function ($q, $location, $injector) {
    return {
        response: function (response) {
            if (response.status === 401) {
                console.log("Response 401");
            }
            return response || $q.when(response);
        },
        responseError: function (rejection) {
            if (rejection.status === 401) {
                console.log("Response Error 401", rejection);
                $injector.get('$state').go('login', { returnUrl: $location.path() });
            }
            return $q.reject(rejection);
        }
    };
};

AuthHttpResponseInterceptor.$inject = ['$q', '$location', '$injector'];
angular.module('HylanApp').factory('AuthHttpResponseInterceptor', AuthHttpResponseInterceptor);





