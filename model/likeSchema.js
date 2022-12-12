import { ObjectID } from "bson";
import mongoose from "mongoose";

// Like Schema
var LikeSchema = new mongoose.Schema({
    userID:          { type:ObjectID, 
                                    ref:'users' },

    musicID:       {  type:ObjectID, 
                                    ref:'musics' } ,
});

// Export Music Schema
const Likes = new mongoose.model('Like', LikeSchema);
export default Likes;