import jwt  from "jsonwebtoken";

//MIDDLEWARE TO CHECK IF ADMIN IS LOGGED-IN
const checkAdmin = async(req,res,next)=>{
    try{
    const token=req.headers.authorization.split(" ")[1];
    const verify =jwt.verify(token,process.env.JWT_SECRET_KEY);
    if(verify.isAdmin) {
        res.user=verify;
        next();
    }
    else {return res.status(401).send("not admin")}
    }catch(error){
        return res.status(401).send(error)
    }
}
export default checkAdmin;