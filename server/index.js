// import express from "express";
// const app= express();
// const port = 3000;


// app.listen(port, () =>{
//  console.log('the server is running on the port  '+port);
// })
// to make the server start and start listening to rquest
 
import express from "express";
const app= express();
const port = 3000;

app.get("/" , (req,res)=>{
    res.send("<h1>hellow world hellow</h1>"); // we used tje end point / "so home page"
});

app.get("/about" , (req,res)=>{
    res.send("<h1>about me</h1><p>i am darshan learing backend using the node");
    // we used tje end point /about "to about page"
});

app.get("/contact" , (req,res)=>{
    res.send("<h1>contact  me on 9849834</h1>");
    // we used tje end point /about "to about page"
});

app.post("/contact" , (req,res)=>{
    res.sendStatus(200);
    // we used tje end point /about "to about page"
});

app.listen(port, () =>{
 console.log('the server is running on the port at the port '+port);
});

