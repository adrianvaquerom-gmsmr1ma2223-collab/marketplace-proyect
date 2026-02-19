const User = require("../models/User");

exports.me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(user);
  } catch (e) {
    next(e);
  }
};

exports.list = async (req, res, next) => {
  try {
    const users = await User.find().select("-password").limit(50);
    res.json(users);
  } catch (e) {
    next(e);
  }
};