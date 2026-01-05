import Razorpay from "razorpay";
import dotenv from 'dotenv';
import catcherror from "../../utils/catcherror";
import { Request, Response } from "express";
import crypto from 'crypto'
import Bookings from "../../models/Bookings";
import vehicles from "../../models/vehicles";
import User from "../../models/User";
import sendEmail from "../../utils/email";
dotenv.config()

 
const razorpay =new Razorpay({
    key_id: process.env.Razorpay_key_id as string ,
    key_secret: process.env.Razorpay_key_secret,
})



export const payment=catcherror(async(req:Request,res:Response)=>{
    const {userId}=req.params
    const {amount,carId,vehicleName,startDate,endDate}=req.body
console.log('this is payment rounte');

    const options={
        amount:amount*100,
        currency: 'INR',
        receipt: `receipt_order_${Math.random().toString(36).substring(2, 15)}`,
        notes:{
            vehicleName:vehicleName,
            carId,
            userId:userId,
            amount:amount,
            startDate:startDate,
            endDate:endDate
        }
    }

    const order=await razorpay.orders.create(options);
    res.status(200).json({
        id:order.id,
        amount:order.amount,
        currency:order.currency
    })


})

export const verifyPayment=catcherror(async(req:Request,res:Response)=>{
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
console.log('this i s veryfy payment ');

    const hmac=crypto.createHmac('sha256',process.env.Razorpay_key_secret as string)
    hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
    const generatedsignature=hmac.digest('hex')

    if(generatedsignature!== razorpay_signature){
        return res.status(400).send(' payment verification failed')
    }

    const order : any = await razorpay.orders.fetch(razorpay_order_id)
    if(!order){
        return res.status(400).json({message:'order not found'})
    }

    const {userId,carId,vehicleName,startDate,endDate,amount}=order.notes;

    console.log('userid from veryfyPayment',userId);
    

    const newbooking=new Bookings({
        userId,
        vehicleName,
        carId,
        startDate:new Date(startDate),
        endDate:new Date(endDate),
        amount:amount,
        paymentId:razorpay_payment_id,
        orderId:razorpay_order_id    
    });

    await newbooking.save();

    const startDatelocal=new Date(startDate).toLocaleDateString()
    const endDatelocal=new Date(startDate).toLocaleDateString()

    const vehicle:any= await vehicles.findOne({name:vehicleName})

    if(!vehicle){
        return res.status(400).json({message:'vehicle not found'})
    }

    vehicle?.bookings?.push({
        pickupDate: new Date(startDate).toISOString(),
        dropoffDate: new Date(endDate).toISOString(),
    })

    

    const user:any= await User.findOne({_id:userId})
    if(!user){
        return res.status(404).json({message:'user not found'})
    }
    
    await vehicle.save();

    await sendEmail({
        email: user.email,
        subject: "Vehicle Booking Confirmation",
        templateData: {
          userName: user.name, 
          vehicleName: vehicleName,
          startDate: startDatelocal,
          endDate: endDatelocal
        }
      });


    user?.Bookings?.push(newbooking._id)

    await user.save()

  return res.status(200).json({ message: "Payment verified and booking saved successfully" });

})