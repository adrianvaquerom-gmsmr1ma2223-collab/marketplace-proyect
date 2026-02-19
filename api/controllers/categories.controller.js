const Category = require("../models/Category");

exports.list = async (req, res, next) => {
  try {
    res.json(await Category.find());
  } catch (e) { next(e); }
};

exports.detail = async (req, res, next) => {
  try {
    res.json(await Category.findById(req.params.id));
  } catch (e) { next(e); }
};

exports.create = async (req, res, next) => {
  try {
    res.status(201).json(await Category.create(req.body));
  } catch (e) { next(e); }
};

exports.update = async (req, res, next) => {
  try {
    res.json(await Category.findByIdAndUpdate(req.params.id, req.body, { new: true }));
  } catch (e) { next(e); }
};

exports.remove = async (req, res, next) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (e) { next(e); }
};