const mongoose = require("mongoose");
const conn = async () => {
    try{
        const response = await mongoose.connect(
            `${process.env.MONGO_URL}`
        ); 
        if(response){
            console.log("connected to db");
        }
    }
    catch(error){
        console.log(" db connection failed")
    }
}
conn();