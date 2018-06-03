(function () {
	"use strict";
	
	angular
		.module('app')
		.controller('aboutController', aboutController);

	aboutController.$inject = [];

	function aboutController() {
		var vm = this;
		console.log('this is aboutController');

		initController();
 
        function initController() {
        }
	}

}());