const Course = require("../models/Course");
const cloudinary = require("../utils/cloudinary");

function httpError(statusCode, message, details) {
  const e = new Error(message);
  e.statusCode = statusCode;
  if (details) e.details = details;
  return e;
}

exports.create = async (req, res, next) => {
  try {
    const data = req.body;
    const course = await Course.create({
      ...data,
      instructor: req.user._id,
    });
    res.status(201).json(course);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate("instructor", "name email");
    if (!course) throw httpError(404, "Curso no encontrado");
    res.json(course);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) throw httpError(404, "Curso no encontrado");

    const isOwner = String(course.instructor) === String(req.user._id);
    const isAdmin = req.user?.role === "admin";
    if (!isOwner && !isAdmin) throw httpError(403, "No autorizado");
    if (req.body.imagePublicId && course.imagePublicId && req.body.imagePublicId !== course.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(course.imagePublicId);
      } catch (e) {
        // si falla, no tiramos todo el update
        console.log("No se pudo borrar la imagen anterior:", e.message);
      }
    }
    
    Object.assign(course, req.body);
    await course.save();

    res.json(course);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) throw httpError(404, "Curso no encontrado");

    const isOwner = String(course.instructor) === String(req.user._id);
    const isAdmin = req.user?.role === "admin";
    if (!isOwner && !isAdmin) throw httpError(403, "No autorizado");

    await course.deleteOne();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || "10", 10), 1), 50);

    const {
      status,
      category,
      q,
      minPrice,
      maxPrice,
      sortBy = "createdAt",
      sortDir = "desc",
    } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;

    if (q) filter.title = { $regex: String(q), $options: "i" };

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const allowedSort = new Set(["createdAt", "price", "title"]);
    const sortField = allowedSort.has(sortBy) ? sortBy : "createdAt";
    const sort = { [sortField]: sortDir === "asc" ? 1 : -1 };

    const [items, total] = await Promise.all([
      Course.find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("instructor", "name email"),
      Course.countDocuments(filter),
    ]);

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      items,
    });
  } catch (err) {
    next(err);
  }
};