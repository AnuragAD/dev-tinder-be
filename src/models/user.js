const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, require: true, trim: true },
    lastName: { type: String, require: true, trim: true },
    email: {
      type: String,
      require: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      require: true,
      trim: true,
    },
    age: {
      type: Number,
      require: true,
      trim: true,
      min: [18, "You are under age"],
    },
    gender: {
      type: String,
      require: true,
      trim: true,
      validate(value) {
        if (!["male", "female", "other"].includes(value.toLowerCase())) {
          throw Error("Invalid Gender");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://png.pngtree.com/element_our/png/20181206/users-vector-icon-png_260862.jpg",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Photo Url is Invalid");
        }
      },
    },
    skills: { type: [String] },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function () {
  const userData = this;
  const token = await jwt.sign({ _id: userData?._id }, "JWTSecretKey@2000", {
    expiresIn: "1d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (userInputPassword) {
  const userData = this;
  const isPasswordValid = await bcrypt.compare(
    userInputPassword,
    userData.password
  );
  return isPasswordValid;
};

module.exports = mongoose.model("User", userSchema);
