import express from 'express';
import cors from 'cors';
import passport from './config/passport';
import authRoutes from './routes/authRoutes';
import apiRoutes from './routes/apiRoutes';

// 載入環境變數 (Bun 會自動載入 .env，但這裡顯式導入以確保相容性)
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// 設定 CORS
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

// 解析 JSON 請求
app.use(express.json());

// 初始化 Passport
app.use(passport.initialize());

// 註冊路由
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

// 健康檢查端點
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'OAuth2 Backend is running' });
});

// 根路由
app.get('/', (req, res) => {
  res.json({
    message: 'OAuth 2.0 Demo Backend',
    endpoints: {
      auth: {
        login: '/auth/login',
        callback: '/auth/callback',
      },
      api: {
        profile: '/api/profile (protected)',
      },
    },
  });
});

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📝 Frontend URL: ${FRONTEND_URL}`);
  console.log(`🔐 OAuth callback: http://localhost:${PORT}/auth/callback`);
});
