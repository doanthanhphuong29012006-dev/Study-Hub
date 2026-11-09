import cloudinary from "../config/cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Tạo cấu hình lưu trữ trên Cloudinary
export const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req: any, file: Express.Multer.File) => {
        const isImage = file.mimetype.startsWith('image/');
        
        const ext = file.originalname.split('.').pop();
        
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

        if (isImage) {
            return {
                folder: 'studyhub_documents',
                resource_type: 'auto',
                public_id: uniqueName
            };
        } else {
            return {
                folder: 'studyhub_documents',
                resource_type: 'raw',
                public_id: `${uniqueName}.${ext}` 
            };
        }
    }
});
