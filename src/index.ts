import express, { Request, Response } from 'express';

const app = express();
const PORT = 3000;

// Middleware đọc JSON
app.use(express.json());

// Route mặc định
app.get('/', (req: Request, res: Response) => {
  res.send('Hello TypeScript & Node.js Server!');
});

// Lắng nghe cổng
app.listen(PORT, () => {
  console.log(`Server đang chạy tại: http://localhost:${PORT}`);
});
