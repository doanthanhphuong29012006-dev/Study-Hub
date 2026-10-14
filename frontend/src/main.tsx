import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

// Backend tăng view_count trong GET /documents/:id. Không bọc StrictMode ở đây vì
// React development sẽ chạy effect hai lần và tạo hai lượt xem cho một lần mở trang.
createRoot(document.getElementById('root')!).render(<App />);
