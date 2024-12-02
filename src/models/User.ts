
import mongoose, { Document, model, Schema } from "mongoose";

export interface userschema extends Document {
    id:mongoose.Types.ObjectId;
    username:string;
    email:string;
    password:string;
    profileImg:string;
    role:string;
    isverified:boolean;
    otp:string|undefined;
    otpExpires:number|undefined;
    resetpassword:string;
    restpasswordOtpExpires:Date;
    created_at:Date;
    Bookings:mongoose.Types.ObjectId;
    Reviews:mongoose.Types.ObjectId;

}

const userSchema=new Schema<userschema>(
  {
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    profileImg:{
        type:String
    },
    isverified:{
        type:Boolean,
        default:false
    },
    otp:{
        type:String,
        default:null
    },
    otpExpires:{
        type:Number,
        default:null
    },
    resetpassword:{
        type:String,
        default:null
    },
    restpasswordOtpExpires:{
        type:Date,
        default:null
    },
    role:{
        type:String
    },
    created_at:{
        type:Date,
        default:Date.now(),
        required:true,
    },
    Bookings:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Bookings'
    },
    Reviews:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Reviews'
    }
  },
  {
        timestamps:true
    },
);

const User=model<userschema>("User", userSchema);

export default User