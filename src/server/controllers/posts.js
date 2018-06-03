const path = require('path');
const fs = require('fs');
const multer = require('multer');
const Post = require('mongoose').model('Post');

module.exports = function (config) {
    const CLIENT_DIR = config.client;
    const PHOTOS_FOLDER = config.photosFolder;
    const upload = multer({ dest: CLIENT_DIR + PHOTOS_FOLDER });

    let module = {};

    module.getPosts = function(req, res) {
        Post.find({}).select('-__v').exec()
            .then(function(result) {
                res.send(result);
            }).catch(function(error) {
                res.status(500).send(error);
            });
    };
    
    module.getPostById = function(req, res) {
        Post.findById(req.params.id).select('-__v').exec()
            .then(function(post) {
                if (!post)
                    return res.status(404).send('Post not found');
    
                res.send(post);
            }).catch(function(error) {
                res.status(500).send(error);
            });
    };

    module.removePost = function(req, res) {
        Post.findById(req.params.id).exec()
            .then(function(post) {
                if (!post)
                    return res.status(404).send('Post not found');
    
                let promises = post.photos.map( (photo) => removeFile(CLIENT_DIR + photo) );

                return Promise.all(promises)
                    .then( post.remove() );
                
            }).then(function(result) {
                res.status(200).send('Removed');
            }).catch(function(error) {
                res.status(500).send(error);
            });
    };
    
    module.editPost = function(req, res) {
        Post.findById(req.params.id).exec()
            .then(function(post) {
                if (!post)
                    return res.status(404).send('Post not found');
    
                if (req.body._id) delete req.body._id;
                if (req.body.__v) delete req.body.__v;
                if (req.body.photos) delete req.body.photos;
    
                for (let property in req.body) {
                    post[property] = req.body[property];
                }  
    
                return post.save();
            }).then(function(result) {
                res.send(result);
            }).catch(function(error) {
                res.status(500).send(error);
            });
    };

    module.createPost = function(req, res) {

        if (!req.body.title) {
            res.status(400);
            return res.send('Title is required');		
        }
    
        let post = new Post({ title: req.body.title });
        post.save()
            .then(function(result) {
                res.status(201).send(result);
            }).catch(function(error) {
                res.status(500).send(error);
            });
    };

    module.multerUpload = upload.any();

    module.savePhotos = function(req, res, next) {
        const fs = require('fs');

        if (req.files.length > 0) {    
            let promises = req.files.map( (file) => {
                return new Promise( (resolve, reject) => {
                    let rename = CLIENT_DIR + PHOTOS_FOLDER + file.originalname; // TODO: make filename unique
                    fs.rename(file.path, rename, function(error) {
                        if (error) 
                            reject(error);
                        
                        resolve(PHOTOS_FOLDER + file.originalname);
                    });
                })
            });
            Promise.all(promises)
                .then(function (newPhotos) {
                    Post.findById(req.params.id).exec()
                        .then(function (post) {
                            if (!post)
                               return res.status(404).send('Post not found');

                            for(let photo of newPhotos)
                                post.photos.push(photo);

                            return post.save();
                        }).then(function (result) {
                            res.send(result.photos);
                        });
                }).catch(function(error) {
                    console.log('error');
                    console.log(error);
                    res.status(400).send(error);
                });
        } else {
            res.status(400);
            res.send('No photos sent.');
        }
    };

    module.removePhotos = function(req, res, next) {
        let index = req.params.index;

        Post.findById(req.params.id).exec()
            .then(function (post) {
                if (!post)
                    return res.status(404).send('Post not found');

                return removeFile(CLIENT_DIR + post.photos[index])
                    .then(function() {
                        post.photos.splice(index, 1);
                        return post.save();
                    });
                
            }).then(function (result) {
                res.send(result.photos);
            }).catch(function(error) {
                console.log('error');
                console.log(error);
                res.status(400).send(error);
            });
    };

    return module;
};

function removeFile(filePath) {
    return new Promise( (resolve, reject) => {
        fs.unlink(filePath, (err) => {
            if (err) 
                return reject(err);

            console.log(filePath + ' was deleted.');
            return resolve('File removed.');
        });
    });
}