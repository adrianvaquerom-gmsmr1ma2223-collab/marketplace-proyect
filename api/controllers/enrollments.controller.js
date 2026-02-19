const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");

function httpError(statusCode, message, details) {
  const e = new Error(message);
  e.statusCode = statusCode;
  if (details) e.details = details;
  return e;
}

exports.requestEnrollment = async (req, res, next) => {
  try {
    const { courseId, pricePaid } = req.body;

    const course = await Course.findById(courseId);
    if (!course) throw httpError(404, "Curso no encontrado");

    if (String(course.instructor) === String(req.user._id)) {
      throw httpError(400, "No puedes inscribirte en tu propio curso");
    }

    const enrollment = await Enrollment.create({
      course: course._id,
      student: req.user._id,
      instructor: course.instructor,
      status: "requested",
      pricePaid: Number(pricePaid) || 0,
    });

    res.status(201).json(enrollment);
  } catch (err) {
    // error de índice unique
    if (err?.code === 11000) {
      return next(httpError(409, "Ya existe una inscripción para este curso"));
    }
    next(err);
  }
};

exports.approveEnrollment = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment) throw httpError(404, "Inscripción no encontrada");

    const isInstructor = String(enrollment.instructor) === String(req.user._id);
    const isAdmin = req.user?.role === "admin";
    if (!isInstructor && !isAdmin) throw httpError(403, "No autorizado");

    if (enrollment.status !== "requested") {
      throw httpError(400, "Solo se pueden aprobar inscripciones en estado requested");
    }

    enrollment.status = "approved";
    await enrollment.save();

    res.json(enrollment);
  } catch (err) {
    next(err);
  }
};

exports.completeEnrollment = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment) throw httpError(404, "Inscripción no encontrada");

    const isInstructor = String(enrollment.instructor) === String(req.user._id);
    const isAdmin = req.user?.role === "admin";
    if (!isInstructor && !isAdmin) throw httpError(403, "No autorizado");

    if (enrollment.status !== "approved") {
      throw httpError(400, "Solo se puede completar una inscripción aprobada");
    }

    enrollment.status = "completed";
    await enrollment.save();

    res.json(enrollment);
  } catch (err) {
    next(err);
  }
};

exports.cancelEnrollment = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment) throw httpError(404, "Inscripción no encontrada");

    const isStudent = String(enrollment.student) === String(req.user._id);
    const isInstructor = String(enrollment.instructor) === String(req.user._id);
    const isAdmin = req.user?.role === "admin";
    if (!isStudent && !isInstructor && !isAdmin) throw httpError(403, "No autorizado");

    if (enrollment.status === "completed") {
      throw httpError(400, "No se puede cancelar una inscripción completada");
    }

    enrollment.status = "cancelled";
    await enrollment.save();

    res.json(enrollment);
  } catch (err) {
    next(err);
  }
};