import express from 'express'
import { body, validationResult } from "express-validator";
import { isAuthenticated } from "../services/middlewares/isAuthenticated";
import { Address, User } from "../services/mongodb/schema";

const router = express.Router()

/*
type : POST
path : /address/add
body : {housenumber, full address,landmark}
query: none
description: Route to add Address
*/

router.post('/add',
isAuthenticated,
body("housenumber").isLength({min:1}),
body("fulladdress").isLength({min:5}),
body("landmark").isLength({min:1}),
body("pincode").isPostalCode("IN"),
async (req,res)=>{
    try {
        const {errors} = validationResult(req);
        console.log(errors)
        if(errors.length > 0)
        return res.json({
            data:{
                address:null,
            },
            success:false,
            message:"validation failed"
        })

        const user = req.user
        // create the address doc
        const {housenumber, fulladdress,landmark,pincode} = req.body
        const address = new Address({housenumber, fulladdress,landmark,pincode,user})
        await address.save()
        // Address saved now modify it inside the user doc
        // ! one of bad approach
        // const previousAddress = await User.find({_id:user}).address
        // previousAddress.push(address._id) // append new address
        await User.findOneAndUpdate({_id:user},{
            $addToSet : {address : address._id}
        }) 
        return res.json({
            data:{
                address,
            },
            success:true,
            message:"Address Added Succesfully"
        })
    } catch (error) {
        console.log(error)
        return res.json({
            data:{
                address:null,
            },
            success:false,
            message:error.message
        })
    }
})

/*
! TODO create a route to delete an address from the DB
-> use the isAuthenticated middleware
-> find the user and use $Pull to modify the address array by removing the address
-> then findONeandDelete on Address
 */

export default router