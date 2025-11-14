import { Router, Request, Response } from 'express';
import passport from '../config/passport';
import jwt from 'jsonwebtoken';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRY = process.env.JWT_EXPIRY || '24h';
const FRONTEND_CALLBACK_URL = process.env.FRONTEND_CALLBACK_URL!;
const TEST_EMAIL = process.env.EMAIL;
const TEST_PASSWORD = process.env.PASSWORD;

// OAuth 流程起點：將使用者重導向到 Google 授權頁面
router.get(
  '/login',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
  })
);

// Google 授權成功後的回調端點
router.get(
  '/callback',
  passport.authenticate('google', {
    failureRedirect: '/',
    session: false
  }),
  (req: Request, res: Response) => {
    try {

      const user = req.user as {
        id: string;
        name: string;
        email: string;
        avatar: string;
      };

      if (!user) {
        res.redirect(`${FRONTEND_CALLBACK_URL}?error=authentication_failed`);
        return;
      }

      const token = jwt.sign(
        {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRY }
      );

      res.redirect(`${FRONTEND_CALLBACK_URL}?token=${token}`);
    } catch (error) {
      console.error('Error in auth callback:', error);
      res.redirect(`${FRONTEND_CALLBACK_URL}?error=server_error`);
    }
  }
);

// 測試用登入端點（僅供開發測試使用）
router.post('/test-login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  // 驗證帳號密碼
  if (email === TEST_EMAIL && password === TEST_PASSWORD) {
    // 生成測試用戶的 JWT token
    const token = jwt.sign(
      {
        id: 'test-user-id',
        name: 'Wu Xin Ding',
        email: email,
        avatar: 'https://lh3.googleusercontent.com/a/default-user',
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );

    res.json({
      success: true,
      token: token,
      user: {
        id: 'test-user-id',
        name: 'Wu Xin Ding',
        email: email,
        avatar: 'https://lh3.googleusercontent.com/a/default-user',
      }
    });
  } else {
    res.status(401).json({
      success: false,
      error: 'Invalid email or password'
    });
  }
});

export default router;
