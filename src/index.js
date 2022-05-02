import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './services/mongodb/connectDB'
import authRoutes from './routes/auth'
import categoryRoutes from './routes/category'
import productRoutes from './routes/product'
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
app.use('/category', categoryRoutes) 
app.use('/product', productRoutes) 

app.get('/', (req,res)=>{
    res.send(`Server deployed by CI/CD pipeline with secrets on : ${PORT}`)
})


app.listen(PORT, ()=>{
    console.log(`Server running on ${PORT}`)
})