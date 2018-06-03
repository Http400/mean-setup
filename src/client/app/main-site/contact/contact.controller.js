(function () {
	"use strict";
	
	angular
		.module('app')
		.controller('contactController', contactController);

        contactController.$inject = [];

	function contactController() {
		var vm = this;
		console.log('this is contactController');
		initController();
 
        function initController() {

        }

	}

}());