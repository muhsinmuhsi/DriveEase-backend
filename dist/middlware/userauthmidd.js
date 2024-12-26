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
exports.userauthmidd = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const apperror_1 = require("../utils/apperror");
const catcherror_1 = __importDefault(require("../utils/catcherror"));
exports.userauthmidd = (0, catcherror_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const SECRET_KEY = process.env.JWT_SECRET;
    const token = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token) || ((_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(' ')[1]);
    if (!token) {
        return next(new apperror_1.apperror('You are not logged in. Please log in to access this resource.', 401));
    }
    const decoded = jsonwebtoken_1.default.verify(token, SECRET_KEY);
    const currentUser = yield User_1.default.findById(decoded.id);
    if (!currentUser) {
        return next(new apperror_1.apperror('The user belonging to this token no longer exists.', 401));
    }
    req.user = currentUser; // Attach user to the request
    next();
}));
