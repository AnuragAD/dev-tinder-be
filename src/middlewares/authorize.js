const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authorizeUser = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Unauthorised users");
    }
    const decodedObj = await jwt.verify(token, "JWTSecretKey@2000", {expiresIn: '1d'});
    const { _id } = decodedObj;
    const userData = await User.findById(_id);
    if (!userData) {
      throw new Error("User not found");
    }
    req.user = userData;
    next();
  } catch (err) {
    res.status(400).send(err.message);
  }
};

module.exports = { authorizeUser };
