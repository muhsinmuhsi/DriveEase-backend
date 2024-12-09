import { NextFunction, Request, Response } from "express";
import catcherror from "../../utils/catcherror";
import carSchemajoi from "../../validation/productvalidate";
import vehicles from "../../models/vehicles";


export const addvehicles=catcherror(async(req:any,res:Response,next:NextFunction)=>{
    const vehicle=await carSchemajoi.validateAsync(req.body);
    if(!vehicle){
      return res.status(403).json({message:'validation error on vehicle'})
    }
    
    const newvehicle= new vehicles({
      name:vehicle.name,
      type:vehicle.type,
      brand:vehicle.brand,
      seatingCapacity:vehicle.seatingCapacity,
      pricePerDay:vehicle.pricePerDay,
      fuelType:vehicle.fuelType,
      transmission:vehicle.transmission,
      image:req.cloudinaryImageUrl,
      bookings:vehicle.bookings
    })

    
    

    await newvehicle.save()
    return res.status(200).json({message:'product added successfully'})
})


