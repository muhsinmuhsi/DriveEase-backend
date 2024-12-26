"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const BookingSchema = new mongoose_1.Schema({
    pickupDate: {
        type: Date,
        required: true,
    },
    dropoffDate: {
        type: Date,
        required: true,
    },
});
const vehicleSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    seatingCapacity: {
        type: Number
    },
    pricePerDay: {
        type: Number,
        required: true
    },
    fuelType: {
        type: String,
        enum: ["Petrol", "Diesel", "Electric"], // Restrict to specific values
        required: true,
    },
    transmission: {
        type: String,
        enum: ["Automatic", "Manual"], // Restrict to specific values
        required: true,
    },
    category: {
        type: String,
        enum: ["Bike", "EconomyCar", "Luxury"],
        required: true
    },
    image: {
        type: String,
    },
    bookings: {
        type: [BookingSchema],
        default: []
    },
    Reviews: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Reviews'
        }],
}, { timestamps: true });
exports.default = mongoose_1.default.model('vehicle', vehicleSchema);
