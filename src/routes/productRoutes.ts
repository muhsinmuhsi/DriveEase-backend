import express from 'express'
import { allvehicles, availableVehicles, bookingsById, ReviewsAdd, vehicleBbyId, vehicleByCategory } from '../controlles/User/produntcontroll'
import {userauthmidd} from '../middlware/userauthmidd'
import { payment, verifyPayment } from '../controlles/User/paymentControll'
import { recommendationControl } from '../controlles/User/recemmendationController'
const router=express.Router()

 //router.use(userauthmidd)
router.get('/allvehicles',allvehicles)
router.get('/vehicles/category/:categoryName',vehicleByCategory)
router.post('/availablevehicles',availableVehicles)
router.get('/vehicle/:id',vehicleBbyId);

//payment router 

router.post('/vehicle/payment/:userId',payment)
router.post('/vehicle/verifyPayment',verifyPayment)
router.get('/mybookings/:userId',bookingsById)
router.post('/Reviews/add/:vehicleId',ReviewsAdd)
// router.get('/Reviews/:vehicleId',ReviewsGet)

//recommendations

router.get('/recommendations/:userId',recommendationControl)

export default router