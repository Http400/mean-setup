(function () {
	"use strict";
	
	angular
		.module('app')
		.controller('postController', postController);

    postController.$inject = ['$stateParams', 'postService'];

	function postController($stateParams, postService) {
        console.log('this is postController');
        var vm = this;
        vm.post = {};
        var postId = $stateParams.id;
        
        initController();

        function initController() {
            postService.getPostById(postId)
                .then(function (response) {
                    vm.post = response.data;
                    console.log(vm.post);
                }).catch(function (error) {
                    console.log(error);
                });
        }
	}

}());