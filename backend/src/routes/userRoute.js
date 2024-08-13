const router = require("express").Router();
const { UserControllers } = require("../app/controllers");

router.post("/send-otp-mail", UserControllers.handleSendOTPByMail);
router.post("/verify-otp", UserControllers.handleVerifyOTP);
router.post("/register", UserControllers.handleRegister);
router.post("/login", UserControllers.handleLogin);

router.get("/", UserControllers.handleGetAccount);
router.get("/search", UserControllers.handleSearch);

module.exports = router;
