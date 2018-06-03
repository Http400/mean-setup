(function () {
	"use strict";
	
	angular
		.module('app')
		.controller('homeController', homeController);

    homeController.$inject = ['postService'];

	function homeController(postService) {
        console.log('this is homeController');
        var vm = this;
        vm.posts = [];

        getPosts();

        function getPosts() {
            postService.getPosts()
                .then(function (response) {
                    console.log(response);
                    vm.posts = response.data;
                }).catch(function (error) {
                    console.log(error);
                });
        }
	}

}());