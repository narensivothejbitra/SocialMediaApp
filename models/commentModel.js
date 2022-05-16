const sql = require("../database/database")

const createCommentandUpdatePost = async (data, callback) => {
    await sql.query(`INSERT INTO Comments SET content=?, comment_author=?, commented_post=?; SELECT LAST_INSERT_ID(); SELECT comments FROM Posts WHERE post_id=?`, [data.content, data.comment_author, data.post_id, data.post_id], async (creatingError, creatingResult) => {
        if(creatingError) {
            callback(creatingError, null)
            return
        }

        const commentsData = JSON.parse(creatingResult[2][0].comments)

        const comments = commentsData ? [...commentsData] : []

        comments.push(creatingResult[1][0]['LAST_INSERT_ID()'])

        await sql.query(`UPDATE Posts SET comments=? WHERE post_id=?`, [JSON.stringify(comments), data.post_id], (error, result) => {
            if(error) {
                callback(error, null)
                return
            }

            callback(null, result)
        } )
    })
}

const getAllCommentsByPostId = async (id, callback) => {
    await sql.query(`SELECT * FROM Comments WHERE commented_post=? ORDER BY Comments.timestamps DESC`, [id],(error, result) => {
        if(error) {
            callback(error, null)
            return
        }

        callback(null, result)
    })
}

const deleteComment = async (id, callback) => {
    await sql.query(`DELETE FROM Comments WHERE comment_id=?`, [id], async (deletingErr, deletingRes) => {
        if(deletingErr){
            callback(deletingErr, null)
            return
        }
        callback(null, deletingRes)
    })
}


module.exports = {
    createCommentandUpdatePost,
    getAllCommentsByPostId,
    deleteComment
}