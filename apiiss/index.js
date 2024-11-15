import  express  from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));


var app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended:true}));

var nam;
app.get("https://api.wheretheiss.at/v1/satellites/25544",(req,res)=>{
    {
        nam=res.body["latitude"]
    }
});

app.get("/",(req,res)=>{
    res.send("heloow")
    res.send(nam);
});

app.listen(port,()=>{
    console.log("the server is running in port"+ port)
});