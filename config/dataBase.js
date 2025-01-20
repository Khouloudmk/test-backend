const mongoose=require ("mongoose")
const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.Mongo_URI,{
            useUnifiedTopology: true,
            useNewUrlParser:true
        })
        console.log("connect to DB")
    }catch(error){
        console.log(error.message)
        process.exit
    }
}
module.exports=connectDB