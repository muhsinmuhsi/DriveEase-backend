import { NextFunction,Request,Response } from "express";
import catcherror from "../../utils/catcherror";
import { config } from "dotenv";
import jwt from 'jsonwebtoken';

config()

export const Login=catcherror(async(req:Request,res:Response,next:NextFunction)=>{
    const {email,password}=req.body
    if(email===process.env.ADMIN_EMAIL&&password===process.env.ADMIN_PASSWORD){
        const token=jwt.sign({email},process.env.ADMIN_SECRET as string)

        res.cookie('token',token,{httpOnly:true})

        return res.status(200).json({message:'admin logged successfully',token})
    }else{
        res.status(401).json({message:'unauthorized'})
    }
})

