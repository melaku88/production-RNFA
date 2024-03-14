const express = require('express')
const requireSignin = require('../middlewares/middleware')
const { createPostController, getAllPostsController, getUserPostsController, deletePostController, updatePostController } = require('../controllers/postController')

//ROUTE OBJECT
const router = express.Router()

// ROUTES
// create post
router.post('/create-post', requireSignin, createPostController)

// get all posts
router.get('/get-all-posts', getAllPostsController)

// get user posts
router.get('/get-user-posts', requireSignin, getUserPostsController)

// delete post
router.delete('/delete-post/:pid', requireSignin, deletePostController)

// update post
router.put('/update-post/:pid', requireSignin, updatePostController)

// EXPORT
module.exports = router