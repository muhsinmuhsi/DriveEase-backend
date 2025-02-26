import dotenv from 'dotenv';
import express,{NextFunction, Request,Response} from 'express'
import mongoose from 'mongoose';
import authRoute from './routes/authroute'
import cors from 'cors'
import globalerrorhandler from './controlles/User/errorcontroller'
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import adminroute from './routes/adminroutes'
import productRouter from './routes/productRoutes'


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


app.use(cors({
  origin: 'https://drive-ease-frontend-xi.vercel.app',
  credentials: true,
}));


app.use(express.json());


//basic routes
app.use('/api/users',authRoute)
app.use('/api/admin',adminroute)
app.use('/api/users',productRouter)

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

