const router = require("express").Router();
const forumController = require("../controllers/forum.controller");
const authController = require("../controllers/auth.controller");
const isAuthenticated = require("../middlewares/isAuthenticated");

router.route("/")
	.get(
        isAuthenticated,
        forumController.getAllForums
    )
	.post(
        authController.protect,
        forumController.createForum
    )

router.route("/:id")
	.patch(
        authController.protect,
        forumController.editForum
    )
	.delete(
        authController.protect, 
        forumController.deleteForum
    )


router.get("/:slug", forumController.getForum);

module.exports = router;


