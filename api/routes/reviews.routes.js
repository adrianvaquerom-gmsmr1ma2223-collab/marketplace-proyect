const router = require("express").Router();
const auth = require("../middlewares/auth");
const c = require("../controllers/reviews.controller");

router.post("/", auth, c.create);

module.exports = router;