const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname+"/date.js");   //custom created module to keep app.js clean
console.log(date);     //logs what is being exported from date module


const app = express();

app.set("view engine", "ejs");            //required to use ejs (ejs is needed for templating, scriptlets and layouts)

app.use(bodyParser.urlencoded({
  extended: true
}));                                         //for extracting data from forms
app.use(express.static("public"));           //specifying endpoint for files

var toDoList = [];
var workList = [];

app.get("/", function(req, res) {
  var formattedDate = date.getDate();         //using custom created date module to keep the "get" clean with emphasis on relevant parts
  res.render("list", {
    listHeading: formattedDate,
    toDoList: toDoList
  });
});

app.post("/", function(req, res) {                //very important stuff go through carefully
  const newItem = req.body.newItem;
  const listHeading  = req.body.listHeading;
  console.log(listHeading);
  if(listHeading==="Work-List"){                //adding to different lists and redirecting based on the listHeading
    workList.push(newItem);
    res.redirect("/work");
  }
  else{
    toDoList.push(newItem);
    res.redirect("/");
  }


});

app.get("/work",function(req,res){
  res.render("list",{
    listHeading: "Work-List",
    toDoList: workList
  });
});



app.listen(3000, function() {
  console.log("server up and runnig on port: 3000");
});
