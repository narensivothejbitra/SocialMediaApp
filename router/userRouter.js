const express = require("express")
const User = require("../models/userModel")
const router = express.Router()
const bcrypt = require("bcrypt")
const auth = require("../utils/auth")
const upload = require("../utils/upload")

// signup
router.post('/signUp', async (req, res) => {
    const hiddenPassword = await bcrypt.hash(req.body.password, 10)
    req.body.password = hiddenPassword
    try {
        await User.signUp(req.body, async (createError, data) => {
            if (createError) return res.status(500).send({message: "Error occurred while creating", error: createError, ok: false})

            await res.json({ok: true, data})
        })
    } catch (e) {
        console.log(e)
    }
})

// signin
router.post("/signIn", async (req, res) => {
    await User.signIn(req.body, (signInError, data) => {
        if (signInError) return res.status(500).send({message: "Error while login", error: signInError})
        if (data.length == 0)
            return res.status(404).send({message: `User not found following email ${req.body.email}`})

        res.json(data)
    })
})

router.delete("/delete/:id", auth, async (req, res) => {
    const id = req.params.id
    await User.deleteUser(id, (error, result) => {
        if(error) return res.status(500).send({message: "Error while deleting", error})
        if(result.affectedRows == 0) return res.status(404).send({
            message: `Not found following id: ${id}`
        })
        res.json({message: "Deleted successfully"})
    })
})

//update user
router.put("/editUser", auth, upload.single("avatar"), async (req, res) => {
    const avatar = `/uploads/${req.file.filename}`
    const id = req.user.user_id
    await User.updateUser(id, {avatar: avatar, ...req.body}, (updatingErr, updatingRes) => {
        if (updatingErr) return res.status(500).send({message: `User not found following id: ${id}`, error: updatingErr})
        res.json(updatingRes)
    })
})

// get user
router.get("/getUser", auth, async (req, res) => {
    await User.getUser((gettingError, gettingResult) => {
        if (gettingError) return res.status(500).send({message: "Error while getting user", error: gettingError})

        if(gettingResult.length == 0) return res.status(404).send({message: `User not found following`, found: false})

        res.json(gettingResult)

    })
})

// search user
router.get('/searchUser', auth, async (req, res) => {
    const searchTerm = req.query.searchTerm
    await User.searchUser(searchTerm, (error, result) => {
        if(error) return res.status(500).send({message: "Error while searching user", error})
        if(result.length == 0) return res.status(404).send({message: `No match found following search: ${searchTerm}`, found: false})

        res.json(result)
    })
})

// follow
router.put('/follow/:id', auth,  async (req, res) => {
    const followingId = req.params.id,
        user_id = req.user.user_id
    await User.follow({followingId, user_id}, (error, result) => {
        if(error) return res.status(500).send({message: "Error while following user", error})

        if(result.affectedRows == 0 || result.length == 0) return res.status(404).send({
            message: "User you following not found", ok: false
        })
        res.json({message: "You followed successfully", result})
    })

})

//unfollow
router.put('/unfollow/:id', auth, async(req, res) => {
    const unfollow_id = req.params.id,
        user_id = req.user.user_id
    await User.unfollow({unfollow_id, user_id}, (error, data) => {
        if(error) return res.status(500).send({message: "Error while unfollowing user", error})
        res.json(data)
    })
})

module.exports = router;