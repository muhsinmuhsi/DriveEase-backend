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
exports.adminvehicleBbyId = exports.allbookings = exports.userById = exports.allusers = exports.adminVehicleByCategory = exports.adminallvehicles = void 0;
const catcherror_1 = __importDefault(require("../../utils/catcherror"));
const vehicles_1 = __importDefault(require("../../models/vehicles"));
const User_1 = __importDefault(require("../../models/User"));
const Bookings_1 = __importDefault(require("../../models/Bookings"));
exports.adminallvehicles = (0, catcherror_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vehicle = yield vehicles_1.default.find();
        if (!vehicle) {
            return res.status(404).json({ message: "Unable to fetch vehicle" });
        }
        return res
            .status(200)
            .json({ message: "Successfully fetched data", data: vehicle });
    }
    catch (error) {
        next(error); // Pass the error to the global error handler
    }
}));
exports.adminVehicleByCategory = (0, catcherror_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryName } = req.params;
    const vehicle = yield vehicles_1.default.find({
        $or: [{ category: { $regex: new RegExp(categoryName, "i") } }],
    });
    if (!vehicle) {
        return res.status(404).json({ message: "item not found" });
    }
    return res
        .status(200)
        .json({ message: "fetched by category", data: vehicle });
}));
exports.allusers = (0, catcherror_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.find();
        if (!users) {
            return res.status(404).json({ message: "Unable to fetch users" });
        }
        return res.status(200).json({ message: 'user fetched successfully ', data: users });
    }
    catch (error) {
        return res.status(500).json({ message: 'internal server error' });
    }
}));
exports.userById = (0, catcherror_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const user = yield User_1.default.findOne({ _id: userId }).populate('Bookings').lean();
        if (!user) {
            return res.status(404).json({ message: 'user not found' });
        }
        return res.status(200).json({ message: 'user fetched', data: user });
    }
    catch (error) {
        console.log(error, 'error');
        return res.status(500).json({ message: 'internal server error' });
    }
}));
exports.allbookings = (0, catcherror_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookings = yield Bookings_1.default.find().populate('userId').lean();
        if (!bookings) {
            return res.status(400).json({ message: 'unable to fetch bookings' });
        }
        return res.status(200).json({ message: 'bookings fetched success fully', data: bookings });
    }
    catch (error) {
        return res.status(500).json({ message: 'internal server error' });
    }
}));
exports.adminvehicleBbyId = (0, catcherror_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { vehicleId } = req.params;
    const vehicle = yield vehicles_1.default.findById(vehicleId);
    if (!vehicle) {
        return res.status(404).json({ message: "vehicle not found" });
    }
    return res.status(200).json({ message: "vehicle fetched", data: vehicle });
}));
