const express = require("express");
const { authorizeUser } = require("../middlewares/authorize");
const User = require("../models/user");
const {
  validateUserUpdateData,
  validateUserPassword,
} = require("../utils/validation");
const bcrypt = require("bcrypt");

const profileRouter = express.Router();

profileRouter.get("/profile/view", authorizeUser, async (req, res) => {
  try {
    if (req?.user?.length) {
      res.send(user);
    } else {
      res.status(404).send("User Not Found");
    }
  } catch (error) {
    res.status(401).send("Something Went Wrong");
  }
});

profileRouter.delete("/user", authorizeUser, async (req, res) => {
  try {
    await User.findOneAndDelete({ email: req?.body?.email });
    res.send("User deleted Successfully");
  } catch (error) {
    res.send(error);
  }
});

profileRouter.patch("/profile/edit", authorizeUser, async (req, res) => {
  try {
    validateUserUpdateData(req);
    const loggedInUser = req.user;
    Object.keys(req?.body)?.forEach(
      (key) => (loggedInUser[key] = req?.body[key])
    );
    await loggedInUser.save();
    res.send("User Updated Successfully");
  } catch (error) {
    res.status(400).send(error?.message);
  }
});

profileRouter.patch(
  "/profile/changePassword",
  authorizeUser,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const newPassword = await validateUserPassword(req, loggedInUser);
      if (newPassword) {
        loggedInUser["password"] = await bcrypt.hash(newPassword, 10);
        await loggedInUser.save();
        res.send("Password Updated Successfully");
      }
    } catch (error) {
      res.status(400).send(error?.message);
    }
  }
);

module.exports = profileRouter;
