require("dotenv").config();

const express = require("express");
const cors = require("cors");

const errorHandler = require("./middlewares/errorHandler");

const authRoutes = require("./routes/auth.routes");
const uploadsRoutes = require("./routes/uploads.routes");
const coursesRoutes = require("./routes/courses.routes");
const categoriesRoutes = require("./routes/categories.routes");
const enrollmentsRoutes = require("./routes/enrollments.routes");
const reviewsRoutes = require("./routes/reviews.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/uploads", uploadsRoutes);
app.use("/api/courses", coursesRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/enrollments", enrollmentsRoutes);
app.use("/api/reviews", reviewsRoutes);

app.use(errorHandler);

module.exports = app;
