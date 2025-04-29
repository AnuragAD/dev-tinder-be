const express = require("express");
const bcrypt = require("bcrypt");
const authRouter = express.Router();
const User = require("../models/user");
const { validateUserData } = require("../utils/validation");

authRouter.post("/signup", async (req, res) => {
  try {
    validateUserData(req);
    const { firstName, lastName, email, password, skills } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const users = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      skills,
    });
    await users.save();
    res.send("User created Successfully");
  } catch (error) {
    res.send(error?.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userData = await User.findOne({ email });
    const isPasswordValid = await userData.validatePassword(password);
    if (!userData || !isPasswordValid) {
      throw new Error("Email or password is Invalid");
    }

    // Create a JWT token
    const token = await userData.getJWT();

    // Add the token to cookie and send the response back to the user.
    res.cookie("token", token);
    res.json({
      message: 'Login Successfull',
      data: userData
    });
  } catch (error) {
    res.status(400).send(error?.message);
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("logout Successful");
});

module.exports = authRouter;
