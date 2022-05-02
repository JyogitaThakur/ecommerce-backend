import express from 'express'
import { body, validationResult } from "express-validator";
import { isAdmin } from "../services/middlewares/isAdmin";
import { isAuthenticated } from "../services/middlewares/isAuthenticated";
import { Category } from "../services/mongodb/schema";

const router = express.Router()

/*
type : POST
path : /category/add
body : {name,description}
query: none
description: Route to add category
*/

router.post('/add',
isAuthenticated,
isAdmin,
body("name").isLength({min:1}),
body("description").isLength({min:5}),
async (req,res)=>{
    try {
        const {errors} = validationResult(req);
        console.log(errors)
        if(errors.length > 0)
        return res.json({
            data:{
                user:null,
            },
            success:false,
            message:"validation failed"
        })
        console.log(req.user)
        const {name, description} = req.body
        const category = new Category({name, description})
        await category.save()
        return res.json({
            data:{
                category,
            },
            success:true,
            message:"Category Added Succesfully"
        })
    } catch (error) {
        console.log(error)
        return res.json({
            data:{
                category:null,
            },
            success:false,
            message:error.message
        })
    }
})

/*
type : GET
path : /category/all
body : none
query: none
description: Route to fetch category
*/

router.get('/all',
async (req,res)=>{
    try {
        const categories = await Category.find({})
        return res.json({
            data:{
                categories,
            },
            success:true,
            message:"Category Fetched Succesfully"
        })
    } catch (error) {
        console.log(error)
        return res.json({
            data:{
                categories: [],
            },
            success:false,
            message:error.message
        })
    }
})



export default router