import jwt  from "jsonwebtoken";

//MIDDLEWARE TO CHECK IF AUTHENTICATE USER IS LOGGED-IN
const checkAuth=async(req,res,next)=>{
    try{
    const token=req.headers.authorization.split(" ")[1];
    const verify =jwt.verify(token,process.env.JWT_SECRET_KEY);
    if(verify) {
        res.userToken=verify;
        next();
    }
    else{ res.status(401).send("not authenticated")}
    }
    catch(error){
        return res.status(401).send(error)
    }
}

export default checkAuth;