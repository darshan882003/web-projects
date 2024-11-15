import  express  from "express";

var app=express(); 

var port =3000;

app.get("/",(req,res)=>{
    res.render("index.ejs",{
        
    })
})
app.listen(port,()=>{
    console.log("the serve is running in port "+port);
})

