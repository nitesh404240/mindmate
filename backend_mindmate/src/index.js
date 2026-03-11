import { app } from "./app.js";
import dotenv from "dotenv"
import connectdb from "./database_connection/index.js";
dotenv.config({
    path: './.env'
})

const database = connectdb()
database.then(()=>{
 
       
        app.listen(process.env.PORT||8005,()=>{
            console.log(`server is listning on ${process.env.PORT}`)
        })
         app.on("error",(error)=>{
        console.log(`getting error`,error);
        throw error
    })
   
}
).catch((error)=>{
          console.log("Mongodb connection failed !! ",error)
    process.exit(1)
    })

