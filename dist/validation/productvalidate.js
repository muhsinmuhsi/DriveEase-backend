"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const carSchemajoi = joi_1.default.object({
    name: joi_1.default.string().required(),
    type: joi_1.default.string().required(),
    brand: joi_1.default.string().required(),
    seatingCapacity: joi_1.default.number().integer().required(),
    pricePerDay: joi_1.default.number().required(),
    fuelType: joi_1.default.string().valid("Petrol", "Diesel", "Electric").required(),
    transmission: joi_1.default.string().valid("Automatic", "Manual").required(),
    category: joi_1.default.string().valid("Bike", "EconomyCar", "Luxury").required(),
    bookings: joi_1.default.array()
        .items(joi_1.default.object({
        pickupDate: joi_1.default.date().iso().required(),
        dropoffDate: joi_1.default.date().iso().required(),
    }))
        .default([]),
});
exports.default = carSchemajoi;
