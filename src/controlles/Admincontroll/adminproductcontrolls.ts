import { NextFunction, Request, Response } from "express";
import carSchemajoi from "../../validation/productvalidate";
import vehicles from "../../models/vehicles";
import catcherror from "../../utils/catcherror";
import cloudinary from 'cloudinary';


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
      bookings:vehicle.bookings,
      category:vehicle.category
    })

    
    

    await newvehicle.save()
    return res.status(200).json({message:'product added successfully'})
})

export const updateVehicle=catcherror(async(req: any, res: Response, next: NextFunction)=>{
    const {vehicleId}=req.params
try {
    const vehicle=await vehicles.findById(vehicleId)
    if(!vehicle){
        return res.status(404).json({message:'vehicle not found'})
    }

    const {name,type,brand,seatingCapacity,pricePerDay,fuelType,transmission}=req.body

    if(name)vehicle.name=name;
    if(type)vehicle.type=type;
    if(brand)vehicle.brand=brand;
    if(seatingCapacity)vehicle.seatingCapacity=seatingCapacity;
    if(pricePerDay)vehicle.pricePerDay=pricePerDay;
    if(fuelType)vehicle.fuelType=fuelType;
    if(transmission)vehicle.transmission=transmission
    if(req.cloudinaryImageUrl)vehicle.image=req.cloudinaryImageUrl;

    await vehicle.save()

    return res.status(200).json({message:'product updated successfully'})
} catch (error) {
   return res.status(500).json({message:'internal server error'})
}
})

export const deleteVehicle=catcherror(async(req: Request, res: Response, next: NextFunction)=>{
    const {vehicleId}=req.params
    try {
        const vehicle=await vehicles.findByIdAndDelete(vehicleId)
        if(!vehicle){
            return res.status(404).json({message:"vehicle not found"})
        }

        res.status(201).json({message:"vehicle deleted ",})
    } catch (error) {
        return res.status(500).json({message:'internal server error'})
    }
})
