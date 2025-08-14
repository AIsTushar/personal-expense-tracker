import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import config from "./index"; // your config file
import { AuthServices } from "../app/modules/Auth/auth.service";

passport.use(
  new GoogleStrategy(
    {
      clientID: config.google.client_id!,
      clientSecret: config.google.client_secret!,
      callbackURL: config.google.callback_url!,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await AuthServices.handleGoogleLogin(profile);
        done(null, user);
      } catch (error) {
        done(error as any, false);
      }
    }
  )
);

export default passport;
