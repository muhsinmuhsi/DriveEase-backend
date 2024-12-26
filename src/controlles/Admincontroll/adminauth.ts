import { NextFunction,Request,Response } from "express";
import catcherror from "../../utils/catcherror";
import { config } from "dotenv";
import jwt from 'jsonwebtoken';

config()

export const Login=catcherror(async(req:Request,res:any,next:NextFunction)=>{
    try {
        const { email, password } = req.body;
    
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
          const token = jwt.sign({ email }, process.env.ADMIN_SECRET as string, { expiresIn: '1h' });

          const jwtExpireInDays = Number(process.env.JWT_EXPIRE_IN) || 7;

    if (!process.env.JWT_EXPIRE_IN) {
      console.warn('JWT_EXPIRE_IN is not defined. Defaulting to 7 days.');
    }

    const cookieOptions={
      expires:new Date (Date.now()+jwtExpireInDays* 24 * 60 * 60 * 1000),
      httponly:true,
      secure:process.env.NODE_ENV==='production',
      sameSite:process.env.NODE_ENV==='production'?'none':'Lax'
    };


          res.cookie("admin_token",token,cookieOptions);

    
          return res.status(200).json({ message: 'Admin logged successfully', token });
        }
    
        res.status(401).json({ message: 'Unauthorized' });
      } catch (error) {
        next(error);
      }
})

