import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Setup Multer Storage Engine for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "CyberSentinel_AI/uploads",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "pdf", "docx"], // Adjust allowed formats
    // format: async (req, file) => "png", // Uncomment to force format
    public_id: (req, file) => `${Date.now()}-${file.originalname.split(".")[0]}`,
  },
});

export const upload = multer({ storage });
export { cloudinary };
