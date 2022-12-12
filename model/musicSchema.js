import { ObjectID } from "bson";
import mongoose from "mongoose";

// Music Schema
var MusicSchema = new mongoose.Schema({
    music_id: 	    { type: String, required: true, unique:[true,"This music id is already exist"]},
    music_link: 	{ type: String, required: true, unique:true},
    thumbnail:    {type: String, unique:true},
    title: 	        { type: String, required: true },
    singer:         { type: String, required: true },
    album:          { type: String, required: true },
    price:          { type: Number, default: 0,min:0 },
    release_date:   { type: Date, default: Date.now },
    likes:          [ { user : { type:ObjectID,ref:'users' } } ],
    disLikes:       [ { user : { type:ObjectID,ref:'users' } } ],
    date_created:   { type: Date },
    last_modified:  { type: Date }

}, {timestamps: { createdAt: 'date_created', updatedAt: 'last_modified' } });

// Export Music Schema
const Musics = new mongoose.model('Music', MusicSchema);
export default Musics;