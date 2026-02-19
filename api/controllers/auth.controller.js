const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const Token = require("../models/Token");
const { sendEmail } = require("../utils/mailer");

function httpError(statusCode, message, details) {
  const e = new Error(message);
  e.statusCode = statusCode;
  if (details) e.details = details;
  return e;
}

function signJWT(user) {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET no definido");
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

function newRandomToken() {
  return crypto.randomBytes(32).toString("hex");
}

async function createToken({ userId, type, hours = 1 }) {
  const token = newRandomToken();
  await Token.create({
    user: userId,
    type,
    token,
    expiresAt: new Date(Date.now() + hours * 60 * 60 * 1000),
    usedAt: null,
  });
  return token;
}

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) throw httpError(400, "Faltan campos");

    const exists = await User.findOne({ email });
    if (exists) throw httpError(409, "Ya existe un usuario con ese email");

    const user = new User({ name, email });
    await user.setPassword(password);
    await user.save();

    // token verificación email (flujo 1)
    const token = await createToken({ userId: user._id, type: "verify_email", hours: 24 });

    await sendEmail({
      to: email,
      subject: "Verifica tu email",
      html: `
        <p>Hola ${name},</p>
        <p>Tu token de verificación es:</p>
        <p><b>${token}</b></p>
        <p>Caduca en 24h.</p>
      `,
    });

    res.status(201).json({ message: "Usuario creado. Revisa tu correo para verificarlo." });
  } catch (err) {
    next(err);
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) throw httpError(400, "Token requerido");

    const doc = await Token.findOne({ token, type: "verify_email" }).populate("user");
    if (!doc) throw httpError(400, "Token inválido");

    if (doc.usedAt) throw httpError(400, "Token ya usado");
    if (doc.expiresAt < new Date()) throw httpError(400, "Token caducado");

    const user = await User.findById(doc.user._id);
    if (!user) throw httpError(404, "Usuario no encontrado");

    user.emailVerifiedAt = new Date();
    await user.save();

    doc.usedAt = new Date();
    await doc.save();

    res.json({ message: "Email verificado correctamente" });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw httpError(400, "Faltan campos");

    const user = await User.findOne({ email });
    if (!user) throw httpError(401, "Credenciales incorrectas");

    const ok = await user.comparePassword(password);
    if (!ok) throw httpError(401, "Credenciales incorrectas");

    // si quieres obligar a verificar email, descomenta:
    // if (!user.emailVerifiedAt) throw httpError(403, "Verifica tu email primero");

    const jwtToken = signJWT(user);

    res.json({
      token: jwtToken,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};

// flujo 2: reset password
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) throw httpError(400, "Email requerido");

    const user = await User.findOne({ email });
    // no damos pistas (mejor práctica)
    if (!user) return res.json({ message: "Si existe, te llegará un correo." });

    const token = await createToken({ userId: user._id, type: "reset_password", hours: 1 });

    await sendEmail({
      to: email,
      subject: "Recuperar contraseña",
      html: `
        <p>Tu token para resetear contraseña es:</p>
        <p><b>${token}</b></p>
        <p>Caduca en 1h.</p>
      `,
    });

    res.json({ message: "Si existe, te llegará un correo." });
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) throw httpError(400, "Faltan campos");

    const doc = await Token.findOne({ token, type: "reset_password" });
    if (!doc) throw httpError(400, "Token inválido");

    if (doc.usedAt) throw httpError(400, "Token ya usado");
    if (doc.expiresAt < new Date()) throw httpError(400, "Token caducado");

    const user = await User.findById(doc.user);
    if (!user) throw httpError(404, "Usuario no encontrado");

    await user.setPassword(newPassword);
    await user.save();

    doc.usedAt = new Date();
    await doc.save();

    res.json({ message: "Contraseña cambiada correctamente" });
  } catch (err) {
    next(err);
  }
};