const authController = require("../controllers/auth.controller");
const userController = require("../controllers/user.controler");

const router = require("express").Router();

router.route("/:id")
    .patch(
        authController.protect,
        userController.updateMe
    )
    .delete(
        authController.protect,
        userController.deleteAccount
    )

module.exports = router;
