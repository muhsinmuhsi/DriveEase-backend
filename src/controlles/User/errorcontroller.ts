import { NextFunction, Request, Response } from "express";

export=(err:any,req:Request,res:Response,next:NextFunction)=>{
   if (typeof err === 'string') {
      err = { message: err, statuscode: 400 }; // Default status code is 400 for bad requests
    }
    
 err.statuscode=err.statuscode||500;
 err.status=err.status||"error";

 res.status(err.statuscode).json({
    status:err.status,
    error:err,
    message:err.message,
    stack:err.stack,
 })
}