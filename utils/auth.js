const sql = require('../database/database')

const auth = async (req, res, next) => {
    const authorization = req.headers.authorization && req.headers.authorization.replace('ID ', '')
    await sql.query(`SELECT * FROM Users WHERE user_id=?`, [authorization], (error, result) => {
        if(error) {
            return res.sendStatus(403)
        }
        if(result.length == 0) {
            return res.sendStatus(401)
        }
        req.user = result[0]
        next()
    })
}

module.exports = auth;