require("dotenv").config();

const connectDB = require("./config/db");
const app = require("./server");

const PORT = process.env.PORT || 3000;

console.log("Iniciando servidor...");

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error de conexión DB:", err.message);
    process.exit(1);
  });