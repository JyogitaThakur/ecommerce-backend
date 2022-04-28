import mongoose from "mongoose";
 const OrderSchema = new mongoose.Schema({
     address:{
         type:mongoose.Types.ObjectId,
         required:true,
         ref:"Address",
     },
     user : {
         type:String,
         required:true
     },
     products : [{
        type: mongoose.Types.ObjectId,
        ref:"Product"
    }],
    total:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        required:true,
        enum:["payment_pending","payment_success","payment_error"]
    }
},{
    timestamps:true
})

export const Order = new mongoose.model("Order", OrderSchema)

