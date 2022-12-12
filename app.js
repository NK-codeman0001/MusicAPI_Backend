import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import fileUpload from "express-fileupload"; //upload thumbnail
//IMPORTING ROUTES
import musicRoutes from './routes/music.js';
import usersRoutes from './routes/users.js';

// IMPORTING DB
import conn from "./db/conn.js";

//CONFIG DOTENV
dotenv.config();

//CONNECTING DB
conn(process.env.DB_URL);


const app = express();
const port = process.env.PORT;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
//thumbnail 
app.use(fileUpload({useTempFiles:true}))

//ROUTES
app.use('/music', musicRoutes);
app.use('/user', usersRoutes);

//HOME
app.get('/', (req, res) => {
    res.send('Backend Task From Neeraj Kumar (19001003073) B.Tech CE JCBose UST')
});

app.listen(port);