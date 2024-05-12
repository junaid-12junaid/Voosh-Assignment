
let User=require("../Models/Users")

 async function isAdmin(req, res, next){

    let user=await User.findById(req.decodedToken)
    if (user && user.role === 'admin') {
        return next();
    }
    res.status(403).json({ error: 'Forbidden' });
};

module.exports ={isAdmin}