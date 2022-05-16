const path = require("path")
const multer = require('multer')
const express = require("express");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads/")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }

})
const upload = multer({
    dest: 'public/uploads/',
    storage: storage
})

module.exports = upload