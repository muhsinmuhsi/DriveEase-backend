import express from 'express'
import { allvehicles, availableVehicles, bookingsById, vehicleBbyId, vehicleByCategory } from '../controlles/User/produntcontroll'
import {userauthmidd} from '../middlware/userauthmidd'
import { payment, verifyPayment } from '../controlles/User/paymentControll'
const router=express.Router()

// router.use(userauthmidd)
router.get('/allvehicles',allvehicles)
router.get('/vehicles/category/:categoryName',vehicleByCategory)
router.post('/availablevehicles',availableVehicles)
router.get('/vehicle/:id',vehicleBbyId);

//payment router 

router.post('/vehicle/payment/:userId',payment)
router.post('/vehicle/verifyPayment',verifyPayment)
router.get('/mybookings/:userId',bookingsById)

export default router