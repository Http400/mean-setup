(function () {
	"use strict";
	
	angular
		.module('app.admin')
		.controller('adminPanel/mainController', mainController);

    mainController.$inject = [];

	function mainController() {
		var vm = this;
		console.log('this is admin panel mainController');

		initController();
 
        function initController() {
        }
	}

}());