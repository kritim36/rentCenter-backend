const express = require("express")
const { connectDatabase } = require("./database/database")
const User = require("./model/userModel")
const app = express()

require("dotenv").config()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
connectDatabase(process.env.MONGO_URI)
app.use(express.json())
app.use(express.urlencoded({extended : true}))

//test api to check if the server is alive or not
app.get("/",(req,res)=>{
    res.status(200).json({
        message : "I am alive"
    })
})

//register user api
app.post("/register",async(req,res)=>{
    const{email,password,name,phoneNumber} = req.body
    if(!email || !password || !name || !phoneNumber){
      return  res.status(400).json({
            message:"Please provide email, Password, name, phoneNumber"
        })
    }
    //chek if the email user already exist or not
   const userFound = await User.find({userEmail : email})
   if(userFound.length > 0){
   return res.status(400).json({
        message : "User with that email already registered"
    })
   }

    await User.create({
        userEmail : email,
        userName : name,
        userPassword : bcrypt.hashSync(password,10),
        userPhoneNumber : phoneNumber
    })

    res.status(202).json({
        message : "user registered sucessfully"
    })
})

//login user api
app.post("/login",async(req,res)=>{
    const{email,password} = req.body
    if(!email || !password){
        return res.status(400).json({
            message : "please provide email,password"
        })
    }
    //check if that email user exist or not
    const userFound = await User.find({userEmail : email})
    if(userFound.length == 0){
        return res.status(404).json({
            message : "User with that email is not Registered"
        })
    }
    //password check
    const isMatched = bcrypt.compareSync(password,userFound[0].userPassword)
    if(isMatched){
        //generate token
        const token = jwt.sign({id : userFound[0]._id},process.env.SECRET_KEY,{
            expiresIn : '30d'
        })
         res.status(200).json({
            message : "User logged in sucessfully",
            token
        })
    }else{
        res.status(400).json({
            message : "Invalid password"
        })
    }
})
const PORT = process.env.PORT
//listen server
app.listen(PORT,()=>{
    console.log(`Server has start at PORT ${PORT}`)
})