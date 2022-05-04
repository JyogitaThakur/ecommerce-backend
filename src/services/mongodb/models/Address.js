import mongoose from "mongoose";
 const AddressSchema = new mongoose.Schema({
     user:{
         type:mongoose.Types.ObjectId,
         ref:"User"
     },
     housenumber:{
         type: Number,
         required:true,
     },
     fulladdress : {
         type:String,
         required:true,
         minlength:1,
         maxlength:500
     },
     landmark : {
        type:String,
        required:true
    }, 
    pincode : {
        type:Number,
        required:true
    }, 
},{
    timestamps:true
})

export const Address = new mongoose.model("Address", AddressSchema)

