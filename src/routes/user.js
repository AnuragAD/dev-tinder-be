const express = require("express");
const userRouter = express.Router();
const { authorizeUser } = require("../middlewares/authorize");

userRouter.get("/feed", authorizeUser, async (req, res) => {
  try {
    res.send(req?.user);
  } catch (error) {
    res.status(401).send("Something Went Wrong");
  }
});

module.exports = userRouter;
