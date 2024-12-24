// import { NextFunction, Request, Response } from "express";
import vehicles, { Booking, vehicleSchema } from "../../models/vehicles";

import { Request, Response, NextFunction } from "express";
import catcherror from "../../utils/catcherror";
import User from "../../models/User";
import Reviews from "../../models/Reviews";

export const allvehicles = catcherror(
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

export const vehicleByCategory = catcherror(
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

export const availableVehicles = catcherror(
  async (req: Request, res: Response, next: NextFunction) => {
    const { pickupDate, dropofDate } = req.body;

    const userPickup = new Date(pickupDate);
    const userDropOff = new Date(dropofDate);

    // Validate dates
    if (isNaN(userPickup.getTime()) || isNaN(userDropOff.getTime())) {
      return res.status(400).json({ message: "Invalid dates provided" });
    }

    try {
      const checkAvaillity = await vehicles.aggregate([
        {
          $match: {
            bookings: {
              $not: {
                $elemMatch: {
                  $and: [
                    { pickupDate: { $lt: userDropOff } },
                    { dropoffDate: { $gt: userPickup } },
                  ],
                },
              },
            },
          },
        },
      ]);

      if (checkAvaillity.length === 0) {
        return res
          .status(400)
          .json({ message: "Sorry, no available vehicles" });
      }
      return res
        .status(200)
        .json({ message: "Fetched successfully", checkAvaillity });
    } catch (error) {
      next(error);
    }
  }
);

export const vehicleBbyId =catcherror(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vehicleId = req.params.id;
  const vehicle = await vehicles.findById(vehicleId).populate({
    path:"Reviews",
    populate:{
      path:'userId',
      select:'username'
    }
  });
  if (!vehicle) {
    return res.status(404).json({ message: "vehicle not found" });
  }
  return res.status(200).json({ message: "vehicle fetched", data: vehicle });
});

export const bookingsById = catcherror(async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
  
    const user = await User.findOne({ _id: userId }).populate({
      path: 'Bookings', // Path to populate
      model: 'Bookings', // Model name of the referenced collection
    });


    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    
    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


export const ReviewsAdd= catcherror(async(req:Request,res:Response,next:NextFunction)=>{
  const {vehicleId}=req.params;
  const {userId,content}=req.body;
  try {
    const vehicle=await vehicles.findById(vehicleId)
    if(!vehicle){
      return res.status(404).json({message:'vehicle not found'})
    }

    if(!content){
      return res.status(400).json({message:'content is empty'})
    }

    const newReview=new Reviews ({
      userId:userId,
      content:content,
    })

    const user=await User.findById(userId)

    if(!user){
      return res.status(404).json({message:'user not found'})
    }

    await newReview.save()

    vehicle.Reviews?.push(newReview._id)
    await vehicle.save()

    user.Reviews?.push(newReview._id)
    await user.save()

    return res.status(201).json({message:"review added successfully",review:newReview})

  } catch (error) {
    return res.status(500).json('internal server error')
  }
})

// export const ReviewsGet=catcherror(async(req:Request,res:Response,next:NextFunction)=>{
//   const {vehicleId}=req.params
//   const vehicle=await vehicles.findById(vehicleId).populate('Reviews')
//   if(!vehicle){
//     return res.status(404).json({message:"vehicle not found"})
//   }

//   res.status(200).json({message:'reviews fetched successfully',data:vehicle})

// })