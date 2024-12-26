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
exports.ReviewsAdd = exports.bookingsById = exports.vehicleBbyId = exports.availableVehicles = exports.vehicleByCategory = exports.allvehicles = void 0;
// import { NextFunction, Request, Response } from "express";
const vehicles_1 = __importDefault(require("../../models/vehicles"));
const catcherror_1 = __importDefault(require("../../utils/catcherror"));
const User_1 = __importDefault(require("../../models/User"));
const Reviews_1 = __importDefault(require("../../models/Reviews"));
exports.allvehicles = (0, catcherror_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.vehicleByCategory = (0, catcherror_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.availableVehicles = (0, catcherror_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { pickupDate, dropofDate } = req.body;
    const userPickup = new Date(pickupDate);
    const userDropOff = new Date(dropofDate);
    // Validate dates
    if (isNaN(userPickup.getTime()) || isNaN(userDropOff.getTime())) {
        return res.status(400).json({ message: "Invalid dates provided" });
    }
    try {
        const checkAvaillity = yield vehicles_1.default.aggregate([
            {
                $match: {
                    bookings: {
                        $not: {
                            $elemMatch: {
                                $and: [
                                    { pickupDate: { $lt: userDropOff } },
                                    { dropoffDate: { $gt: userPickup } },
                                ],
                            },
                        },
                    },
                },
            },
        ]);
        if (checkAvaillity.length === 0) {
            return res
                .status(400)
                .json({ message: "Sorry, no available vehicles" });
        }
        return res
            .status(200)
            .json({ message: "Fetched successfully", checkAvaillity });
    }
    catch (error) {
        next(error);
    }
}));
exports.vehicleBbyId = (0, catcherror_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vehicleId = req.params.id;
    const vehicle = yield vehicles_1.default.findById(vehicleId).populate({
        path: "Reviews",
        populate: {
            path: 'userId',
            select: 'username'
        }
    });
    if (!vehicle) {
        return res.status(404).json({ message: "vehicle not found" });
    }
    return res.status(200).json({ message: "vehicle fetched", data: vehicle });
}));
exports.bookingsById = (0, catcherror_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const user = yield User_1.default.findOne({ _id: userId }).populate({
            path: 'Bookings', // Path to populate
            model: 'Bookings', // Model name of the referenced collection
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });
    }
    catch (error) {
        console.error("Error fetching user bookings:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
exports.ReviewsAdd = (0, catcherror_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { vehicleId } = req.params;
    const { userId, content } = req.body;
    try {
        const vehicle = yield vehicles_1.default.findById(vehicleId);
        if (!vehicle) {
            return res.status(404).json({ message: 'vehicle not found' });
        }
        if (!content) {
            return res.status(400).json({ message: 'content is empty' });
        }
        const newReview = new Reviews_1.default({
            userId: userId,
            content: content,
        });
        const user = yield User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'user not found' });
        }
        yield newReview.save();
        (_a = vehicle.Reviews) === null || _a === void 0 ? void 0 : _a.push(newReview._id);
        yield vehicle.save();
        (_b = user.Reviews) === null || _b === void 0 ? void 0 : _b.push(newReview._id);
        yield user.save();
        return res.status(201).json({ message: "review added successfully", review: newReview });
    }
    catch (error) {
        return res.status(500).json('internal server error');
    }
}));
// export const ReviewsGet=catcherror(async(req:Request,res:Response,next:NextFunction)=>{
//   const {vehicleId}=req.params
//   const vehicle=await vehicles.findById(vehicleId).populate('Reviews')
//   if(!vehicle){
//     return res.status(404).json({message:"vehicle not found"})
//   }
//   res.status(200).json({message:'reviews fetched successfully',data:vehicle})
// })
