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
exports.Adminauthmidd = void 0;
const catcherror_1 = __importDefault(require("../utils/catcherror"));
const apperror_1 = require("../utils/apperror");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.Adminauthmidd = (0, catcherror_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const token = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.admin_token) || ((_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(' ')[1]);
        if (!token) {
            return next(new apperror_1.apperror('You are not logged in. Please log in to access this resource.', 401));
        }
        jsonwebtoken_1.default.verify(token, process.env.ADMIN_SECRET, (error, decode) => {
            if (error) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            req.email = decode.email;
            next();
        });
    }
    catch (error) {
        return res.status(500).json({ messge: 'intrenel server error' });
    }
}));
