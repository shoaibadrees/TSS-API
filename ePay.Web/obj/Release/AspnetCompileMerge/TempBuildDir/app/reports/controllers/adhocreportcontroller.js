angular.module('HylanApp').controller("AdHocReportController", ['$rootScope', '$scope', '$controller', '$timeout', 'AdHocReportsService', 'Utility', 'NOTIFYTYPE',
    function ($rootScope, $scope, $controller, $timeout, AdHocReportsService, Utility, NOTIFYTYPE) {
        $scope.ApiResource = "AdhocReport";
        $controller('BaseController', { $scope: $scope });
        //Hide PDF & Print
        $('.GlobalButtons li:nth-child(2)').hide();
        $('.GlobalButtons li:nth-child(3)').hide();
        //Pass txtQuery to ChildGridLoaded event to get angular scope later
        var txtQuery = $('#BodyContent #txtQuery').get(0);
        txtQuery.$angular_scope = $scope;
        $scope.$emit("ChildGridLoaded", txtQuery);

        $scope.successFunction = function () {
            var result = $('#ifrmAdhocReport').contents().find('body').html();
            var txtQuery = document.getElementById("txtQuery");
            if (result.indexOf("_ERROR_") > -1) {
                result = result.replace("_ERROR_", "");
                Utility.Notify({ type: NOTIFYTYPE.ERROR, message: result, IsPopUp: false });
            }
            else {
                txtQuery.innerHTML = result;
            }
        };

        $scope.onFileSelected = function (event) {
            var txtQuery = document.getElementById("txtQuery");
            txtQuery.innerHTML = "";
            Utility.HideNotification();
            if (window.FileReader) {
                var selectedFile = event.target.files[0];
                var fileExtension = selectedFile.name.split('.').pop();
                if (fileExtension == "txt" || fileExtension == "sql") {
                    var reader = new FileReader();
                    reader.onload = function (event) {
                        txtQuery.innerHTML = event.target.result;
                    };
                    reader.readAsText(selectedFile);
                }
                else {
                    Utility.Notify({ type: NOTIFYTYPE.ERROR, message: "Invalid File Type: Only '.txt' and '.sql' file types are allowed.", IsPopUp: false });
                }
            }
            else {
                document.getElementById('frmAdhocReport').target = 'ifrmAdhocReport';
                var callback = function () {
                    if ($scope.successFunction)
                        $scope.successFunction();
                    $('#ifrmAdhocReports').unbind('load', callback);
                };

                $('#ifrmAdhocReport').bind('load', callback);
                $('#hfParam').val('id:1');

                $('#frmAdhocReport').attr("action", '/GetFileText');
                $('#frmAdhocReport').submit();
            }
        }
    }
]);