(function() {
'use strict';

    angular
        .module('app', [
            'ui.router',
            'app.main',
            'app.admin',
            'app.common'
        ]);
})();