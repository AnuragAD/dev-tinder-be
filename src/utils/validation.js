const validator = require("validator");
const bcrypt = require("bcrypt");

const validateUserData = (req) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Please enter FirstName and lastName");
  } else if (!validator.isEmail(email)) {
    throw new Error("Please enter valid Email");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password");
  }
};

const validateUserUpdateData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "photoUrl",
    "skills",
  ];
  const isUpdateAllowed = Object.keys(req?.body)?.every((field) =>
    allowedEditFields.includes(field)
  );
  if (!isUpdateAllowed) {
    throw new Error("Fields cannot be updated");
  }
};

const validateUserPassword = async (req, loggedInUser) => {
  const { currentPassword, newPassword } = req?.body;
  if (currentPassword == newPassword) {
    throw new Error("Current password and new Password cannot be same");
  }

  const currentPasswordValid = await bcrypt.compare(
    currentPassword,
    loggedInUser?.password
  );

  if (!currentPasswordValid) {
    throw new Error("Current password is incorrect");
  }

  const newPassWordValid = validator.isStrongPassword(newPassword);
  if (!newPassWordValid) {
    throw new Error("Please Enter a strong password");
  } else {
    return newPassword;
  }
};

module.exports = {
  validateUserData,
  validateUserUpdateData,
  validateUserPassword,
};
