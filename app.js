const express = require("express")
const { connectDatabase } = require("./database/database")
const app = express()

require("dotenv").config()

//routes
const authRoute = require("./routes/auth/authRoute")


//database connection
connectDatabase(process.env.MONGO_URI)
app.use(express.json())
app.use(express.urlencoded({extended : true}))

//test api to check if the server is alive or not
app.get("/",(req,res)=>{
    res.status(200).json({
        message : "I am alive"
    })
})


app.use("/",authRoute)



const PORT = process.env.PORT
//listen server
app.listen(PORT,()=>{
    console.log(`Server has start at PORT ${PORT}`)
})