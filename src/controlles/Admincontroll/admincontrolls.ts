import { NextFunction, Request, Response } from "express";
import catcherror from "../../utils/catcherror";
import carSchemajoi from "../../validation/productvalidate";
import vehicles from "../../models/vehicles";
import User from "../../models/User";
import Bookings from "../../models/Bookings";





export const adminallvehicles = catcherror(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const vehicle = await vehicles.find();

      if (!vehicle) {
        return res.status(404).json({ message: "Unable to fetch vehicle" });
      }

      return res
        .status(200)
        .json({ message: "Successfully fetched data", data: vehicle });
    } catch (error) {
      next(error); // Pass the error to the global error handler
    }
  }
);

export const adminVehicleByCategory = catcherror(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { categoryName } = req.params;

    const vehicle = await vehicles.find({
      $or: [{ category: { $regex: new RegExp(categoryName, "i") } }],
    });

    if (!vehicle) {
      return res.status(404).json({ message: "item not found" });
    }

    return res
      .status(200)
      .json({ message: "fetched by category", data: vehicle });
  }
);

export const allusers=catcherror(async(req: Request, res: Response, next: NextFunction)=>{
  try {
    const users=await User.find()

    if (!users) {
      return res.status(404).json({ message: "Unable to fetch users" });
    }
    
    return res.status(200).json({message:'user fetched successfully ',data:users})
  } catch (error) {
    return res.status(500).json({message:'internal server error'})
  }
})


export const userById=catcherror(async(req: Request, res: Response, next: NextFunction)=>{
  try {
    const {userId}=req.params
    const user = await User.findOne({ _id: userId }).populate('Bookings').lean(); 

   if(!user){
      return res.status(404).json({message:'user not found'})
    }

    return res.status(200).json({message:'user fetched',data:user})
  } catch (error) {
    console.log(error,'error');
    return res.status(500).json({message:'internal server error'})
  }
})

export const allbookings=catcherror(async(req: Request, res: Response, next: NextFunction)=>{
  try {
    const bookings=await Bookings.find().populate('userId').lean()
    if(!bookings){
      return res.status(400).json({message:'unable to fetch bookings'})
    }

    return res.status(200).json({message:'bookings fetched success fully',data:bookings})
  } catch (error) {
    return res.status(500).json({message:'internal server error'})
  }

})

export const adminvehicleBbyId =catcherror(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {vehicleId} = req.params;
  const vehicle = await vehicles.findById(vehicleId);
  
  
  if (!vehicle) {
    return res.status(404).json({ message: "vehicle not found" });
  }
  return res.status(200).json({ message: "vehicle fetched", data: vehicle });
});




