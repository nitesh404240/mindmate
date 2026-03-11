import mongoose from "mongoose";

import { DB_NAME } from "../constant.js";

const  connectdb = async() =>{

    try{
       const connectionInstance = await mongoose.connect(`${process.env.DB_URI}`)
        console.log(`\nMongoDB connected! DB Host: ${connectionInstance.connection.host}`);
        console.log(`\nMongoDB connected! DB Name: ${connectionInstance.connection.name}`);
        console.log(`\nMongoDB connected! DB Port: ${connectionInstance.connection.port}`);
       
    }catch(error){
         console.log("MONGODB connection error:", error);
        process.exit(1);
    }
}
export default connectdb