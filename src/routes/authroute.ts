import express from 'express'
import { register, verifyAccount,googleAuth, Login } from '../controlles/User/userauth';
import { userauthmidd } from '../middlware/userauthmidd';
import uploadImage from '../middlware/uploadimage';



const router=express.Router();

router.post('/register',uploadImage, register)
router.post('/veryfyacount',userauthmidd,verifyAccount)
router.post('/googleauth',googleAuth)
router.post('/Login',Login)

export default router