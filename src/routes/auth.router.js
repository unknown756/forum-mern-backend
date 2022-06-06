const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const userController = require("../controllers/user.controller");


router.post(
    "/signup", 
    authController.signup
);
router.post(
    "/login",
    authController.login
);
router.post("/refresh-token", authController.refreshToken);

module.exports = router;

