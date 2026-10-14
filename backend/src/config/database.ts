import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load biến môi trường
dotenv.config();

// Khởi tạo Pool kết nối PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432', 10),
});

// Lắng nghe sự kiện lỗi trên các client đang rảnh (idle)
pool.on('error', (err) => {
  console.error('Lỗi kết nối PostgreSQL đột xuất:', err);
  process.exit(-1);
});

// Hàm kiểm tra kết nối khi khởi động server
export const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log('Kết nối cơ sở dữ liệu PostgreSQL thành công!');
    client.release(); // Giải phóng client trả lại cho Pool
  } catch (error) {
    console.error('Lỗi kết nối PostgreSQL:', error);
    process.exit(1); // Dừng ứng dụng nếu database chết
  }
};

export default pool;