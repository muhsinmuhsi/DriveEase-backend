import dotenv from 'dotenv';
import express,{NextFunction, Request,Response} from 'express'
import mongoose from 'mongoose';
import authRoute from './routes/authroute'
import cors from 'cors'
import globalerrorhandler from './controlles/errorcontroller'
import { apperror } from './utils/apperror';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';

dotenv.config()
 
const app=express()

app.use(cookieParser())

app.use(cookieSession({
    name:"session",
    keys:['DriveEase'],
    maxAge:24*60*60*100
}))

app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    next();
  });

//cors setup
// const corsOptions = {
//     origin: "http://localhost:5174", // Your client origin
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true, // Allow cookies
//   };
app.use(cors())
// middlewareas (options: cors.CorsOptions) => express.RequestHandler)({}))

app.use(express.json());

//global error handling
// app.use('*',(req:Request,res:Response,next:NextFunction)=>{
//     next(new apperror(`can't find ${req.originalUrl} on this server !`,404))
// })


//basic routes
app.use('/api/users',authRoute)

app.use(globalerrorhandler)


//database connecting
if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not defined in environment variables');
  }
  
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI as string,{dbName:"DriveEase"});
        console.log('DB connected successfully');
    } catch (error) {
        console.error('db connecting failed');
        
    }
}
connectDB()

//port listen
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8080;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

server.on('error', (err: any) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is in use. Trying another port...`);
    const newPort = PORT + 1;
    app.listen(newPort, () => {
      console.log(`Server running on port ${newPort}`);
    });
  } else {
    console.error(err);
  }
});

