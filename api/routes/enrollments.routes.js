const router = require("express").Router();
const auth = require("../middlewares/auth");
const c = require("../controllers/enrollments.controller");

router.post("/request", auth, c.requestEnrollment);
router.post("/:id/approve", auth, c.approveEnrollment);
router.post("/:id/complete", auth, c.completeEnrollment);
router.post("/:id/cancel", auth, c.cancelEnrollment);

module.exports = router;