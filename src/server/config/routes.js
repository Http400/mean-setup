const express = require('express');

module.exports = function(app, config) {
    const posts = require('../controllers/posts')(config);
    const apiRouter = express.Router();

    apiRouter.route('/posts')
        .get(posts.getPosts)
        .post(posts.createPost);

    apiRouter.route('/posts/:id')
        .get(posts.getPostById)
        .put(posts.editPost)
        .delete(posts.removePost);

    apiRouter.route('/posts/:id/photos')
        .post(posts.multerUpload, posts.savePhotos);

    apiRouter.route('/posts/:id/photos/:index')
        .delete(posts.removePhotos);
    
    app.use('/api', apiRouter);
};