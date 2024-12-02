import passport from 'passport';
import {Strategy as GoogleStrategy} from'passport-google-oauth20';
import User from '../models/User';

passport.use(new GoogleStrategy({
            clientID: process.env.CLIENT_ID as string,
			clientSecret: process.env.CLIENT_SECRET as string,
			callbackURL: "/auth/google/callback",
			scope: ["profile", "email"],
},
function (accessToken, refreshToken, profile, callback) {
    callback(null, profile);
}
))


