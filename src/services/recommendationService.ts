import Booking, { bookings} from "../models/Bookings";
import mongoose from "mongoose";

// Cosine Similarity Function
const cosineSimilarity = (vecA: number[], vecB: number[]): number => {
  const dotProduct = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, val) => sum + val ** 2, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, val) => sum + val ** 2, 0));
  return magnitudeA && magnitudeB ? dotProduct / (magnitudeA * magnitudeB) : 0;
};

// Function to Get AI-Based Car Recommendations
export const getRecommendedCars = async (userId: string): Promise<string[]> => {
  try {
    // Fetch all bookings
    const bookings: bookings[] = await Booking.find();
    

    // Step 1: Create User-Car Matrix
    const userCarMatrix: Record<string, Record<string, number>> = {};
    bookings.forEach(({ userId, carId, amount }) => {
        if (!userId || !carId) {
            console.warn("Skipping invalid booking:", { userId, carId });
            return; // Skip invalid entries
          }

      if (!userCarMatrix[userId.toString()]) userCarMatrix[userId.toString()] = {};
      userCarMatrix[userId.toString()][carId.toString()] = amount;
    });

    // Get unique users & cars
    const users = Object.keys(userCarMatrix);
    const cars = Array.from(new Set(bookings.map((b) => b.carId.toString())));

    // Step 2: Convert to Vectors
    const userVectors = users.map((user) =>
      cars.map((car) => userCarMatrix[user]?.[car] || 0)
    );

    // Step 3: Find Most Similar User
    const targetUserIndex = users.indexOf(userId);
    if (targetUserIndex === -1) return [];

    const similarities = users.map((_, i) =>
      i !== targetUserIndex
        ? cosineSimilarity(userVectors[targetUserIndex], userVectors[i])
        : -1
    );

    console.log("Users:", users);
console.log("Cars:", cars);
console.log("User Vectors:", userVectors);
console.log("Target User Index:", targetUserIndex);
console.log("User Vector for Target User:", userVectors[targetUserIndex]);
console.log("Similarities:", similarities);


let mostSimilarUserIndex = similarities.findIndex(score => score > 0);

if (mostSimilarUserIndex === -1) {
    console.warn("No strong similar user found, trying the next best.");
    mostSimilarUserIndex = similarities.indexOf(Math.max(...similarities)); // Use even if it's 0
}

    // Step 4: Get Cars Recommended from Most Similar User
    const mostSimilarUser = users[mostSimilarUserIndex];
    const recommendedCars = Object.keys(userCarMatrix[mostSimilarUser] || {}).filter(
      (car) => !userCarMatrix[userId]?.[car]
    );
console.log('recommended cars',recommendedCars);




    return recommendedCars;
  } catch (error) {
    console.error("Error in AI Recommendations:", error);
    return [];
  }
};
