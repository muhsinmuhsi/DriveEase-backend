"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = __importDefault(require("cloudinary"));
const multer_1 = __importDefault(require("multer"));
cloudinary_1.default.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 2000000000 }, // 2GB
});
const uploadImage = (req, res, next) => {
    // Use the multer upload middleware
    upload.single('image')(req, res, (error) => {
        if (error) {
            return res.status(400).json({ message: "File upload failed", error });
        }
        if (req.file) {
            // Upload the image to Cloudinary using the file buffer
            const stream = cloudinary_1.default.v2.uploader.upload_stream({ resource_type: "image" }, (error, result) => {
                if (error) {
                    return res.status(500).json({ message: "Cloudinary upload failed", error });
                }
                // Add the Cloudinary image URL to the request object
                req.cloudinaryImageUrl = result.secure_url;
                next();
            });
            // Write the buffer data to the upload stream
            stream.end(req.file.buffer);
        }
        else {
            next();
        }
    });
};
exports.default = uploadImage;
