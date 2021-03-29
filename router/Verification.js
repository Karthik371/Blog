/** @format */

function verifyToken(req, res, next) {
  if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require("node-localstorage").LocalStorage;
    localStorage = new LocalStorage("./scratch");
  }
  const token = localStorage.getItem("key");

  if (token === null) return res.redirect("/user/login");

  try {
    let user = jwt.verify(token, "shhhhh");
    req.user = user;
    next();
  } catch (error) {
    res.redirect("/user/login");
  }
}
module.exports = verifyToken;
