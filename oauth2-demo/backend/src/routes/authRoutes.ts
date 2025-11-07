import { Router, Request, Response } from 'express';
import passport from '../config/passport';
import jwt from 'jsonwebtoken';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRY = process.env.JWT_EXPIRY || '24h';
const FRONTEND_CALLBACK_URL = process.env.FRONTEND_CALLBACK_URL!;

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

export default router;
