/** @format */
const express = require("express");
const bodyParser = require("body-parser");
const Post = require("./models/postsmodel");
const port = process.env.PORT || 3000;
var cookieParser = require("cookie-parser");
require("./database/conect");
var session = require("express-session");
const app = express();
require("dotenv").config();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(cookieParser());

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3000 },
  })
);

app.use("/", require("./router/HomeRoute"));
app.use("/user", require("./router/UsersRoute"));

app.listen(port, function () {
  console.log("server is running");
});
