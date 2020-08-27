const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose") //ODM for mongoDB
const date = require(__dirname + "/date.js"); //custom created module to keep app.js clean
const _ = require("lodash");
console.log(date); //logs what is being exported from date module


const app = express();

app.set("view engine", "ejs"); //required to use ejs (ejs is needed for templating, scriptlets and layouts)

app.use(bodyParser.urlencoded({
  extended: true
})); //for extracting data from forms
app.use(express.static("public")); //specifying endpoint for files


//mongoose stuff begins
mongoose.connect("mongodb://localhost:27017/toDoListDB", {
  useNewUrlParser: true
});

const itemSchema = {
  name: String
};

const listSchema = {
  name: String,
  items: [itemSchema]
}

const Item = mongoose.model("Item", itemSchema);
const List = mongoose.model("List", listSchema);

const item1 = new Item({
  name: "item 1",
});
const item2 = new Item({
  name: "item 2"
});
const item3 = new Item({
  name: "item 3"
});

const defaultItems = [item1, item2, item3];



app.get("/", function(req, res) {
  var formattedDate = date.getDate(); //using custom created date module to keep the "get" clean with emphasis on relevant parts
  //cool stuff starts
  Item.find({}, function(err, result) {
    if (result.length === 0) {
      Item.insertMany(defaultItems, function(err) { //inserts many documents into db
        if (err)
          console.log(err);
        else
          console.log("default items added successfully");
      });
      res.redirect("/"); // to update the changes on the screen
    } else {
      res.render("list", {
        listHeading: formattedDate,    //ejs : here
        toDoList: result
      });
    }
  });
});

app.get("/:customList",function(req, res){
  const reqHeading = _.capitalize(req.params.customList);
  List.findOne({name: reqHeading}, function(err, result){
    if(!err){
      if(!result){
        const list = new List({
          name: reqHeading,
          items: defaultItems
        });
        list.save();
        res.redirect("/"+reqHeading);
      }
      else{
        res.render("list", {
          listHeading: reqHeading,
          toDoList: result.items
        });
      }
    }
  });
});

app.post("/", function(req, res) { //very important stuff go through carefully
  const newItem = req.body.newItem;
  const listHeading = req.body.listHeading;
  const itemDoc = new Item({
    name: newItem
  });
  console.log(req.body,+" "+date.getDate());
  if (_.lowerCase(listHeading) === _.lowerCase(date.getDate())) {
    console.log("bp");
    itemDoc.save();
    res.redirect("/");
  } else {
    List.findOne({name: listHeading}, function(err, result){
      if(!err){
        result.items.push(itemDoc);
        result.save();
        res.redirect("/"+listHeading);
      }
      else{
        console.log(err);
      }
    });
  }
});

app.post("/delete",function(req, res){
  const listHeading = req.body.listHeading;
  const checkedItemId = req.body.checkbox;
  if(listHeading == date.getDate()){
    Item.findByIdAndRemove(checkedItemId, function(err){
      if(err)
        console.log(err);
      else
        console.log("deleted an item with id"+checkedItemId);
    });
    res.redirect("/");
  }
  else{
    List.findOneAndUpdate(
      {name: listHeading},
      {$pull: {items: {_id: checkedItemId}}},
      function(err, result){
        if(!err){
          res.redirect("/"+listHeading);
        }
      }
    );
  }

});





app.listen(3000, function() {
  console.log("server up and runnig on port: 3000");
});
