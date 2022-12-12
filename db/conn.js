import mongoose from "mongoose";

//FUNCTION TO CONNECT WITH MONGODB
const conn = (DB_URL) => {

    mongoose.connect(DB_URL,{
        dbName : 'MusicAPI',
        useNewUrlParser:true,
        useUnifiedTopology:true,
    }).then(()=>{

    }).catch((err)=> console.log(`DB not connected : Error = ${err}`));
}

export default conn;