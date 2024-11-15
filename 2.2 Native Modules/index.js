const fs =require("fs");

// fs.writeFile("mesa.txt","hellow darshan",(err) => {
//     if (err) throw err;
//     console.log('The file has been saved!');
//   });

  fs.readFile('./mes', 'utf8', (err, data) => {
    if (err) throw err;
    console.log(data);
  }); 