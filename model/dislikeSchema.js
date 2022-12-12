import { ObjectID } from "bson";
import mongoose from "mongoose";

// Like Schema
var DislikeSchema = new mongoose.Schema({
    userID:          { type:ObjectID,ref:'users' },
    musicID:       { type:ObjectID,ref:'musics' },
});

// Export Music Schema
const Dislikes = new mongoose.model('Dislike', DislikeSchema);
export default Dislikes;