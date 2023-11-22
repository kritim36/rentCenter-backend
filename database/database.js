const mongoose = require("mongoose")

exports.connectDatabase = async(URI)=>{
 await mongoose.connect(URI)
 //mongodb+srv://rentCenter:<password>@cluster0.ock63fr.mongodb.net/?retryWrites=true&w=majority
 console.log("Database connected successfully")

}
