(function () {
	"use strict";
	
	angular
		.module('app.admin')
		.controller('adminPanel/navigationController', navigationController);

	navigationController.$inject = ['$scope'];

	function navigationController($scope) {
		console.log('this is admin panel navigationController');

	}
}());