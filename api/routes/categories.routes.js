const router = require("express").Router();
const auth = require("../middlewares/auth");
const c = require("../controllers/categories.controller");

router.get("/", c.list);
router.get("/:id", c.detail);
router.post("/", auth, c.create);
router.put("/:id", auth, c.update);
router.delete("/:id", auth, c.remove);

module.exports = router;