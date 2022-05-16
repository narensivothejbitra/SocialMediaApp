const express = require("express")
const app = express()
const auth = require("./utils/auth")
const path = require("path")
const PORT = process.env.PORT || 2500

//router imports
const userRouter = require("./router/userRouter")
const postRouter = require("./router/postRouter")
const commentRouter = require("./router/commentRouter")


// app.use() middleware
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public'))
app.use("/user", userRouter)
app.use("/post", postRouter)
app.use("/comment", commentRouter)

// cors handler
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    next();
});

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, '/public', '/html', "/index.html"))
})

//signup
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, "/public", "/html", "/signup.html"))
})

//signIn
app.get("/signin", (req, res) => {
    res.sendFile(path.join(__dirname, "/public", "/html", "/signin.html"))
})


app.listen(PORT,() => {
    console.log(`App running on ${PORT}`)
})