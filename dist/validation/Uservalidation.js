"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const uservalidation = joi_1.default.object({
    username: joi_1.default.string().min(3).max(30).required()
        .messages({
        'string.empty': 'Username is required',
        'string.min': 'Username should have at least 3 characters',
        'any.required': 'Username is a required field'
    }),
    email: joi_1.default.string().email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net", "org"] }
    }).lowercase().required().trim()
        .messages({
        'string.email': 'Please provide a valid email',
        'any.required': 'Email is a required field'
    }),
    // image: joi.string().uri().required()
    //   .messages({
    //     'string.empty': 'Image URL is required',
    //     'string.uri': 'Image must be a valid URL'
    //   }),
    password: joi_1.default.string().min(8).required()
        .pattern(new RegExp("^[a-zA-Z0-9]{8,30}$"))
        .messages({
        'string.pattern.base': 'Password must contain only alphanumeric characters',
        'string.min': 'Password should have at least 8 characters',
        'any.required': 'Password is a required field'
    }),
    cpassword: joi_1.default.string().min(8).required()
        .pattern(new RegExp("^[a-zA-Z0-9]{8,30}$"))
        .messages({
        'string.pattern.base': 'Password must contain only alphanumeric characters',
        'string.min': 'Password should have at least 8 characters',
        'any.required': 'Password is a required field'
    })
});
exports.default = uservalidation;
