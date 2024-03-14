const PostModel = require("../models/postModel");

const createPostController = async(req, res)=>{
  try {
    const {title, description} = req.body
    // Validatoiion
    switch(true){
      case !title:
        return res.send({success: false, message: 'Title is required please fill it'});
      case !description:
        return res.send({success: false, message: 'Description of the post is required'});
    }
    // Creating
    const post  = await new PostModel({
      title, 
      description,
      postedBy: req.auth._id
    }).save()
    return res.send({
      success: true,
      message: 'Post created successfully!',
      post
    })
  } catch (error) {
    console.log(error)
    return res.send({
      success: false,
      message: 'Error while creating a post'
    })
  }
}

// GET ALL POSTS CONTROLLER
const getAllPostsController = async(req, res)=>{
  try {
    const posts = await PostModel.find({}).populate('postedBy', '_id username').sort({createdAt: -1})
    return res.send({
      success: true,
      posts
    })
  } catch (error) {
    console.log(error)
    return res.send({
      success: false,
      message: 'Error while fetching all posts'
    })
  }
}

// Get user posts
const getUserPostsController = async(req, res)=>{
  try {
    const posts = await PostModel.find({postedBy: req.auth._id}).populate('postedBy', '_id username').sort({createdAt: -1})
    return res.send({
      success: true,
      posts
    })
  } catch (error) {
    console.log(error)
    return res.send({
      success: false,
      message: 'Error while fetching user posts'
    })
  }
}

// Delete Post
const deletePostController = async(req, res)=>{
  try {
    await PostModel.findByIdAndDelete(req.params.pid)
    return res.send({
      success: true,
      message: 'Post deleted successfully'
    })
  } catch (error) {
    console.log(error)
    return res.send({
      success: false,
      message: 'Error while deleting user post'
    })
  }
}

// UPDATE POST
const updatePostController = async(req, res)=>{
  try {
    const {title, description } = req.body
    const post = await PostModel.findById(req.params.pid)
    const updatedPost = await PostModel.findByIdAndUpdate(req.params.pid, {
      title: title ? title : post?.title,
      description: description ? description : post?.description,
    }, {new: true})
    return res.send({success: true, message: 'Post updated successfully', updatedPost})
  } catch (error) {
    console.log(error)
    return res.send({
      success: false,
      message: 'Error while updating user post'
    })
  }
}

// EXPORT
module.exports = { createPostController, getAllPostsController, getUserPostsController, deletePostController, updatePostController }