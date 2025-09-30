const mongoose = require('mongoose')


async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Coonected to MongoDB");
    }catch(err){
        console.log("Error connecting to MongoDB : ",err);
    }
}



module.exports = connectDB;