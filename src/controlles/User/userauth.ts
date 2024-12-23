import { NextFunction, Request,  Response } from "express";
import uservalidation from "../../validation/Uservalidation";
import User from "../../models/User";
import bcryptjs from 'bcryptjs'
import catcherror from "../../utils/catcherror";
import { apperror } from "../../utils/apperror";
import { generateOtp } from "../../utils/genereteOtp";
import  jwt  from "jsonwebtoken";
import dotenv from 'dotenv';
import { OAuth2Client } from "google-auth-library";
import sendOtp from "../../utils/otpsend";



dotenv.config()


const signtoken = (id:string) => {
  return jwt.sign({ id },process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRE_IN || '1h',
  });
};

const createsendToken=(user:any,statuscode:number,res:any,message:string)=>{
    const token=signtoken(user._id)
    

    const jwtExpireInDays = Number(process.env.JWT_EXPIRE_IN) || 7;

    if (!process.env.JWT_EXPIRE_IN) {
      console.warn('JWT_EXPIRE_IN is not defined. Defaulting to 7 days.');
    }

    const cookieOptions={
      expires:new Date (Date.now()+jwtExpireInDays* 24 * 60 * 60 * 1000),
      httponly:true,
      secure:process.env.NODE_ENV==='production',
      sameSite:process.env.NODE_ENV==='production'?'none':'Lax'
    };

      res.cookie("token",token,cookieOptions);

    user.password=undefined;
    user.otp=undefined;

     res.status(statuscode).json({
      status:'success',
      message,
      token,
      data:{
        user,
      },
    });
}

export const register= catcherror(async (req:Request,res:Response,next:NextFunction):Promise<any>=>{


    const {value,error}=uservalidation.validate(req.body)
    if(error){
        return res.status(400).json({messege:'validation error ',error:error})
    }
    

    const {username,email,password}=value
    
    try {
      const isexistinguser=await User.findOne({email:email})
      if(isexistinguser){
        return next(new apperror ('Email already registered',400));
      }

      const otp=generateOtp();

      const otpexpires=Date.now() + 24 * 60 * 60 * 1000;



      const hashedpassword= await bcryptjs.hash(password,10)

      const newuser = new User ({
        username:username,
        email:email,
        password:hashedpassword,
        otp:otp,
        otpExpires:otpexpires
      })

       await newuser.save()  

console.log('this from send email');

      try {
        await sendOtp({
          email:newuser.email,
          subject:"OTP for email verification",
          html:`<h1>your otp is: ${otp}</h1>`
        })

        createsendToken(newuser,200,res,'Registration successful')

      } catch (error) {
        await User.findByIdAndDelete(newuser.id)
        return next(new apperror('There is an error sending the email. Try again',500))
      }

     
    } catch (error) {
        return res.status(500).json({message:'internal server error'})
    }

})


export const verifyAccount = catcherror(async (req: any, res: Response, next: NextFunction) => {
  const { otp } = req.body;  

  if (!otp) {
    return next(new apperror('OTP is required', 400));
  }

  const user = req.user;

  if (!user) {
    return next(new apperror('User not found', 401));
  }

  if (user.otp !== otp) {
    return next(new apperror('Invalid OTP', 401));
  }

  if (Date.now() > (user.otpExpires || 0)) {
    return next(new apperror('OTP has expired. Please request a new OTP.', 410));
  }

  user.isverified = true;
  user.otp = undefined;
  user.otpExpires = undefined;

  await user.save({ validateBeforeSave: false });

  createsendToken(user, 200, res, 'Email has been verified');
});


const client=new OAuth2Client(process.env.CLIENT_ID)

export const googleVerify = async (idtoken: string): Promise<{ email: string; picture: string; name: string,sub:string }> => {
  const ticket = await client.verifyIdToken({
    idToken: idtoken,
    audience: process.env.CLIENT_ID,
  });

  interface Payload {
    email: string;
    email_verified: boolean;
    name: string;
    picture: string;
    sub:string;
  }

  const payload = ticket.getPayload() as Payload | null;

  if (!payload) {
    throw new Error("Invalid ID token: Payload is undefined");
  }

  const { email, email_verified, name, picture ,sub} = payload;

  if (!email_verified) {
    throw new Error("Email is not verified");
  }

  return { email, picture, name, sub };
};

export const googleAuth = catcherror(async (req: any, res: Response, next: NextFunction) => {
  const { idtoken } = req.body;
  console.log('thsi is gooogle auth',idtoken)

  const {email,picture, name,sub }= await googleVerify(idtoken);

  let user = await User.findOne({ email });

  const hashedpassword= await bcryptjs.hash(sub,10)

  if (!user) {
    user = await User.create({ email, username:name, profileImg: picture, password:hashedpassword,isverified:true});
     createsendToken(user, 201, res, "user registered successfully");
  }

  createsendToken(user,200,res,'user login successful')
  
});


export const Login=catcherror(async(req:any, res:Response, next:NextFunction)=>{
  const{email,password}=req.body;

  const isUserVaild=await User.findOne({email})

  if(!isUserVaild){
    return res.status(404).json({error:'user not found'})
  }

  const comparePass= bcryptjs.compareSync(password,isUserVaild.password)

  if(!comparePass){
    return res.status(404).json({error:"wrong credential"})
  }

  createsendToken(isUserVaild,201,res,'user login success fully')
})