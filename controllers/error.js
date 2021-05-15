exports.get404Page = (req,res,next)=>{
    //res.status(400).sendFile(path.join(__dirname,'views','404.html'));
    res.status(400).render('404',{pageTitle:'404'});
}