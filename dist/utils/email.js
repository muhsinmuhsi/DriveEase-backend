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
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const handlebars_1 = __importDefault(require("handlebars"));
dotenv_1.default.config();
const sendEmail = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        host: process.env.BREVO_SMTP_HOST,
        port: Number(process.env.BREVO_SMTP_PORT),
        secure: false,
        auth: {
            user: process.env.BREVO_SMTP_USER,
            pass: process.env.BREVO_SMTP_PASS,
        },
    });
    yield transporter.verify();
    const __dirname = path_1.default.resolve();
    const templatePath = path_1.default.join(__dirname, "template", "bookingTemplate.html");
    const templateSource = fs_1.default.readFileSync(templatePath, "utf8");
    const template = handlebars_1.default.compile(templateSource);
    const htmlContent = template(options.templateData);
    yield transporter.sendMail({
        from: `"DriveEase" <${process.env.EMAIL_FROM}>`,
        to: options.email,
        subject: options.subject,
        html: htmlContent,
    });
    console.log("✅ Email sent successfully");
});
exports.default = sendEmail;
