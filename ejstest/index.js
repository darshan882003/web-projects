import express from "express";
const app=express();
var port =3000;

const d=new Date();
let day = d.getDay();

var da="a weekday"
var adv="a weekday"
if(day===0 ||day===6){
    da="its weekend"
    adv="enjoy your day"
} 
app.get("/",(req,res)=>{
    res.render("index.ejs",{
        day:da,
        advise: adv,
    });
    console.log(day);
});


app.post("/contact" , (req,res)=>{
    res.sendStatus(200);
    // we used tje end point /about "to about page"
});

app.listen(port,()=>{
    console.log("the server is running in port "+port)
})
