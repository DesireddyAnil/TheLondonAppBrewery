const express = require("express");
const app = express();

app.get("/",function(req,res){
  res.send("<h1>hey yo!</h1>");
});
app.get("/contact",function(req,res){
  res.send("anil@gmail.com");
});
app.listen(3000, function(){
  console.log("server started on port: 3000");
});
