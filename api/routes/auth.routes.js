const router = require("express").Router();
const ctrl = require("../controllers/auth.controller");

router.post("/register", ctrl.register);
router.post("/verify-email", ctrl.verifyEmail);
router.post("/login", ctrl.login);
router.post("/forgot-password", ctrl.forgotPassword);
router.post("/reset-password", ctrl.resetPassword);

module.exports = router;