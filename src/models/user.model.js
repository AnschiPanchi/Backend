import mongoose,{Schema} from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema= new mongoose.Schema(
{
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },

    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        
    },

    fullname:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    avatar:{
        type:String,//we get the image in form of link ,from cloudinary.
        required:true,
    },
    coverImage:{
        type:String,//same as above
    },
    watchHistory:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    password:{
        type:String,
        required:[true,"Password is required"] //we can give a custom message if the required field is not there.

    },
    refreshToken:{

    }
    

},{timestamps:true})

userSchema.pre("save",async function(next){ //takes some time for encryuption ,so we use async
    if(!this.isModified("password")) return next();
    this.password=bcrypt.hash(this.password,10) //no. of rounds for encyption
    next();

})

userSchema.methods.isPasswordCorrect= async function(password){
    return await bcrypt.compare("password",this.password)
}

userSchema.methods.generateAccessToken= function (){
    return jwt.sign(
        {
            _id:this._id,
            username:this.username,
            email:this.email,
            fullName:this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken= function (){
    return jwt.sign(
        {
            _id:this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User= mongoose.model("User",userSchema)