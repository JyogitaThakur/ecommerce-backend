import mongoose from "mongoose";
 const UserSchema = new mongoose.Schema({
     firstName:{
        type:String,
        required:true,
        minlength:1,
     },
    lastName:{
        type:String,
        required:true,
        minlength:1,
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
    role:{
        type:Number,
        default:0
        // 0 is the non-privilege user and 1 is the admin user
    },
    address : [
        {
            type: mongoose.Types.ObjectId,
            ref:"Address"
       }
    ],
    orders : [
        {
            type: mongoose.Types.ObjectId,
            ref:"Address"
       }
    ]       
},{
    timestamps:true
})

export const User = new mongoose.model("User", UserSchema)

