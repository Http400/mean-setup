(function () {
    'use strict';

    angular
        .module('app.common')
        .directive('fileUpload', fileUpload);

    fileUpload.$inject = [];

    function fileUpload() {
        var directive = {
            link: link,
            scope: {
                fileUpload: "="
            },
            restrict: 'A'
        };
        return directive;

        function link (scope, el, attrs) {
            console.log("file dir");
            el.bind("change", function (changeEvent) {
                scope.$apply(function () {
                    console.log( changeEvent.target.files );
                    //scope.fileread.push(changeEvent.target.files[0]);
                    
                    scope.fileUpload = changeEvent.target.files;
                });
            });
        }
    }
})();