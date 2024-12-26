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
exports.bookingsStats = exports.deleteVehicle = exports.updateVehicle = exports.addvehicles = void 0;
const productvalidate_1 = __importDefault(require("../../validation/productvalidate"));
const vehicles_1 = __importDefault(require("../../models/vehicles"));
const catcherror_1 = __importDefault(require("../../utils/catcherror"));
const Bookings_1 = __importDefault(require("../../models/Bookings"));
exports.addvehicles = (0, catcherror_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vehicle = yield productvalidate_1.default.validateAsync(req.body);
    if (!vehicle) {
        return res.status(403).json({ message: 'validation error on vehicle' });
    }
    const newvehicle = new vehicles_1.default({
        name: vehicle.name,
        type: vehicle.type,
        brand: vehicle.brand,
        seatingCapacity: vehicle.seatingCapacity,
        pricePerDay: vehicle.pricePerDay,
        fuelType: vehicle.fuelType,
        transmission: vehicle.transmission,
        image: req.cloudinaryImageUrl,
        bookings: vehicle.bookings,
        category: vehicle.category
    });
    yield newvehicle.save();
    return res.status(200).json({ message: 'product added successfully' });
}));
exports.updateVehicle = (0, catcherror_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { vehicleId } = req.params;
    try {
        const vehicle = yield vehicles_1.default.findById(vehicleId);
        if (!vehicle) {
            return res.status(404).json({ message: 'vehicle not found' });
        }
        const { name, type, brand, seatingCapacity, pricePerDay, fuelType, transmission } = req.body;
        if (name)
            vehicle.name = name;
        if (type)
            vehicle.type = type;
        if (brand)
            vehicle.brand = brand;
        if (seatingCapacity)
            vehicle.seatingCapacity = seatingCapacity;
        if (pricePerDay)
            vehicle.pricePerDay = pricePerDay;
        if (fuelType)
            vehicle.fuelType = fuelType;
        if (transmission)
            vehicle.transmission = transmission;
        if (req.cloudinaryImageUrl)
            vehicle.image = req.cloudinaryImageUrl;
        yield vehicle.save();
        return res.status(200).json({ message: 'product updated successfully' });
    }
    catch (error) {
        return res.status(500).json({ message: 'internal server error' });
    }
}));
exports.deleteVehicle = (0, catcherror_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { vehicleId } = req.params;
    try {
        const vehicle = yield vehicles_1.default.findByIdAndDelete(vehicleId);
        if (!vehicle) {
            return res.status(404).json({ message: "vehicle not found" });
        }
        res.status(201).json({ message: "vehicle deleted ", });
    }
    catch (error) {
        return res.status(500).json({ message: 'internal server error' });
    }
}));
exports.bookingsStats = (0, catcherror_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookingStats = yield Bookings_1.default.aggregate([
            {
                $group: {
                    _id: { month: { $month: { $toDate: "$startDate" } } },
                    totalBookings: { $sum: 1 },
                    totalAmount: { $sum: "$amount" },
                },
            },
            {
                $sort: { "_id.month": 1 },
            }
        ]);
        const formattedStats = bookingStats.map((stat) => ({
            month: getMonthName(stat._id.month),
            totalBookings: stat.totalBookings,
            totalAmount: stat.totalAmount
        }));
        res.json({ success: true, data: formattedStats });
    }
    catch (error) {
        console.error("Error fetching booking stats:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}));
function getMonthName(month) {
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    return months[month - 1];
}
