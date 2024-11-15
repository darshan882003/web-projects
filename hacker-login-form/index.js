//To see how the final website should work, run "node solution.js".
//Make sure you have installed all the dependencies with "npm i".
//The password is ILoveProgramming
import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;
var passwords=false;
var password="aaaaaa";

app.use(bodyParser.urlencoded({ extended:true}));
function check (req,res,next){
    if(req.body["password"]===password){
       passwords=true
    }
    next()
}


app.use(check)

app.get("/", (req, res) => {
  // console.log(__dirname + "/public/index.html")
  res.sendFile(__dirname + "/public/index.html");
});


app.post("/check" , (req,res)=>{
  
  console.log(req.body)
  if(passwords){
    res.sendFile(__dirname + "/public/secret.html");
    passwords=false;
  }else{
    // alert("enter the currect password")
    // res.sendFile(__dirname + "/public/2.html");
    res.send("<h1>enter the currect password</h1>")
  }
})
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
