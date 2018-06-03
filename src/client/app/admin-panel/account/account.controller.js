(function () {
	"use strict";
	
	angular
		.module('app.admin')
		.controller('adminPanel/accountController', accountController);

        accountController.$inject = [];

	function accountController() {
		var vm = this;
		console.log('this is accountController');

		initController();
 
        function initController() {
        }
	}

}());