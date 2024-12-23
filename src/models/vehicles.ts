import { string } from "joi";
import mongoose, { Document, Schema } from "mongoose";

export interface Booking {
    pickupDate: Date; // ISO date string
    dropoffDate: Date; // ISO date string
  }

  interface Reviews {
    userId:mongoose.Types.ObjectId,
    review:string,
    rating:number
  }

export interface vehicleSchema extends Document{
    _id:mongoose.Types.ObjectId;
    name:string;
    type:string;
    brand:string;
    seatingCapacity:number ;
    pricePerDay:number;
    fuelType:"Petrol" | "Diesel" | "Electric";
    transmission:"Automatic" | "Manual";
    category:"Bike"|"EconomyCar"|"Luxury"
    image:string;
    bookings:Booking[];   
    Reviews:Reviews[];

}

const BookingSchema = new Schema<Booking>({
    pickupDate: {
      type: Date,
      required: true,
    },
    dropoffDate: {
      type: Date,
      required: true,
    },
  });

  const ReviewSchema = new Schema<Reviews>({
    userId:{
      type:Schema.Types.ObjectId,
      
    },
    review:{
      type:String,
      
    },
    rating:{
      type:Number,
    },
  })



const vehicleSchema=new Schema<vehicleSchema>(
    {
        name:{
            type:String,
            required:true
        },
        type:{
            type:String,
            required:true
        },
        brand:{
            type:String,
            required:true
        },
        seatingCapacity:{
            type:Number
        },
        pricePerDay:{
            type:Number,
            required:true
       },
       fuelType: {
        type: String,
        enum: ["Petrol", "Diesel", "Electric"], // Restrict to specific values
        required: true,
      },
      transmission: {
        type: String,
        enum: ["Automatic", "Manual"], // Restrict to specific values
        required: true,
      },
      category:{
        type:String,
        enum:["Bike","EconomyCar","Luxury"],
        required:true
      },
       image:{
        type:String,
       },
       bookings:{
        type:[BookingSchema],
        default:[]
       },
       Reviews:{
        type:[ReviewSchema],
        default:[]
       },
    },
    {timestamps:true}
)

export default mongoose.model<vehicleSchema>('vehicle',vehicleSchema);