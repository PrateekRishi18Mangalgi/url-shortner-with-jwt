const express = require("express");
const app = express();
const port = 8000;
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const {connectToMongoDB} = require('./config');
const {handleUserSignup, handleUserLogin} = require('../controllers/user');
const {handleCreateShortUrl} = require('../controllers/url');
const User = require('../models/user');
const URL = require('../models/url');
const {restrictToLoggedInUseOnly} = require('../middleware/auth');


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectToMongoDB("mongodb://localhost:27017/url-shortener").then(() =>
  console.log("Mongodb connected")
);


app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("login");
});
app.get("/signup", (req, res) => {
  res.render("signup");
});
app.get("/home", restrictToLoggedInUseOnly, async (req, res) => {
  const urls = await URL.find({createdBy: req.user._id});
  res.render("home",{urls});
});
app.post("/signup", handleUserSignup);
app.post("/login",handleUserLogin);
app.post("/url",restrictToLoggedInUseOnly,handleCreateShortUrl);
app.get("/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visithistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  res.redirect(entry.redirectURL);
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



