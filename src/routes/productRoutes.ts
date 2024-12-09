import express from 'express'
import { allvehicles, availableVehicles, vehicleByCategory } from '../controlles/User/produntcontroll'

const router=express.Router()

router.get('/allvehicles',allvehicles)
router.get('/vehicles/category/:categoryName',vehicleByCategory)
router.get('/availablevehicles',availableVehicles)

export default router