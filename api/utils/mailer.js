const nodemailer = require("nodemailer");

function transporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

async function sendEmail({ to, subject, html }) {
  const t = transporter();

  await t.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  });
}

module.exports = { sendEmail };