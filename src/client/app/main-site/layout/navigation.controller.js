(function () {
	"use strict";
	
	angular
		.module('app')
		.controller('navigationController', navigationController);

	navigationController.$inject = [];

	function navigationController() {
        console.log('this is navigationController');
        var vm = this;

	}
}());