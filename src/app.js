import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app=express()
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))//stores pdf,images,files in our public folder.
app.use(cookieParser())

//routes import
import userRouter from "./routes/user.routes.js"

//routes declaration

app.use("/api/v1/users",userRouter) //we are making it one time use ,so whenever we go to website it will give 
//control to router which will perform further actions ,like login ,register etc.
// ex- https://localhost:8000/api/v1/users/register

export {app}