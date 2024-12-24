import express from 'express'
import {Login}  from '../controlles/Admincontroll/adminauth'
import {  adminallvehicles, adminvehicleBbyId, adminVehicleByCategory, allbookings, allusers, userById } from '../controlles/Admincontroll/admincontrolls'
import uploadImage from '../middlware/uploadimage'
import { addvehicles, bookingsStats, deleteVehicle, updateVehicle } from '../controlles/Admincontroll/adminproductcontrolls'
import { Adminauthmidd } from '../middlware/Adminauthmidd'


const router=express.Router()
router.post('/login',Login)
router.use(Adminauthmidd)
router.post('/addVehicle',uploadImage,addvehicles)
router.get('/allVehicles',adminallvehicles)
router.get('/vehicle/category/:categoryName',adminVehicleByCategory)
router.get('/users',allusers)
router.get('/user/:userId',userById)
router.get('/bookings',allbookings)
router.put('/vehicle/update/:vehicleId',uploadImage,updateVehicle)
router.delete('/vehicle/delete/:vehicleId',deleteVehicle)
router.get('/vehiclebyId/:vehicleId',adminvehicleBbyId)
router.get('/booking-stats',bookingsStats)


export default router   