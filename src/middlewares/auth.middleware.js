const authMiddleWare = (req, res, next) => {
  const token = "abcxyz";
  if (token !== "abc") {
    res.status(401).send("UnAuthorised");
  } else {
    next();
  }
};

module.exports = { authMiddleWare };
