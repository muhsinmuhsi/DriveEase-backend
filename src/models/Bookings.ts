import mongoose, { Document, Schema } from "mongoose";


export interface bookings extends Document {
    _id:mongoose.Types.ObjectId,
    userId:mongoose.Types.ObjectId,
    vehicleName:string,
    startDate:Date,
    endDate:Date,
    amount:number,
    status:boolean,
    paymentId:string,
    orderId:string
}

const bookingSchema= new Schema<bookings>({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    vehicleName:{
        type:String,
        required:true
    },
    startDate:{
        type:Date,
        required:true,
    },
    endDate:{
        type:Date,
        required:true,
    },
    amount:{
        type:Number,
    },
    status:{
        type:Boolean
    },
    paymentId:{
        type:String,
    },
    orderId:{
        type:String
    }
},
  {timestamps:true},
)

export default mongoose.model<bookings>('Bookings',bookingSchema);