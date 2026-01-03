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
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: {
            rejectUnauthorized: false
        },
        connectionTimeout: 60 * 1000,
    });
    // Load and compile the template
    const templatePath = path_1.default.join(__dirname, 'template', 'bookingTemplate.html');
    const templateSource = fs_1.default.readFileSync(templatePath, 'utf8');
    const template = handlebars_1.default.compile(templateSource);
    // Inject data into the template
    const htmlContent = template(options.templateData);
    const mailOptions = {
        from: `"DRIVE EASE" <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        html: htmlContent
    };
    try {
        const info = yield transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.response);
        yield transporter.verify();
        console.log("SMTP connection successful");
    }
    catch (err) {
        console.error('Error while sending email:', err);
        throw new Error('Failed to send email: ' + err.message);
    }
});
exports.default = sendEmail;
