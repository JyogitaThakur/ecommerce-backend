import mongoose from "mongoose";
 const AddressSchema = new mongoose.Schema({
     housenumber:{
         type: Number,
         required:true,
     },
     fulladdress : {
         type:String,
         required:true,
         minlength:10,
         maxlength:500
     },
     landmark : {
        type:String,
        required:true
    }, 
},{
    timestamps:true
})

export const Address = new mongoose.model("Address", AddressSchema)

