import express from 'express'
import {User} from '../services/mongodb/schema'
import bcrypt from 'bcryptjs'
import {validationResult,body} from 'express-validator'
import { signJWT, verifyJWT } from "../utils/index"

import { isAuthenticated } from "../services/middlewares/isAuthenticated";
import { isAdmin } from "../services/middlewares/isAdmin";

const router = express.Router()

/*
type : POST
path : /user/signup
body : {firstName,lastName,email,password}
query: none
description: Route to sign up a new user
*/

router.post('/signup', 
body("firstName").isLength({min:1}),
body("lastName").isLength({min:1}),
body("email").isEmail(),
body("password").isLength({min:3}),
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
        const {firstName, lastName, email, password} = req.body // gets from the user
        const salt = await bcrypt.genSalt(5)// random series of character mixed with your password text and then the combination is hashed [for security]
        const hashedPassword = await bcrypt.hash(password,salt)
        const user = new User({firstName, lastName, email, password:hashedPassword}) // creates a new user
        await user.save()
        return res.json({
            data:{
                user,
            },
            success:true,
            message:"User saved Successfully"
        })
        console.log(user)
        
    } catch (error) {
        console.log(error)
        return res.json({
            data:{
                user:null,
                success:false,
            },
            success:false,
            message:error.message
        })
    }
})



/*
type : POST
path : /user/login
body : {email,password}
query: none
description: Route to login a user
*/

router.post('/login',
body("email").isEmail(),
body("password").isLength({min:3}),
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
        const {email, password} = req.body // gets from the body
        const user = await User.findOne({email}); // finds user email in database
        if(!user)
        return res.json({
            data:{
                token:null,
                success:false,
            },
            success:false,
            message:"User does not exist"
        })

        // using brcypt compare the password and userpassword 
        const isVerified = await bcrypt.compare(password, user.password)
        if(!isVerified)
        return res.json({
            data:{
                token:null,
                success:false,
            },
            success:false,
            message:"Invalid Password"
        })

        // verified user 
        const token = signJWT({
            id: user._id,
            email:user.email,
            role:user.role
        })

        await user.save()

        return res.json({
            data:{
                token,
            },
            success:true,
            message:"User loggedIn Successfully"
        })
        console.log(user)
        
    } catch (error) {
        console.log(error)
        return res.json({
            data:{
                token:null,
                success:false,
            },
            success:false,
            message:error.message
        })
    }
})

/*
type : GET
path : /user/all
body : none
query: none
description: Route to get all user info
*/
router.get('/all',isAuthenticated,
isAdmin, async (req,res)=>{
    try {
        const users = await User.findOne({ }).select("firstName lastName email orders address"); // finds user email in database
        return res.json({
            data:{
                users,
            },
            success:true,
            message:"User fetched Successfully"
        })
        console.log(user)
        
    } catch (error) {
        console.log(error)
        return res.json({
            data:{
                users: [],
            },
            success:false,
            message:error.message
        })
    }
})


// profile section
/*
type : GET
path : /user/profile/me
body : none
header : authorization = bearer token
query: none
description: Route to get profile section
*/

router.get('/profile/me', isAuthenticated, async (req,res)=>{
    try {
        const token = req.headers["authorization"].split(' ')[1]
        const {id} = verifyJWT(token)
        //  get the userid from json token
        const user = await User.findOne({_id : id}).populate("address")       
        return res.json({
            data:{
                user,
            },
            success:true,
            message:"User profile fetched Successfully"
        })
        console.log(user)
        
    } catch (error) {
        console.log(error)
        return res.json({
            data:{
                user:null,
                success:false,
            },
            success:false,
            message:error.message
        })
    }
})

export default router