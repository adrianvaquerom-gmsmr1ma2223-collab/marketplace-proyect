const router = require("express").Router();
const auth = require("../middlewares/auth");
const c = require("../controllers/conversations.controller");

router.get("/", auth, c.list);
router.post("/", auth, c.create);
router.get("/:id", auth, c.detail);

module.exports = router;