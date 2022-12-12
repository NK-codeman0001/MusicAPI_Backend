import { ObjectID } from "bson";
import mongoose from "mongoose"

// User Schema (FOR BOTH ADMIN/NORMAL USER)
var UserSchema = new mongoose.Schema({
    name : 	        { type: String, required: true, minLenght:3},
    username:       { type: String, required: true, minLenght:5, unique:[true,"This username is already taken"]},
    password:       { type: String, required: true},
    isAdmin:        {type: Boolean, default: false},
    likes:          [{ music : { type: ObjectID,ref:'musics' } }],    
    disLikes:          [{ music : { type: ObjectID,ref:'musics' } }],    
    last_modified:  { type: Date },
}, 
{timestamps: { createdAt: 'date_created', updatedAt: 'last_modified' } }
);


// Export User Schema
const Users = new mongoose.model('User', UserSchema);
export default Users;
