const router = require("express").Router();
const auth = require("../middlewares/auth");
const ctrl = require("../controllers/courses.controller");
const validate = require("../middlewares/validate");
const { courseSchema } = require("../schemas/course.schema");

router.get("/", ctrl.list);
router.get("/:id", ctrl.getById);
router.post("/", auth, validate(courseSchema), ctrl.create);
router.put("/:id", auth, ctrl.update);
router.delete("/:id", auth, ctrl.remove);

module.exports = router;