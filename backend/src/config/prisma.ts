import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

// Đảm bảo DATABASE_URL luôn hợp lệ (tự động tạo từ các biến DB_* nếu chưa thiết lập)
if (!process.env.DATABASE_URL) {
  const user = process.env.DB_USER || "postgres";
  const password = process.env.DB_PASSWORD || "";
  const host = process.env.DB_HOST || "localhost";
  const port = process.env.DB_PORT || "5432";
  const name = process.env.DB_NAME || "document_sharing";
  process.env.DATABASE_URL = `postgresql://${user}:${encodeURIComponent(password)}@${host}:${port}/${name}?schema=public`;
}

declare global {
  // Tránh tạo nhiều kết nối trùng lặp khi chạy dev reload
  var prismaGlobal: PrismaClient | undefined;
}

export const prisma = global.prismaGlobal || new PrismaClient({
  log: process.env.NODE_ENV === "developer" ? ["query", "info", "warn", "error"] : ["error"],
});

if (process.env.NODE_ENV !== "production") {
  global.prismaGlobal = prisma;
}

export default prisma;
