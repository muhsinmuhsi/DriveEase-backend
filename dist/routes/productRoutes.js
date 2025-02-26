"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const produntcontroll_1 = require("../controlles/User/produntcontroll");
const paymentControll_1 = require("../controlles/User/paymentControll");
const recemmendationController_1 = require("../controlles/User/recemmendationController");
const router = express_1.default.Router();
//router.use(userauthmidd)
router.get('/allvehicles', produntcontroll_1.allvehicles);
router.get('/vehicles/category/:categoryName', produntcontroll_1.vehicleByCategory);
router.post('/availablevehicles', produntcontroll_1.availableVehicles);
router.get('/vehicle/:id', produntcontroll_1.vehicleBbyId);
//payment router 
router.post('/vehicle/payment/:userId', paymentControll_1.payment);
router.post('/vehicle/verifyPayment', paymentControll_1.verifyPayment);
router.get('/mybookings/:userId', produntcontroll_1.bookingsById);
router.post('/Reviews/add/:vehicleId', produntcontroll_1.ReviewsAdd);
// router.get('/Reviews/:vehicleId',ReviewsGet)
//recommendations
router.get('/recommendations/:userId', recemmendationController_1.recommendationControl);
exports.default = router;
