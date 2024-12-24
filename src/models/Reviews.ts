import mongoose, { Document, Schema } from "mongoose";

export interface Reviews extends Document{
    _id:mongoose.Types.ObjectId,
    userId:mongoose.Types.ObjectId,
    vehicleId:mongoose.Types.ObjectId,
    content:string,
}

const ReviewsSchema=new Schema<Reviews>({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    vehicleId:{
        type:Schema.Types.ObjectId,
        ref:'vehicle'
    },
    content:{
        type:String,
        required:true
    }

},
{timestamps:true},
)

export default mongoose.model<Reviews>('Reviews',ReviewsSchema)