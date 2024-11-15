import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  res.render("index.ejs")
});

app.get("/hello", (req, res) => {
  res.render("hellow.ejs");
});

app.post("/submit", (req, res) => {
  const nam=req.body["fName"].length + req.body["lName"].length;
  res.render("index.ejs",{
    nama : nam
    // nama :nam
  })
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
