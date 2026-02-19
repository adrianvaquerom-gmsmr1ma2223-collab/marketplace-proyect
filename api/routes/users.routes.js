const router = require("express").Router();
const auth = require("../middlewares/auth");
const c = require("../controllers/users.controller");

// Obtener mi perfil
router.get("/me", auth, c.me);

// Listar usuarios
router.get("/", auth, c.list);

module.exports = router;