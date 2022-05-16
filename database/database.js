require("dotenv").config()
const mysql = require("mysql")
const connection = mysql.createPool({
    host: "us-cdbr-east-05.cleardb.net",
    user: "b9b3f1f97d34df" ,
    password: "1cdcc8b3",
    database: "heroku_a094d2c26200d38",
    multipleStatements: true
})

// connection.query(`CREATE DATABASE IF NOT EXISTS heroku_a094d2c26200d38`, (error, result) => {
//     console.log(error, "error")
//     console.log(result, "result")
// })
//
// connection.query(`CREATE TABLE Users (
//      user_id INT AUTO_INCREMENT,
//      full_name VARCHAR(40) NOT NULL,
//      username VARCHAR(40) NOT NULL,
//      email VARCHAR(255) NOT NULL,
//      password VARCHAR(255) NOT NULL,
//      avatar VARCHAR(255),
//      PRIMARY KEY (user_id) )`, (error, result) => {
//     console.log(error, result)
// })

// connection.query(`DELETE FROM Posts WHERE post_id="34"`, (E, R) => {
//     console.log(E, R)
// })

// connection.query(`CREATE TABLE IF NOT EXISTS Comments(
//     comment_id INT AUTO_INCREMENT,
//     content MEDIUMTEXT,
//     comment_author INT,
//     commented_post INT,
//     timestamps TIMESTAMP,
//     PRIMARY KEY(comment_id),
//     FOREIGN KEY (comment_author) REFERENCES Users(user_id),
//     FOREIGN KEY (commented_post) REFERENCES Posts(post_id)
// )`, (error, result) => {
//     console.log("Comments", error, result)
// })

// connection.query(`CREATE TABLE IF NOT EXISTS Posts(
//         post_id INT AUTO_INCREMENT,
//         content MEDIUMTEXT,
//         images VARCHAR(255),
//         likes VARCHAR(255),
//         comments VARCHAR(255),
//         post_author INT,
//         PRIMARY KEY(post_id),
//         FOREIGN KEY(post_author) REFERENCES Users(user_id),
//         created_at TIMESTAMP
//
// )`, (error, result) => {
//     console.log("Posts", error, result)
// })



module.exports = connection