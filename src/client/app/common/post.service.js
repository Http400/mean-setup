(function () {
    'use strict';
 
    angular
        .module('app.common')
        .service('postService', postService);

    postService.$inject = ['$http'];
       
    function postService($http) {
        return {
            getPosts: _getPosts,
            getPostById: _getPostById,
            createPost: _createPost,
            uploadPhotos: _uploadPhotos,
            removePhoto: _removePhoto,
            deletePost: _deletePost,
            editPost: _editPost,
            
        }
     
        function _getPosts() {
            return $http.get('/api/posts');
        }

        function _getPostById(id) {
            return $http.get('/api/posts/' + id);
        }

        function _createPost(title) {
            return $http.post('/api/posts', { title: title });
        }

        function _uploadPhotos(postId, formData) {
            return $http.post('/api/posts/' + postId + '/photos', formData, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            });
        }

        function _removePhoto(postId, imageIndex) {
            return $http.delete('/api/posts/' + postId + '/photos/' + imageIndex);
        }

        function _editPost(post) {
            return $http.put('/api/posts/' + post._id, post);
        }

        function _deletePost(id) {
            return $http.delete('/api/posts/' + id);
        }
    }
})();