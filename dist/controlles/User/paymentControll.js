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
exports.verifyPayment = exports.payment = void 0;
const razorpay_1 = __importDefault(require("razorpay"));
const dotenv_1 = __importDefault(require("dotenv"));
const catcherror_1 = __importDefault(require("../../utils/catcherror"));
const crypto_1 = __importDefault(require("crypto"));
const Bookings_1 = __importDefault(require("../../models/Bookings"));
const vehicles_1 = __importDefault(require("../../models/vehicles"));
const User_1 = __importDefault(require("../../models/User"));
const email_1 = __importDefault(require("../../utils/email"));
dotenv_1.default.config();
const razorpay = new razorpay_1.default({
    key_id: process.env.Razorpay_key_id,
    key_secret: process.env.Razorpay_key_secret,
});
exports.payment = (0, catcherror_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const { amount, carId, vehicleName, startDate, endDate } = req.body;
    console.log('this is payment rounte');
    const options = {
        amount: amount * 100,
        currency: 'INR',
        receipt: `receipt_order_${Math.random().toString(36).substring(2, 15)}`,
        notes: {
            vehicleName: vehicleName,
            carId,
            userId: userId,
            amount: amount,
            startDate: startDate,
            endDate: endDate
        }
    };
    const order = yield razorpay.orders.create(options);
    res.status(200).json({
        id: order.id,
        amount: order.amount,
        currency: order.currency
    });
}));
exports.verifyPayment = (0, catcherror_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    console.log('this i s veryfy payment ');
    const hmac = crypto_1.default.createHmac('sha256', process.env.Razorpay_key_secret);
    hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
    const generatedsignature = hmac.digest('hex');
    if (generatedsignature !== razorpay_signature) {
        return res.status(400).send(' payment verification failed');
    }
    const order = yield razorpay.orders.fetch(razorpay_order_id);
    if (!order) {
        return res.status(400).json({ message: 'order not found' });
    }
    const { userId, carId, vehicleName, startDate, endDate, amount } = order.notes;
    console.log('userid from veryfyPayment', userId);
    const newbooking = new Bookings_1.default({
        userId,
        vehicleName,
        carId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        amount: amount,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id
    });
    yield newbooking.save();
    const startDatelocal = new Date(startDate).toLocaleDateString();
    const endDatelocal = new Date(startDate).toLocaleDateString();
    const vehicle = yield vehicles_1.default.findOne({ name: vehicleName });
    if (!vehicle) {
        return res.status(400).json({ message: 'vehicle not found' });
    }
    (_a = vehicle === null || vehicle === void 0 ? void 0 : vehicle.bookings) === null || _a === void 0 ? void 0 : _a.push({
        pickupDate: new Date(startDate).toISOString(),
        dropoffDate: new Date(endDate).toISOString(),
    });
    const user = yield User_1.default.findOne({ _id: userId });
    if (!user) {
        return res.status(404).json({ message: 'user not found' });
    }
    yield vehicle.save();
    yield (0, email_1.default)({
        email: user.email,
        subject: "Vehicle Booking Confirmation",
        templateData: {
            userName: user.name,
            vehicleName: vehicleName,
            startDate: startDatelocal,
            endDate: endDatelocal
        }
    });
    (_b = user === null || user === void 0 ? void 0 : user.Bookings) === null || _b === void 0 ? void 0 : _b.push(newbooking._id);
    yield user.save();
    return res.status(200).json({ message: "Payment verified and booking saved successfully" });
}));
