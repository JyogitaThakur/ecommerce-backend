import express from 'express'
import { body, validationResult } from "express-validator";
import { isAdmin } from "../services/middlewares/isAdmin";
import { isAuthenticated } from "../services/middlewares/isAuthenticated";
import { Product } from "../services/mongodb/schema";

const router = express.Router()
/*
type : POST
path : /category/add
body : {name,description,stickerPrice,markedPrice,category,image,stock,compatibleWith}
query: none
description: Route to add Product
*/

router.post('/add',
isAuthenticated,
isAdmin,
body("name").isLength({min:1}),
body("description").isLength({min:5}),
body("stickerPrice").isNumeric({min:1}),
body("markedPrice").isNumeric({min:5}),
body("image").isLength({min:5}),
body("stock").isNumeric({min:1}),
body("color").isLength({min:1}),
async (req,res)=>{
    try {
        const {errors} = validationResult(req);
        console.log(errors)
        if(errors.length > 0)
        return res.json({
            data:{
                product:null,
            },
            success:false,
            message:"validation failed"
        })
        const {name, description,stickerPrice,markedPrice,image,stock,color,category,compatibleWith } = req.body

        const product = new Product({
            name,
            description,
            stickerPrice,
            markedPrice,
            image,
            stock,
            color,
            category,
            compatibleWith,
          });

        await product.save()
        return res.json({
            data:{
                product,
            },
            success:true,
            message:"Product Added Succesfully"
        })
    } catch (error) {
        console.log(error)
        return res.json({
            data:{
                product:null,
            },
            success:false,
            message:error.message
        })
    }
})

/*
type : GET
path : /product/all
body : none
query: none
description: Route to fetch products
*/

router.get('/all',
async (req,res)=>{
    try {
        const products = await Product.find({}).populate('category')
        return res.json({
            data:{
                products,
            },
            success:true,
            message:"Product Fetched Succesfully"
        })
    } catch (error) {
        console.log(error)
        return res.json({
            data:{
                products: [],
            },
            success:false,
            message:error.message
        })
    }
})

/*
type : DELETE
path : /product/id
body : none
query: none
description: Route to fetch products
*/

router.delete('/:id',
async (req,res)=>{
    try {
        const product = await Product.findOneAndDelete({_id:id})
        return res.json({
            data:{
                product,
            },
            success:true,
            message:"Product Deleted Succesfully"
        })
    } catch (error) {
        console.log(error)
        return res.json({
            data:{
                product: null,
            },
            success:false,
            message:error.message
        })
    }
})



export default router