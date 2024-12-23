import { NextFunction, Request, Response } from "express";
import catcherror from "../utils/catcherror";
import { apperror } from "../utils/apperror";
import  Jwt  from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config()


export const Adminauthmidd=catcherror(async(req:any,res:Response,next:NextFunction)=>{
    try {
        const token = req.cookies?.admin_token  || req.headers.authorization?.split(' ')[1];
        console.log(req.cookies.admin_token,'this is from adminauth');
        

    if(!token){
        return next(new apperror('You are not logged in. Please log in to access this resource.', 401));
    }   

    Jwt.verify(token,process.env.ADMIN_SECRET as string,(error:any,decode:any)=>{
        if(error){
            return  res.status(401).json({message:'Unauthorized'})
        }

        req.email=decode.email  
        next()

    })    
    } catch (error) {
        return  res.status(500).json({messge:'intrenel server error'})
    }
    

})