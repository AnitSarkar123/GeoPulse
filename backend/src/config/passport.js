require("dotenv").config();
const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const User = require("../models/User");
const logger = require("../utils/logger");

const CALLBACK_URL = `http://localhost:${process.env.PORT || 5000}/api/auth/google/callback`;
console.log(`\n🔗 Google OAuth Redirect URL: ${CALLBACK_URL}\n`);

passport.use(
  new GoogleStrategy(
    {
      clientID:     process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:  CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const email    = profile.emails?.[0]?.value || "";
        const name     = profile.displayName || "GeoPulse User";
        const avatar   = profile.photos?.[0]?.value || null;

        let user = await User.findOne({ googleId });

        if (!user) {
          user = await User.create({ googleId, email, name, avatar });
          logger.info(`New user created: ${email}`, "passport");
        } else {
          // Keep avatar fresh
          if (user.avatar !== avatar) {
            user.avatar = avatar;
            await user.save();
          }
        }

        return done(null, user);
      } catch (err) {
        logger.error(`Passport strategy error: ${err.message}`, "passport");
        return done(err, null);
      }
    }
  )
);

// We use JWT — no session serialisation needed, but passport middleware requires these stubs
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
