"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Login = exports.googleAuth = exports.googleVerify = exports.verifyAccount = exports.register = void 0;
const Uservalidation_1 = __importDefault(require("../validation/Uservalidation"));
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const catcherror_1 = __importDefault(require("../utils/catcherror"));
const apperror_1 = require("../utils/apperror");
const genereteOtp_1 = require("../utils/genereteOtp");
const email_1 = __importDefault(require("../utils/email"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const google_auth_library_1 = require("google-auth-library");
dotenv_1.default.config();
const signtoken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE_IN || '1h',
    });
};
const createsendToken = (user, statuscode, res, message) => {
    const token = signtoken(user._id);
    console.log('hhhhhhhhhhhh', user);
    const jwtExpireInDays = Number(process.env.JWT_EXPIRE_IN) || 7;
    if (!process.env.JWT_EXPIRE_IN) {
        console.warn('JWT_EXPIRE_IN is not defined. Defaulting to 7 days.');
    }
    const cookieOptions = {
        expires: new Date(Date.now() + jwtExpireInDays * 24 * 60 * 60 * 1000),
        httponly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'Lax'
    };
    res.cookie("token", token, cookieOptions);
    user.password = undefined;
    user.otp = undefined;
    res.status(statuscode).json({
        status: 'success',
        message,
        token,
        data: {
            user,
        },
    });
};
exports.register = (0, catcherror_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { value, error } = Uservalidation_1.default.validate(req.body);
    console.log('from regissternn', req.body);
    if (error) {
        return res.status(400).json({ messege: 'validation error ' });
    }
    const { username, email, password } = value;
    try {
        const isexistinguser = yield User_1.default.findOne({ email: email });
        if (isexistinguser) {
            return next(new apperror_1.apperror('Email already registered', 400));
        }
        const otp = (0, genereteOtp_1.generateOtp)();
        const otpexpires = Date.now() + 24 * 60 * 60 * 1000;
        const hashedpassword = yield bcryptjs_1.default.hash(password, 10);
        const newuser = new User_1.default({
            username: username,
            email: email,
            password: hashedpassword,
            otp: otp,
            otpExpires: otpexpires
        });
        yield newuser.save();
        try {
            yield (0, email_1.default)({
                email: newuser.email,
                subject: "OTP for email verification",
                html: `<h1>your otp is: ${otp}</h1>`
            });
            createsendToken(newuser, 200, res, 'Registration successful');
        }
        catch (error) {
            yield User_1.default.findByIdAndDelete(newuser.id);
            return next(new apperror_1.apperror('There is an error sending the email. Try again', 500));
        }
    }
    catch (error) {
        return res.status(500).json({ message: 'internal server error' });
    }
}));
exports.verifyAccount = (0, catcherror_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp } = req.body;
    if (!otp) {
        return next(new apperror_1.apperror('OTP is required', 400));
    }
    const user = req.user;
    if (!user) {
        return next(new apperror_1.apperror('User not found', 401));
    }
    if (user.otp !== otp) {
        return next(new apperror_1.apperror('Invalid OTP', 401));
    }
    if (Date.now() > (user.otpExpires || 0)) {
        return next(new apperror_1.apperror('OTP has expired. Please request a new OTP.', 410));
    }
    user.isverified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    yield user.save({ validateBeforeSave: false });
    createsendToken(user, 200, res, 'Email has been verified');
}));
const client = new google_auth_library_1.OAuth2Client(process.env.CLIENT_ID);
const googleVerify = (idtoken) => __awaiter(void 0, void 0, void 0, function* () {
    const ticket = yield client.verifyIdToken({
        idToken: idtoken,
        audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload) {
        throw new Error("Invalid ID token: Payload is undefined");
    }
    const { email, email_verified, name, picture, sub } = payload;
    if (!email_verified) {
        throw new Error("Email is not verified");
    }
    return { email, picture, name, sub };
});
exports.googleVerify = googleVerify;
exports.googleAuth = (0, catcherror_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { idtoken } = req.body;
    console.log('thsi is gooogle auth', idtoken);
    const { email, picture, name, sub } = yield (0, exports.googleVerify)(idtoken);
    let user = yield User_1.default.findOne({ email });
    const hashedpassword = yield bcryptjs_1.default.hash(sub, 10);
    if (!user) {
        user = yield User_1.default.create({ email, username: name, profileImg: picture, password: hashedpassword, isverified: true });
        createsendToken(user, 201, res, "user registered successfully");
    }
    return res.status(400).json({ message: "User already existed" });
}));
exports.Login = (0, catcherror_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const isUserVaild = yield User_1.default.findOne({ email });
    if (!isUserVaild) {
        return res.status(404).json({ error: 'user not found' });
    }
    const comparePass = bcryptjs_1.default.compareSync(password, isUserVaild.password);
    if (!comparePass) {
        return res.status(404).json({ error: "wrong credential" });
    }
    createsendToken(isUserVaild, 201, res, 'user login success fully');
}));
