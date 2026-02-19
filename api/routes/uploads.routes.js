const router = require("express").Router();
const auth = require("../middlewares/auth");
const ctrl = require("../controllers/uploads.controller");

router.post("/course-image", auth, ctrl.uploadCourseImage);

module.exports = router;