import express, { request } from 'express';
import dotenv from "dotenv";

// THUMBNAIL
import multer from 'multer';
import cloudinary from 'cloudinary'
const fileUpload = multer()


//MIDDLEWARE
import checkAdmin from '../middleware/checkAdmin.js'; //TO CHECK IF ADMIN
import checkAuth from '../middleware/checkAuth.js';  // TO CHECK IF USER

//ROUTER
const router = express.Router();
const app = express();
app.use(express.json()); 
dotenv.config();
//Cloudinary Config
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET
  });


//IMPORT SCEHEMA
import Musics from '../model/musicSchema.js';

                        // AUTHOR'S ENDPOINT //

//-------------------------GET----------------------------------------//

//MUSIC LIBRARY (FOR BOTH ADMIN/NORMAL USER)
router.get('/',checkAuth, async (req,res)=>{
    const records = await Musics.find({})
	res.json(records);
})

//SEARCH MUSIC META DATA USING SONG OBJECTID /music/:_Id (FOR BOTH ADMIN/NORMAL USER)
router.get('/:_id',checkAuth, async (req, res) => {
    const records = await Musics.find({ _id : req.params._id});
    res.json(records);
})


//-----------------------POST--------------------------------------//

//ADD MUSIC IN LIBRARY (ADMIN ONLY) + with thumbnail
router.post('/',checkAdmin,async (req,res)=>{
    try{
        const file = req.files.thumbnail;
        cloudinary.v2.uploader.upload(file.tempFilePath,
  async function(error, result) { 
    const music = new Musics({...req.body,thumbnail: result.url});
        const createMusic = await music.save();
            res.status(201);
            res.send(createMusic);
});
        
        }catch(e){
            res.status(400).send(e);
        }
});



//----------------------DELETE------------------------------------//

// REMOVE MUSIC FROM LIBRARY USING MUSIC'S OBJECTID /musics/delete/:musicId (ADMIN ONLY)
router.delete('/delete/:musicId',checkAdmin, async (req, res) => {
	
	try {
        const response = await  Musics.deleteOne({ _id : req.params.musicId}) ;    
         //search user using id to delete that user;
        if(response.deletedCount) return res.json({ status: 'ok', message: `music removed` })
	}catch (error) {
		res.json({ status: 'error', error: 'An error had occured. Please try againg' })
	}
    return res.json({ status: 'error', error: 'Music not found' })
})

//patch update price
router.patch("/update/price/:_id",checkAdmin,async(req,res)=>{
    //get price
    const newPrice= req.body.price;
    //get music
    const records = await Musics.findByIdAndUpdate({ _id : req.params._id},{"price":newPrice});
    if(!records) res.send("Error in update");
    res.send(records);
});

//update thumbnail
router.patch("/update/thumbnail/:_id",checkAdmin,async(req,res)=>{
    //get thumbnail
    const file = req.files.thumbnail;
        cloudinary.v2.uploader.upload(file.tempFilePath,
  async function(error, result) { 
    const thumbnail = result.url;
    //get music
    const records = await Musics.findByIdAndUpdate({ _id : req.params._id},{thumbnail});
    if(!records) res.send("Error in update");
    res.send(records);
  })
  
});

export default router;