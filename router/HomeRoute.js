/** @format */

const express = require("express");
var Router = require("router");
var router = Router();
const Post = require("../models/postsmodel");
const User = require("../models/Usersmodel");
var jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require("node-localstorage").LocalStorage;
    localStorage = new LocalStorage("./scratch");
  }
  const token = localStorage.getItem("key");

  if (token === null) return res.redirect("/user/login");

  try {
    let user = jwt.verify(token, process.env.DB_TOKEN);
    req.user = user;
    next();
  } catch (error) {
    res.redirect("/user/login");
  }
}
// getting all posts
router.get("/", verifyToken, async (req, res) => {
  const userData = await User.findOne({ email: req.user.email });

  try {
    Post.find({})
      .sort({ $natural: -1 })
      .exec((err, docs) => {
        res.render("home", {
          posts: docs,
          userData,
          errors: req.session.error,
        });
      });

    // const postItem = await Post.find({}).sort("-date");
  } catch (error) {
    console.log(error);
  }
});
// submiting posts
router.post("/", verifyToken, async (req, res) => {
  const { name, post } = req.body;
  var date = new Date();
  const userList = await User.findOne({ name });
  try {
    const value = new Post({
      name: name,
      post: post,
      year: date.toLocaleDateString(),
      img: userList.img,
      date: date,
    });
    await value.save();
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

router.get("/posts", verifyToken, async (req, res) => {
  const userPosts = await User.findOne({ email: req.user.email });

  res.render("posts", { userPosts });
});

router.get("/user/post/:id", verifyToken, async (req, res) => {
  const userData = await Post.findOne({ _id: req.params.id });
  res.render("user", { userData });
});
router.get("/edit/:id", verifyToken, async (req, res) => {
  const id = req.params.id;

  const user = req.user.email;
  console.log(user);
  let errors = [];
  try {
    const userData = await Post.findOne({ _id: id });
    const userData2 = await User.findOne({ email: user });

    if (userData.name === userData2.name) {
      res.render("edit", { userData });
    } else {
      req.session.error = `You are not ${userData.name} are you??`;
      res.redirect("/");
    }
  } catch (error) {
    console.log(error);
  }

  // console.log(userData);
  // res.render("edit", { userData });
});
router.post("/edit/:id", async (req, res) => {
  const userId = req.params.id;
  const query = { _id: userId };
  const { name, post } = req.body;

  try {
    const findUser = await Post.findOneAndUpdate(query, {
      name: name,
      post: post,
    });
    if (!findUser) return console.log("user not Found");

    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

router.get("/delete/:id", verifyToken, async (req, res) => {
  const postId = req.params.id;
  const userEmail = req.user.email;
  let errors = [];
  try {
    const userData = await User.findOne({ email: userEmail });
    const postData = await Post.findOne({ _id: postId });

    if (userData.name === postData.name) {
      const deleteItem = await Post.deleteOne({ _id: postData._id });
      if (!deleteItem) return console.log("not found");

      res.redirect("/");
    } else {
      req.session.error = `Are you ${postData.name}'s cousin ? 🙄 `;
      res.redirect("/");
    }
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
