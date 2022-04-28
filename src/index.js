import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './services/mongodb/connectDB'
import authRoutes from './routes/auth'
// to get access to your env file 
dotenv.config('./.env')

const app = express()

console.log('Hii')
// access to the variables created in env file
console.log(process.env.PORT)

// if no port then set default port to 8080
const PORT = process.env.PORT || 8080
connectDB()

app.use(express.json()) // middleware to access the body
app.use('/user', authRoutes) 

app.listen('/', (req,res)=>{
    res.send(`Server deployed on Port : ${PORT}`)
})

app.listen(PORT, ()=>{
    console.log(`Server running on ${PORT}`)
})