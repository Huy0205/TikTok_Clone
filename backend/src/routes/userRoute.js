const router = require("express").Router();
const { UserControllers } = require("../app/controllers");

router.post("/send-otp-mail", UserControllers.handleSendOTPByMail);
router.post("/verify-otp", UserControllers.handleVerifyOTP);
router.post("/register", UserControllers.handleRegister);
router.post("/login", UserControllers.handleLogin);

router.get("/", UserControllers.handleGetUserByTiktokId);
router.get("/auth", UserControllers.handleGetAccountAuth);
router.get("/search", UserControllers.handleSearch);
router.get("/followings", UserControllers.handleGetUserByFollowings);

module.exports = router;
