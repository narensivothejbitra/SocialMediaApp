const sql = require('../database/database')
const bcrypt = require("bcrypt")

const signUp = async (data, callback) => {
    await existedUser({username: data.username, email: data.email}, async (usernameError, usernameResult) => {
        if (usernameError) {
            callback(usernameError, null)
            return
        }
        if (usernameResult[1].length > 0) {
            callback("Username is taken", null)
            return
        }

        if (usernameResult[0].length > 0) {
            callback("Email already registered, try another one", null)
            return
        }

        await sql.query(`INSERT INTO Users SET ?; SELECT * FROM Users WHERE user_id = LAST_INSERT_ID()`, data, async (error, result) => {
            if (error) {
                callback(error, null)
                return
            }
            callback(null, result[1][0])
        })
    })


}

//sign in
const signIn = async (data, callback) => {
    const {email, password} = data
    await sql.query(`SELECT * FROM Users WHERE email="${email}" LIMIT 1`, async (error, result) => {
        if (error) {
            callback(error, null)
            return
        }
        if(result.length == 0) {
            callback(`User not found following email: ${email}`)
            return
        }
        const isPasswordMatched = await bcrypt.compare(password, result[0].password)
        if (!isPasswordMatched) {
            callback("Password is incorrect", null)
            return
        }
        callback(null, result)
    })
}

// check user was already created or not
const existedUser = async (data, callback) => {
    await sql.query(`SELECT * FROM Users WHERE email = "${data.email}" LIMIT 1;SELECT * FROM Users WHERE username="${data.username} " LIMIT 1`, (error, result) => {
        if (error) {
            callback(error, null)
            return error
        }
        callback(null, result)
        return result
    })
}

// search functionality
const searchUser = async (searchTerm, callback) => {
    await sql.query(`SELECT * FROM Users WHERE username or full_name LIKE "%${searchTerm}%"`, (error, result) => {
        if (error) {
            callback(error, null)
            return
        }
        callback(null, result)
    })
}

// getuser
const getUser = async (callback) => {
    await sql.query(`SELECT * FROM Users ORDER BY Users.created_at DESC LIMIT 5`, (error, result) => {
        if (error) {
            callback(error, null)
            return;
        }

        callback(null, result)
    })
}

// update user
const updateUser = async (id, data, callback) => {
    await sql.query(`UPDATE Users SET full_name=?, avatar=? WHERE user_id = ?`, [data.full_name, data.avatar, id], async (error, result) => {
        if (error) {
            callback(error, null)
            return
        }

        if (result.affectedRows == 0) {
            callback({found: false, message: `User not found following id: ${id}`}, null)
            return
        }

        await sql.query(`SELECT * FROM Users WHERE user_id=?`, [id], (
            error, result
        ) => {
            if(error){
                callback(error, null)
                return
            }
            callback(null, result[0])
        })
    })
}


// follow functionality
const follow = async (data, callback) => {
    const {followingId, user_id} = data;

    await sql.query(`SELECT * FROM Users WHERE user_id = "${followingId}" and followers LIKE "%${user_id}%"; SELECT followers FROM Users WHERE user_id="${followingId}"; SELECT following FROM Users WHERE user_id="${user_id}"`, async (error, result) => {
        if (error) {
            callback(error, null)
            return
        }

        if (result[0].length > 0) {
            callback({message: "You followed this user", ok: false}, null)
            return
        }
        const followersData = JSON.parse(result[1][0].followers) || [],
            followingsData = JSON.parse(result[2][0].following) || []


        const followers = [...followersData]
        const following = [...followingsData]
        followers.push(user_id)
        following.push(followingId)

        await sql.query(`UPDATE Users SET followers = ? WHERE user_id=?`, [JSON.stringify(followers), followingId], async (updatingError, updatingResult) => {
            if (updatingError) {
                callback(updatingError, null)
                return
            }

            await sql.query(`UPDATE Users SET following=? WHERE user_id=?`, [JSON.stringify(following), user_id], (followingError, followingResult) => {
                if (followingError) {
                    callback(followingError, null)
                    return
                }

                callback(null, followingResult)
            })
        })


    })
}

//unfollow
const unfollow = async (data, callback) => {
    const {unfollow_id, user_id} = data;
    let followers = []
    let following = []
    await sql.query(`SELECT followers FROM Users WHERE user_id = ?`, [unfollow_id], async (err, res) => {
        if (err) {
            callback(err, null)
            return
        }

        if (res.length == 0) {
            callback({message: `User not found following user_id : ${unfollow_id}`, found: false})
            return
        }
        if (!res[0].followers) {
            callback({message: "User does not any follower"}, null)
            return
        }

        followers = JSON.parse(res[0].followers)

        await sql.query(`SELECT following FROM Users WHERE user_id=?`, [user_id], async (error, result) => {
            if (error) {
                callback(error, null)
                return
            }
            if (result.length == 0) {
                callback({message: `User not found following id: ${user_id}`, found: false}, null)
                return
            }

            if (!result[0].following) {
                callback({message: "User didnt follow this user"})
                return
            }


            following = JSON.parse(result[0].following)

            followers && followers.pop()
            following && following.pop()

            await sql.query(`UPDATE Users SET followers="${JSON.stringify(followers)}" WHERE user_id = "${unfollow_id}"; UPDATE Users SET following="${JSON.stringify(followers)}" WHERE user_id = "${user_id}"`, (updatingError, updatingResult) => {
                if (updatingError) {
                    callback(updatingError, null)
                    return
                }

                if (updatingResult[0].affectedRows == 0) {
                    callback({message: `User not found following user_id: ${unfollow_id}`, found: false})
                    return
                }

                if (updatingResult[1].affectedRows == 0) {
                    callback({message: `User not found following user_id: ${user_id}`, found: false})
                    return
                }

                callback(null, {message: "You unfollowed successfully"})
            })

        })
    })
}

const deleteUser = async (id, callback) => {
    await sql.query(`DELETE FROM Users WHERE user_id=?`, [id], (error, result) => {
        if(error) {
            callback(error, null)
            return
        }
        callback(null, result)
    })
}


module.exports = {signUp, signIn, searchUser, follow, unfollow, updateUser, getUser, deleteUser}