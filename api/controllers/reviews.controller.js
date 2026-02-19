const Review = require("../models/Review");
const Enrollment = require("../models/Enrollment");

exports.create = async (req, res, next) => {
  try {
    const { courseId, rating, comment } = req.body;

    const completed = await Enrollment.findOne({
      course: courseId,
      student: req.user.id,
      status: "completed",
    });

    if (!completed) return res.status(403).json({ message: "Solo puedes reseñar si completaste el curso" });

    const review = await Review.create({
      course: courseId,
      user: req.user.id,
      rating,
      comment,
    });

    res.status(201).json(review);
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ message: "Ya reseñaste este curso" });
    next(e);
  }
};