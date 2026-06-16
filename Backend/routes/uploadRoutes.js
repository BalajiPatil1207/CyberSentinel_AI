import express from "express";
import { upload } from "../config/cloudinary.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @desc    Upload a single file to Cloudinary
 * @route   POST /api/upload
 * @access  Protected
 */
router.post("/", protect, upload.single("image"), (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file provided" });
    }

    // req.file contains the file details including the Cloudinary URL (req.file.path)
    const fileData = {
      url: req.file.path,
      public_id: req.file.filename, // This is the public_id in Cloudinary
      originalName: req.file.originalname,
      size: req.file.size,
    };

    return sendSuccess(res, fileData, "File uploaded successfully");
  } catch (error) {
    next(error);
  }
});

export default router;
