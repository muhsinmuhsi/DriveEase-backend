// import { NextFunction, Request, Response } from "express";
import vehicles, { Booking, vehicleSchema } from "../../models/vehicles";

import { Request, Response, NextFunction } from 'express';
import catcherror from "../../utils/catcherror";

export const allvehicles = catcherror(async (req: Request, res: Response, next: NextFunction):Promise<any> => {
  try {
    const vehicle = await vehicles.find();

    if (!vehicle) {
      return res.status(404).json({ message: "Unable to fetch vehicle" });
    }

    return res.status(200).json({ message: 'Successfully fetched data', data: vehicle });
  } catch (error) {
    next(error); // Pass the error to the global error handler
  }
});

export const vehicleByCategory =catcherror(async(req:Request,res:Response,next:NextFunction):Promise<any>=>{
    const{categoryName}=req.params
    
  const vehicle=await vehicles.find({
    $or:[
        {category:{$regex:new RegExp(categoryName,'i')}}
    ]
})

if(!vehicle){
    return res.status(404).json({message:'item not found'})
}

return res.status(200).json({message:'fetched by category',data:vehicle})
})

export const availableVehicles=catcherror(async(req:Request,res:Response,next:NextFunction)=>{
   const {pickupDate,dropofDate}=req.body;

   const userPickup=new Date(pickupDate);
   const userDropOff=new Date(dropofDate);
console.log('kskksk',userPickup);

   try {

    const checkAvaillity = await vehicles.aggregate([
      {
          $match: {
              bookings: {
                  $not: {
                      $elemMatch: {
                          $or: [
                              { pickupDate: { $lt: userDropOff } },
                              { dropoffDate: { $gt: userPickup } }
                          ]
                      }
                  }
              }
          }
      }
  ]);
  

    if(checkAvaillity.length==0){
      return res.status(400).json({message:'Sorry, no available vehicles'})
    }
    return res.status(200).json({message:'Fetched successfully',checkAvaillity})
    
   } catch (error) {
    next(error)
   }

   
})
