import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const BACKEND_URL = process.env.BACKEND_URL!;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `${BACKEND_URL}/auth/callback`,
    },
    (accessToken, refreshToken, profile, done) => {
      // 在實際應用中，這裡會查詢或建立使用者記錄
      // 對於展示目的，我們直接使用 Google 提供的 profile
      const user = {
        id: profile.id,
        name: profile.displayName,
        email: profile.emails?.[0]?.value || '',
        avatar: profile.photos?.[0]?.value || '',
      };

      return done(null, user);
    }
  )
);

// 序列化使用者（存入 session，但在這個 OAuth 流程中我們不使用 session）
passport.serializeUser((user, done) => {
  done(null, user);
});

// 反序列化使用者
passport.deserializeUser((user: any, done) => {
  done(null, user);
});

export default passport;
