function handleError(err,req,resp,next){
   try{
    if(resp.statusCode===200) resp.status(500)
   resp.json({error:err.message || "somethimg went wrong"})    
   }catch(error){
    next()
   }
}
module.exports=handleError

//next-> agar handlerror me hi error aagaya thoh yeh next usko handle krega
// if statuscode=200 means executed successfully
// if statuscode=500 means internal error