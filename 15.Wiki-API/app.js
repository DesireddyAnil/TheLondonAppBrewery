const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));



mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article",articleSchema);


app.route("/articles")

  .get(function(req, res){
    Article.find({}, function(err, result){
      if(!err){
        res.send(result);
      }
      else{
        res.send(err);
      }
    });
  })

  .post(function(req, res){
    //console.log(req.body.title+" "+req.body.content);
    const article = new Article({
      title: req.body.title,
      content: req.body.content
    });
    article.save(function (err){
      if(!err){
        res.redirect("/articles");
      }
      else{
        res.send(err);
      }
    });
  })

  .delete(function(req, res){
    Article.deleteMany(
      {},              //as we want to delete all articles (also it is optional)
      function(err){
        if(!err)
          res.send("deleted all articles");
        else
          res.send(err);
      }
    );
  });

app.route("/articles/:article")

  .get(function(req, res){
    Article.find({ title: req.params.article }, function(err, result){
      if(!err)
        res.send(result);
      else
        res.send(err);
    });
  })

  .put(function(req, res){
    Article.update(
      {title: req.params.article},
      {title: req.body.title, content: req.body.content},
      {overwrite: true},
      function(err){
        if(!err)
          res.send("updated the article " + req.params.article +" successfully");
        else
          res.send(err);
      }
    );
  })

  .patch(function(req, res){

    Article.update(
      {title: req.params.article},
      {$set: req.body},
      function(err){
        if(!err)
          res.send("patche of article with title "+req.params.article +" is successful");
        else
          res.send(err);
      }

    );
  })

  .delete(function(req, res){
    Article.deleteOne(
      {title: req.params.article},
      function(err){
        if(!err)
          res.send("deleted articles with title " + req.params.article);
        else
          res.send(err);
      }
    );
  });






app.listen(3000,function(err){
  if(!err)
    console.log("server up on port: 3000");
});
