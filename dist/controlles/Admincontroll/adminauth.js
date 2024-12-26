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
exports.Login = void 0;
const catcherror_1 = __importDefault(require("../../utils/catcherror"));
const dotenv_1 = require("dotenv");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
(0, dotenv_1.config)();
exports.Login = (0, catcherror_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jsonwebtoken_1.default.sign({ email }, process.env.ADMIN_SECRET, { expiresIn: '1h' });
            const jwtExpireInDays = Number(process.env.JWT_EXPIRE_IN) || 7;
            if (!process.env.JWT_EXPIRE_IN) {
                console.warn('JWT_EXPIRE_IN is not defined. Defaulting to 7 days.');
            }
            const cookieOptions = {
                expires: new Date(Date.now() + jwtExpireInDays * 24 * 60 * 60 * 1000),
                httpOnly: true,
                secure: false, // Set to true only in production
                sameSite: 'Lax', // Allows cookies for same-origin requests
            };
            res.cookie("admin_token", token, cookieOptions);
            return res.status(200).json({ message: 'Admin logged successfully', token });
        }
        res.status(401).json({ message: 'Unauthorized' });
    }
    catch (error) {
        next(error);
    }
}));
