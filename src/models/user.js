const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, require: true },
    lastName: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true, unique: true },
    age: { type: Number, require: true },
    gender: { type: String, require: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
