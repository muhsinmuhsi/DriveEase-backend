"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminauth_1 = require("../controlles/Admincontroll/adminauth");
const admincontrolls_1 = require("../controlles/Admincontroll/admincontrolls");
const uploadimage_1 = __importDefault(require("../middlware/uploadimage"));
const adminproductcontrolls_1 = require("../controlles/Admincontroll/adminproductcontrolls");
const Adminauthmidd_1 = require("../middlware/Adminauthmidd");
const router = express_1.default.Router();
router.post('/login', adminauth_1.Login);
router.use(Adminauthmidd_1.Adminauthmidd);
router.post('/addVehicle', uploadimage_1.default, adminproductcontrolls_1.addvehicles);
router.get('/allVehicles', admincontrolls_1.adminallvehicles);
router.get('/vehicle/category/:categoryName', admincontrolls_1.adminVehicleByCategory);
router.get('/users', admincontrolls_1.allusers);
router.get('/user/:userId', admincontrolls_1.userById);
router.get('/bookings', admincontrolls_1.allbookings);
router.put('/vehicle/update/:vehicleId', uploadimage_1.default, adminproductcontrolls_1.updateVehicle);
router.delete('/vehicle/delete/:vehicleId', adminproductcontrolls_1.deleteVehicle);
router.get('/vehiclebyId/:vehicleId', admincontrolls_1.adminvehicleBbyId);
router.get('/booking-stats', adminproductcontrolls_1.bookingsStats);
exports.default = router;
