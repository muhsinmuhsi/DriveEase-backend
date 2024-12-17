import express from 'express'
import { register, verifyAccount,googleAuth, Login } from '../controlles/User/userauth';
import { userauthmidd } from '../middlware/userauthmidd';



const router=express.Router();

router.post('/register',register)
router.post('/veryfyacount',userauthmidd,verifyAccount)
router.post('/googleauth',googleAuth)
router.post('/Login',userauthmidd,Login)

export default router