import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import pool, { connectDB } from './config/database';
import { redisConnect, redisClose } from './config/redis';
import { requireValidOrigin } from './middlewares/origin-check.middleware';
import { globalErrorHandler } from './middlewares/error.middleware';

const app = express();
const PORT = process.env.PORT || 1234;

// CORS configuare
app.use(cors({
    origin: [
        "http://localhost:5173", 
        "https://payt-chia-se-tai-lieu.vercel.app", 
        "https://payt-chia-se-tai-lieu-f0zzshy7b.vercel.app",
        "http://localhost:8080"
    ],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: [
      'Content-Type', 
      'Authorization',
      'X-CSRF-Token'
    ],
    credentials: true
}));

// Cho phép gửi data lên dạng json
app.use(express.json());

app.use(cookieParser());

app.set('trust proxy', 1);

app.use(requireValidOrigin)

const startServer = async () => {
  try {
        const requiredEnvs = ['PORT', 'JWT_SECRET', 'ROUTE_ADMIN', 'DB_USER', 'DB_PASSWORD'];
        for (const env of requiredEnvs) {
            if (!process.env[env]) {
                throw new Error(`Thiếu biến môi trường quan trọng: ${env}`);
            }
        }

        await connectDB();
        await redisConnect();

        const { globalLimiter } = require("./middlewares/rate-limit.middleware");
        const routes = require("./routes/index.route").default;
        const adminRoutes = require("./routes/admin/index.route").default;

        app.use(globalLimiter);
        app.use("/", routes);
        app.use(`/${process.env.ROUTE_ADMIN}`, adminRoutes);
        app.use(globalErrorHandler);

        const server = app.listen(PORT, () => {
            console.log(`Server đang chạy trên cổng ${PORT}`);
        });

        // Graceful Shutdown
        const gracefulShutdown = async (signal: string) => {
            console.log(`\nNhận tín hiệu ${signal}. Đang chuẩn bị dừng server...`);
            
            server.close(async () => {
                console.log('Đã đóng kết nối HTTP.');
                try {
                    // Ngắt kết nối Database pool an toàn
                    await pool.end();
                    console.log('Đã ngắt kết nối PostgreSQL.');

                    await redisClose();
                    console.log('Đã ngắt kết nối Redis.');
                    
                    console.log('Tạm biệt!');
                    process.exit(0);
                } catch (err) {
                    console.error('Lỗi trong quá trình ngắt kết nối:', err);
                    process.exit(1);
                }
            });

            // Ép tắt nếu quá trình dọn dẹp kéo dài quá 10 giây (Timeout)
            setTimeout(() => {
                console.error('Quá thời gian đóng an toàn. Buộc dừng server.');
                process.exit(1);
            }, 10000);
        };

        // Bắt các tín hiệu dừng từ Hệ điều hành / Docker
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM')); // Dừng từ hệ thống
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));   // Dừng khi bấm Ctrl+C

    } catch (error) {
        console.error("Khởi động hệ thống thất bại:", error);
        process.exit(1); 
    }
};

startServer();