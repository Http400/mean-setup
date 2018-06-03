(function () {
	"use strict";
	
	angular
		.module('app.admin')
		.controller('adminPanel/postDetailsController', postDetailsController);

    postDetailsController.$inject = ['$timeout', '$state', '$stateParams', 'postService'];

	function postDetailsController($timeout, $state, $stateParams, postService) {
        console.log('this is admin panel postDetailsController');
        
        var vm = this;
        vm.post = {};
        vm.newPhotos = [];
        vm.photoToRemove = null;
        var postId = $stateParams.id;

        initController();

        function initController() {
            postService.getPostById(postId)
                .then(function (response) {
                    vm.post = response.data;
                    console.log(response);
                }).catch(function (error) {
                    console.log(error);
                });
        }

        vm.saveChanges = function() {
            postService.editPost(vm.post)
                .then(function (response) {
                    vm.post = response.data;
                    console.log(response);
                }).catch(function (error) {
                    console.log(error);
                });
        };

        vm.savePhotos = function() {
            var formData = new FormData();

            for (var i = 0; i < vm.newPhotos.length; i++) {
                formData.append('photo', vm.newPhotos[i]);  
            }

            postService.uploadPhotos(postId, formData)
                .then(function (response) {
                    console.log(response);
                    vm.post.photos = response.data;
                    vm.newPhotos = [];
                }).catch(function(error) {
                    console.log(error);
                });
        };

        vm.setPhotoToRemove = function(image, index) {
            vm.photoToRemove = index;
        };

        vm.removePhoto = function() {
            postService.removePhoto(postId, vm.photoToRemove)
                .then(function (response) {
                    angular.element('#removePhotoModal').modal('hide');              
                    $timeout( function(){
                        $state.reload();
                    }, 500 );
                }).catch(function(error) {
                    angular.element('#removePhotoModal').modal('hide');
                    console.log(error);
                });
        };
	}
}());   