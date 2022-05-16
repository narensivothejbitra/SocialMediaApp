const express = require('express')
const Comment = require("../models/commentModel")
const auth = require("../utils/auth")
const router = express.Router()


router.post("/create", auth, async (req, res) => {
    await Comment.createCommentandUpdatePost({comment_author: req.user.user_id, ...req.body}, (error, data) => {
        if(error) return res.status(500).send({message: "error while creating comment", error})

        res.json({message: "comment created successfully"})
    })
})

router.get("/all/:id", async (req, res) => {
    const id = req.params.id
    await Comment.getAllCommentsByPostId(id, (error, result) => {
        if(error) return res.status(500).send({message: "Error while getting comment", error})
        if(result.length == 0) return res.status(404).send({message: `Comments not fouund following id: ${id}`, found: false})
        res.json({found: true, data: result})
    })
} )

router.delete("/delete/:id", async (req, res) => {
    const id = req.params.id
    await Comment.deleteComment(id, (error, result) => {
        if(error) return res.status(500).send({
            message: "Error while deleting comment",
            error
        })
        if(result.affectedRows == 0) return res.status(404).send({
            message: `Not found following id: ${id}`
        })

        res.json({
            message: "Deleted successfully"
        })

    })
})
module.exports = router