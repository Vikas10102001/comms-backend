const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const friendInvitationController = require("../controller/friendInvitationController");

router.use(authController.protect)
router
  .route("/invite")
  .post(friendInvitationController.invitationHandler);
router.route("/accept").post(friendInvitationController.invitationAcceptHandler)
router.route("/reject").post(friendInvitationController.invitationRejectHandler)
module.exports = router;
