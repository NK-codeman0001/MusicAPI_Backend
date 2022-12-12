import express from 'express';
import jwt  from 'jsonwebtoken';
import bcrypt from 'bcrypt';

//MIDDLEWARE
import checkAuth from '../middleware/checkAuth.js'; // TO CHECK IF USER

//ROUTER
const router = express.Router();
const app = express();
app.use(express.json()); 

//IMPORT SCEHEMA
import Users from '../model/userSchema.js';
import Musics from '../model/musicSchema.js';
import Likes from '../model/likeSchema.js';
import DisLikes from '../model/dislikeSchema.js';
import Dislikes from '../model/dislikeSchema.js';


                        // AUTHOR'S ENDPOINT //

//-------------------------GET----------------------------------------//

//SHOW LIST OF SONGS LIKED BY CURRENT USER (FOR BOTH ADMIN/NORMAL USER)
router.get('/likes',checkAuth,async(req,res)=>{
    try{
    const token = await req.headers.authorization.split(" ")[1];
    const verify =jwt.verify(token,process.env.JWT_SECRET_KEY);
    const likeList = await Likes.find({userID: verify._id});
    res.status(200).send(likeList);
    }catch(error){
        res.status(500).send("Server Error")
    }
})

//-------------------------POST----------------------------------------//

//LOGIN USER (FOR BOTH ADMIN/NORMAL USER)
router.post('/login', (req, res) => {
    Users.find({username:req.body.username})
    .exec()
    .then(user=>{
        if(user.length < 1){
            return res.status(401).send("User not exist")
        }
        bcrypt.compare(req.body.password,user[0].password,(err,result)=>{
           if(!result){
            return res.status(401).send("wrong password")
           }
            const token = jwt.sign({
                _id: user[0]._id,
                name: user[0].name,
                username:user[0].username,
                isAdmin:user[0].isAdmin
            },process.env.JWT_SECRET_KEY,{
                expiresIn:"24h"
            }
            );
            res.status(200).json({
                _id: user[0]._id,
                name: user[0].name,
                username:user[0].username,
                isAdmin:user[0].isAdmin,
            token:token
        })
        })

    })
    .catch(err=>{
        res.status(500).send(err)
    })
       
})

//CREATE NEW USER (FOR BOTH ADMIN/NORMAL USER)
router.post('/signup', (req, res) => {
 
try{
    bcrypt.hash(req.body.password,10,(err,hash)=>{
        if(err){
            return res.status(500).json({
                error: err
            })
        }
        else{
            const user = new Users({
                name: req.body.name,
                username: req.body.username,
                password: hash,
                isAdmin:req.body.isAdmin
            })
            
            user.save().then(result=>{
                res.status(201);
            res.send(user);
            }).catch(err=>{
            res.status(500);
            res.send(err);
            })
        }
    })
 }catch(e){
     res.status(400).send(e);
 }
})


//-------------------------Post----------------------------------------//

//LIKE A SONG USING IT'S OBJECTID /user/like/:_id (FOR BOTH ADMIN/NORMAL USER)
router.post('/like/:id',checkAuth,async(req,res)=>{
    try{
    const token = await req.headers.authorization.split(" ")[1];
    const verify =jwt.verify(token,process.env.JWT_SECRET_KEY);
    // const music = await Musics.findByIdAndUpdate(req.params.id);
    // const user = await Users.findByIdAndUpdate(verify._id);

    // check if already liked
    const check = await Likes.find({userID: verify._id ,musicID: req.params.id})
    // console.log(check);
    if(check.length >0) return res.status(400).send("already liked");

    //add in likes  
    const like = new Likes ({userID: verify._id, musicID:req.params.id})
    await like.save();  
    
    //remove from dislike
    const unlike = await Dislikes.deleteOne({userID: verify._id ,musicID: req.params.id})
    // await unlike.save();
    res.status(200).send(like)
    }catch(error){
        res.status(500).send("Server Error")
    }
})

//DISLIKE A SONG USING IT'S OBJECTID /user/dislike/:_id (FOR BOTH ADMIN/NORMAL USER)
router.post('/dislike/:id',checkAuth,async(req,res)=>{
    try{
    const token = await req.headers.authorization.split(" ")[1];
    const verify =jwt.verify(token,process.env.JWT_SECRET_KEY);

    // check if already disliked
    const check = await Dislikes.find({userID: verify._id ,musicID: req.params.id})
    // console.log(check);
    if(check.length >0) return res.status(400).send("already disliked");

    //add in Dislikes  
    const dislike = new Dislikes({userID: verify._id, musicID:req.params.id})
    await dislike.save();  
    
    //remove from like
    const unlike = await Likes.deleteOne({userID: verify._id ,musicID: req.params.id})
    // await unlike.save();
    res.status(200).send(unlike)
    }catch(error){
        res.status(500).send("Server Error")
    }
})
export default router;