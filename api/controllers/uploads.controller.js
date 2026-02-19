const multer = require("multer");
const cloudinary = require("../utils/cloudinary");

function httpError(statusCode, message) {
  const e = new Error(message);
  e.statusCode = statusCode;
  return e;
}

const upload = multer({ storage: multer.memoryStorage() });

exports.uploadCourseImage = [
  upload.single("image"),
  async (req, res, next) => {
    try {
      if (!req.file) throw httpError(400, "No se ha enviado imagen");

      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "courses" },
          (err, r) => (err ? reject(err) : resolve(r))
        );
        stream.end(req.file.buffer);
      });

      res.json({
        url: result.secure_url,
        publicId: result.public_id,
      });
    } catch (err) {
      next(err);
    }
  },
];