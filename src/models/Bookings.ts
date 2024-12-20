import mongoose, { Document, Schema } from "mongoose";


export interface bookings extends Document {
    _id:mongoose.Types.ObjectId,
    userId:mongoose.Types.ObjectId,
    vehiclename:string,
    startDate:string,
    endDate:string,
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
    vehiclename:{
        type:String,
    },
    startDate:{
        type:String,
        required:true,
    },
    endDate:{
        type:String,
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