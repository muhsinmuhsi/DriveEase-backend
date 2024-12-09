import express from 'express'
import { Login } from '../controlles/Admincontroll/adminauth'
import { addvehicles } from '../controlles/Admincontroll/admincontrolls'
import uploadImage from '../middlware/uploadimage'


const router=express.Router()
router.post('/login',Login)
router.post('/addproduct',uploadImage,addvehicles)
export default router   