const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const whiteList = [
    "/user/send-otp-mail",
    "/user/verify-otp",
    "/user/register",
    "/user/login",
    "/user/search",
    "/keyword/inscrease-keyword-count",
    "/keyword/search",
  ];
  if (whiteList.includes(req.path)) {
    return next();
  }

  if (req?.headers?.authorization?.split(" ")?.[1]) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      return next();
    } catch (error) {
      return res.status(401).json({
        status: 401,
        message: "Token is expired",
      });
    }
  }
  return res.status(401).json({
    status: 401,
    message: "Unauthorized",
  });
};

module.exports = auth;
