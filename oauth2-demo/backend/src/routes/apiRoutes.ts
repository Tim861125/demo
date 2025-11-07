import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// 受保護的個人資料端點
router.get('/profile', authMiddleware, (req: Request, res: Response) => {
  // authMiddleware 已經驗證 JWT 並將使用者資訊附加到 req.user
  res.json({
    success: true,
    user: req.user,
  });
});

export default router;
