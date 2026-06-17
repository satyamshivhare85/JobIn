import express from "express"
import dotenv from "dotenv"
import userRoutes from "./routes/user.js"

dotenv.config();

const app=express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/user',userRoutes);

app.listen(process.env.PORT,()=>{
    console.log(`user service is running on https://localhost:${process.env.PORT}`)
})