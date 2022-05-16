const express = require("express")
const Posts = require("../models/postModel")
const auth = require('../utils/auth')
const router = express.Router()
const upload = require("../utils/upload")

// post => creates new post
router.post('/createPost', auth, upload.single("images"), async (req, res) => {
    const uploadedImg = `/uploads/${req.file.filename}`
    await Posts.createPost({images: uploadedImg, post_author: req.user.user_id, ...req.body}, (error, data) => {
        if(error) return res.status(500).send({
            message: "Error while creating post",
            error
        })
        res.json({
            message: "Post created successfully"
        })
    })
} )

// put => updates existed post by id
router.put("/updatePost/:id", auth, async (req, res) => {
    const id = req.params.id;
    await Posts.editPost(id, req.body, (error, data) => {
        if(error) return res.status(500).send({
            message: "Error while updating",
            error
        })
        if(data.affectedRows == 0) return res.status(404).send({
            message: `Post not found following id: ${id}`,
            found: false
        })
        res.json({
            message: "Post updates successfully",
            found: true
        })
    })
})

// delete => deletes an existed post by id
router.delete("/delete/:id", auth, async (req, res) => {
    const id = req.params.id;
    await Posts.deletePost(id, (error, result) => {
        if(error) return res.status(500).send({
            message: "Error while deleting user"
        })
        if(result.affectedRows == 0) return res.status(404).send({
            message: `Post not found following id: ${id}`,
            found: false
        })

        res.json({
            message: "Deleted successfully",
            deleted: true
        })
    })
})

// get => gets all posts
router.get("/all", async (req, res) => {
    await Posts.getPosts((error, data) => {
        if(error) return res.status(500).send({
            message: "Error while getting posts"
        })
        res.json(data)
    })
})

// get => gets one post by id
router.get("/published", auth, async (req, res) => {
    const post_author_id = req.user.user_id;
    await Posts.getPostsByAuthorId(post_author_id, (error, data) => {
        console.log(error)
        if(error) return res.status(500).send({
            message: "Error while getting post"
        })
        if(data.length == 0) return res.status(400).send({
            message: `Not found following id: ${post_author_id}`
        })
        res.json(data)
    })
})

module.exports = router;