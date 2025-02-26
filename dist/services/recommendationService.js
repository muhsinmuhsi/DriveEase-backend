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
exports.getRecommendedCars = void 0;
const Bookings_1 = __importDefault(require("../models/Bookings"));
// Cosine Similarity Function
const cosineSimilarity = (vecA, vecB) => {
    const dotProduct = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, val) => sum + Math.pow(val, 2), 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, val) => sum + Math.pow(val, 2), 0));
    return magnitudeA && magnitudeB ? dotProduct / (magnitudeA * magnitudeB) : 0;
};
// Function to Get AI-Based Car Recommendations
const getRecommendedCars = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch all bookings
        const bookings = yield Bookings_1.default.find();
        // Step 1: Create User-Car Matrix
        const userCarMatrix = {};
        bookings.forEach(({ userId, carId, amount }) => {
            if (!userId || !carId) {
                // console.warn("Skipping invalid booking:", { userId, carId });
                return; // Skip invalid entries
            }
            if (!userCarMatrix[userId.toString()])
                userCarMatrix[userId.toString()] = {};
            userCarMatrix[userId.toString()][carId.toString()] = amount;
        });
        // Get unique users & cars
        const users = Object.keys(userCarMatrix);
        const cars = Array.from(new Set(bookings.map((b) => b.carId.toString())));
        // Step 2: Convert to Vectors
        const userVectors = users.map((user) => cars.map((car) => { var _a; return ((_a = userCarMatrix[user]) === null || _a === void 0 ? void 0 : _a[car]) || 0; }));
        // Step 3: Find Most Similar User
        const targetUserIndex = users.indexOf(userId);
        if (targetUserIndex === -1)
            return [];
        const similarities = users.map((_, i) => i !== targetUserIndex
            ? cosineSimilarity(userVectors[targetUserIndex], userVectors[i])
            : -1);
        // console.log("Users:", users);
        // console.log("Cars:", cars);
        // console.log("User Vectors:", userVectors);
        // console.log("Target User Index:", targetUserIndex);
        // console.log("User Vector for Target User:", userVectors[targetUserIndex]);
        // console.log("Similarities:", similarities);
        let mostSimilarUserIndex = similarities.findIndex(score => score > 0);
        if (mostSimilarUserIndex === -1) {
            // console.warn("No strong similar user found, trying the next best.");
            mostSimilarUserIndex = similarities.indexOf(Math.max(...similarities)); // Use even if it's 0
        }
        // Step 4: Get Cars Recommended from Most Similar User
        const mostSimilarUser = users[mostSimilarUserIndex];
        const recommendedCars = Object.keys(userCarMatrix[mostSimilarUser] || {}).filter((car) => { var _a; return !((_a = userCarMatrix[userId]) === null || _a === void 0 ? void 0 : _a[car]); });
        // console.log('recommended cars',recommendedCars);
        return recommendedCars;
    }
    catch (error) {
        console.error("Error in AI Recommendations:", error);
        return [];
    }
});
exports.getRecommendedCars = getRecommendedCars;
