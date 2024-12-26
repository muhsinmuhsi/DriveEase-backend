"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userauth_1 = require("../controlles/User/userauth");
const userauthmidd_1 = require("../middlware/userauthmidd");
const router = express_1.default.Router();
router.post('/register', userauth_1.register);
router.post('/veryfyacount', userauthmidd_1.userauthmidd, userauth_1.verifyAccount);
router.post('/googleauth', userauth_1.googleAuth);
router.post('/Login', userauth_1.Login);
exports.default = router;
