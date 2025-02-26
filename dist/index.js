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
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const authroute_1 = __importDefault(require("./routes/authroute"));
const cors_1 = __importDefault(require("cors"));
const errorcontroller_1 = __importDefault(require("./controlles/User/errorcontroller"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const adminroutes_1 = __importDefault(require("./routes/adminroutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
app.use((0, cookie_session_1.default)({
    name: "session",
    keys: ['DriveEase'],
    maxAge: 24 * 60 * 60 * 100
}));
app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    next();
});
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(express_1.default.json());
//basic routes
app.use('/api/users', authroute_1.default);
app.use('/api/admin', adminroutes_1.default);
app.use('/api/users', productRoutes_1.default);
app.use(errorcontroller_1.default);
//database connecting
if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not defined in environment variables');
}
function connectDB() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(process.env.MONGO_URI, { dbName: "DriveEase" });
            console.log('DB connected successfully');
        }
        catch (error) {
            console.error('db connecting failed');
        }
    });
}
connectDB();
//port listen
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8080;
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is in use. Trying another port...`);
        const newPort = PORT + 1;
        app.listen(newPort, () => {
            console.log(`Server running on port ${newPort}`);
        });
    }
    else {
        console.error(err);
    }
});
