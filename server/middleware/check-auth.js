const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, "Super secret message only for development: Seals are like dogs but underwater dogs.");
    next();
  } catch (error) {
    res.status(401).json({ message: "Auth failed!" });
  }
};
