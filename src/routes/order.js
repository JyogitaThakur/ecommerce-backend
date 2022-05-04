import express from 'express'
import { body, validationResult } from "express-validator";
import { isAuthenticated } from "../services/middlewares/isAuthenticated";
import { isAdmin } from "../services/middlewares/isAdmin";
import { Order,User } from "../services/mongodb/schema";

const router = express.Router()

/*
type : POST
path : /order/create
body : {address,user,products,total,total,status}
query: none
description: Route to create Order
*/

router.post('/create',
isAuthenticated,
body("total").isNumeric(),
async (req,res)=>{
    try {
        const {errors} = validationResult(req);
        console.log(errors)
        if(errors.length > 0)
        return res.json({
            data:{
                order:null,
            },
            success:false,
            message:"validation failed"
        })

        const user = req.user
        // create the address doc
        const {address,products,total,status} = req.body
        const order = new Order({address,user,products,total,status})
        await order.save()
        // Address saved now modify it inside the user doc
        await User.findOneAndUpdate({_id:user},{
            $addToSet : {orders : order._id}
        }) 
        return res.json({
            data:{
                order,
            },
            success:true,
            message:"Order Created Succesfully"
        })
    } catch (error) {
        console.log(error)
        return res.json({
            data:{
                order:null,
            },
            success:false,
            message:error.message
        })
    }
})

/*
type : GET
path : /order/all
body : none
query: none
description: Route to get orders for admin
*/
//Admin Route
router.get('/all',
isAdmin,
isAuthenticated,
body("total").isNumeric(),
async (req,res)=>{
    try {
        const orders = await Order.find({})
        return res.json({
            data:{
                orders,
            },
            success:true,
            message:"Order Fetched Succesfully"
        })
    } catch (error) {
        console.log(error)
        return res.json({
            data:{
                orders:[],
            },
            success:false,
            message:error.message
        })
    }
})

/*
type : GET
path : /order/me
body : none
query: none
description: Route to get orders for admin
*/

// User route
router.get('/me',
isAuthenticated,
body("total").isNumeric(),
async (req,res)=>{
    try {
        const user = req.user
        const orders = await Order.find({_id:user})
        return res.json({
            data:{
                orders,
            },
            success:true,
            message:"Order Fetched Succesfully"
        })
    } catch (error) {
        console.log(error)
        return res.json({
            data:{
                orders:[],
            },
            success:false,
            message:error.message
        })
    }
})



export default router