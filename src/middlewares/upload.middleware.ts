import multer from "multer";
import { storage } from "../helpers/cloudinary.helper";

export const uploadMiddleware = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024
    }
});