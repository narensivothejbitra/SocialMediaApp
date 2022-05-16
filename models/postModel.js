const sql = require("../database/database")

// creates post
const createPost = async (data, callback) => {
    await sql.query(`INSERT INTO Posts SET ?`, data, (error, result) => {
        if(error) {
            callback(error, null)
            return
        }

        callback(null, result)
    })
}
// updates post
const editPost = async (id, data, callback) => {
    const {content, images} = data
    await sql.query(`UPDATE Posts SET content=?, images=? WHERE post_id=?`, [content, images, id], (error, result) => {
        if(error) {
            callback(error, null)
            return
        }
        callback(null, result)
    })
}

// deletes post
const deletePost = async (id, callback) => {
    await sql.query(`DELETE FROM Posts WHERE post_id=?`, [id], (error, result) => {
        if(error) {
            callback(error, null)
            return
        }
        callback(null, result)
    })
}

// gets all posts
const getPosts = async (callback) => {
    await sql.query(`SELECT * FROM Posts ORDER BY created_at`, (error, result) => {
        if(error) {
            callback(error, null)
            return
        }

        callback(null, result)
    })
}

// get one post by its id
const getPostsByAuthorId = async (id, callback) => {
    await sql.query(`SELECT * FROM Posts WHERE post_author="${id}"`,(error, result) => {
        if(error) {
            callback(error, null)
            return
        }
        callback(null, result)
    })
}
module.exports = {createPost, editPost, deletePost, getPosts, getPostsByAuthorId}