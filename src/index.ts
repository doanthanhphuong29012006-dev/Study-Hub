import express from 'express';
import cors from 'cors';
import { globalLimiter } from './middlewares/rate-limit.middleware';
import cookieParser from 'cookie-parser';
import routes from './routes/index.route';
import adminRoutes from './routes/admin/index.route';
import { connectDB } from './config/database';

const app = express();
const PORT = process.env.PORT || 1234;

// CORS configuare
app.use(cors({
    origin: ["http://localhost:5173", "https://payt-chia-se-tai-lieu.vercel.app", "https://payt-chia-se-tai-lieu-f0zzshy7b.vercel.app"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Cho phép gửi data lên dạng json
app.use(express.json());

app.use(cookieParser());

app.set('trust proxy', 1);

app.use(globalLimiter);

// Thiết lập đường dẫn
app.use('/', routes);
app.use(`/${process.env.ROUTE_ADMIN}`, adminRoutes);

app.listen(PORT, async () => {
    await connectDB();
  console.log(`Server running on http://localhost:${PORT}`);
});