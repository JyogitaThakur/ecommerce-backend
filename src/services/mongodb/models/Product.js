import mongoose from "mongoose";
 const ProductSchema = new mongoose.Schema({
     name:{
         type:String,
         required:true
     },
     description:{
        type:String,
        required:true
    },
    stickerPrice : {
         type:Number
     },
    markedPrice : {
        type:Number
    },
    category: {
         type:mongoose.Types.ObjectId,
         ref:"Category"
    },
    image:{
        type:String,
        required:true
    },
    compatibleWith:{
        type:String,
        enum:["IPhone","Mac","Apple Watch","Airpods"]
    },
    stock:{
        type:Number,
        default:0,
        required:true
    },
    color:{
        type:String,
        required:true
    }
},{
    timestamps:true
})

export const Product = new mongoose.model("Product", ProductSchema)

