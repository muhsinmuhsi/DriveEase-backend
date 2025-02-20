import { Request, Response } from "express";
import { getRecommendedCars } from "../../services/recommendationService";
import vehicles from "../../models/vehicles";


export const  recommendationControl= async(req:Request,res:Response): Promise<any>  =>{
    try {

        const {userId}=req.params
        

        if(!userId){
            return res.status(400).json({message:'user Id is required'})
        }

        const recommendations= await getRecommendedCars(userId)

        const recommendedCars= await vehicles.find({ _id: { $in: recommendations } })
        

        res.status(200).json({recommendedCars:recommendedCars})
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" })
    }
    
}