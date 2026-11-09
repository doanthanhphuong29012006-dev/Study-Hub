import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

export const configureCloudinary = () => {
    if (process.env.CLOUDINARY_URL) {
        cloudinary.config();
    } else {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME || process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
            secure: true,
        });
    }

    const currentConfig = cloudinary.config();
    if (!currentConfig.api_key) {
        console.warn("[Cloudinary] CLOUDINARY_API_KEY chưa được cấu hình. Việc upload file/ảnh sẽ báo lỗi!");
    } else {
        console.log(`[Cloudinary] Đã khởi tạo cấu hình thành công cho cloud_name: ${currentConfig.cloud_name}`);
    }
};

export default cloudinary;
