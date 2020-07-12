module.exports.home = function(req,res){
   
    //welcome route
    return res.status(200).json({
        message:"hospital"
    });
    
}