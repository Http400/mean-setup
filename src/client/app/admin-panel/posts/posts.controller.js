(function () {
	"use strict";
	
	angular
		.module('app.admin')
		.controller('adminPanel/postsController', postsController);

    postsController.$inject = ['$timeout', '$state', 'postService'];

	function postsController($timeout, $state, postService) {
        console.log('this is admin panel postsController');
        
        var vm = this;
        vm.posts = [];
        vm.postToBeRemoved = {};

        _getPosts();

        vm.createNewPost = function() {
            postService.createPost(vm.postTitle)
                .then(function (response) {
                    console.log(response);
                    //vm.posts.splice(0, 0, response.data);
                    angular.element('#addPostModal').modal('hide');
                    $timeout( function(){
                        $state.go('adminPanel.posts.details', { id: response.data._id });
                    }, 500 );
                }).catch(function(error) {
                    angular.element('#newPostModal').modal('hide');
                    console.log(error);
                });
        };

        vm.setPostToBeRemoved = function(project) {
            vm.postToBeRemoved = project;
        };

        vm.removePost = function() {
            postService.deletePost(vm.postToBeRemoved._id)
                .then(function(response) {
                    console.log(response);
                    _getPosts();
                }).catch(function(error) {
                    console.log(error);
                }).finally(function() {
                    angular.element('#removePostModal').modal('hide');
                });
        };

        function _getPosts() {
            postService.getPosts()
                .then(function(response) {
                    console.log(response);
                    vm.posts = response.data;
                }).catch(function(error) {
                    console.log(error);
                });
        }
	}
}());   