import express from'express'
import dotenv from 'dotenv'

dotenv.config()

const app=express()
app.use((req,res)=>{
  res.send('this is driveEase server')
})

const PORT=process.env.PORT||5000

app.listen(PORT,()=>{
    console.log(`your server running on port ${PORT}`);
})